import './Sidebar.css';
import { useState } from 'react';
import MenuItem from '../ui/MenuItem';
import { useSelector } from 'react-redux';

interface SubMenuItem {
    icon: string;
    url: string;
    label: string;
    roles: string[];
}

interface MenuItemData {
    icon: string;
    url: string;
    label: string;
    roles: string[];
    subItems?: SubMenuItem[];
}

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const role = useSelector((state: any) => state.auth.user?.role);
    const menuItems: MenuItemData[] = [
        {
            icon: "🏠",
            url: "dashboard",
            label: "Dashboard",
            roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
        },
        {
            icon: "🎓",
            url: "lop-hoc",
            label: "Lớp Học",
            roles: ["subject_teacher", "homeroom_teacher"]
            //roles: ["subject_teacher"]
        },
        {
            icon: "📝",
            url: "diem",
            label: "Quản Lý Điểm",
            roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"]
            //roles: ["subject_teacher"]
        },
        {
            icon: "📊",
            url: "diem-danh",
            label: "Quản Lý Điểm Danh",
            roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
            //roles: ["subject_teacher"]
        },
        {
            icon: "📅",
            url: "thoi-khoa-bieu",
            label: "Thời Khóa Biểu",
            roles: ["faculty_admin", "department_admin"],
        },
        {
            icon: "📅",
            url: "thoi-khoa-bieu-giang-vien",
            label: "Thời Khóa Biểu",
            roles: ["subject_teacher", "homeroom_teacher"],
        }, {
            icon: "📁",
            url: "tai-lieu",
            label: "Tài Liệu",
            // roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
            roles: ["subject_teacher"]
        },
        {
            icon: "🔔",
            url: "thong-bao/danh-sach",
            label: "Thông Báo",
            subItems: [
                { icon: "📋", url: "thong-bao/danh-sach", label: "Danh Sách TB", roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"] },
                { icon: "📝", url: "thong-bao/khoa-va-sinh-vien", label: "Thông Báo Từ Khoa & Sinh Viên", roles: ["subject_teacher", "homeroom_teacher"] },
            ],
            roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
        },
        {
            icon: "👨‍🎓",
            url: "sinh-vien",
            label: "Quản lý Sinh Viên",
            roles: ["faculty_admin", "department_admin"],
        },
        {
            icon: "👨‍🏫",
            url: "giang-vien",
            label: "Quản lý giảng viên",
            roles: ["faculty_admin", "department_admin"],
        },

        {
            icon: "📚",
            url: "lop-hoc-phan",
            label: "Quản lý lớp học phần",
            roles: ["faculty_admin", "department_admin"],
        },
        {
            icon: "🎓",
            url: "lop-chinh-khoa",
            label: "Quản lý lớp chính khóa",
            roles: ["faculty_admin", "department_admin"],
        },
    ];


    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.includes(role)
    ).map(item => ({
        ...item,
        subItems: item.subItems?.filter(sub =>
            !sub.roles || sub.roles.includes(role)
        )
    }));

    return (
        <>
            {/*  Sidebar */}
            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-title">Chào Mừng Giáo Viên</div>
                    <div className="sidebar-subtitle">Hệ thống quản lý học tập</div>
                </div>
                <nav className="sidebar-menu">
                    {filteredMenuItems.map((item, index) => (
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
