import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Card, CardBody, Chip, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import User from '../../../../../public/images/user.png'
import Inpt from "@/Components/Input";
import axios from "axios";
import Loader from "@/Components/Loader";

const tabs = ["Personal Details"]

const View = () => {
  const [enumerator, setEnumerator] = useState({})
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [loading, setLoading] = useState(true)

  const enumerator_id = new URLSearchParams(window.location.search).get('enumerator_id');

  useEffect(() => {
    if (enumerator_id) {
      getEnumerator()
    }
  }, [enumerator_id])

  const getEnumerator = async () => {
    await axios.get(route('api.admin.view.enumerator', { enumerator_id }))
      .then(({ data }) => {
        setEnumerator(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title={
        <div>
          {enumerator.first_name} {enumerator.last_name}
        </div>
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
        {loading ? (
          <Loader />
        ) : (
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
            </TabsBody>
          </div>
        )}
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View