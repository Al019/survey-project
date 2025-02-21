import Loader from "@/Components/Loader"
import Tbl from "@/Components/Table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link, router, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"

const List = () => {
  const [surveys, setSurvey] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(route('api.enumerator.survey.list'))
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
      "Responses",
      "Total Responses",
    ],
    tbodies: surveys.map((survey) => ({
      id: survey.id,
      title: survey.title,
      enumerator_response: survey.enumerator_response_count,
      total_reponse: survey.total_response_count,
    }))
  }

  const handleNavigate = (survey_id) => {
    router.visit(route('enumerator.view.survey', { survey_id }))
  }

  return (
    <AuthenticatedLayout title="Surveys">
      {loading ? (
        <Loader />
      ) : (
        <div className='p-4 mt-[80px] max-sm:p-2'>
          <Tbl title="Surveys" data={dataTable} idKey="id" onClickView={handleNavigate} />
        </div>
      )}
    </AuthenticatedLayout>
  )
}

export default List