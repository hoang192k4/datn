import React from "react";
import { StudentStatus } from '../../../enums/StudentStatus';

type Props = {
    status: StudentStatus;
};

const StudentStatusBadge: React.FC<Props> = ({ status }) => {
    const getLabel = () => {
        switch (status) {
            case StudentStatus.Active:
                return "Đang học";
            case StudentStatus.Graduated:
                return "Đã tốt nghiệp";
            case StudentStatus.Suspended:
                return "Đình chỉ";
            case StudentStatus.Dropped_Out:
                return "Thôi học";
            case StudentStatus.Pending:
                return "Chờ xét duyệt";
            case StudentStatus.Deferment:
                return "Bảo lưu";
            default:
                return "Không rõ";
        }
    };

    return <span className={`student-badge badge-${status}`}>{getLabel()}</span>;
};

export default StudentStatusBadge;
