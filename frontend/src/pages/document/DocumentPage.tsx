import { Link, useParams } from 'react-router-dom';
import './DocumentPage.css';
import { useEffect, useState } from 'react';
import type { DocumentSubject } from '../../types/documentSubject';
import { getDetailDocumentBySubjectId } from '../../services/docmentSubjectService';


const DocumentPage = () => {
    const { id }: any = useParams()
    const [detailDocumentSubject, setDetailDocumentSubject] = useState<DocumentSubject>();


    const fetchDetailDocumentSubject = async (id: number) => {
        try {
            const res = await getDetailDocumentBySubjectId(id);
            setDetailDocumentSubject(res.data);
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchDetailDocumentSubject(id);
    }, []);

    return (
        <>
            <div className="document-subject container">
                <h1>Tài liệu {detailDocumentSubject?.subject_name}</h1>
                {detailDocumentSubject?.chapters.map((chapter) => (
                    <>
                        <h2>Chương {chapter.position}: {chapter.title}</h2>

                        {chapter.lectures.map((lecture) => (
                            <div className="lecture">
                                <Link to={lecture.file_path} className="lecture-title" target="_blank"> Bài {lecture.position} : {lecture.title}</Link>
                            </div>
                        ))}
                    </>

                ))}
            </div>
        </>
    )
}

export default DocumentPage