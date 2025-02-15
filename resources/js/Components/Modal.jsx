import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

const Modal = ({ open, onClose, size = 'sm', children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const maxWidthClass = {
    'sm': 'sm:max-w-xl sm:w-full m-4 sm:mx-auto',
    'md': 'md:max-w-2xl md:w-full m-4 md:mx-auto',
    'lg': 'lg:max-w-4xl lg:w-full m-4 lg:mx-auto',
  }[size]

  return (
    <AnimatePresence>
      {open && (
        <div onClick={onClose} className="size-full fixed top-0 start-0 z-[99] overflow-x-hidden overflow-y-auto bg-black bg-opacity-50" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }} className={`min-h-[calc(100%-3.5rem)] flex items-center ${maxWidthClass}`}>
            <div className="w-full flex flex-col pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
