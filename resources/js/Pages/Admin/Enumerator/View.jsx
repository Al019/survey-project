import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { useState } from "react";
import User from '../../../../../public/images/user.png'
import Inpt from "@/Components/Input";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";

const tabs = ["Personal Details", "Settings"]

const View = () => {
  const { enumerator } = usePage().props
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [openDelete, setOpenDelete] = useState(false)
  const { post, data, setData, errors, processing } = useForm()

  const handleDeleteEnumerator = () => {
    post(route('admin.delete.enumerator', {
      enumerator_id: enumerator.id
    }))
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title={
        <div>
          {enumerator.first_name} {enumerator.last_name}
        </div>
      } tab={
        <div className="h-[30px] flex justify-start items-end px-4">
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
                className={`text-sm whitespace-nowrap ${activeTab === tab && "text-blue-gray-800 font-medium"}`}
              >
                {tab}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      }>
        <div className="max-w-[800px] mx-auto mt-[110px]">
          <TabsBody>
            <TabPanel value="Personal Details" className="space-y-4 max-sm:space-y-2 max-sm:p-2">
              <Card className='h-fit shadow-none border border-gray-200'>
                <CardBody className='flex items-center justify-between max-sm:p-4'>
                  <div className='flex items-center gap-4'>
                    <img src={User} className="h-24 w-24" />
                    <div className='flex flex-col space-y-2'>
                      <span className='text-base font-semibold text-blue-gray-800'>
                        {enumerator.first_name} {enumerator.last_name}
                      </span>
                      <Chip value={enumerator.role === 'admin' && 'Administrator' || enumerator.role === 'enumerator' && 'Enumerator'} variant="outlined" className="w-fit" color="green" />
                    </div>
                  </div>
                  <Chip value={enumerator.status} variant="ghost" className="w-fit" color={enumerator.status === 'active' ? 'green' : 'red'} />
                </CardBody>
              </Card>
              <Card className='h-fit shadow-none border border-gray-200'>
                <CardBody className='max-sm:p-4'>
                  <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                    <Inpt value={enumerator.last_name} variant="standard" label="Last Name" />
                    <Inpt value={enumerator.first_name} variant="standard" label="First Name" />
                    <Inpt value={enumerator.middle_name === null ? '-' : enumerator.middle_name} variant="standard" label="Middle Name" />
                    <Inpt value={enumerator.gender} variant="standard" label="Gender" className="capitalize" />
                    <Inpt value={enumerator.email} variant="standard" label="Email Address" />
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel value="Settings">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="space-y-4 max-sm:p-4">
                  <h1 className="font-medium">Manage Enumerator</h1>
                  <hr className="border-blue-gray-200" />
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h1 className="font-normal text-sm">Delete this enumerator</h1>
                      <p className="text-xs font-normal">Once you delete a enumerator, there is no going back. Please be certain.</p>
                    </div>
                    <Button onClick={() => setOpenDelete(true)} variant="outlined" size="sm" color="red">
                      Delete enumerator
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </div>

        <Modal size="sm" open={openDelete} onClose={() => setOpenDelete(false)}>
          <Card className="shadow-none">
            <CardHeader shadow={false} floated={false} className="text-lg font-semibold">
              Confirm your password
            </CardHeader>
            <CardBody>
              <Inpt value={data.password} onChange={(e) => setData("password", e.target.value)} label="Password" type="password" />
              <InputError message={errors.password} className="mt-1" />
            </CardBody>
            <CardFooter>
              <Button onClick={handleDeleteEnumerator} color="red" disabled={processing} fullWidth>
                Delete this enumerator
              </Button>
            </CardFooter>
          </Card>
        </Modal>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View