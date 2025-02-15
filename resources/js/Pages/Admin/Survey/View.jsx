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

ChartJS.register(ArcElement, Tooltip, Legend)

const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#3f51b5"]

const tabs = ["Questions", "Responses", "Assignments", "Settings"]

const View = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const { survey, responses, notAssignEnumerators, assignEnumerators } = usePage().props
  const [open, setOpen] = useState(false)
  const { post, processing } = useForm()

  const pieChartConfig = (series, labels) => ({
    data: {
      labels: labels, // Labels for the pie chart
      datasets: [
        {
          data: series, // Data for the pie chart
          backgroundColor: colors, // Use the predefined colors
          borderWidth: 0, // Remove borders
        },
      ],
    },
    options: {
      responsive: true, // Make the chart responsive
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
        tooltip: {
          enabled: true, // Enable tooltips
        },
      },
    },
  });

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
                    <Card key={qIndex} className="shadow-none max-h-[340px] overflow-y-auto border border-gray-200">
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
                                <div className="grid grid-cols-2 place-items-center max-sm:grid-cols-1">
                                  <div style={{ width: '200px', height: '200px' }}>
                                    <Pie data={chartData.data} options={chartData.options} />
                                  </div>
                                  <div className="space-y-2">
                                    {question.option.map((option, oIndex) => {
                                      const count = series[oIndex];
                                      return (
                                        <div key={oIndex} className="flex items-center gap-2">
                                          <div
                                            style={{ backgroundColor: colors[oIndex] }}
                                            className="size-4 rounded-full"
                                          ></div>
                                          <p className="text-sm font-normal">{option.text}</p>
                                          <span className="text-sm font-normal">{`(${count})`}</span>
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