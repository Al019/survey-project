import Loader from "@/Components/Loader"
import Tbl from "@/Components/Table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { router } from "@inertiajs/react"
import axios from "axios"
import { useEffect, useState } from "react"

const List = () => {
  const [surveys, setSurvey] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(route('api.viewer.survey.list'))
      .then(({ data }) => {
        setSurvey(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const dataTable = {
    theads: [
      "Title",
      "Total Responses",
    ],
    tbodies: surveys.map((survey) => ({
      id: survey.id,
      title: survey.title,
      reponse: survey.response_count,
    }))
  }

  const handleNavigate = (survey_id) => {
    router.visit(route('viewer.view.survey', { survey_id }))
  }

  return (
    <AuthenticatedLayout title="Surveys">
      {loading ? (
        <Loader />
      ) : (
        <div className='p-4 mt-[80px]'>
          <Tbl title="Surveys" data={dataTable} idKey="id" onClickView={handleNavigate} />
        </div>
      )}
    </AuthenticatedLayout>
  )
}

export default List