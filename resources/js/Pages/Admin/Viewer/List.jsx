import InputError from '@/Components/InputError'
import Inpt from '@/Components/Input'
import Tbl from '@/Components/Table'
import Modal from '@/Components/Modal'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { router, useForm, usePage } from '@inertiajs/react'
import { Button, Card, CardBody, CardFooter, CardHeader, Option, Select } from '@material-tailwind/react'
import { useState } from 'react'

const List = () => {
  const { viewers } = usePage().props
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm({
    last_name: "",
    first_name: "",
    middle_name: "",
    gender: "",
    email: ""
  })

  const handleAdd = () => {
    post(route('admin.add.viewer'), {
      onSuccess: () => {
        reset()
        setOpen(false)
      }
    });
  };

  const dataTable = {
    theads: [
      "Last Name",
      "First Name",
      "Middle Name",
      "Email Address",
      "Status"
    ],
    tbodies: viewers.map((viewer) => ({
      id: viewer.id,
      last_name: viewer.last_name,
      first_name: viewer.first_name,
      middle_name: viewer.middle_name,
      email: viewer.email,
      status: viewer.status
    }))
  }

  const handleNavigate = (viewer_id) => {
    router.visit(route('admin.view.viewer', { viewer_id }))
  }

  return (
    <AuthenticatedLayout title="Viewers" button={
      <Button color='green' onClick={() => setOpen(true)}>
        Add
      </Button>
    }>
      <div className='p-4 max-sm:p-2 mt-[80px]'>
        <Tbl title="Viewers" idKey="id" data={dataTable} onClickView={handleNavigate} />
      </div>
      <Modal size="md" open={open} onClose={() => setOpen(false)}>
        <Card className='shadow-none'>
          <CardHeader shadow={false} floated={false} className="text-lg font-semibold">
            Add Viewer
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div>
              <Inpt value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} label="Last name" />
              <InputError message={errors.last_name} className="mt-1" />
            </div>
            <div>
              <Inpt value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} label="First name" />
              <InputError message={errors.first_name} className="mt-1" />
            </div>
            <div>
              <Inpt value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} label="Middle name" placeholder="Optional" />
              <InputError message={errors.middle_name} className="mt-1" />
            </div>
            <div>
              <Select value={data.gender} onChange={(val) => setData('gender', val)} label="Gender" color="green">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
              <InputError message={errors.gender} className="mt-1" />
            </div>
            <div>
              <Inpt type='email' value={data.email} onChange={(e) => setData('email', e.target.value)} label="Email address" />
              <InputError message={errors.email} className="mt-1" />
            </div>
          </CardBody>
          <CardFooter className='flex justify-end'>
            <Button onClick={handleAdd} color='green' disabled={processing}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </Modal>
    </AuthenticatedLayout>
  )
}

export default List