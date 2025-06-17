import './Sidebar.css';
import { useState } from 'react';
import MenuItem from '../ui/MenuItem';

interface SubMenuItem {
    icon: string;
    url: string;
    label: string;
}

interface MenuItemData {
    icon: string;
    url: string;
    label: string;
    subItems?: SubMenuItem[];
}

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const menuItems: MenuItemData[] = [
        {
            icon: "📊",
            url: "dashboard",
            label: "Dashboard",
        },
        {
            icon: "👥",
            url: "sinh-vien",
            label: "Danh Sách Sinh Viên",
        },
        {
            icon: "📚",
            url: "lop-hoc",
            label: "Lớp Học",
        },
        {
            icon: "📝",
            url: "diem",
            label: "Quản Lý Điểm",
        },
        {
            icon: "📅",
            url: "thoi-khoa-bieu",
            label: "Thời Khóa Biểu",
        },
        {
            icon: "📁",
            url: "tai-lieu",
            label: "Tài Liệu",
        },
        {
            icon: "📅",
            url: "diem-danh",
            label: "Quản Lý Điểm Danh",
        },
        {
            icon: "📢",
            url: "thong-bao",
            label: "Thông Báo",
            subItems: [
                { icon: "📋", url: "thong-bao/danh-sach", label: "Danh Sách TB" },
                { icon: "📝", url: "thong-bao/khoa", label: "Thông Báo Từ Khoa" },
                { icon: "📝", url: "thong-bao/sinh-vien", label: "Phản Hồi Từ Sinh Viên" },
            ]
        },
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
                    {menuItems.map((item, index) => (
                        <MenuItem
                            url={item.url}
                            key={index}
                            icon={item.icon}
                            className={activeIndex === index ? "active" : ""}
                            onClick={() => setActiveIndex(index)}
                            subItems={item.subItems}
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
