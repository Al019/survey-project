import Modal from '@/Components/Modal';
import { Spinner } from '@material-tailwind/react';
import { createContext, useContext, useState } from 'react';
import Logo from '../../../public/images/logo.png'

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(false)

  return (
    <ProgressContext.Provider value={{ setProgress }}>
      {children}
      <Modal open={progress}>
        <div className='relative flex justify-center items-center'>
          <img src={Logo} className='absolute size-44 z-10' alt="logo" />
          <Spinner className='absolute size-48' color='green' />
        </div>
      </Modal>
    </ProgressContext.Provider>
  );
};
