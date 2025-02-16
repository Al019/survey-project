import Tbl from "@/Components/Table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link, router, usePage } from "@inertiajs/react"
import { Button } from "@material-tailwind/react"

const List = () => {
  const { surveys } = usePage().props
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })

  const dataTable = {
    theads: [
      "Title",
      "Assign Enumerators",
      "Total Responses",
      "Date Created",
    ],
    tbodies: surveys.map((survey) => ({
      id: survey.id,
      title: survey.title,
      assign: survey.assign_count,
      reponse: survey.response_count,
      created_at: formatDateTime(survey.created_at)
    }))
  }

  const handleNavigate = (survey_id) => {
    router.visit(route('admin.view.survey', { survey_id }))
  }

  return (
    <AuthenticatedLayout title="Surveys" button={
      <Link href={route('admin.survey.create')}>
        <Button color='green'>
          Create
        </Button>
      </Link>
    }>
      <div className='p-4 mt-[80px]'>
        <Tbl title="Surveys" data={dataTable} idKey="id" onClickView={handleNavigate} />
      </div>
    </AuthenticatedLayout>
  )
}

export default List