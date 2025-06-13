import React, { useState, useEffect, useRef } from 'react';

const GradeManagement = () => {
  // State management
  const [currentClassId, setCurrentClassId] = useState(null);
  const [gradeTypeCounts, setGradeTypeCounts] = useState({});
  const [gradeTypeOrder, setGradeTypeOrder] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedGradeType, setSelectedGradeType] = useState('');
  const [classLoading, setClassLoading] = useState(false);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ show: false, message: '', isSuccess: true });
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const inputRef = useRef(null);

  const gradeTypes = [
    { id: 1, name: "Điểm hệ số 1" },
    { id: 2, name: "Điểm hệ số 2" },
    { id: 3, name: "Điểm thi" }
  ];

  // Initialize data
  useEffect(() => {
    loadClasses();
  }, []);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const showApiStatus = (message, isSuccess = true) => {
    setApiStatus({ show: true, message, isSuccess });
    setTimeout(() => {
      setApiStatus(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const loadClasses = () => {
    setClassLoading(true);

    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockClasses = [
        { id: 37, name: "Lập trình Java", code: "IT2021A", students: 35 },
        { id: 38, name: "Cấu trúc dữ liệu", code: "IT2021B", students: 32 },
        { id: 39, name: "Lập trình Web", code: "IT2022A", students: 28 },
        { id: 40, name: "Cơ sở dữ liệu", code: "IT2022B", students: 30 }
      ];

      setAllClasses(mockClasses);
      setClassLoading(false);
      showApiStatus('Tải danh sách lớp thành công!');
    }, 1000);
  };

  const handleClassSelection = (classId) => {
    if (classId) {
      setCurrentClassId(parseInt(classId));
      fetchGrades(parseInt(classId));
    }
  };

  const changeClass = (classId) => {
    if (classId && parseInt(classId) !== currentClassId) {
      const newClassId = parseInt(classId);
      setCurrentClassId(newClassId);
      fetchGrades(newClassId);
    }
  };

  const fetchGrades = (classId) => {
    if (!classId) return;

    setGradeLoading(true);

    // Mock grade data with notes and exam retakes
    setTimeout(() => {
      const mockStudentData = [
        {
          id: 1,
          name: "Nguyễn Văn An",
          grades: [
            [
              { id: 1, grade_type: { id: 1, name: "Điểm hệ số 1" }, attempt: 1, score: 8.5 },
              { id: 2, grade_type: { id: 1, name: "Điểm hệ số 1" }, attempt: 2, score: 9.0 }
            ],
            [
              { id: 3, grade_type: { id: 2, name: "Điểm hệ số 2" }, attempt: 1, score: 7.8 }
            ]
          ],
          summary_grade: {
            avg_score: 8.5,
            exam1_score: 7.8,
            exam2_score: null,
            exam1_retake: null,
            exam2_retake: null,
            final_score: 8.2,
            evaluation: "Giỏi"
          },
          notes: "Học tập tích cực"
        },
        {
          id: 2,
          name: "Trần Thị Bình",
          grades: [
            [
              { id: 4, grade_type: { id: 1, name: "Điểm hệ số 1" }, attempt: 1, score: 9.2 }
            ],
            [
              { id: 5, grade_type: { id: 2, name: "Điểm hệ số 2" }, attempt: 1, score: 8.9 }
            ]
          ],
          summary_grade: {
            avg_score: 9.2,
            exam1_score: 8.9,
            exam2_score: null,
            exam1_retake: null,
            exam2_retake: null,
            final_score: 9.1,
            evaluation: "Xuất sắc"
          },
          notes: ""
        },
        {
          id: 3,
          name: "Lê Văn Cường",
          grades: [
            [
              { id: 6, grade_type: { id: 1, name: "Điểm hệ số 1" }, attempt: 1, score: 7.5 }
            ]
          ],
          summary_grade: {
            avg_score: 7.5,
            exam1_score: 5.2,
            exam2_score: null,
            exam1_retake: 6.8,
            exam2_retake: null,
            final_score: 7.5,
            evaluation: "Khá"
          },
          notes: "Đã thi lại GK"
        }
      ];

      setStudentData(mockStudentData);
      prepareGradeTypeData(mockStudentData);
      setGradeLoading(false);
      showApiStatus('Tải dữ liệu điểm thành công!');
    }, 1000);
  };

  const prepareGradeTypeData = (data) => {
    const counts = {};
    const order = [];

    data.forEach(student => {
      student.grades?.forEach(gradeGroup => {
        gradeGroup.forEach(grade => {
          const typeId = grade.grade_type.id;
          if (!counts[typeId]) {
            counts[typeId] = 0;
            if (!order.includes(typeId)) {
              order.push(typeId);
            }
          }
          counts[typeId] = Math.max(counts[typeId], grade.attempt);
        });
      });
    });

    setGradeTypeCounts(counts);
    setGradeTypeOrder(order);
  };

  const addGradeColumn = () => {
    if (!selectedGradeType) {
      showApiStatus('Vui lòng chọn loại điểm!', false);
      return;
    }

    const typeId = parseInt(selectedGradeType);
    const currentCount = gradeTypeCounts[typeId] || 0;

    setGradeTypeCounts(prev => ({
      ...prev,
      [typeId]: currentCount + 1
    }));

    if (!gradeTypeOrder.includes(typeId)) {
      setGradeTypeOrder(prev => [...prev, typeId]);
    }

    showApiStatus('Thêm cột điểm thành công!');
  };

  const exportGrades = () => {
    showApiStatus('Xuất điểm thành công!');
  };

  const handleCellDoubleClick = (cellType, studentId, gradeTypeId = null, attempt = null) => {
    const cellKey = `${cellType}-${studentId}-${gradeTypeId || ''}-${attempt || ''}`;
    setEditingCell(cellKey);

    let currentValue = '';
    const student = studentData.find(s => s.id === studentId);

    if (cellType === 'grade' && gradeTypeId && attempt) {
      currentValue = getGradeValue(student, gradeTypeId, attempt);
    } else if (cellType === 'exam1') {
      currentValue = student.summary_grade?.exam1_score || '';
    } else if (cellType === 'exam2') {
      currentValue = student.summary_grade?.exam2_score || '';
    } else if (cellType === 'exam1_retake') {
      currentValue = student.summary_grade?.exam1_retake || '';
    } else if (cellType === 'exam2_retake') {
      currentValue = student.summary_grade?.exam2_retake || '';
    } else if (cellType === 'notes') {
      currentValue = student.notes || '';
    }

    setTempValue(currentValue.toString());
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleInputBlur = () => {
    saveEditedValue();
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEditedValue();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setTempValue('');
    }
  };

  const saveEditedValue = () => {
    if (!editingCell) return;

    const [cellType, studentId, gradeTypeId, attempt] = editingCell.split('-');
    const parsedStudentId = parseInt(studentId);

    if (cellType === 'grade') {
      const score = parseFloat(tempValue);
      if (!isNaN(score) && score >= 0 && score <= 10) {
        updateGrade(parsedStudentId, parseInt(gradeTypeId), parseInt(attempt), tempValue);
      }
    } else if (cellType === 'notes') {
      updateStudentNotes(parsedStudentId, tempValue);
    } else if (cellType.includes('exam')) {
      const score = parseFloat(tempValue);
      if (!isNaN(score) && score >= 0 && score <= 10) {
        updateExamScore(parsedStudentId, cellType, score);
      }
    }

    setEditingCell(null);
    setTempValue('');
  };

  const updateGrade = (studentId, gradeTypeId, attempt, value) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 10) return;

    setStudentData(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedGrades = student.grades ? [...student.grades] : [];

        // Find or create grade group for this type
        let gradeGroupIndex = updatedGrades.findIndex(group =>
          group.some(g => g.grade_type.id === gradeTypeId)
        );

        if (gradeGroupIndex === -1) {
          updatedGrades.push([]);
          gradeGroupIndex = updatedGrades.length - 1;
        }

        // Update or add the specific grade
        const gradeGroup = [...updatedGrades[gradeGroupIndex]];
        const gradeIndex = gradeGroup.findIndex(g =>
          g.grade_type.id === gradeTypeId && g.attempt === attempt
        );

        if (gradeIndex !== -1) {
          gradeGroup[gradeIndex] = { ...gradeGroup[gradeIndex], score };
        } else {
          gradeGroup.push({
            id: Date.now(),
            grade_type: gradeTypes.find(t => t.id === gradeTypeId),
            attempt,
            score
          });
        }

        updatedGrades[gradeGroupIndex] = gradeGroup;

        return { ...student, grades: updatedGrades };
      }
      return student;
    }));
  };

  const updateExamScore = (studentId, examType, score) => {
    setStudentData(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          summary_grade: {
            ...student.summary_grade,
            [examType]: score
          }
        };
      }
      return student;
    }));
  };

  const updateStudentNotes = (studentId, notes) => {
    setStudentData(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, notes };
      }
      return student;
    }));
  };

  const getGradeValue = (student, gradeTypeId, attempt) => {
    if (!student.grades) return '';

    for (const gradeGroup of student.grades) {
      const grade = gradeGroup.find(g =>
        g.grade_type.id === gradeTypeId && g.attempt === attempt
      );
      if (grade) return grade.score || '';
    }
    return '';
  };

  const getSelectedClassInfo = () => {
    return allClasses.find(c => c.id === currentClassId);
  };

  const renderTableHeaders = () => {
    const headers = ['STT', 'Họ tên'];

    gradeTypeOrder.forEach(typeId => {
      const gradeType = gradeTypes.find(t => t.id === typeId);
      const count = gradeTypeCounts[typeId] || 0;

      for (let i = 1; i <= count; i++) {
        headers.push(`${gradeType.name} ${i}`);
      }
    });

    headers.push('ĐTB', 'Thi GK', 'Thi lại GK', 'Thi CK', 'Thi lại CK', 'Tổng kết', 'Xếp loại', 'Ghi chú');

    return headers.map((header, index) => (
      <th key={index} className="gm-table-header">{header}</th>
    ));
  };

  const renderEditableCell = (cellType, studentId, value, gradeTypeId = null, attempt = null) => {
    const cellKey = `${cellType}-${studentId}-${gradeTypeId || ''}-${attempt || ''}`;
    const isEditing = editingCell === cellKey;

    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type={cellType === 'notes' ? 'text' : 'number'}
          className="gm-edit-input"
          value={tempValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyPress}
          min={cellType !== 'notes' ? "0" : undefined}
          max={cellType !== 'notes' ? "10" : undefined}
          step={cellType !== 'notes' ? "0.1" : undefined}
        />
      );
    }

    return (
      <div
        className="gm-editable-cell"
        onDoubleClick={() => handleCellDoubleClick(cellType, studentId, gradeTypeId, attempt)}
      >
        {value || (cellType === 'notes' ? '' : '-')}
      </div>
    );
  };

  const renderStudentRow = (student, index) => {
    const cells = [
      <td key="stt" className="gm-table-cell gm-cell-center">{index + 1}</td>,
      <td key="name" className="gm-table-cell">
        <div className="gm-student-info">
          <div className="gm-student-avatar">
            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="gm-student-details">
            <h4 className="gm-student-name">{student.name}</h4>
            <div className="gm-student-id">SV{String(student.id).padStart(6, '0')}</div>
          </div>
        </div>
      </td>
    ];

    // Add grade input cells
    gradeTypeOrder.forEach(typeId => {
      const count = gradeTypeCounts[typeId] || 0;

      for (let attempt = 1; attempt <= count; attempt++) {
        const value = getGradeValue(student, typeId, attempt);
        cells.push(
          <td key={`${typeId}-${attempt}`} className="gm-table-cell gm-cell-center">
            {renderEditableCell('grade', student.id, value, typeId, attempt)}
          </td>
        );
      }
    });

    // Add summary cells
    const summary = student.summary_grade || {};
    cells.push(
      <td key="avg" className="gm-table-cell gm-cell-center gm-summary-cell">{summary.avg_score || '-'}</td>,
      <td key="exam1" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam1', student.id, summary.exam1_score)}
      </td>,
      <td key="exam1_retake" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam1_retake', student.id, summary.exam1_retake)}
      </td>,
      <td key="exam2" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam2', student.id, summary.exam2_score)}
      </td>,
      <td key="exam2_retake" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam2_retake', student.id, summary.exam2_retake)}
      </td>,
      <td key="final" className="gm-table-cell gm-cell-center gm-summary-cell">{summary.final_score || '-'}</td>,
      <td key="evaluation" className="gm-table-cell gm-cell-center gm-summary-cell">{summary.evaluation || '-'}</td>,
      <td key="notes" className="gm-table-cell">
        {renderEditableCell('notes', student.id, student.notes)}
      </td>
    );

    return cells;
  };

  return (
    <main className="main-content">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

    .main-content {
    margin-left: 280px;
    margin-top: 70px;
    padding: 30px;
    min-height: calc(100vh - 70px);
}

        .gm-page-header {
          margin-bottom: 30px;
        }

        .gm-page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .gm-page-subtitle {
          color: #666;
          font-size: 1rem;
        }

        .gm-class-selection {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          margin-bottom: 30px;
          text-align: center;
        }

        .gm-selection-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          color: #667eea;
        }

        .gm-selection-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .gm-selection-subtitle {
          color: #666;
          margin-bottom: 25px;
        }

        .gm-class-select {
          position: relative;
          display: inline-block;
          min-width: 300px;
        }

        .gm-select-dropdown {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          transition: all 0.3s ease;
        }

        .gm-select-dropdown:focus {
          outline: none;
          border-color: #3b4d99;
          box-shadow: 0 0 0 3px rgba(59, 77, 153, 0.1);
        }

        .gm-select-dropdown:hover {
          border-color: #3b4d99;
        }

        .gm-grade-section {
          display: ${currentClassId ? 'block' : 'none'};
          animation: fadeInUp 0.6s ease;
        }

        .gm-grade-header {
          background: white;
          border-radius: 15px 15px 0 0;
          padding: 25px 30px;
          border: 1px solid #e9ecef;
          border-bottom: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .gm-selected-class-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .gm-class-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .gm-class-details h3 {
          color: #333;
          margin-bottom: 5px;
        }

        .gm-class-details p {
          color: #666;
          font-size: 0.9rem;
        }

        .gm-grade-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .gm-grade-controls {
          background: #f8f9ff;
          padding: 20px 30px;
          border: 1px solid #e9ecef;
          border-top: none;
          border-bottom: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
        }

        .gm-control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gm-control-label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .gm-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .gm-btn-primary {
          background: linear-gradient(135deg, #3b4d99 0%, #2d3a7a 100%);
          color: white;
        }

        .gm-btn-primary:hover {
          background: linear-gradient(135deg, #2d3a7a 0%, #1e2a5a 100%);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 77, 153, 0.3);
        }

        .gm-btn-secondary {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .gm-btn-secondary:hover {
          background: #e9ecef;
        }

        .gm-table-container {
          background: white;
          border-radius: 0 0 15px 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e9ecef;
          border-top: none;
        }

        .gm-grade-table {
          width: 100%;
          border-collapse: collapse;
        }

        .gm-table-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
          border-right: 1px solid #dee2e6;
          position: sticky;
          top: 0;
          z-index: 10;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .gm-table-cell {
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
          border-right: 1px solid #f0f0f0;
          vertical-align: middle;
        }

        .gm-cell-center {
          text-align: center;
        }

        .gm-grade-table tr:hover {
          background: #f8f9ff;
        }

        .gm-grade-table tr:last-child td {
          border-bottom: none;
        }

        .gm-student-info {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }

        .gm-student-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 0.8rem;
        }

        .gm-student-details {
          flex: 1;
        }

        .gm-student-name {
          color: #333;
          margin-bottom: 2px;
          font-size: 0.9rem;
        }

        .gm-student-id {
          color: #666;
          font-size: 0.75rem;
        }

        .gm-editable-cell {
          min-height: 24px;
          padding: 4px 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          min-width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gm-editable-cell:hover {
          background-color: #f0f8ff;
          border: 1px dashed #3b4d99;
        }

        .gm-edit-input {
          width: 100%;
          max-width: 80px;
          padding: 4px 6px;
          border: 2px solid #3b4d99;
          border-radius: 4px;
          text-align: center;
          font-size: 0.85rem;
          background: white;
          color: #333;
        }

        .gm-edit-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 77, 153, 0.2);
        }

        .gm-summary-cell {
          font-weight: 600;
          color: #333;
          background-color: #f8f9fa;
        }

        .gm-loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .gm-loading-spinner {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3b4d99;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        .gm-api-status {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          z-index: 1100;
          display: ${apiStatus.show ? 'block' : 'none'};
          background: ${apiStatus.isSuccess ? '#d4edda' : '#f8d7da'};
          color: ${apiStatus.isSuccess ? '#155724' : '#721c24'};
          border: 1px solid ${apiStatus.isSuccess ? '#c3e6cb' : '#f1b0b7'};
          animation: ${apiStatus.show ? 'slideInRight 0.3s ease' : 'none'};
        }

       @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .gm-main-content {
            padding: 15px;
          }

          .gm-page-title {
            font-size: 1.5rem;
          }

          .gm-class-selection {
            padding: 20px;
          }

          .gm-selection-icon {
            font-size: 3rem;
          }

          .gm-class-select {
            min-width: 250px;
          }

          .gm-grade-header {
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
          }

          .gm-grade-controls {
            padding: 15px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .gm-control-group {
            width: 100%;
            justify-content: space-between;
          }

          .gm-grade-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .gm-table-container {
            overflow-x: auto;
          }

          .gm-grade-table {
            min-width: 800px;
          }

          .gm-table-header {
            padding: 8px 6px;
            font-size: 0.75rem;
          }

          .gm-table-cell {
            padding: 8px 6px;
          }

          .gm-student-info {
            min-width: 150px;
          }

          .gm-student-avatar {
            width: 30px;
            height: 30px;
            font-size: 0.7rem;
          }

          .gm-student-name {
            font-size: 0.85rem;
          }

          .gm-student-id {
            font-size: 0.7rem;
          }

          .gm-edit-input {
            max-width: 60px;
            font-size: 0.8rem;
          }

          .gm-api-status {
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .gm-main-content {
            padding: 10px;
          }

          .gm-class-selection {
            padding: 15px;
          }

          .gm-selection-title {
            font-size: 1.2rem;
          }

          .gm-class-select {
            min-width: 200px;
          }

          .gm-select-dropdown {
            padding: 12px 15px;
            font-size: 0.9rem;
          }

          .gm-grade-header {
            padding: 15px;
          }

          .gm-class-badge {
            padding: 6px 12px;
            font-size: 0.8rem;
          }

          .gm-btn {
            padding: 8px 15px;
            font-size: 0.8rem;
          }

          .gm-grade-table {
            min-width: 600px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .gm-main-content {
            background: #1a1a1a;
            color: #e0e0e0;
          }

          .gm-class-selection,
          .gm-grade-header,
          .gm-table-container {
            background: #2d2d2d;
            border-color: #404040;
          }

          .gm-page-title {
            color: #e0e0e0;
          }

          .gm-page-subtitle {
            color: #b0b0b0;
          }

          .gm-selection-title {
            color: #e0e0e0;
          }

          .gm-selection-subtitle {
            color: #b0b0b0;
          }

          .gm-select-dropdown {
            background: #3d3d3d;
            border-color: #555;
            color: #e0e0e0;
          }

          .gm-select-dropdown:focus {
            border-color: #667eea;
          }

          .gm-table-header {
            background: linear-gradient(135deg, #3d3d3d 0%, #2d2d2d 100%);
            color: #e0e0e0;
            border-color: #555;
          }

          .gm-table-cell {
            border-color: #404040;
          }

          .gm-grade-table tr:hover {
            background: #2a2a2a;
          }

          .gm-student-name {
            color: #e0e0e0;
          }

          .gm-student-id {
            color: #b0b0b0;
          }

          .gm-editable-cell:hover {
            background-color: #1a2332;
            border-color: #667eea;
          }

          .gm-edit-input {
            background: #3d3d3d;
            border-color: #667eea;
            color: #e0e0e0;
          }

          .gm-summary-cell {
            background-color: #3d3d3d;
            color: #e0e0e0;
          }

          .gm-grade-controls {
            background: #2a2a2a;
            border-color: #404040;
          }

          .gm-control-label {
            color: #e0e0e0;
          }

          .gm-btn-secondary {
            background: #3d3d3d;
            color: #e0e0e0;
            border-color: #555;
          }

          .gm-btn-secondary:hover {
            background: #4d4d4d;
          }
        }

        /* Print styles */
        @media print {
          .gm-main-content {
            background: white !important;
            color: black !important;
          }

          .gm-class-selection,
          .gm-grade-controls,
          .gm-grade-actions {
            display: none !important;
          }

          .gm-grade-header {
            background: white !important;
            border: 1px solid black !important;
          }

          .gm-table-container {
            box-shadow: none !important;
            border: 1px solid black !important;
          }

          .gm-grade-table {
            border-collapse: collapse !important;
          }

          .gm-table-header,
          .gm-table-cell {
            border: 1px solid black !important;
            background: white !important;
            color: black !important;
          }

          .gm-student-avatar {
            background: #f0f0f0 !important;
            color: black !important;
          }

          .gm-api-status {
            display: none !important;
          }
        }

        /* Custom scrollbar */
        .gm-table-container::-webkit-scrollbar {
          height: 8px;
        }

        .gm-table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .gm-table-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .gm-table-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Focus states for accessibility */
        .gm-select-dropdown:focus,
        .gm-btn:focus,
        .gm-edit-input:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        /* Loading state enhancements */
        .gm-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .gm-loading-content {
          text-align: center;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="gm-api-status">
        {apiStatus.message}
      </div>

      <header className="gm-page-header">
        <h1 className="gm-page-title">🎓 Quản lý điểm số</h1>
        <p className="gm-page-subtitle">Hệ thống quản lý và theo dõi kết quả học tập của sinh viên</p>
      </header>

      {!currentClassId ? (
        <section className="gm-class-selection">
          <div className="gm-selection-icon">📚</div>
          <h2 className="gm-selection-title">Chọn lớp học</h2>
          <p className="gm-selection-subtitle">Vui lòng chọn lớp học để bắt đầu quản lý điểm</p>

          <div className="gm-class-select">
            {classLoading ? (
              <div className="gm-loading">
                <div className="gm-loading-spinner"></div>
                <p>Đang tải danh sách lớp...</p>
              </div>
            ) : (
              <select
                className="gm-select-dropdown"
                onChange={(e) => handleClassSelection(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>-- Chọn lớp học --</option>
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code}) - {cls.students} sinh viên
                  </option>
                ))}
              </select>
            )}
          </div>
        </section>
      ) : (
        <section className="gm-grade-section">
          <div className="gm-grade-header">
            <div className="gm-selected-class-info">
              <div className="gm-class-badge">{getSelectedClassInfo()?.code}</div>
              <div className="gm-class-details">
                <h3>{getSelectedClassInfo()?.name}</h3>
                <p>{getSelectedClassInfo()?.students} sinh viên</p>
              </div>
            </div>

            <div className="gm-grade-actions">
              <select
                className="gm-select-dropdown"
                onChange={(e) => changeClass(e.target.value)}
                value={currentClassId}
                style={{ minWidth: '200px' }}
              >
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="gm-grade-controls">
            <div className="gm-control-group">
              <label className="gm-control-label">Loại điểm:</label>
              <select
                className="gm-select-dropdown"
                value={selectedGradeType}
                onChange={(e) => setSelectedGradeType(e.target.value)}
                style={{ minWidth: '180px' }}
              >
                <option value="">-- Chọn loại điểm --</option>
                {gradeTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <button className="gm-btn gm-btn-primary" onClick={addGradeColumn}>
                ➕ Thêm cột
              </button>
            </div>

            <div className="gm-control-group">
              <button className="gm-btn gm-btn-secondary" onClick={exportGrades}>
                📊 Xuất điểm
              </button>
            </div>
          </div>

          <div className="gm-table-container">
            {gradeLoading ? (
              <div className="gm-loading">
                <div className="gm-loading-spinner"></div>
                <p>Đang tải dữ liệu điểm...</p>
              </div>
            ) : (
              <table className="gm-grade-table">
                <thead>
                  <tr>
                    {renderTableHeaders()}
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, index) => (
                    <tr key={student.id}>
                      {renderStudentRow(student, index)}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default GradeManagement;