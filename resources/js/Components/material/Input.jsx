import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Button, IconButton, Input } from "@material-tailwind/react"
import { useState } from "react"

const Inpt = ({ label, onChange, type = 'text', ...rest }) => {
  const [toggle, setToggle] = useState(false)

  return (
    <Input onChange={onChange} label={label} type={type === "password" ? (toggle ? "text" : "password") : type} icon={type === 'password' && (
      <div className='absolute inset-y-0 flex items-center'>
        <IconButton onClick={() => setToggle(!toggle)} size="sm" variant="text" className="rounded-full text-blue-gray-500" tabIndex={-1}>
          {!toggle ? (
            <EyeSlashIcon className="size-6" />
          ) : (
            <EyeIcon className="size-6" />
          )}
        </IconButton>
      </div>
    )} color="green" {...rest} />
  )
}

export default Inpt