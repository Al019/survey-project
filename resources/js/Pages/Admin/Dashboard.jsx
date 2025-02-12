import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import DarkModeToggle from "@/Components/preline/DarkModeToggle"

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className='lg:ml-64 grid grid-cols-2 items-center p-4 border-b border-gray-200'>
                    <div>
                        <button type="button" className="block w-fit font-medium text-gray-800 p-1.5 rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 lg:hidden" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-sidebar-header" aria-label="Toggle navigation" data-hs-overlay="#hs-sidebar-header">
                            <Bars3BottomLeftIcon className='shrink-0 size-5' />
                        </button>
                    </div>
                    <div className='flex justify-end'>
                        <DarkModeToggle />
                    </div>
                </div>
            }>
            <div className="mx-auto max-w-7xl p-4">
                <div className="overflow-hidden bg-white shadow-sm ">
                    <div className="p-6 text-gray-900">
                        You're logged in!
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}