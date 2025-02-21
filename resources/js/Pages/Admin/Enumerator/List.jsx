import InputError from '@/Components/InputError'
import Inpt from '@/Components/Input'
import Tbl from '@/Components/Table'
import Modal from '@/Components/Modal'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { router, } from '@inertiajs/react'
import { Button, Card, CardBody, CardFooter, CardHeader, Option, Select } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '@/Components/Loader'
import { useToast } from '@/Contexts/ToastContext'

const List = () => {
  const [enumerators, setEnumerators] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    gender: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState({})
  const { showToast } = useToast()

  const handleOpen = () => {
    setOpen(!open)
    setFormData({})
    setError({})
  }

  useEffect(() => {
    getEnumerator()
  }, [])

  const getEnumerator = async () => {
    setLoading(true)
    await axios.get(route('api.admin.enumerator.list'))
      .then(({ data }) => {
        setEnumerators(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAdd = async () => {
    setProcessing(true)
    axios.post(route('api.admin.add.enumerator'), formData)
      .then(() => {
        handleOpen()
        showToast("Enumerator added successfully.")
        getEnumerator()
      })
      .catch((error) => {
        setError(error.response.data.errors)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const dataTable = {
    theads: [
      "Last Name",
      "First Name",
      "Middle Name",
      "Email Address",
      "Status"
    ],
    tbodies: enumerators.map((enumerator) => ({
      id: enumerator.id,
      last_name: enumerator.last_name,
      first_name: enumerator.first_name,
      middle_name: enumerator.middle_name,
      email: enumerator.email,
      status: enumerator.status
    }))
  }

  const handleNavigate = (enumerator_id) => {
    router.visit(route('admin.view.enumerator', { enumerator_id }))
  }

  return (
    <AuthenticatedLayout title="Enumerators" button={
      <Button color='green' onClick={handleOpen}>
        Add
      </Button>
    }>
      {loading ? (
        <Loader />
      ) : (
        <div className='p-4 max-sm:p-2 mt-[80px]'>
          <Tbl title="Enumerators" idKey="id" data={dataTable} onClickView={handleNavigate} />
        </div>
      )}

      <Modal size="md" open={open} onClose={handleOpen}>
        <Card className='shadow-none'>
          <CardHeader shadow={false} floated={false} className="text-lg font-semibold">
            Add Enumerator
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div>
              <Inpt onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} label="Last name" />
              <InputError message={error.last_name} className="mt-1" />
            </div>
            <div>
              <Inpt onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} label="First name" />
              <InputError message={error.first_name} className="mt-1" />
            </div>
            <div>
              <Inpt onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })} label="Middle name" placeholder="Optional" />
              <InputError message={error.middle_name} className="mt-1" />
            </div>
            <div>
              <Select onChange={(val) => setFormData({ ...formData, gender: val })} label="Gender" color="green">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
              <InputError message={error.gender} className="mt-1" />
            </div>
            <div>
              <Inpt type='email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} label="Email address" />
              <InputError message={error.email} className="mt-1" />
            </div>
          </CardBody>
          <CardFooter className='flex justify-end'>
            <Button onClick={handleAdd} color='green' loading={processing}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </Modal>
    </AuthenticatedLayout>
  )
}

export default List