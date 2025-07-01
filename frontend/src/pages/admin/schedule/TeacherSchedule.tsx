import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleItem {
    subject: string;
    time: string;
    room?: string;
}

interface WeekSchedule {
    [key: string]: ScheduleItem[];
}

const TeacherSchedule: React.FC = () => {
    const [currentWeek, setCurrentWeek] = useState(0);
    const [teacherName, setTeacherName] = useState('');

    // Dữ liệu mẫu cho nhiều tuần
    const weeklySchedules: WeekSchedule[] = [
        {
            'Thứ 2': [
                { subject: 'Toán Cao Cấp', time: '7:30-9:30', room: 'A101' },
                { subject: 'Lý Thuyết Xác Suất', time: '13:30-15:30', room: 'B203' }
            ],
            'Thứ 3': [
                { subject: 'Giải Tích', time: '9:30-11:30', room: 'A102' }
            ],
            'Thứ 4': [
                { subject: 'Đại Số Tuyến Tính', time: '7:30-9:30', room: 'C301' },
                { subject: 'Thống Kê', time: '15:30-17:30', room: 'B105' }
            ],
            'Thứ 5': [
                { subject: 'Toán Rời Rạc', time: '13:30-15:30', room: 'A203' }
            ],
            'Thứ 6': [
                { subject: 'Phương Pháp Tính', time: '9:30-11:30', room: 'D401' }
            ],
            'Thứ 7': []
        },
        {
            'Thứ 2': [
                { subject: 'Cấu Trúc Dữ Liệu', time: '7:30-9:30', room: 'Lab1' },
                { subject: 'Thuật Toán', time: '15:30-17:30', room: 'Lab2' }
            ],
            'Thứ 3': [
                { subject: 'Lập Trình Java', time: '9:30-11:30', room: 'Lab3' },
                { subject: 'Cơ Sở Dữ Liệu', time: '13:30-15:30', room: 'A301' }
            ],
            'Thứ 4': [
                { subject: 'Mạng Máy Tính', time: '7:30-9:30', room: 'B201' }
            ],
            'Thứ 5': [
                { subject: 'Hệ Điều Hành', time: '9:30-11:30', room: 'Lab4' },
                { subject: 'An Toàn Thông Tin', time: '15:30-17:30', room: 'C205' }
            ],
            'Thứ 6': [
                { subject: 'Trí Tuệ Nhân Tạo', time: '13:30-15:30', room: 'D301' }
            ],
            'Thứ 7': []
        },
        {
            'Thứ 2': [
                { subject: 'Kinh Tế Vi Mô', time: '7:30-9:30', room: 'E101' }
            ],
            'Thứ 3': [
                { subject: 'Kinh Tế Vĩ Mô', time: '9:30-11:30', room: 'E102' },
                { subject: 'Tài Chính Doanh Nghiệp', time: '15:30-17:30', room: 'E201' }
            ],
            'Thứ 4': [
                { subject: 'Marketing', time: '13:30-15:30', room: 'E203' }
            ],
            'Thứ 5': [
                { subject: 'Quản Trị Nguồn Nhân Lực', time: '7:30-9:30', room: 'F101' }
            ],
            'Thứ 6': [
                { subject: 'Kế Toán Tài Chính', time: '9:30-11:30', room: 'F102' },
                { subject: 'Phân Tích Đầu Tư', time: '13:30-15:30', room: 'F201' }
            ],
            'Thứ 7': []
        }
    ];

    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const timeSlots = [
        '7:30-9:30',
        '9:30-11:30',
        '13:30-15:30',
        '15:30-17:30'
    ];

    const getCurrentWeekDates = () => {
        const today = new Date();
        const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
        const weekStart = new Date(currentWeekStart);
        weekStart.setDate(weekStart.getDate() + (currentWeek * 7));

        const dates = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            dates.push(date.getDate() + '/' + (date.getMonth() + 1));
        }
        return dates;
    };

    const nextWeek = () => {
        if (currentWeek < weeklySchedules.length - 1) {
            setCurrentWeek(currentWeek + 1);
        }
    };

    const prevWeek = () => {
        if (currentWeek > 0) {
            setCurrentWeek(currentWeek - 1);
        }
    };

    const findScheduleItem = (day: string, timeSlot: string): ScheduleItem | null => {
        const daySchedule = weeklySchedules[currentWeek][day] || [];
        return daySchedule.find(item => item.time === timeSlot) || null;
    };

    const weekDates = getCurrentWeekDates();

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #ff9a56, #ff6b35)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                }}>
                    <h1 style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        THỜI KHÓA BIỂU GIẢNG VIÊN
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <button
                            onClick={prevWeek}
                            disabled={currentWeek === 0}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: currentWeek === 0 ? 'not-allowed' : 'pointer',
                                opacity: currentWeek === 0 ? 0.5 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ChevronLeft color="white" size={20} />
                        </button>

                        <span style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '500',
                            minWidth: '100px',
                            textAlign: 'center'
                        }}>
                            Tuần {currentWeek + 1}
                        </span>

                        <button
                            onClick={nextWeek}
                            disabled={currentWeek === weeklySchedules.length - 1}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: currentWeek === weeklySchedules.length - 1 ? 'not-allowed' : 'pointer',
                                opacity: currentWeek === weeklySchedules.length - 1 ? 0.5 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ChevronRight color="white" size={20} />
                        </button>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <label style={{ color: 'white', fontSize: '14px' }}>Họ và tên:</label>
                    <input
                        type="text"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Nhập tên giảng viên..."
                        style={{
                            border: 'none',
                            borderRadius: '20px',
                            padding: '8px 15px',
                            fontSize: '14px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            outline: 'none',
                            minWidth: '250px'
                        }}
                    />
                </div>
            </div>

            {/* Schedule Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{
                                padding: '15px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                borderRight: '1px solid #dee2e6',
                                borderBottom: '2px solid #dee2e6',
                                backgroundColor: '#fff3e0'
                            }}>
                                Tiết
                            </th>
                            {days.map((day, index) => (
                                <th key={day} style={{
                                    padding: '15px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    borderRight: index < days.length - 1 ? '1px solid #dee2e6' : 'none',
                                    borderBottom: '2px solid #dee2e6',
                                    backgroundColor: index === 0 ? '#e3f2fd' :
                                        index === 1 ? '#e8f5e8' :
                                            index === 2 ? '#fff3e0' :
                                                index === 3 ? '#fce4ec' :
                                                    index === 4 ? '#f3e5f5' : '#ffebee'
                                }}>
                                    <div>{day}</div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        fontWeight: 'normal',
                                        marginTop: '5px'
                                    }}>
                                        {weekDates[index]}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((timeSlot, timeIndex) => (
                            <tr key={timeSlot}>
                                <td style={{
                                    padding: '20px 15px',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    borderRight: '1px solid #dee2e6',
                                    borderBottom: '1px solid #dee2e6',
                                    backgroundColor: '#fff3e0',
                                    verticalAlign: 'middle'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#333' }}>
                                        Tiết {timeIndex * 2 + 1}-{timeIndex * 2 + 2}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                        {timeSlot}
                                    </div>
                                </td>
                                {days.map((day, dayIndex) => {
                                    const scheduleItem = findScheduleItem(day, timeSlot);
                                    return (
                                        <td key={day} style={{
                                            padding: '15px',
                                            borderRight: dayIndex < days.length - 1 ? '1px solid #dee2e6' : 'none',
                                            borderBottom: '1px solid #dee2e6',
                                            height: '80px',
                                            verticalAlign: 'top',
                                            position: 'relative'
                                        }}>
                                            {scheduleItem && (
                                                <div style={{
                                                    background: dayIndex === 0 ? 'linear-gradient(135deg, #2196F3, #21CBF3)' :
                                                        dayIndex === 1 ? 'linear-gradient(135deg, #4CAF50, #81C784)' :
                                                            dayIndex === 2 ? 'linear-gradient(135deg, #FF9800, #FFB74D)' :
                                                                dayIndex === 3 ? 'linear-gradient(135deg, #E91E63, #F06292)' :
                                                                    dayIndex === 4 ? 'linear-gradient(135deg, #9C27B0, #BA68C8)' :
                                                                        'linear-gradient(135deg, #F44336, #EF5350)',
                                                    color: 'white',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                    lineHeight: '1.3',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    transform: 'scale(1)',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
                                                        {scheduleItem.subject}
                                                    </div>
                                                    {scheduleItem.room && (
                                                        <div style={{ fontSize: '11px', opacity: 0.9 }}>
                                                            📍 {scheduleItem.room}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                marginTop: '20px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    Sử dụng nút ← → để chuyển đổi giữa các tuần học
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    Hiện tại: Tuần {currentWeek + 1} / {weeklySchedules.length}
                </div>
            </div>
        </div>
    );
};

export default TeacherSchedule;