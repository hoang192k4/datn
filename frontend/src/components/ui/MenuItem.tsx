import type { ReactNode } from "react"
import { Link } from "react-router-dom"

interface SubMenuItem {
    icon: string;
    url: string;
    label: string;
}

interface MenuItemProps {
    children: ReactNode;
    icon: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    url: string;
    subItems?: SubMenuItem[];
}

const MenuItem = ({ url, children, icon, className = "", onClick, subItems }: MenuItemProps) => {
    return (
        <div className="menu-item-wrapper">
            <Link to={url} className={`menu-item ${className}`} onClick={onClick}>
                <span className="menu-icon">{icon}</span>
                {children}
                {subItems && subItems.length > 0 && (
                    <span className="dropdown-arrow">▼</span>
                )}
            </Link>

            {subItems && subItems.length > 0 && (
                <div className="sidebar-dropdown-menu">
                    {subItems.map((subItem, index) => (
                        <Link
                            key={index}
                            to={subItem.url}
                            className="dropdown-item"
                        >
                            <span className="dropdown-icon">{subItem.icon}</span>
                            {subItem.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MenuItem