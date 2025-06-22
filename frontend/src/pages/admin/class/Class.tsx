import { useEffect, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader"
import './Class.css';
import ClassCard from "./ClassCard";
import Loadding from "../../../components/ui/Loadding";
import { getCourseSectionByTeacher } from "../../../services/courseSectionService";
import type { CourseSection } from "../../../types/courseSecion";


const Class = () => {
    const [loading, setLoading] = useState(false);
    const [listCourseSection, setListCourseSection] = useState<CourseSection[]>([]);

    const fetchCourseSection = async () => {
        try {
            setLoading(true);
            const res = await getCourseSectionByTeacher('');
            setListCourseSection(res.data.data.course_sections);
        } catch (errors) {
            console.log(errors);
        } finally { setLoading(false); }
    }
    useEffect(() => {
        fetchCourseSection();
    }, [])
    console.log(listCourseSection);
    return (
        <>
            {loading && <Loadding />}
            <PageHeader title="📚 Quản lý lớp học" subtitle="Hệ thống quản lý lớp học, danh sách sinh viên" />
            <div className="class-container">
                <h2>Danh Sách Lớp Học</h2>

                <div className="grid">
                    {listCourseSection && listCourseSection?.map(item => (
                        <ClassCard  course_section={item}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Class