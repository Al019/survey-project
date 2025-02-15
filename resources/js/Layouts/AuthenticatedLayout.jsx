import SideBar from '@/Components/SideBar'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { IconButton } from "@material-tailwind/react"
import { useSidebar } from "@/Contexts/SidebarContext"

const AuthenticatedLayout = ({ title = "", button, tab, children }) => {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="lg:ml-64">
            <SideBar />
            <div className="z-50 fixed left-0 lg:left-64 right-0 top-0 bg-white border-b border-gray-200">
                <div className='h-20 grid grid-cols-2 items-center p-4 max-sm:p-2'>
                    <div className='flex justify-start items-center gap-4 max-sm:gap-2'>
                        <IconButton onClick={toggleSidebar} size="md" variant="text" className="lg:hidden">
                            <Bars3BottomLeftIcon className="size-6" />
                        </IconButton>
                        <h1 className="text-base font-medium text-blue-gray-800 break-words line-clamp-2">
                            {title}
                        </h1>
                    </div>
                    <div className='flex justify-end'>
                        {button}
                    </div>
                </div>
                {tab}
            </div>
            <div className="max-w-[1280px] mx-auto">
                {children}
            </div>
        </div>
    )
}

export default AuthenticatedLayout