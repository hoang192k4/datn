import { useParams } from "react-router-dom";
import BoxItem from "../../components/ui/BoxItem";
import NotificationItem from "../../components/ui/NotificationItem"
import './TeacherPage.css';
import { useEffect, useState } from "react";
import type { Post } from "../../types/post";
import { getPostsByTeacherSlug } from "../../services/postService";
import type { Paginate } from "../../types/paginate";
import { getSubjectsByTeacherSlug } from "../../services/docmentSubjectService";

interface Subject {
    id: number,
    name: string,
}

const TeacherPage = () => {
    const { slug }: any = useParams();

    const [posts, setPosts] = useState<Post[]>();
    const [postPage, setPostPage] = useState<number>(1);
    const [postPaginate, setPostPaginate] = useState<Paginate>();
    const [subjects, setSubjects] = useState<Subject[]>();
    const [subjectPaginate, setSubjectPaginate] = useState<Paginate>();
    const [subjectPage, setSubjectPage] = useState(1);

    const fetchPosts = async (slug: string, page: number) => {
        try {
            const response = await getPostsByTeacherSlug(slug, page);
            const data = response.data;

            setPosts(data.posts);
            setPostPaginate(data.meta);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSubjects = async (slug: string, page: number) => {
        try {
            const res = await getSubjectsByTeacherSlug(slug, null, page);
            const data = res.data;
            setSubjects(data.subjects);
            setSubjectPaginate(data.meta);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPosts(slug, postPage);
    }, [postPage]);

    useEffect(() => {
        fetchSubjects(slug, subjectPage);
    }, [subjectPage]);

    return (
        <>
            <main className="container teacher-page">
                <section className="notification">
                    <h2>Thông Báo Gần Đây</h2>
                    <div className="notification-list">
                        {posts ? posts.map((item, index) => (
                            <NotificationItem
                                key={index}
                                post={item}
                            />
                        )) : <p>Không có bất kì thông báo nào gần đây</p>}
                    </div>

                    <div className="post-pagination">
                        <button
                            disabled={postPaginate?.current_page === 1}
                            onClick={() => setPostPage(postPaginate?.previous_page ?? 1)}
                        >
                            Trước
                        </button>
                        <span className="page-info">Trang {postPaginate?.current_page} / {postPaginate?.total_pages}</span>
                        <button
                            disabled={postPaginate?.current_page === postPaginate?.total_pages}
                            onClick={() => setPostPage(postPaginate?.next_page ?? 1)}
                        >
                            Sau
                        </button>
                    </div>
                </section>

                <div className="class-list">
                    <h2>Danh Sách Lớp Học</h2>
                    <div className="card-grid">
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH23A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22B</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22C</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                    </div>
                </div>
                <div className="document-subject-list">
                    <h2>Tài Liệu Môn Học</h2>
                    <div className="card-grid">
                        {subjects?.map((subject) => (
                            <BoxItem href={'tai-lieu/' + String(subject.id)}>{subject.name}</BoxItem>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}

export default TeacherPage