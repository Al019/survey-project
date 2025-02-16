import { Link } from '@inertiajs/react';
import Logo from '../../../public/images/logo.png'

const GuestLayout = ({ children }) => {
    return (
        <div className='min-h-screen flex items-center justify-center p-4 max-sm:p-2'>
            <div className='flex flex-col bg-white border rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 space-y-6 w-full max-w-sm'>
                <div className="flex justify-center items-center">
                    <Link href='/'>
                        <img src={Logo} className="object-contain size-20" />
                    </Link>
                </div>
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
