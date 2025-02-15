import { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const showToast = (message, type = 'success') => {
    toast[type](message)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        className="text-sm" />
    </ToastContext.Provider>
  );
};