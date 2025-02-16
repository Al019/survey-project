import SideBar from '@/Components/SideBar'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { IconButton } from "@material-tailwind/react"
import { useSidebar } from "@/Contexts/SidebarContext"
import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { useSecurity } from '@/Contexts/SecurityContext'

const AuthenticatedLayout = ({ title = "", button, tab, children }) => {
    const { toggleSidebar } = useSidebar()
    const user = usePage().props.auth.user
    const currentPath = usePage().url
    const { setOpen } = useSecurity()

    useEffect(() => {
        const securityAlert = () => {
            if (user.is_default === 0 && currentPath !== "/profile") {
                setOpen(true)
            } else {
                setOpen(false)
            }
        }
        securityAlert()
    }, [user])

    return (
        <div className="lg:ml-64">
            <SideBar />
            <div className="z-50 fixed left-0 lg:left-64 right-0 top-0 bg-white border-b border-gray-200">
                <div className='h-20 grid grid-cols-2 items-center p-4 max-sm:p-2'>
                    <div className='flex justify-start items-center gap-4 max-sm:gap-2'>
                        <div className="lg:hidden">
                            <IconButton onClick={toggleSidebar} variant="text">
                                <Bars3BottomLeftIcon className="size-6" />
                            </IconButton>
                        </div>
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