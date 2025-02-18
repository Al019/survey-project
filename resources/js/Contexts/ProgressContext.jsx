import Modal from '@/Components/Modal';
import { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(false)

  return (
    <ProgressContext.Provider value={{ setProgress }}>
      {children}
      <Modal open={progress}>
        <div className='flex justify-center'>
          <div className='bg-white p-4 w-fit rounded-md'>
            <span className='text-blue-gray-800 font-medium text-sm'>Submitting reponse, Please wait...</span>
          </div>
        </div>
      </Modal>
    </ProgressContext.Provider>
  );
};
