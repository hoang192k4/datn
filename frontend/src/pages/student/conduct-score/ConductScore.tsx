import { useEffect, useState } from "react"
import { getConductScoresMyStudent } from "../../../services/studentService"
import { HttpStatus } from "../../../enums/HttpStatus";
import ProfileStudent from "../../../components/ui/ProfileStudent";
import type { ConductScoreStudent } from "../../../types/conductScore";
import { Loading } from "../../../components/ui/Loading";
import './ConductScore.css';
import { getMonthYear } from "../../../utils/utils";

const ConductScore = () => {
    const [loadingConductScore, setLoadingConductScore] = useState(false);
    const [conductScoreMyStudent, setConductScoreMyStudent] = useState<ConductScoreStudent[]>([]);
    const fetchConductScoreMyStudent = async () => {
        try {
            setLoadingConductScore(true);
            const res = await getConductScoresMyStudent();
            if (res.status === HttpStatus.SUCCESS)
                if (res.status === HttpStatus.SUCCESS)
                    setConductScoreMyStudent(res.data);
        } catch ($error) {

        } finally { setLoadingConductScore(false); }
    }
    useEffect(() => {
        fetchConductScoreMyStudent();
    }, [])
    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>KẾT QUẢ RÈN LUYỆN</h2>
            <ProfileStudent />
            <div className="discipline-table-wrapper">
                {loadingConductScore ? <Loading /> :
                    conductScoreMyStudent.length > 0 ?
                        <table className="discipline-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tháng</th>
                                    <th>Điểm rèn luyện</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conductScoreMyStudent.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{getMonthYear(item.date)}</td>
                                        <td>{item.conduct_score}</td>
                                        <td>{item.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <div style={{ textAlign: 'center', color: '#888', marginTop: '1.5rem' }}>
                            <strong>Điểm rèn luyện chưa được cập nhật.</strong>
                        </div>
                }
            </div>

        </>
    )
}

export default ConductScore