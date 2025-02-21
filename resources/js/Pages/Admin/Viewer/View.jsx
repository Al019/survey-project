import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Card, CardBody, Chip, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import User from '../../../../../public/images/user.png'
import Inpt from "@/Components/Input";
import axios from "axios";
import Loader from "@/Components/Loader";

const tabs = ["Personal Details"]

const View = () => {
  const [viewer, setViewer] = useState({})
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [loading, setLoading] = useState(true)

  const viewer_id = new URLSearchParams(window.location.search).get('viewer_id')

  useEffect(() => {
    if (viewer_id) {
      getViewer()
    }
  }, [viewer_id])

  const getViewer = async () => {
    await axios.get(route('api.admin.view.viewer', { viewer_id }))
      .then(({ data }) => {
        setViewer(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Tabs value={activeTab}>
      <AuthenticatedLayout title={
        <div>
          {viewer.first_name} {viewer.last_name}
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
                          {viewer.first_name} {viewer.last_name}
                        </span>
                        <Chip value={viewer.role === 'admin' && 'Administrator' || viewer.role === 'viewer' && 'viewer'} variant="outlined" className="w-fit" color="green" />
                      </div>
                    </div>
                    <Chip value={viewer.status} variant="ghost" className="w-fit" color={viewer.status === 'active' ? 'green' : 'red'} />
                  </CardBody>
                </Card>
                <Card className='h-fit shadow-none border border-gray-200'>
                  <CardBody className='max-sm:p-4'>
                    <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                      <Inpt value={viewer.last_name} variant="standard" label="Last Name" />
                      <Inpt value={viewer.first_name} variant="standard" label="First Name" />
                      <Inpt value={viewer.middle_name === null ? '-' : viewer.middle_name} variant="standard" label="Middle Name" />
                      <Inpt value={viewer.gender} variant="standard" label="Gender" className="capitalize" />
                      <Inpt value={viewer.email} variant="standard" label="Email Address" />
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