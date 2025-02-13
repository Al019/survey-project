import SideBar from "@/Components/preline/SideBar"
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import DarkModeToggle from "@/Components/preline/DarkModeToggle"
import { IconButton } from "@material-tailwind/react"

const AuthenticatedLayout = ({ children }) => {
    return (
        <div className="lg:ml-64">
            <SideBar />
            <div className='bg-white grid grid-cols-2 items-center p-2.5 border-b border-gray-200'>
                <div className='flex justify-start'>
                    <IconButton size="md" variant="text" className="lg:hidden" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-sidebar-header" aria-label="Toggle navigation" data-hs-overlay="#hs-sidebar-header">
                        <Bars3BottomLeftIcon className="size-6 opacity-60" />
                    </IconButton>
                </div>
                <div className='flex justify-end'>
                    <DarkModeToggle />
                </div>
            </div>
            {children}
        </div>
    )
}

export default AuthenticatedLayout