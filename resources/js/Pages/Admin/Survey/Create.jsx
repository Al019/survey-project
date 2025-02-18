import { CloudArrowUpIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { Accordion, AccordionBody, AccordionHeader, Button, Card, CardBody, CardFooter, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Textarea, Tooltip } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import { IoMdRadioButtonOff, IoIosArrowDown } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { FiTrash2 } from "react-icons/fi"
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import { RxTextAlignLeft } from "react-icons/rx";
import * as XLSX from "xlsx"
import Inpt from "@/Components/Input"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { router, useForm } from "@inertiajs/react"
import Modal from "@/Components/Modal"

const tabs = ["Questions", "Settings"]

const Create = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [selected, setSelected] = useState(1)
  const questionRefs = useRef([])
  const [file, setFile] = useState(null)
  const [open, setOpen] = useState(false)
  const { post, processing } = useForm()
  const [process, setProcess] = useState(false)

  const [survey, setSurvey] = useState(() => {
    const savedSurvey = localStorage.getItem("create-survey")
    return savedSurvey ? JSON.parse(savedSurvey) : {
      title: "Untitled Form",
      description: "",
      questions: [
        { text: "Untitled Question", type: "radio", required: 0, options: [{ text: "Question option" }] }
      ],
    }
  })

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    console.log("Chunks:", chunks); // Debugging: Log the chunks
    return chunks;
  };

  const handlePublish = async () => {
    setProcess(true)
    const surveyData = {
      title: survey.title,
      description: survey.description,
    };

    // Send the survey data to create the survey
    post(route('admin.create.survey', surveyData), {
      onSuccess: (response) => {
        const survey_id = response.props.survey.id; // Assuming the backend returns the survey ID

        // Step 2: Split questions into chunks of 10
        const chunkSize = 5;
        const questionChunks = chunkArray(survey.questions, chunkSize);

        // Step 3: Function to send chunks at intervals
        const sendChunksWithInterval = (index) => {
          if (index < questionChunks.length) {
            post(route('admin.publish.survey', { survey_id, questions: questionChunks[index] }), {
              onSuccess: () => {
                console.log(`Chunk ${index + 1} of ${questionChunks.length} sent successfully.`);
                setTimeout(() => sendChunksWithInterval(index + 1), 500); // Delay of 1 second before sending the next chunk
              },
              onError: (error) => {
                console.error(`Error sending chunk ${index + 1}:`, error);
              },
            });
          } else {
            setProcess(false)
            localStorage.removeItem("create-survey");
            router.visit(route('admin.survey.list'));
          }
        };

        // Start sending chunks
        sendChunksWithInterval(0);
      },
      onError: (error) => {
        setProcess(false)
        console.error("Error creating survey:", error);
      },
    });
  };


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

  const handleImport = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const questions = json.slice(1).map(row => {
        const type = row[1]
        const options = type === 'Open ended' ? [{ text: 'Text' }] : row.slice(2).filter(option => option).map(option => ({ text: option }));

        return {
          text: row[0],
          type: type === 'Multiple choice' && 'radio' || type === 'Checkboxes' && 'checkbox' || type === 'Dropdown' && 'select' || type === 'Open ended' && 'input',
          required: 0,
          options: options,
        };
      });

      setSurvey(prevSurvey => ({
        ...prevSurvey,
        questions: questions,
      }));
    };
    reader.readAsArrayBuffer(file);
    setOpen(false)
  };

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title={survey.title} button={
        <Button onClick={handlePublish} color="green" disabled={process} loading={process} className={activeTab !== tabs[0] ? 'hidden' : ''}>
          Publish
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
                          <Option value="input">Open ended</Option>
                        </Select>
                      </div>
                    </div>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        {question.type === 'radio' && <IoMdRadioButtonOff className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'checkbox' && <MdCheckBoxOutlineBlank className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'select' && <IoIosArrowDown className="size-6 text-blue-gray-500 me-1.5" />}
                        {question.type === 'input' && <RxTextAlignLeft className="size-6 text-blue-gray-500 me-1.5" />}
                        <Inpt value={option.text} onChange={(e) => handleChangeOption(qIndex, oIndex, e.target.value)} label={question.type !== 'input' ? `Option ${oIndex + 1}` : ''} variant="standard" disabled={question.type === 'input'} className="disabled:bg-transparent" />
                        <div className={question.type === 'input' ? 'hidden' : ''}>
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
            </TabPanel>
            <TabPanel value="Settings">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="space-y-4 max-sm:p-4">
                  <h1 className="font-medium">Manage Survey</h1>
                  <hr className="border-blue-gray-200" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h1 className="font-normal text-sm">Required</h1>
                      <p className="text-xs font-normal">All questions are required.</p>
                    </div>
                    <Switch
                      color="green"
                      checked={survey.questions.every(q => q.required === 1)}
                      onChange={(e) => handleToggleRequired(e.target.checked)}
                    />
                  </div>
                  <hr className="border-blue-gray-200" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h1 className="font-normal text-sm">Questions</h1>
                      <p className="text-xs font-normal">Import existing questions.</p>
                    </div>
                    <Button onClick={() => setOpen(true)} color="green" variant="outlined" size="sm">
                      Import
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </div>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Card className='shadow-none'>
            <CardHeader shadow={false} floated={false} className="text-lg font-semibold">
              Import Questions
            </CardHeader>
            <CardBody>
              <Button onClick={() => document.getElementById("file").click()} icon={<CloudArrowUpIcon className="w-5 h-5" />} variant="outlined" color="green" fullWidth>
                {`Choose File ${file ? `| ${file.name}` : ''}`}
              </Button>
              <input onChange={(e) => setFile(e.target.files[0])} id="file" type="file" hidden />
            </CardBody>
            <CardFooter className='flex justify-end'>
              <Button onClick={handleImport} color='green'>
                Save
              </Button>
            </CardFooter>
          </Card>
        </Modal>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default Create