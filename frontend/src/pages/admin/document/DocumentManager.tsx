import { useEffect, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader"
import "./Document.css";
import SubjectCard from "./SubjectCard";
import { getSubjetsByTeacher } from "../../../services/docmentSubjectService";
import Loadding from "../../../components/ui/Loadding";

const DocumentManager = () => {
    const [listSubject, setListSubject] = useState<any[]>([]);
    const [loadingGetData, setLoadingGetData] = useState(false);
    const getListSubjects = async () => {
        try {
            setLoadingGetData(true);
            const res = await getSubjetsByTeacher();
            setListSubject(res.data.data);

        } catch (errors) {
            console.log(errors);
        } finally {
            setLoadingGetData(false);
        }
    }
    useEffect(() => {

        getListSubjects();
    }, []);

    return (
        <>
            {loadingGetData && <Loadding />}
            <PageHeader title="📁 Quản lý tài liệu"
                subtitle="Hệ thống quản lý tài liệu của từng môn học" />

            <div className="subject">
                <h2>Danh Sách Môn Học</h2>

                <div className="grid">
                    {listSubject.length !== 0 ? listSubject.map((item, index) => (
                        <SubjectCard key={index} {...item} />
                    )): <p>Bạn chưa được bổ nhiệm giảng dạy môn học nào cả</p>}
                </div>
            </div>
        </>
    )
}

export default DocumentManager