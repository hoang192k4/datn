import './HomePage.css';
import TearcherItem from '../../components/ui/TeacherItem';
import { useCallback, useEffect, useState } from 'react';
import type { TeacherList } from '../../types/teacher';
import { getAllTeachers } from '../../services/teacherService';
import { Loading } from '../../components/ui/Loading';
import { TeacherRole } from '../../enums/TeacherRole';


const HomePage = () => {
    const [teachers, setTeachers] = useState<TeacherList[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchTeachers = useCallback(async (page: number | null) => {
        try {
            setLoading(true);
            const response = await getAllTeachers(12, null, page);
            const data = response.data;
            const newTeachers: TeacherList[] = data.teachers;

            setTeachers(prev => [...prev, ...newTeachers]);

            if (data.meta.current_page >= data.meta.total_pages) {
                setHasMore(false);
            }

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers(page);
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            const isBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
            if (isBottom && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    const filterTeachers = teachers.filter((teacher) => { return teacher.role !== TeacherRole.FacultyAdmin || teacher.role !== TeacherRole.FacultyAdmin });
   
    return (
        <>
            <section className="hero">
                <h2>Chào Mừng Đến Với Khoa Công Nghệ Thông Tin</h2>
                <p>Để tra cứu thông tin học tập như điểm số, thời khóa biểu, thông báo và tài liệu học tập, sinh viên vui lòng truy cập vào trang thông tin của giảng viên bên dưới.</p>
            </section>

            <section className="teacher-list container">
                <h3>Danh Sách Giảng Viên</h3>
                <div className="card-grid">
                    {filterTeachers.map((teacher) => (
                        <TearcherItem key={teacher.id} href={teacher.slug} 
                        teacher_email={teacher.email}
                        subjects={teacher.subjects} teacher_name={teacher.name}/>
                    ))}
                </div>
            </section>
            {loading ? <Loading /> : <> </>}
        </>
    )
}

export default HomePage