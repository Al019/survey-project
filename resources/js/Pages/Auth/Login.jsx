import Inpt from '@/Components/material/Input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { Alert, Button, Checkbox } from '@material-tailwind/react';

const Login = ({ status, canResetPassword }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout header={
            <div className='space-y-6'>
                {status && (
                    <Alert variant="outlined" color="green">
                        <span className="text-sm">
                            {status}
                        </span>
                    </Alert>
                )}
                {(errors.email || errors.password) && (
                    <Alert variant="outlined" color="red">
                        <span className="text-sm">
                            {errors.email || errors.password}
                        </span>
                    </Alert>
                )}
            </div>
        }>
            <form onSubmit={handleLogin} className='space-y-6'>
                <span className="font-semibold text-green-500">Login</span>
                <div className="space-y-4">
                    <Inpt value={data.email} onChange={(e) => setData('email', e.target.value)} label="Email Address" type='email' required />
                    <div className="space-y-2">
                        <Inpt value={data.password} onChange={(e) => setData('password', e.target.value)} label="Password" type='password' required />
                        <div className="flex justify-between items-center">
                            <Checkbox checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                } color="green" label="Remember Me" labelProps={{ className: "text-sm font-normal text-blue-gray-500" }} />
                            {canResetPassword && (
                                <Link href={route('password.request')}>
                                    <span className="text-blue-gray-500 text-sm cursor-pointer hover:underline hover:text-green-500">Forgot Password?</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <Button type='submit' color='green' fullWidth disabled={processing}>
                    Sign In
                </Button>
            </form>
        </GuestLayout>
    );
}

export default Login