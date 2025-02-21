import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { router, useForm } from "@inertiajs/react"
import { Button, Card, CardBody, CardFooter, CardHeader, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import Inpt from "@/Components/Input"
import Tbl from "@/Components/Table"
import Modal from "@/Components/Modal"
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import InputError from "@/Components/InputError"
import axios from "axios"
import Loader from "@/Components/Loader"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement);

const colors = [
  "#f44336", "#4caf50", "#2196f3", "#ff9800", "#3f51b5",
  "#e91e63", "#00bcd4", "#8bc34a", "#ffeb3b", "#9c27b0",
  "#ff5722", "#009688", "#cddc39", "#673ab7", "#ffc107",
  "#03a9f4", "#795548", "#607d8b", "#f06292", "#4dd0e1",
  "#d32f2f", "#388e3c", "#1976d2", "#f57c00", "#303f9f",
  "#c2185b", "#00796b", "#afb42b", "#512da8", "#ffa000",
  "#0288d1", "#5d4037", "#455a64", "#ec407a", "#26c6da",
  "#ff1744", "#00e676", "#2979ff", "#ff9100", "#6200ea",
  "#00acc1", "#8e24aa", "#ffea00", "#76ff03", "#d500f9",
  "#ff3d00", "#1de9b6", "#ff6d00", "#ff4081"
];

const tabs = ["Responses", "Assignments", "Settings"]

const View = () => {
  const [survey, setSurvey] = useState([])
  const [responses, setResponses] = useState([])
  const [notAssignEnumerators, setNotAssignEnumerators] = useState([])
  const [assignEnumerators, setAssignEnumerators] = useState([])
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState({})

  const survey_id = new URLSearchParams(window.location.search).get('survey_id')

  useEffect(() => {
    if (survey_id) {
      getEnumerator()
      getSurvey()
    }
  }, [survey_id])

  const getSurvey = async () => {
    axios.get(route('api.admin.view.survey', { survey_id }))
      .then(({ data }) => {
        setSurvey(data.survey);
        setResponses(data.responses);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getEnumerator = async () => {
    axios.get(route('api.admin.survey.enumerator', { survey_id }))
      .then(({ data }) => {
        setNotAssignEnumerators(data.notAssignEnumerators);
        setAssignEnumerators(data.assignEnumerators);
      })
  }

  const pieChartConfig = (series, labels) => {
    const total = series.reduce((sum, value) => sum + value, 0);

    return {
      data: {
        labels: labels,
        datasets: [
          {
            data: series,
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 14,
            },
            formatter: (value, context) => {
              let percentage = ((value / total) * 100).toFixed(2);
              return percentage > 0 ? `${percentage}%` : '';
            },
          },
        },
      },
    };
  };

  const barChartConfig = (series, labels) => {
    return {
      data: {
        labels: labels,
        datasets: [
          {
            data: series,
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            color: '#000',
            anchor: 'end',
            align: 'top',
            font: {
              size: 14,
            },
            formatter: (value) => value > 0 ? value : '',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  };

  const calculateResponseData = (question) => {
    const optionCounts = question.option.map(opt => ({
      id: opt.id,
      text: opt.text,
      count: 0,
    }));

    responses.forEach(res => {
      res.answer.forEach(ans => {
        if (ans.question_id === question.id) {
          const selectedOptionIds = ans.answer_option.map(ao => ao.option_id)

          selectedOptionIds.forEach(optionId => {
            const option = optionCounts.find(opt => opt.id === optionId)
            if (option) {
              option.count += 1
            }
          })
        }
      })
    })

    const totalResponses = optionCounts.reduce((sum, opt) => sum + opt.count, 0)

    const series = optionCounts.map(opt => opt.count)
    const labels = optionCounts.map(opt => opt.text)

    return { series, labels, totalResponses }
  }

  const dataTableAssignEnumerator = {
    theads: [
      "Name",
      "Responses",
    ],
    tbodies: assignEnumerators.map((enumerator) => ({
      id: enumerator.id,
      name: `${enumerator.first_name} ${enumerator.last_name}`,
      response: enumerator.response_count
    }))
  }

  const dataTableNotAssignEnumerator = {
    theads: [
      "Name",
    ],
    tbodies: notAssignEnumerators.map((enumerator) => ({
      id: enumerator.id,
      name: `${enumerator.first_name} ${enumerator.last_name}`,
    }))
  }

  const handleAssignEnumerator = async (enumerator) => {
    setProcessing((prev) => ({ ...prev, [enumerator.id]: true }))
    await axios.post(route('api.admin.assign.enumerator', {
      survey_id: survey.id,
      enumerator_id: enumerator.id,
    }))
      .then(() => {
        getEnumerator()
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const handleDeleteSurvey = async () => {
    setProcessing(true)
    await axios.post(route('api.admin.delete.survey', {
      survey_id: survey.id,
      password
    }))
      .then(() => {
        router.visit(route('admin.survey.list'))
      })
      .catch((error) => {
        setError(error.response.data.errors)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const handleExportResponse = () => {
    window.open(route('api.admin.export.response',
      { survey_id: survey.id }
    ), '_blank')
  };

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout button={
        <Button onClick={() => setOpen(!open)} color="green" className={activeTab === 'Assignments' ? '' : 'hidden'}>
          Assign
        </Button>
      } title={survey.title} tab={
        <div className="h-[30px] overflow-x-auto flex justify-center items-end">
          <TabsHeader
            className="w-fit space-x-6 rounded-none border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-green-500 shadow-none rounded-none",
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                value={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm ${activeTab === tab && "text-blue-gray-800 font-medium"}`}
              >
                {tab}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      }>
        {loading ? (
          <Loader />
        ) : (
          <div className="mt-[110px]">
            <TabsBody>
              <TabPanel value="Responses" className="max-sm:p-2">
                <Card className="shadow-none border border-gray-200">
                  <CardBody className="flex items-center justify-between max-sm:p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-normal">
                        Total Responses:
                      </p>
                      <h1 className="font-medium">
                        {survey.response_count}
                      </h1>
                    </div>
                    <Button onClick={handleExportResponse} size="sm" variant="outlined" color="green">
                      Export
                    </Button>
                  </CardBody>
                </Card>
                {responses.length > 0 && (
                  <div className="mt-4 space-y-4 max-sm:space-y-2 max-sm:mt-2">
                    {survey.question?.map((question, qIndex) => (
                      <div key={qIndex}>
                        {(question.type === 'radio' || question.type === 'select' || question.type === 'checkbox') && (
                          <Card className="shadow-none border border-gray-200">
                            <CardBody className="space-y-6 max-sm:p-4">
                              <div className="space-y-3">
                                <span className="text-xs font-normal">Question {qIndex + 1}</span>
                                <h1 className="text-sm font-medium">{question.text}</h1>
                              </div>
                              {(() => {
                                const { series, labels } = calculateResponseData(question);
                                const isBarChart = question.option.length > 8
                                const chartData = isBarChart ? barChartConfig(series, labels) : pieChartConfig(series, labels);
                                return (
                                  <div className={!isBarChart ? 'grid grid-cols-2 gap-4' : ''}>
                                    <div className="w-full mx-auto h-[300px] sm:h-[400px]">
                                      {isBarChart ? (
                                        <Bar data={chartData.data} options={chartData.options} />
                                      ) : (
                                        <Pie data={chartData.data} options={chartData.options} />
                                      )}
                                    </div>
                                    {!isBarChart && (
                                      <div className="space-y-2 flex flex-col justify-center items-start">
                                        {question.option.map((option, oIndex) => {
                                          const counts = series[oIndex];
                                          return (
                                            <div key={oIndex} className="w-full flex justify-between items-center gap-2">
                                              <div className="flex items-center gap-2">
                                                <div>
                                                  <div
                                                    style={{ backgroundColor: colors[oIndex] }}
                                                    className="size-4 rounded-full"
                                                  ></div>
                                                </div>
                                                <p className="text-sm font-normal">{option.text}</p>
                                              </div>
                                              <div>
                                                <span>{counts}</span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </CardBody>
                          </Card>
                        )}
                        {question.type === 'input' && (
                          <Card className="shadow-none border overflow-hidden border-gray-200 max-h-[500px]">
                            <CardBody className="space-y-6 max-sm:p-4">
                              <div className="space-y-3">
                                <span className="text-xs font-normal">Question {qIndex + 1}</span>
                                <h1 className="text-sm font-medium">{question.text}</h1>
                              </div>
                              <div className="overflow-y-auto max-h-[360px] space-y-2">
                                {responses.map((res, resIndex) => {
                                  const answer = res.answer.find(ans => ans.question_id === question.id)
                                  if (answer) {
                                    return (
                                      <p key={resIndex} className="text-sm font-normal p-2 bg-gray-100 rounded-md">
                                        {answer.text}
                                      </p>
                                    )
                                  }
                                })}
                              </div>
                            </CardBody>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
              <TabPanel value="Assignments" className="max-sm:p-2">
                <Tbl title="Enumerators" data={dataTableAssignEnumerator} />
              </TabPanel>
              <TabPanel value="Settings" className="max-sm:p-2">
                <Card className="shadow-none border border-gray-200">
                  <CardBody className="space-y-4 max-sm:p-4">
                    <h1 className="font-medium">Manage Survey</h1>
                    <hr className="border-blue-gray-200" />
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h1 className="font-normal text-sm">Delete this survey</h1>
                        <p className="text-xs font-normal">Once you delete a survey, there is no going back. Please be certain.</p>
                      </div>
                      <Button onClick={() => {
                        setPassword("")
                        setError({})
                        setOpenDelete(true)
                      }} variant="outlined" size="sm" color="red">
                        Delete survey
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabsBody>
          </div>
        )}

        <Modal size="md" open={open} onClose={() => setOpen(false)}>
          <Card className="shadow-none">
            <CardBody className="p-0">
              <Tbl title="Enumerators" data={dataTableNotAssignEnumerator} onClickAssign={handleAssignEnumerator} btnLoading={processing} />
            </CardBody>
          </Card>
        </Modal>

        <Modal size="sm" open={openDelete} onClose={() => {
          setPassword("")
          setError({})
          setOpenDelete(false)
        }}>
          <Card className="shadow-none">
            <CardHeader shadow={false} floated={false} className="text-lg font-semibold">
              Confirm your password
            </CardHeader>
            <CardBody>
              <Inpt onChange={(e) => setPassword(e.target.value)} label="Password" type="password" />
              <InputError message={error.password} className="mt-1" />
            </CardBody>
            <CardFooter>
              <Button onClick={handleDeleteSurvey} color="red" loading={processing} fullWidth className="flex justify-center">
                Delete this survey
              </Button>
            </CardFooter>
          </Card>
        </Modal>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View