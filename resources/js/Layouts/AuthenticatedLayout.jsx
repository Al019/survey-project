
import SideBar from "@/Components/preline/SideBar"


const AuthenticatedLayout = ({ header, children }) => {
    return (
        <div>
            {header}
            <SideBar />
            {children}
        </div>
    )
}

export default AuthenticatedLayout