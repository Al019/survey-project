import Modal from '@/Components/Modal';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@material-tailwind/react';
import { createContext, useContext, useState } from 'react';

const SecurityContext = createContext();

export const useSecurity = () => useContext(SecurityContext);

export const SecurityProvider = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <SecurityContext.Provider value={{ setOpen }}>
      {children}
      <Modal open={open}>
        <Card className='shadow-none'>
          <CardHeader floated={false} shadow={false} className='text-center font-semibold text-lg'>
            Security Alert!
          </CardHeader>
          <CardBody className='flex flex-col items-center gap-2'>
            <LockClosedIcon color='red' className='size-20' />
            <span className='text-sm text-center font-normal text-blue-gray-700'>Please change your password!</span>
          </CardBody>
          <CardFooter>
            <Button onClick={() => router.visit(route('profile.information'))} color='green' fullWidth>
              Change Password
            </Button>
          </CardFooter>
        </Card>
      </Modal>
    </SecurityContext.Provider>
  );
};
