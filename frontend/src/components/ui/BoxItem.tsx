import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface BoxItem {
    children: ReactNode;
    href: string;
}

const BoxItem = ({ children, href }: BoxItem) => {
    return (
        <>
            <div className="card">
                <Link to={href}><h4>{children}</h4></Link>
            </div>
        </>
    )
}

export default BoxItem