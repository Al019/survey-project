import { CloudArrowUpIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { Accordion, AccordionBody, AccordionHeader, Button, Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea, Tooltip } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import { IoMdRadioButtonOff, IoIosArrowDown } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { FiTrash2 } from "react-icons/fi"
import { v4 as uuidv4 } from 'uuid'
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import { RxTextAlignLeft } from "react-icons/rx";
import * as XLSX from "xlsx"
import Inpt from "@/Components/material/Input"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm } from "@inertiajs/react"

const Create = () => {
  const [selected, setSelected] = useState(1)
  const questionRefs = useRef([])
  const [btnLoading, setBtnLoading] = useState(false)
  const [switchLimit, setSwitchLimit] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(0)
  const [file, setFile] = useState(null)
  const handleAccordionOpen = (value) => setAccordionOpen(accordionOpen === value ? 0 : value)

  const handlePublish = () => {
    post(route('admin.publish.survey'), {
      onSuccess: () => localStorage.removeItem("create-survey")
    });
  }

  const { data, setData, post, processing, errors, reset } = useForm({
    uuid: uuidv4(),
    survey: {}
  });

  const [survey, setSurvey] = useState(() => {
    const savedSurvey = localStorage.getItem("create-survey")
    return savedSurvey ? JSON.parse(savedSurvey) : {
      title: "Untitled Form",
      description: "",
      limit: "",
      questions: [
        { text: "Untitled Question", type: "radio", required: 0, options: [{ text: "Question option" }] }
      ],
    }
  })

  useEffect(() => {
    setData("survey", survey);
  }, [survey]);

  useEffect(() => {
    localStorage.setItem("create-survey", JSON.stringify(survey))
  }, [survey])

  const handleChangeHeader = (field, value) => {
    setSurvey({ ...survey, [field]: value })
  }

  const handleChangeQuestion = (qIndex, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex][field] = value;

    if (value === 'input') {
      updatedQuestions[qIndex].options = [{ text: 'Text' }];
    } else if (['radio', 'checkbox', 'select'].includes(value)) {
      updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map(option => ({
        ...option,
        text: 'Question option',
      }))
    }

    setSurvey({
      ...survey,
      questions: updatedQuestions,
    })
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      text: "Untitled question",
      type: "radio",
      required: 0,
      options: [{ text: "Question option" }]
    }

    setSurvey(prevSurvey => {
      const updatedQuestions = [...prevSurvey.questions]
      const insertIndex = selected === 0 ? 0 : selected
      updatedQuestions.splice(insertIndex, 0, newQuestion)

      setTimeout(() => {
        setSelected(insertIndex + 1)
        questionRefs.current[insertIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)

      return { ...prevSurvey, questions: updatedQuestions }
    })
  }

  const handleRemoveQuestion = (qIndex) => {
    setSurvey((prev) => {
      const updatedQuestions = prev.questions.filter((_, index) => index !== qIndex)

      let newSelected = selected

      if (updatedQuestions.length === 0) {
        newSelected = 0
      } else if (selected === qIndex + 1) {
        newSelected = qIndex === 0 ? 1 : qIndex
      } else if (selected > qIndex + 1) {
        newSelected -= 1
      }

      setTimeout(() => {
        setSelected(newSelected)
        if (newSelected > 0) {
          questionRefs.current[newSelected - 1]?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)

      return { ...prev, questions: updatedQuestions }
    })
  }

  const handleChangeOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options[oIndex].text = value
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options.push({ text: "Question option" })
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options.splice(oIndex, 1)
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleToggleRequired = (checked) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => ({ ...q, required: checked ? 1 : 0 })),
    }))
  }

  return (
    <AuthenticatedLayout>
      <div className="z-20 sticky top-0 px-4 pt-4 border-b bg-white border-gray-200 dark:border-neutral-700">
        <div className="grid grid-cols-2 items-center h-12">
          <h1 className="text-base font-medium text-blue-gray-800 break-words line-clamp-2">
            {survey.title}
          </h1>
          <div className="flex justify-end">
            <Button onClick={handlePublish} color="green" variant="outlined" disabled={processing}>
              Publish
            </Button>
          </div>
        </div>
        <nav className="-mb-0.5 flex justify-center gap-x-6" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
          <button type="button" className="hs-tab-active:font-medium hs-tab-active:border-green-500 hs-tab-active:text-green-500 py-2 px-1 inline-flex items-end gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-blue-gray-500 hover:text-green-500 focus:outline-none focus:text-green-500 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-green-500 active" id="horizontal-alignment-item-1" aria-selected="true" data-hs-tab="#horizontal-alignment-1" aria-controls="horizontal-alignment-1" role="tab">
            Questions
          </button>
          <button type="button" className="hs-tab-active:font-medium hs-tab-active:border-green-500 hs-tab-active:text-green-500 py-2 px-1 inline-flex items-end gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-blue-gray-500 hover:text-green-500 focus:outline-none focus:text-green-500 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-green-500" id="horizontal-alignment-item-2" aria-selected="false" data-hs-tab="#horizontal-alignment-2" aria-controls="horizontal-alignment-2" role="tab">
            Settings
          </button>
        </nav>
      </div>

      <div className="max-w-[800px] mx-auto p-4">
        <div id="horizontal-alignment-1" role="tabpanel" aria-labelledby="horizontal-alignment-item-1" className="space-y-4 pb-40">
          <Card onClick={() => setSelected(0)} className={`shadow-none ${selected === 0 ? "border-2 border-green-500" : "border border-gray-200"}`}>
            <CardBody className="space-y-4 max-sm:p-4">
              <Textarea
                value={survey.title}
                onChange={(e) => handleChangeHeader("title", e.target.value)}
                label="Title"
                color="green"
                variant="standard"
                style={{
                  minHeight: "32px",
                }}
              />
              <Textarea
                value={survey.description}
                onChange={(e) => handleChangeHeader("description", e.target.value)}
                label="Description (optional)"
                color="green"
                variant="standard"
                style={{
                  minHeight: "32px",
                }}
              />
            </CardBody>
          </Card>
          {survey.questions.map((question, qIndex) => (
            <Card ref={el => questionRefs.current[qIndex] = el} onClick={() => setSelected(qIndex + 1)} key={qIndex} className={`shadow-none ${selected === qIndex + 1 ? "border-2 border-green-500" : "border border-gray-200"}`}>
              <CardBody className="space-y-4 max-sm:p-4">
                <div className="flex items-center gap-4">
                  <Textarea
                    value={question.text} onChange={(e) => handleChangeQuestion(qIndex, "text", e.target.value)} label={`Question ${qIndex + 1}`} variant="standard" color="green"
                    style={{
                      minHeight: "32px",
                    }}
                  />
                  <div className="w-fit">
                    <Select value={question.type} onChange={(val) => handleChangeQuestion(qIndex, "type", val)} label="Type" color="green">
                      <Option value="radio">Multiple choice</Option>
                      <Option value="checkbox">Checkboxes</Option>
                      <Option value="select">Dropdown</Option>
                      <Option value="input">Text</Option>
                    </Select>
                  </div>
                </div>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    {question.type === 'radio' && <IoMdRadioButtonOff className="size-6 text-blue-gray-500 me-1.5" />}
                    {question.type === 'checkbox' && <MdCheckBoxOutlineBlank className="size-6 text-blue-gray-500 me-1.5" />}
                    {question.type === 'select' && <IoIosArrowDown className="size-6 text-blue-gray-500 me-1.5" />}
                    {question.type === 'input' && <RxTextAlignLeft className="size-6 text-blue-gray-500 me-1.5" />}
                    <Inpt value={option.text} onChange={(e) => handleChangeOption(qIndex, oIndex, e.target.value)} label={question.type !== 'input' && `Option ${oIndex + 1}`} variant="standard" disabled={question.type === 'input'} className="disabled:bg-transparent" />
                    <div className={question.type === 'input' && 'hidden'}>
                      <Tooltip content="Remove" placement="bottom">
                        <Button onClick={() => handleRemoveOption(qIndex, oIndex)} variant="text" className="p-1.5 rounded-full" tabIndex={-1}>
                          <IoCloseOutline className="size-5 text-blue-gray-500" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
                {question.type !== 'input' && (
                  <Button onClick={() => handleAddOption(qIndex)} variant="outlined" size="sm" color="green">
                    Add option
                  </Button>
                )}
                <hr className="border-blue-gray-200" />
                <div className="flex justify-end items-center gap-4">
                  <Tooltip content="Delete question" placement="bottom">
                    <Button onClick={() => handleRemoveQuestion(qIndex)} variant="text" className="p-2 rounded-full">
                      <FiTrash2 className="size-5 text-blue-gray-500" />
                    </Button>
                  </Tooltip>
                  <Switch checked={question.required === 1} value={question.required === 1 ? 0 : 1} onChange={(e) => handleChangeQuestion(qIndex, "required", e.target.checked ? 1 : 0)} labelProps={{ className: "text-sm" }} label="Required" color="green" />
                </div>
              </CardBody>
            </Card>
          ))}
          <div className="lg:left-64 fixed bottom-0 inset-x-0 flex items-center justify-center">
            <Card className="mx-4 max-sm:mx-2 shadow-none flex items-center justify-center border border-gray-200 max-w-[768px] w-full p-2 rounded-none rounded-t-xl">
              <Tooltip content="Add question" placement="top">
                <Button onClick={handleAddQuestion} variant="text" className="p-2">
                  <PlusCircleIcon className="size-7 text-blue-gray-500" />
                </Button>
              </Tooltip>
            </Card>
          </div>
        </div>
        <div id="horizontal-alignment-2" className="hidden" role="tabpanel" aria-labelledby="horizontal-alignment-item-2">

        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Create