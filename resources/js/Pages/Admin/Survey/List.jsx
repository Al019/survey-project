import Tbl from "@/Components/material/Table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link, usePage } from "@inertiajs/react"
import { Button } from "@material-tailwind/react"

const List = () => {
  const { surveys } = usePage().props
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })

  const dataTable = {
    theads: [
      "Title",
      "Total Responses",
      "Date Created",
    ],
    tbodies: surveys.map((survey) => ({
      id: survey.id,
      uuid: survey.uuid,
      title: survey.title,
      reponse: survey.limit !== null ? `${survey.response_count} / ${survey.limit}` : survey.response_count,
      created_at: formatDateTime(survey.created_at)
    }))
  }

  return (
    <AuthenticatedLayout>
      <div className='p-4 space-y-4'>
        <div className="flex justify-end">
          <Link href={route('admin.survey.create')}>
            <Button color='green' variant='outlined'>
              Create
            </Button>
          </Link>
        </div>
        <Tbl title="Surveys" data={dataTable} />
      </div>
    </AuthenticatedLayout>
  )
}

export default List