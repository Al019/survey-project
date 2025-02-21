import { motion } from "framer-motion"
import { BeatLoader } from "react-spinners"

const Loader = () => {
  return (
    <motion.div
      className="lg:ml-64 z-50 absolute inset-0 flex justify-center items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <BeatLoader color="#4caf50" size={24} />
    </motion.div>
  )
}

export default Loader
