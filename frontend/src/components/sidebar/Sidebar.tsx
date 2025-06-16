import './Sidebar.css';
import { useState } from 'react';
import MenuItem from '../ui/MenuItem';
const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const menuItems = [
        { icon: "📊", url: "#", label: "Dashboard" },
        { icon: "👥", url: "#", label: "Danh Sách Sinh Viên" },
        { icon: "📚", url: "lop-hoc", label: "Lớp Học" },
        { icon: "📝", url: "diem", label: "Quản Lý Điểm" },
        { icon: "📅", url: "#", label: "Thời Khóa Biểu" },
        { icon: "📁", url: "tai-lieu", label: "Tài Liệu" },
         { icon: "📅", url: "diem-danh", label: "Quản Lý Điểm Danh" },
        { icon: "📢", url: "thong-bao", label: "Thông Báo" },
    ];
    return (
        <>
            {/*  Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-title">Chào Mừng Giáo Viên</div>
                    <div className="sidebar-subtitle">Hệ thống quản lý học tập</div>
                </div>
                <nav className="sidebar-menu">
                    {
                        menuItems.map((item, index) => (
                            <MenuItem
                                url={item.url}
                                key={index}
                                icon={item.icon}
                                className={activeIndex === index ? "active" : ""}
                                onClick={() => setActiveIndex(index)}
                            >
                                {item.label}
                            </MenuItem>
                        ))}

                </nav>
            </div>

            {/* Sidebar Overlay for Mobile  */}
            <div className="sidebar-overlay" id="sidebarOverlay" onClick={toggleSidebar}></div>
        </>
    )
}

export default Sidebar