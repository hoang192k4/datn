import { Outlet } from "react-router-dom";
import HeaderAdmin from "../Header/HeaderAdmin";
import Sidebar from "../sidebar/Sidebar";
const TeacherLayout = () => {
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (!sidebar || !overlay)
            return;
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    return (
        <>
            <HeaderAdmin toggleSidebar={toggleSidebar} />
            <Sidebar toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <Outlet />
            </div>

        </>
    )
}

export default TeacherLayout