import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface TearcherItemProps {
  children: ReactNode;
  slug: string;
}

const TearcherItem = ({children, slug}: TearcherItemProps) => {
    return (
        <>
            <div className="card">
                <Link to={slug}><h4>{children}</h4></Link>
            </div>
        </>
    )
}

export default TearcherItem