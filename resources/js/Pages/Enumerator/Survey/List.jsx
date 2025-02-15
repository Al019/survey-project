import Tbl from "@/Components/Table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link, router, usePage } from "@inertiajs/react"

const List = () => {
  const { surveys } = usePage().props

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
    router.visit(route('enumerator.view.survey', { survey_id }))
  }

  return (
    <AuthenticatedLayout title="Surveys">
      <div className='p-4 mt-[80px]'>
        <Tbl title="Surveys" data={dataTable} idKey="id" onClickView={handleNavigate} />
      </div>
    </AuthenticatedLayout>
  )
}

export default List