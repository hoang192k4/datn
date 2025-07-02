import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getScheduleByTeacher } from '../../../services/scheduleService';
import { HttpStatus } from '../../../enums/HttpStatus';
import './TeacherSchedule.css'

interface Session {
    course_section_name: string;
    classroom_name: string;
    start_time: string;
    end_time: string;
}

interface ScheduleItem {
    day_name: string;
    date: string;
    morning: Session[];
    afternoon: Session[];
}

interface Week {
    start: string;
    end: string;
    next_week: string;
    prev_week: string;
}

interface WeekSchedule {
    week: Week;
    schedule: ScheduleItem[];
}

const TeacherSchedule: React.FC = () => {
    const [schedule, setSchedule] = useState<WeekSchedule>();
    const [filterDate, setFilterDate] = useState<string | null>(null);

    const fetchSchedule = async () => {
        try {
            const res = await getScheduleByTeacher(filterDate);
            if (res.status === HttpStatus.SUCCESS) {
              setSchedule(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch schedule', error);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [filterDate]);

    const getColor = (index: number) => {
        const colors = [
            '#3F51B5, #5C6BC0',
            '#2196F3, #42A5F5',
            '#00BCD4, #26C6DA',
            '#4CAF50, #66BB6A',
            '#9C27B0, #AB47BC',
            '#673AB7, #7986CB',
            '#3F51B5, #5C6BC0',
        ];
        return colors[index % colors.length];
    };

    const handleWeekChange = (type: 'prev' | 'next') => {
        if (schedule) {
            const newDate = type === 'prev' ? schedule.week.prev_week : schedule.week.next_week;
            setFilterDate(newDate);
        }
    };

    return (
        <>

            <div className="schedule-container">
                <div className="schedule-header">
                    <div className="header-content">
                        <h1 className="header-title">THỜI KHÓA BIỂU GIẢNG VIÊN</h1>
                        <div className="navigation-controls">
                            <button onClick={() => handleWeekChange('prev')} className="nav-button">
                                <ChevronLeft color="white" size={20} />
                            </button>
                            <span className="week-range">
                                {schedule ? `${schedule.week.start} → ${schedule.week.end}` : 'Đang tải...'}
                            </span>
                            <button onClick={() => handleWeekChange('next')} className="nav-button">
                                <ChevronRight color="white" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="schedule-table-container">
                    <table className="schedule-table">
                        <thead className="table-header">
                            <tr>
                                <th className="session-header">
                                    Buổi
                                </th>
                                {schedule?.schedule.map((day, _index) => (
                                    <th key={day.date} className="day-header">
                                        <div>{day.day_name}</div>
                                        <div className="day-date">{day.date}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(["morning", "afternoon"] as Array<keyof Pick<ScheduleItem, "morning" | "afternoon">>).map((sessionType) => (
                                <tr key={sessionType}>
                                    <td className="session-type-cell">
                                        {sessionType === 'morning' ? 'Buổi sáng' : 'Buổi chiều'}
                                    </td>
                                    {schedule?.schedule.map((day, dayIndex) => (
                                        <td key={day.date + sessionType} className="schedule-cell">
                                            {day[sessionType] && day[sessionType].length > 0 ? (
                                                day[sessionType].map((lesson, lessonIndex) => (
                                                    <div
                                                        key={lessonIndex}
                                                        className="lesson-card"
                                                        style={{ background: `linear-gradient(135deg, ${getColor(dayIndex)})` }}
                                                    >
                                                        <div className="lesson-title">{lesson.course_section_name}</div>
                                                        <div className="lesson-location">📍 {lesson.classroom_name}</div>
                                                        <div className="lesson-time">🕓 {lesson.start_time} - {lesson.end_time}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="empty-cell">—</div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TeacherSchedule;