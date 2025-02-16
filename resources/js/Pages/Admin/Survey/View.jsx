import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import { IoMdRadioButtonOff, IoIosArrowDown } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { FiTrash2 } from "react-icons/fi"
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import { RxTextAlignLeft } from "react-icons/rx";
import { ArrowDownTrayIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import Inpt from "@/Components/Input"
import Tbl from "@/Components/Table"
import Modal from "@/Components/Modal"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const colors = [
  "#f44336", // Red
  "#4caf50", // Green
  "#2196f3", // Blue
  "#ff9800", // Orange
  "#3f51b5", // Indigo
  "#e91e63", // Pink
  "#00bcd4", // Cyan
  "#8bc34a", // Light Green
  "#ffeb3b", // Yellow
  "#9c27b0", // Purple
  "#ff5722", // Deep Orange
  "#009688", // Teal
  "#cddc39", // Lime
  "#673ab7", // Deep Purple
  "#ffc107", // Amber
  "#03a9f4", // Light Blue
  "#795548", // Brown
  "#607d8b", // Blue Grey
  "#f06292", // Light Pink
  "#4dd0e1", // Light Cyan
];

const tabs = ["Questions", "Responses", "Assignments", "Settings"]

const View = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const { survey, responses, notAssignEnumerators, assignEnumerators } = usePage().props
  const [open, setOpen] = useState(false)
  const { post, processing } = useForm()

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
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // Disable tooltips
          },
          datalabels: {
            color: '#fff', // Set text color
            anchor: 'center',
            align: 'center',
            font: {
              size: 12,
            },
            formatter: (value, context) => {
              let percentage = ((value / total) * 100).toFixed(2);
              return percentage > 0 ? `${percentage}%` : ''; // Hide 0% values
            },
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

  const handleAssignEnumerator = (enumerator) => {
    post(route('admin.assign.enumerator', {
      survey_id: survey.id,
      enumerator_id: enumerator.id,
    }))
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout button={
        <Button onClick={() => setOpen(!open)} color="green" className={activeTab !== tabs[2] ? 'hidden' : ''}>
          Assign
        </Button>
      } title={survey.title} tab={
        <div className="h-[30px] flex justify-center items-end">
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
        <div className="max-w-[800px] mx-auto mt-[110px]">
          <TabsBody>
            <TabPanel value="Responses">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal">
                      Total Responses:
                    </p>
                    <h1 className="font-medium">
                      {responses.length}
                    </h1>
                  </div>
                </CardBody>
              </Card>
              {responses.length > 0 && (
                <div className="mt-4 space-y-4 max-sm:space-y-2 max-sm:mt-2">
                  {survey.question?.map((question, qIndex) => (
                    <Card key={qIndex} className="shadow-none max-h-[350px] overflow-y-auto border border-gray-200">
                      <CardBody className="space-y-6">
                        <div className="space-y-3">
                          <span className="text-xs font-normal">Question {qIndex + 1}</span>
                          <h1 className="text-sm font-medium">{question.text}</h1>
                        </div>
                        {(question.type === 'radio' || question.type === 'select' || question.type === 'checkbox') && (
                          <div>
                            {(() => {
                              const { series, labels } = calculateResponseData(question);
                              const chartData = pieChartConfig(series, labels);

                              return (
                                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                  <div className="flex items-center justify-center">
                                    <div style={{ width: '200px', height: '200px' }}>
                                      <Pie data={chartData.data} options={chartData.options} />
                                    </div>
                                  </div>
                                  <div className="space-y-2 flex flex-col justify-center items-start">
                                    {question.option.map((option, oIndex) => {
                                      return (
                                        <div key={oIndex} className="flex items-center gap-2">
                                          <div>
                                            <div
                                              style={{ backgroundColor: colors[oIndex] }}
                                              className="size-4 rounded-full"
                                            ></div>
                                          </div>
                                          <p className="text-sm font-normal">{option.text}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        {question.type === 'input' && (
                          <div className="space-y-2">
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
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </TabPanel>
            <TabPanel value="Assignments">
              <Tbl title="Enumerators" data={dataTableAssignEnumerator} />
            </TabPanel>
          </TabsBody>
        </div>

        <Modal size="md" open={open} onClose={() => setOpen(false)}>
          <Card className="shadow-none">
            <CardBody className="p-0">
              <Tbl title="Enumerators" data={dataTableNotAssignEnumerator} onClickAssign={handleAssignEnumerator} />
            </CardBody>
          </Card>
        </Modal>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View