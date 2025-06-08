import type { ReactNode } from "react"
import { Link } from "react-router-dom"

interface MenuItemProps {
    children: ReactNode;
    icon: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    url: string;
}

const MenuItem = ({url, children, icon, className = "" , onClick}: MenuItemProps) => {
    return (
        <>
            <Link to={url} className={`menu-item ${className}`} onClick={onClick}>
                <span className="menu-icon">{icon}</span>
                {children}
            </Link>
        </>
    )
}

export default MenuItem