import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card, CardBody, Chip, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { useState } from 'react';
import User from '../../../../public/images/user.png'
import { useForm, usePage } from '@inertiajs/react';
import Inpt from '@/Components/Input';
import InputError from '@/Components/InputError';
import { useToast } from '@/Contexts/ToastContext';

const tabs = ["Personal Details", "Change Password"]

const Information = () => {
  const user = usePage().props.auth.user
  const [activeTab, setActiveTab] = useState(user.is_default === 0 ? "Change Password" : "Personal Details")
  const { data, setData, post, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const { showToast } = useToast()

  const handleSave = () => {
    post(route('profile.change.password'), {
      onSuccess: () => {
        reset()
        showToast("Change password successfully.")
      }
    });
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title="My Profile" button={
        <Button onClick={handleSave} color="green" disabled={processing} className={activeTab !== tabs[1] ? 'hidden' : ''}>
          Save Changes
        </Button>
      } tab={
        <div className="h-[30px] overflow-x-auto flex max-sm:justify-center items-end px-4">
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
                <CardBody className='max-sm:p-4'>
                  <div className='flex items-center gap-4'>
                    <img src={User} className="h-24 w-24" />
                    <div className='flex flex-col space-y-2'>
                      <span className='text-base font-semibold text-blue-gray-800'>
                        {user.first_name} {user.last_name}
                      </span>
                      <Chip value={user.role === 'admin' && 'Administrator' || user.role === 'enumerator' && 'Enumerator' || user.role === 'viewer' && 'Viewer'} variant="outlined" className="w-fit mb-4" color="green" />
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card className='h-fit shadow-none border border-gray-200'>
                <CardBody className='max-sm:p-4'>
                  <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                    <Inpt value={user.last_name} variant="standard" label="Last Name" />
                    <Inpt value={user.first_name} variant="standard" label="First Name" />
                    <Inpt value={user.middle_name === null ? '-' : user.middle_name} variant="standard" label="Middle Name" />
                    <Inpt value={user.gender} variant="standard" label="Gender" className="capitalize" />
                    <Inpt value={user.email} variant="standard" label="Email Address" />
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel value="Change Password" className="max-sm:p-2">
              <Card className="shadow-none border border-gray-200">
                <CardBody className="space-y-4 max-sm:p-4">
                  {user.is_default === 1 && (
                    <div className="grid grid-cols-2 max-sm:grid-cols-1">
                      <div>
                        <Inpt value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} label="Current Password" type='password' />
                        <InputError message={errors.current_password} className="mt-1" />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 max-sm:grid-cols-1">
                    <div>
                      <Inpt value={data.password} onChange={(e) => setData('password', e.target.value)} label="New Password" type='password' />
                      <InputError message={errors.password} className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 max-sm:grid-cols-1">
                    <div>
                      <Inpt value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} label="Confirm Password" type='password' />
                      <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </div>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default Information