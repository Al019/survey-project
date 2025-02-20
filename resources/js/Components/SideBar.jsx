import { usePage } from '@inertiajs/react'
import User from '../../../public/images/user.png'
import Logo from '../../../public/images/logo.png'
import { Accordion, AccordionBody, AccordionHeader, Chip, List, ListItem, ListItemPrefix } from '@material-tailwind/react'
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, DocumentDuplicateIcon, PresentationChartLineIcon, UsersIcon } from '@heroicons/react/24/outline'
import NavLink from './NavLink'
import { useSidebar } from '@/Contexts/SidebarContext'

const SideBar = () => {
  const user = usePage().props.auth.user
  const { isSidebarOpen, closeSidebar } = useSidebar()

  const [open, setOpen] = useState(0)

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  return (
    <div>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-[80] transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"} lg:hidden`} onClick={closeSidebar} />
      <div className={`overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 transition-transform duration-300 transform h-full fixed top-0 start-0 bottom-0 z-[99] bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="relative flex flex-col h-full max-h-full ">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <img src={Logo} className="object-contain size-12" />
              <span className="text-green-500 font-bold text-xl tracking-wide">DITADS</span>
            </div>
          </div>
          <List>
            <Chip value={user.role === 'admin' && 'Administrator' || user.role === 'enumerator' && 'Enumerator' || user.role === 'viewer' && 'Viewer'} variant="outlined" className="w-fit mb-4" color="green" />
            <Accordion open={open === 1} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`} />}>
              <ListItem className="p-0">
                <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                  <ListItemPrefix>
                    <img src={User} className="h-8 w-8" />
                  </ListItemPrefix>
                  <span className="mr-auto text-sm font-normal">
                    {user.first_name} {user.last_name}
                  </span>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <NavLink onClick={closeSidebar} href={route('profile.information')} active={location.pathname.startsWith('/profile')} label='My Profile'>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                    </ListItemPrefix>
                  </NavLink>
                  <NavLink method="post" onClick={closeSidebar} href={route('logout')} label='Sign Out'>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                    </ListItemPrefix>
                  </NavLink>
                </List>
              </AccordionBody>
            </Accordion>
            <hr className="m-2 border-blue-gray-200" />
            {user.role === 'admin' && (
              <div className="space-y-2">
                <div>
                  <NavLink onClick={closeSidebar} href={route('admin.dashboard')} active={location.pathname.startsWith('/admin/dashboard')} label='Dashboard'>
                    <ListItemPrefix>
                      <PresentationChartLineIcon className="h-5 w-5" />
                    </ListItemPrefix>
                  </NavLink>
                </div>
                <div>
                  <Accordion open={open === 2} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`} />}>
                    <ListItem className="p-0">
                      <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                        <ListItemPrefix>
                          <UsersIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <span className="mr-auto text-sm font-normal">
                          Users
                        </span>
                      </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                      <List className="p-0">
                        <NavLink onClick={closeSidebar} href={route('admin.enumerator.list')} active={location.pathname.startsWith('/admin/enumerators')} label='Enumerators'>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                          </ListItemPrefix>
                        </NavLink>
                        <NavLink onClick={closeSidebar} href={route('admin.viewer.list')} active={location.pathname.startsWith('/admin/viewers')} label='Viewers'>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                          </ListItemPrefix>
                        </NavLink>
                      </List>
                    </AccordionBody>
                  </Accordion>
                </div>
                <div>
                  <NavLink onClick={closeSidebar} href={route('admin.survey.list')} active={location.pathname.startsWith('/admin/surveys')} label='Surveys'>
                    <ListItemPrefix>
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </ListItemPrefix>
                  </NavLink>
                </div>
              </div>
            )}
            {user.role === 'enumerator' && (
              <div className="space-y-2">
                <div>
                  <NavLink onClick={closeSidebar} href={route('enumerator.dashboard')} active={location.pathname.startsWith('/enumerator/dashboard')} label='Dashboard'>
                    <ListItemPrefix>
                      <PresentationChartLineIcon className="h-5 w-5" />
                    </ListItemPrefix>
                  </NavLink>
                </div>
                <div>
                  <NavLink onClick={closeSidebar} href={route('enumerator.survey.list')} active={location.pathname.startsWith('/enumerator/surveys')} label='Surveys'>
                    <ListItemPrefix>
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </ListItemPrefix>
                  </NavLink>
                </div>
              </div>
            )}
            {user.role === 'viewer' && (
              <div className="space-y-2">
                <div>
                  <NavLink onClick={closeSidebar} href={route('viewer.dashboard')} active={location.pathname.startsWith('/viewer/dashboard')} label='Dashboard'>
                    <ListItemPrefix>
                      <PresentationChartLineIcon className="h-5 w-5" />
                    </ListItemPrefix>
                  </NavLink>
                </div>
                <div>
                  <NavLink onClick={closeSidebar} href={route('viewer.survey.list')} active={location.pathname.startsWith('/viewer/surveys')} label='Surveys'>
                    <ListItemPrefix>
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </ListItemPrefix>
                  </NavLink>
                </div>
              </div>
            )}
          </List>
        </div>
      </div>
    </div>
  )
}

export default SideBar