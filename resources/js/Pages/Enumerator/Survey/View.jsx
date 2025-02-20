import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Checkbox, Option, Radio, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useToast } from "@/Contexts/ToastContext";
import { useProgress } from "@/Contexts/ProgressContext";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

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

const tabs = ["Questions", "Responses", "Settings"]

const View = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const { survey, responses } = usePage().props
  const [answer, setAnswer] = useState([])
  const [validationErrors, setValidationErrors] = useState([])
  const { post } = useForm()
  const { showToast } = useToast()
  const { setProgress } = useProgress()

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers_${survey.id}`)
    if (savedAnswers) {
      setAnswer(JSON.parse(savedAnswers))
    }
  }, [survey])

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
            enabled: false,
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 12,
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

  const chunkArray = (array, chunkSize) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  const scrollToFirstUnansweredQuestion = (unansweredQuestions) => {
    if (unansweredQuestions.length > 0) {
      const firstUnansweredQuestionId = unansweredQuestions[0].id;
      const questionElement = document.getElementById(`question-${firstUnansweredQuestionId}`);
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  const handleSubmit = async () => {
    const requiredQuestions = survey.question.filter(q => q.required === 1)
    const unansweredQuestions = requiredQuestions.filter(q => !answer.some(a => a.questionId === q.id))

    if (unansweredQuestions.length > 0) {
      setValidationErrors(unansweredQuestions.map(q => q.id))
      scrollToFirstUnansweredQuestion(unansweredQuestions)
      return
    }

    setProgress(true)

    post(route('enumerator.submit.response', { survey_id: survey.id }), {
      preserveState: true,
      onSuccess: (res) => {
        const response_id = res.props.response.id;
        const chunkSize = 10
        const answerChunks = chunkArray(answer, chunkSize)
        const submitChunksWithInterval = (index) => {
          if (index < answerChunks.length) {
            post(route('enumerator.submit.answer', {
              response_id: response_id,
              answer: answerChunks[index]
            }), {
              preserveState: true,
              onSuccess: () => {
                setTimeout(() => submitChunksWithInterval(index + 1), 1000)
              }
            })
          } else {
            setProgress(false)
            localStorage.removeItem(`answers_${survey.id}`)
            setAnswer([])
            setValidationErrors([])
            showToast("Submit response successfully.")
          }
        }
        submitChunksWithInterval(0)
      }
    })
  }

  const handleExportAnswerSheet = () => {
    window.open(route('enumerator.export.answer.sheet',
      { survey_id: survey.id }
    ), '_blank')
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title={survey.title} button={
        <Button onClick={handleSubmit} color="green" className={activeTab !== tabs[0] ? 'hidden' : ''}>
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
            <TabPanel value="Questions" className="space-y-4 max-sm:space-y-2 max-sm:p-2">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="space-y-6 max-sm:space-y-4 max-sm:p-4">
                  <h1 className="font-medium">
                    {survey.title}
                  </h1>
                  <p className="text-sm font-normal">
                    {survey.description}
                  </p>
                </CardBody>
              </Card>
              {survey.question.map((question, qIndex) => (
                <Card key={qIndex} id={`question-${question.id}`} className={`shadow-none ${validationErrors.includes(question.id) ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                  <CardBody className="space-y-6 max-sm:space-y-4 max-sm:p-4">
                    <div className="space-y-3">
                      <span className="text-xs font-normal">Question {qIndex + 1} {question.required === 1 && <span className="text-red-500 text-sm">*</span>}</span>
                      <h1 className="text-sm font-medium">{question.text}</h1>
                    </div>
                    {(question.type === 'radio' || question.type === 'checkbox') && (
                      <div className="grid grid-cols-2 gap-1 max-sm:grid-cols-1">
                        {question.option.map((option, oIndex) => {
                          if (question.type === 'radio') {
                            return (
                              <label key={oIndex} className="flex items-center cursor-pointer">
                                <Radio
                                  id={`radio-${question.id}-${option.id}`}
                                  color="green"
                                  checked={answer.some(
                                    (ans) =>
                                      ans.questionId === question.id &&
                                      ans.option.some((opt) => opt.optionId === option.id)
                                  )}
                                  onChange={() => handleAnswerChange(question.id, option)}
                                />
                                <span className="font-normal text-sm">{option.text}</span>
                              </label>
                            )
                          } else if (question.type === 'checkbox') {
                            return (
                              <label key={oIndex} className="flex items-center cursor-pointer">
                                <Checkbox
                                  id={`checkbox-${question.id}-${option.id}`}
                                  color="green"
                                  checked={answer.some(
                                    (ans) =>
                                      ans.questionId === question.id &&
                                      ans.option.some((opt) => opt.optionId === option.id)
                                  )}
                                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                                />
                                <span className="font-normal text-sm">{option.text}</span>
                              </label>
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
            <TabPanel value="Responses" className="max-sm:p-2">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="flex items-center justify-between max-sm:p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal">
                      Responses:
                    </p>
                    <h1 className="font-medium">
                      {survey.enumerator_response_count}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal">
                      Total Responses:
                    </p>
                    <h1 className="font-medium">
                      {survey.total_response_count}
                    </h1>
                  </div>
                </CardBody>
              </Card>
              {responses.length > 0 && (
                <div className="mt-4 space-y-4 max-sm:space-y-2 max-sm:mt-2">
                  {survey.question?.map((question, qIndex) => (
                    <Card key={qIndex} className="shadow-none max-h-[350px] overflow-y-auto border border-gray-200">
                      <CardBody className="space-y-6 max-sm:p-4">
                        <div className="space-y-3">
                          <span className="text-xs font-normal">Question {qIndex + 1}</span>
                          <h1 className="text-sm font-medium">{question.text}</h1>
                        </div>
                        {(question.type === 'radio' || question.type === 'select' || question.type === 'checkbox') && (
                          <div>
                            {(() => {
                              const { series, labels } = calculateResponseData(question)
                              const chartData = pieChartConfig(series, labels)
                              return (
                                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                  <div className="flex items-center justify-center">
                                    <div style={{ width: '200px', height: '200px' }}>
                                      <Pie data={chartData.data} options={chartData.options} />
                                    </div>
                                  </div>
                                  <div className="space-y-2 flex flex-col justify-center items-start">
                                    {question.option.map((option, oIndex) => {
                                      const counts = series[oIndex]
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
            <TabPanel value="Settings" className="max-sm:p-2">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="space-y-4 max-sm:p-4">
                  <h1 className="font-medium">Manage Survey</h1>
                  <hr className="border-blue-gray-200" />
                  <div className="flex justify-between items-center gap-2">
                    <div className="space-y-1">
                      <h1 className="font-normal text-sm">Answer Sheet</h1>
                      <p className="text-xs font-normal">Import existing answers.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button color="green" variant="outlined" size="sm">
                        Import
                      </Button>
                      <Button onClick={handleExportAnswerSheet} variant="text" size="sm">
                        Download format
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </div>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View