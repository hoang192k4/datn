import React, { useMemo } from 'react';
import type { StudentGrade } from '../../types/student';
import './GradePage.css'


interface Props {
    students: StudentGrade[];
}

const GradePage: React.FC<Props> = ({ students }) => {

    const gradeColumns = useMemo(() => {
        const columns: string[] = [];

        students.forEach((student) => {
            student.grades.forEach((gradeGroup) => {
                gradeGroup.forEach((grade) => {
                    const key = `${grade.grade_type.name} - Lần ${grade.attempt}`;
                    if (!columns.includes(key)) {
                        columns.push(key);
                    }
                });
            });
        });

        return columns.sort(); // để có thứ tự nhất quán
    }, [students]);

    return (
        <div className="grade-page container">
            <h1>Danh Sách Điểm Chi Tiết</h1>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Mã số sinh viên</th>
                            <th>Họ và tên</th>
                            <th>Chuyên cần</th>
                            {gradeColumns.map((col, idx) => (
                                <th key={idx}>{col}</th>
                            ))}

                            <th>Giữa kỳ</th>
                            <th>Cuối kỳ</th>
                            <th>TB</th>
                            <th>Tổng kết</th>
                            <th>Xếp loại</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => {
                            // Biến để dễ lấy điểm theo tổ hợp
                            const scoreMap: Record<string, string> = {};
                            student.grades.forEach((gradeGroup) => {
                                gradeGroup.forEach((grade) => {
                                    if (grade.score_visibility === 'private') return;
                                    const key = `${grade.grade_type.name} - Lần ${grade.attempt}`;
                                    scoreMap[key] = grade.score;
                                });
                            });

                            const summary = student.summary_grade;

                            return (
                                <tr key={idx}>
                                    <td>{student.student_code}</td>
                                    <td>{student.name}</td>
                                    <td>{summary.attendance_score ?? '-'}</td>
                                    {gradeColumns.map((col) => (
                                        <td key={col}>{scoreMap[col] ?? '-'}</td>
                                    ))}

                                    <td>{summary.exam1_score ?? '-'}</td>
                                    <td>{summary.exam2_score ?? '-'}</td>
                                    <td>{summary.avg_score ?? '-'}</td>
                                    <td>{summary.final_score ?? '-'}</td>
                                    <td>{getEvaluationLabel(summary.evaluation)}</td>
                                    <td>{summary.note}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

function getEvaluationLabel(evaluation: string): string {
    switch (evaluation) {
        case 'excellent':
            return 'Xuất sắc';
        case 'good':
            return 'Giỏi';
        case 'fair':
            return 'Khá';
        case 'average':
            return 'Trung bình';
        case 'poor':
            return 'Yếu';
        case 'fail':
            return 'Kém';
        default:
            return evaluation;
    }
}

export default GradePage;
