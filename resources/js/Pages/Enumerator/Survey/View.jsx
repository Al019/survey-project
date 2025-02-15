import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Checkbox, Option, Radio, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#3f51b5"]

const tabs = ["Questions", "Responses"]

const View = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const { survey, responses } = usePage().props
  const [answer, setAnswer] = useState([])
  const [validationErrors, setValidationErrors] = useState([])
  const { post, processing } = useForm();

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers_${survey.id}`)
    if (savedAnswers) {
      setAnswer(JSON.parse(savedAnswers))
    }
  }, [survey])

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
    }))

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

  const handleAnswerChange = (questionId, option) => {
    setAnswer((prev) => {
      const updatedAnswers = prev.filter((item) => item.questionId !== questionId)
      const newAnswers = [
        ...updatedAnswers,
        {
          questionId,
          text: option.text,
          option: [{ optionId: option.id }],
        },
      ]

      localStorage.setItem(`answers_${survey.id}`, JSON.stringify(newAnswers))
      return newAnswers
    })
  }

  const handleCheckboxChange = (questionId, option, checked) => {
    setAnswer((prev) => {
      let updatedAnswers = [...prev]
      let existing = updatedAnswers.find((item) => item.questionId === questionId)

      if (!existing) {
        existing = { questionId, option: [], text: [] }
        updatedAnswers.push(existing)
      }

      if (checked) {
        existing.option.push({ optionId: option.id })
        existing.text.push(option.text)
      } else {
        existing.option = existing.option.filter((opt) => opt.optionId !== option.id)
        existing.text = existing.text.filter((text) => text !== option.text)
      }

      if (existing.option.length === 0) {
        updatedAnswers = updatedAnswers.filter((item) => item.questionId !== questionId)
      }

      localStorage.setItem(`answers_${survey.id}`, JSON.stringify(updatedAnswers))
      return updatedAnswers
    })
  }

  const handleInputChange = (questionId, option, value) => {
    setAnswer((prev) => {
      const updatedAnswers = prev.filter((item) => item.questionId !== questionId)

      if (value.trim() !== "") {
        const newAnswers = [
          ...updatedAnswers,
          {
            questionId,
            text: value,
            option: [{ optionId: option.id }],
          },
        ]
        localStorage.setItem(`answers_${survey.id}`, JSON.stringify(newAnswers))
        return newAnswers
      } else {
        localStorage.setItem(`answers_${survey.id}`, JSON.stringify(updatedAnswers))
        return updatedAnswers
      }
    })
  }

  const handleSubmit = async () => {
    const requiredQuestions = survey.question.filter(q => q.required === 1);
    const unansweredQuestions = requiredQuestions.filter(q => !answer.some(a => a.questionId === q.id))

    if (unansweredQuestions.length > 0) {
      setValidationErrors(unansweredQuestions.map(q => q.id))
      return
    }

    post(route('enumerator.submit.survey', {
      survey_id: survey.id,
      answer
    }), {
      onSuccess: () => {
        localStorage.removeItem(`answers_${survey.id}`)
      }
    })
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title={survey.title} button={
        <Button onClick={handleSubmit} color="green" disabled={processing}>
          Submit
        </Button>
      } tab={
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
            <TabPanel value="Questions" className="space-y-4 pb-40">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="space-y-4">
                  <h1 className="font-medium">
                    {survey.title}
                  </h1>
                  <p className="text-sm font-normal">
                    {survey.description}
                  </p>
                </CardBody>
              </Card>
              {survey.question.map((question, qIndex) => (
                <Card key={qIndex} className={`shadow-none ${validationErrors.includes(question.id) ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                  <CardBody className="space-y-6">
                    <div className="space-y-3">
                      <span className="text-xs font-normal">Question {qIndex + 1} {question.required === 1 && <span className="text-red-500 text-sm">*</span>}</span>
                      <h1 className="text-sm font-medium">{question.text}</h1>
                    </div>
                    {(question.type === 'radio' || question.type === 'checkbox') && (
                      <div className="grid grid-cols-2 max-sm:grid-cols-1">
                        {question.option.map((option, oIndex) => {
                          if (question.type === 'radio') {
                            return (
                              <Radio
                                key={oIndex}
                                name={`radio_${qIndex}`}
                                label={option.text}
                                color="green"
                                checked={answer.some(
                                  (ans) =>
                                    ans.questionId === question.id &&
                                    ans.option.some((opt) => opt.optionId === option.id)
                                )}
                                onChange={() => handleAnswerChange(question.id, option)}
                                labelProps={{ className: "font-normal text-sm" }}
                              />
                            )
                          } else if (question.type === 'checkbox') {
                            return (
                              <Checkbox
                                key={oIndex}
                                label={option.text}
                                color="green"
                                checked={answer.some(
                                  (ans) =>
                                    ans.questionId === question.id &&
                                    ans.option.some((opt) => opt.optionId === option.id)
                                )}
                                onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                                labelProps={{ className: "font-normal text-sm" }}
                              />
                            )
                          }
                        })}
                      </div>
                    )}
                    {question.type === 'select' && (
                      <Select label="Select"
                        value={answer.find(ans => ans.questionId === question.id)?.text || ""}
                        onChange={(val) => {
                          const selectedOption = question.option.find(opt => opt.text === val);
                          if (selectedOption) {
                            handleAnswerChange(question.id, selectedOption);
                          }
                        }} color="green" variant="standard">
                        {question.option.map((option, oIndex) => (
                          <Option key={oIndex} value={option.text}>
                            {option.text}
                          </Option>
                        ))}
                      </Select>
                    )}
                    {question.type === 'input' && (
                      <div>
                        {question.option.map((option, oIndex) => (
                          <Textarea value={answer.find(ans => ans.questionId === question.id)?.text || ""}
                            key={oIndex}
                            label={option.text}
                            onChange={(e) => handleInputChange(question.id, option, e.target.value)}
                            variant="standard"
                            color="green"
                            style={{
                              minHeight: "32px",
                            }} />
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </TabPanel>
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
          </TabsBody>
        </div>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View