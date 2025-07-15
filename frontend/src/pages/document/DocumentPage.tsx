import { Link, Navigate, useParams } from 'react-router-dom';
import './DocumentPage.css';
import { useEffect, useState } from 'react';
import type { DocumentSubject } from '../../types/documentSubject';
import { getDetailDocumentBySubjectId } from '../../services/docmentSubjectService';


const DocumentPage = () => {
    const { id }: any = useParams()
    const [detailDocumentSubject, setDetailDocumentSubject] = useState<DocumentSubject>();
    const [notfound, setNotfound] = useState(false);


    const fetchDetailDocumentSubject = async (id: number) => {
        try {
            const res = await getDetailDocumentBySubjectId(id);
            setDetailDocumentSubject(res.data);
        } catch (error) {
            setNotfound(true);
        }
    }
    useEffect(() => {
        fetchDetailDocumentSubject(id);
    }, []);

    if (notfound) {
        return <Navigate to="/404" />
    }

    return (
        <>
            <div className="document-subject container">
                <h1>Tài liệu {detailDocumentSubject?.subject_name}</h1>

                {detailDocumentSubject && detailDocumentSubject?.chapters?.length > 0 ? (detailDocumentSubject?.chapters.map((chapter , index) => (

                    <>
                        <h2>Chương {index + 1}: {chapter.title}</h2>

                        {chapter.lectures.map((lecture , index) => (
                            <div className="lecture">
                                <Link to={lecture.file_path} className="lecture-title" target="_blank"> Bài {index + 1} : {lecture.title}</Link>
                            </div>
                        ))}
                    </>

                ))) : <div> Chưa có bài giảng hoặc tài liệu được cập nhật cho môn học này.</div>}
            </div>
        </>
    )
}

export default DocumentPage