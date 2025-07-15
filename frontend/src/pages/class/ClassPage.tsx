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
    const [activeTab, setActiveTab] = useState<'score' | 'attendance'>('score');

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
            {loading ? <Loading /> :

                <div className="sa-form-container container">
                    <h1 className="sa-title">Lớp {courseSection?.name}</h1>
                    <div className="sa-tabs">
                        <button
                            className={`sa-tab ${activeTab === 'score' ? 'active' : ''}`}
                            onClick={() => setActiveTab('score')}>
                            Bảng điểm
                        </button>
                        <button
                            className={`sa-tab ${activeTab === 'attendance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('attendance')}>
                            Điểm danh
                        </button>
                    </div>

                    <div className="sa-content">
                        <h2>
                            {activeTab === 'score' ? 'Danh sách bảng điểm' : 'Danh sách điểm danh'}
                        </h2>
                        {activeTab === 'score' ? <GradePage students={studentGrades} /> :
                            <AttendancePage id={id} />}
                    </div>
                </div>
            }

        </>
    )
}

export default ClassPage

