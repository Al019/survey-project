import Inpt from '@/Components/material/Input';
import Tbl from '@/Components/material/Table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader, Option, Select } from '@material-tailwind/react';

const List = () => {
  const { enumerators } = usePage().props
  const { data, setData, post, processing, errors, reset } = useForm({
    last_name: "",
    first_name: "",
    middle_name: "",
    gender: "",
    email: ""
  });

  const handleAdd = () => {
    post(route('admin.add.enumerator'), {
      onSuccess: () => reset('last_name', 'first_name', 'middle_name', 'gender', 'email')
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
    tbodies: enumerators.map((enumerator) => ({
      id: enumerator.id,
      last_name: enumerator.last_name,
      first_name: enumerator.first_name,
      middle_name: enumerator.middle_name,
      email: enumerator.email,
      status: enumerator.status
    }))
  }

  return (
    <AuthenticatedLayout>
      <div className='p-4 space-y-4'>
        <div className="flex justify-end">
          <Button color='green' variant='outlined' aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-scale-animation-modal" data-hs-overlay="#hs-scale-animation-modal">
            Add
          </Button>
        </div>
        <Tbl title="Enumerators" data={dataTable} />
      </div>

      <div id="hs-scale-animation-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabIndex="-1" aria-labelledby="hs-scale-animation-modal-label">
        <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 md:max-w-2xl md:w-full m-4 md:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="w-full flex flex-col bg-white border rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <Card className='shadow-none'>
              <CardHeader shadow={false} floated={false} className="text-lg font-semibold">
                Add Enumerator
              </CardHeader>
              <CardBody className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <Inpt value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} variant="standard" label="Last name" />
                <Inpt value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} variant="standard" label="First name" />
                <Inpt value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} variant="standard" label="Middle name" placeholder="Optional" />
                <Select value={data.gender} onChange={(val) => setData('gender', val)} variant="standard" label="Gender" color="green">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
                <Inpt type='email' value={data.email} onChange={(e) => setData('email', e.target.value)} variant="standard" label="Email address" />
              </CardBody>
              <CardFooter className='flex justify-end'>
                <Button onClick={handleAdd} color='green' variant='outlined' disabled={processing}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default List