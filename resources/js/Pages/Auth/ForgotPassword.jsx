import Inpt from '@/Components/Input'
import GuestLayout from '@/Layouts/GuestLayout'
import { useForm } from '@inertiajs/react'
import { Alert, Button } from '@material-tailwind/react'

const ForgotPassword = ({ status }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSend = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            {status && (
                <Alert variant="ghost" color="green">
                    <span className="text-sm">
                        {status}
                    </span>
                </Alert>
            )}
            {errors.email && (
                <Alert variant="outlined" color="red">
                    <span className="text-sm">
                        {errors.email}
                    </span>
                </Alert>
            )}
            <form onSubmit={handleSend} className='space-y-6'>
                <span className="font-bold text-base text-green-500">Forgot Password</span>
                <Inpt value={data.email} onChange={(e) => setData('email', e.target.value)} label="Email Address" type='email' required />
                <Button type='submit' color='green' fullWidth disabled={processing}>
                    Send
                </Button>
            </form>
        </GuestLayout>
    );
}

export default ForgotPassword
