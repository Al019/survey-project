import { Link, usePage } from '@inertiajs/react'
import User from '../../../../public/images/user.png'
import Logo from '../../../../public/images/logo.png'
import { Accordion, AccordionBody, AccordionHeader, Chip, List, ListItem, ListItemPrefix } from '@material-tailwind/react'
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, PresentationChartLineIcon, UsersIcon } from '@heroicons/react/24/outline'
import NavLink from '../NavLink'

const SideBar = () => {
  const user = usePage().props.auth.user
  const [open, setOpen] = useState(0)

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  return (
    <div id="hs-sidebar-header" className="hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform h-full hidden fixed top-0 start-0 bottom-0 z-[60] bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabIndex="-1" aria-label="Sidebar" >
      <div className="relative flex flex-col h-full max-h-full ">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img src={Logo} className="object-contain size-12" />
            <span className="text-green-500 font-bold text-xl tracking-wide">DITADS</span>
          </div>
        </div>
        <List>
          <Chip value={user.role === 'admin' && 'Administrator' || user.role === 'enumerator' && 'Enumerator'} variant="outlined" className="w-fit mb-4" color="green" />
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
                <NavLink href={route('profile.information')} active={route().current('profile.information')} label='My Profile'>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                  </ListItemPrefix>
                </NavLink>
                <NavLink method="post" href={route('logout')} label='Sign Out'>
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
                <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} label='Dashboard'>
                  <ListItemPrefix>
                    <PresentationChartLineIcon className="h-5 w-5" />
                  </ListItemPrefix>
                </NavLink>
              </div>
              <div>
                <NavLink href={route('admin.enumerator.list')} active={route().current('admin.enumerator.*')} label='Enumerators'>
                  <ListItemPrefix>
                    <UsersIcon className="h-5 w-5" />
                  </ListItemPrefix>
                </NavLink>
              </div>
              <div>
                <NavLink href={route('admin.survey.list')} active={route().current('admin.survey.*')} label='Surveys'>
                  <ListItemPrefix>
                    <UsersIcon className="h-5 w-5" />
                  </ListItemPrefix>
                </NavLink>
              </div>
            </div>
          )}
        </List>
      </div>
    </div>
  )
}

export default SideBar