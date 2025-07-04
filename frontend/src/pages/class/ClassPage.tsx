import { useEffect, useState } from 'react';
import AttendancePage from '../attendance/AttendancePage';
import GradePage from '../grade/GradePage';
import './ClassPage.css';
import { Navigate, useParams } from 'react-router-dom';
import { getStudentByCourseSectionId } from '../../services/gradeStudentService';
import type { StudentGrade } from '../../types/student';
import { Loading } from '../../components/ui/Loading';
import type { CourseSection } from '../../types/courseSecion';
import { getCourseSectionDetail } from '../../services/courseSectionService';



const ClassPage = () => {
    const { id }: any = useParams();
    const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [courseSection, setCourseSection] = useState<CourseSection>();

    const fetchStudentGrades = async (id: number) => {
        try {
            setLoading(true);
            const res = await getStudentByCourseSectionId(id);
            setStudentGrades(res.data.data);

        } catch (error) {
            setError(true);
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchStudentGrades(id);

        const fetchCourseSectionDetail = async (id: number) => {
            try {
                const res = await getCourseSectionDetail(id);
                setCourseSection(res.data);
            } catch (error) {
                setError(true);
            }
        }

        fetchCourseSectionDetail(id);
    }, [])


    if (error) {
        return <Navigate to="/404" />
    }
    return (
        <>
            {loading ? <Loading /> : (<>
                <GradePage students={studentGrades} courseSection={courseSection ??  null} />
                <AttendancePage id={id} courseSecion={courseSection ?? null} /> </>)}

        </>
    )
}

export default ClassPage

