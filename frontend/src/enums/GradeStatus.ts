export enum GradeStatus {
    DraftExam = 'draft_exam',
    SubmittedExam = 'submitted_exam',
    SubmittedExam1 = 'submitted_exam1',
    SubmittedExam2 = 'submitted_exam2',
}

export function getGradingStatusLabel(status: GradeStatus|string): string {
    switch (status) {
        case GradeStatus.DraftExam:
            return 'Đang nhập điểm kiểm tra';
        case GradeStatus.SubmittedExam:
            return 'điểm kiểm tra';
        case GradeStatus.SubmittedExam1:
            return 'điểm thi lần 1';
        case GradeStatus.SubmittedExam2:
            return 'điểm thi lần 2';
        default:
            return 'Không xác định';
    }
}
