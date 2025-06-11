import { Outlet } from "react-router-dom"
import Footer from "../Footer/Footer"
import SidebarStudent from "../sidebar/SidebarStudent"
import HeaderStudent from "../Header/HeaderStudent"

const StudentLayout = () => {
    return (
        <>
            <HeaderStudent />
            <div className="layout-student">
                <SidebarStudent />
                <div className="main-student">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default StudentLayout