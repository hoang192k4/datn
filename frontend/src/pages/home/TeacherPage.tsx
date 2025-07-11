import { useParams } from "react-router-dom";
import BoxItem from "../../components/ui/BoxItem";
import NotificationItem from "../../components/ui/NotificationItem"
import './TeacherPage.css';
import { useEffect, useState } from "react";
import type { Post } from "../../types/post";
import { getPostsByTeacherSlug } from "../../services/postService";
import type { Paginate } from "../../types/paginate";
import { getSubjectsByTeacherSlug } from "../../services/docmentSubjectService";
import type { CourseSection } from "../../types/courseSecion";
import { getCourseSectionByTeacherSlug } from "../../services/courseSectionService";
import NotFoundPage from "../notfound/NotFoundPage";
import { Loading } from "../../components/ui/Loading";
import {  useSelector } from 'react-redux';

interface Subject {
    id: number,
    name: string,
}

const TeacherPage = () => {
    const { slug }: any = useParams();

    const [posts, setPosts] = useState<Post[]>([]);
    const [postPage, setPostPage] = useState<number>(1);
    const [postPaginate, setPostPaginate] = useState<Paginate>();
    const [subjects, setSubjects] = useState<Subject[]>();
    const [subjectPaginate, setSubjectPaginate] = useState<Paginate>();
    const [subjectPage, setSubjectPage] = useState(1);
    const [courseSections, setCourseSections] = useState<CourseSection[]>([]);
    const [courseSectionPaginate, setCourseSectionPaginate] = useState<Paginate>();
    const [courseSectionPage, setCourseSectionPage] = useState<number>(1);
    const [notfound, setNotfound] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = useSelector((state: any) => state.auth?.user ?? null);

    const fetchPosts = async (slug: string, page: number) => {
        try {
            const response = await getPostsByTeacherSlug(slug, page);
            const data = response.data;

            setPosts(data.posts);
            setPostPaginate(data.meta);
        } catch (error) {
            setNotfound(true);
        } finally {
            setLoading(false);
        }
    }

    const fetchSubjects = async (slug: string, page: number) => {
        try {
            const res = await getSubjectsByTeacherSlug(slug, null, page);
            const data = res.data;
            setSubjects(data.subjects);
            setSubjectPaginate(data.meta);
        } catch (error) {
            setNotfound(true);
        }
    }

    const fetchCourseSections = async (slug: string, page: number) => {
        try {
            const res = await getCourseSectionByTeacherSlug(slug, page);
            const data = res.data;
            setCourseSections(data.course_sections);
            setCourseSectionPaginate(data.meta);
        } catch (error) {
            setNotfound(true);
        }
    }

    useEffect(() => {
        fetchPosts(slug, postPage);
    }, [postPage]);

    useEffect(() => {
        fetchSubjects(slug, subjectPage);
    }, [subjectPage]);


    useEffect(() => {
        fetchCourseSections(slug, courseSectionPage)
    }, [courseSectionPage]);

    return (
        <>
            {
                loading ? <Loading /> : (notfound ? <NotFoundPage /> : (
                    <main className="container teacher-page">
                        <section className="notification">
                            <h2>Thông Báo Gần Đây</h2>
                            <div className="notification-list">
                                {posts && posts?.length > 0 ? posts.map((item, index) => (
                                    <NotificationItem
                                        key={index}
                                        post={item}
                                    />
                                )) : <p>Không có bất kì thông báo nào gần đây</p>}
                            </div>

                            {posts?.length === 0 ? <> </> : (
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
                            )}

                        </section>

                        {user ? (
                            <div className="class-list">
                                <h2>Danh Sách Lớp Học</h2>
                                <div className="card-grid">
                                    {courseSections.length > 0 ? courseSections?.map((courseSection) => (
                                        <BoxItem href={'lop-hoc/' + courseSection.id}> {courseSection.name}</BoxItem>
                                    )) : <p> Không có danh sách lớp học nào</p>}

                                </div>


                                {courseSections.length !== 0 ? (
                                    <div className="post-pagination">
                                        <button
                                            disabled={courseSectionPaginate?.current_page === 1}
                                            onClick={() => setCourseSectionPage(courseSectionPaginate?.previous_page ?? 1)}
                                        >
                                            Trước
                                        </button>
                                        <span className="page-info">Trang {courseSectionPaginate?.current_page} / {courseSectionPaginate?.total_pages}</span>
                                        <button
                                            disabled={courseSectionPaginate?.current_page === courseSectionPaginate?.total_pages}
                                            onClick={() => setCourseSectionPage(courseSectionPaginate?.next_page ?? 1)}
                                        >
                                            Sau
                                        </button>
                                    </div>
                                ) : <></>}

                            </div>
                        ) : <> </>}

                        <div className="document-subject-list">
                            <h2>Tài Liệu Môn Học</h2>
                            <div className="card-grid">
                                {subjects && subjects?.length > 0 ? subjects?.map((subject) => (
                                    <BoxItem href={'tai-lieu/' + String(subject.id)}>{subject.name}</BoxItem>
                                )) : <p> Chưa có tài liệu môn học nào</p>}
                            </div>

                            {subjects && subjects?.length > 0 ? (<div className="post-pagination">
                                <button
                                    disabled={subjectPaginate?.current_page === 1}
                                    onClick={() => setSubjectPage(subjectPaginate?.previous_page ?? 1)}
                                >
                                    Trước
                                </button>
                                <span className="page-info">Trang {subjectPaginate?.current_page} / {subjectPaginate?.total_pages}</span>
                                <button
                                    disabled={subjectPaginate?.current_page === subjectPaginate?.total_pages}
                                    onClick={() => setSubjectPage(subjectPaginate?.next_page ?? 1)}
                                >
                                    Sau
                                </button>
                            </div>) : <></>}

                        </div>
                    </main>
                ))

            }
        </>
    )
}

export default TeacherPage
