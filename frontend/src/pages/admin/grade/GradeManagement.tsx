import React, { useState, useEffect, useRef } from 'react';
import './GradeManagement.css';
import PageHeader from '../../../components/ui/PageHeader';
import { getCourseSectionByTeacher } from '../../../services/courseSectionService';
import { HttpStatus } from '../../../enums/HttpStatus';
import Loadding from '../../../components/ui/Loadding';

import { addGradeColumnToCourseSection, createGrade, getGradeTypes, getStudentByCourseSectionId, updateGradeById } from '../../../services/gradeStudentService';
import Swal from 'sweetalert2';
import { Evaluation } from '../../../enums/Evaluation';
const GradeManagement = () => {
  // State management
  const [currentClassId, setCurrentClassId] = useState(null);
  const [currentGradeId, setCurrentGradeId] = useState(null);
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
  const [gradeTypes, setGradeTypes] = useState([]);
  const inputRef = useRef(null);





  // Initialize data
  useEffect(() => {
    loadCourseSections('');
    loadGradeTypes();
  }, []);

  const loadGradeTypes = async () => {
    const response = await getGradeTypes();
    if (response.status == HttpStatus.SUCCESS) {
      const gradeTypes = response.data.data;
      setGradeTypes(gradeTypes);
    }
  }
  const [loading, setLoading] = useState(false);
  const loadCourseSections = async (keyWord: string) => {
    try {
      setLoading(true);
      const response = await getCourseSectionByTeacher(keyWord);
      if (response.status === HttpStatus.SUCCESS) {
        setAllClasses(response.data.data.course_sections);
      }
    } catch (e) {

    } finally {
      setLoading(false);
    }
  }

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



  const handleClassSelection = (classId) => {
    if (classId) {
      console.log(classId);
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

  const fetchGrades = async (courseSectionId: any) => {
    if (!courseSectionId) return;

    try {
      setGradeLoading(true);
      const response = await getStudentByCourseSectionId(courseSectionId);
      if (response.status == HttpStatus.SUCCESS) {
        const students = response.data.data;
        setStudentData(students);
        prepareGradeTypeData(students);

      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi trong quá trình lấy dữ liệu!",
      })
    } finally {
      setGradeLoading(false);
    }
  };

  const fetchGradesNoLoading = async (courseSectionId: any) => {
    if (!courseSectionId) return;

    try {
      const response = await getStudentByCourseSectionId(courseSectionId);
      if (response.status == HttpStatus.SUCCESS) {
        const students = response.data.data;
        setStudentData(students);
        prepareGradeTypeData(students);

      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi trong quá trình lấy dữ liệu!",
      })
    } finally {
    }
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

  const addGradeColumn = async () => {
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

    try {
      const response = await addGradeColumnToCourseSection(currentClassId, typeId);
      if (response.status === HttpStatus.SUCCESS)
        fetchGradesNoLoading(currentClassId);
    } catch (e) {

    }

  };


  const handleCellDoubleClick = (cellType, studentId, gradeTypeId = null, attempt = null, gradeId = null, summaryId = null) => {
    const cellKey = `${cellType}-${studentId}-${gradeTypeId || ''}-${attempt || ''}-${gradeId || ''}-${summaryId || ''}`;
    setEditingCell(cellKey);
    setCurrentGradeId(gradeId);
    let currentValue = '';
    const student = studentData.find(s => s.id === studentId);

    if (cellType === 'grade' && gradeTypeId && attempt) {
      const grade = getGradeValue(student, gradeTypeId, attempt);
      currentValue = grade.score;
    } else if (cellType === 'exam1') {
      currentValue = student.summary_grade?.exam1_score || '';
    } else if (cellType === 'exam2') {
      currentValue = student.summary_grade?.exam2_score || '';
    }

    setTempValue(currentValue ? currentValue.toString() : 0);
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

    const [cellType, studentId, gradeTypeId, attempt, gradeId, summaryId] = editingCell.split('-');
    const parsedStudentId = parseInt(studentId);

    if (cellType === 'grade') {
      const score = parseFloat(tempValue);
      if (!isNaN(score) && score >= 0 && score <= 10) {
        updateGrade(parsedStudentId, parseInt(gradeTypeId), parseInt(attempt), tempValue, gradeId);
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

  const updateGrade = async (studentId, gradeTypeId, attempt, value, gradeId) => {
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


    if (gradeId == "undefined" || gradeId === '') {
      try {
        const response = await createGrade(currentClassId, gradeTypeId, studentId, score, attempt);
        if (response.status === HttpStatus.SUCCESS) {
          fetchGradesNoLoading(currentClassId);
        }
      } catch (e) {

      }
    }

    try {
      const response = await updateGradeById(gradeId, score);
      if (response.status === HttpStatus.SUCCESS) {
        fetchGradesNoLoading(currentClassId);
      }
    } catch (e) {

    }
  };

  const updateExamScore = (studentId, examType, score, summaryId) => {
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
    if (!student.grades) return {};

    for (const gradeGroup of student.grades) {
      const grade = gradeGroup.find(g =>
        g.grade_type.id === gradeTypeId && g.attempt === attempt
      );
      if (grade) return grade || {};
    }
    return {};
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
        headers.push(`${gradeType.name} - ${i}`);
      }
    });

    headers.push('ĐTB', 'Thi Lần 1', 'Thi Lần 2', 'Tổng kết', 'Xếp loại', 'Ghi chú');

    return headers.map((header, index) => (
      <th key={index} className="gm-table-header">{header}</th>
    ));
  };

  const renderEditableCell = (cellType, studentId, value, gradeTypeId = null, attempt = null, gradeId = null, summaryId = null) => {
    const cellKey = `${cellType}-${studentId}-${gradeTypeId || ''}-${attempt || ''}-${gradeId || ''}-${summaryId || ''}`;
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
        onDoubleClick={() => handleCellDoubleClick(cellType, studentId, gradeTypeId, attempt, gradeId, summaryId)}
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
          <div className="gm-student-details">
            <h4 className="gm-student-name">{student.name}</h4>
            <div className="gm-student-id">{student.student_code}</div>
          </div>
        </div>
      </td>
    ];

    // Add grade input cells
    gradeTypeOrder.forEach(typeId => {
      const count = gradeTypeCounts[typeId] || 0;

      for (let attempt = 1; attempt <= count; attempt++) {
        const grade = getGradeValue(student, typeId, attempt);
        cells.push(
          <td key={`${typeId}-${attempt}`} className="gm-table-cell gm-cell-center">
            {renderEditableCell('grade', student.id, grade.score, typeId, attempt, grade.id)}
          </td>
        );
      }
    });

    // Add summary cells
    const summary = student.summary_grade || {};
    cells.push(
      <td key="avg" className="gm-table-cell gm-cell-centerl">{summary.avg_score || '-'}</td>,
      <td key="exam1" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam1', student.id, summary.exam1_score, null, null, null, summary.id)}
      </td>,
      <td key="exam2" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam2', student.id, summary.exam2_score, null, null, null, summary.id)}
      </td>,
      <td key="final" className="gm-table-cell gm-cell-center">{summary.final_score || '-'}</td>,
      <td key="evaluation" className="gm-table-cell gm-cell-center">{Evaluation[summary.evaluation] || '-'}</td>,
      <td key="notes" className="gm-table-cell">
        {renderEditableCell('notes', student.id, student.notes)}
      </td>
    );

    return cells;
  };

  return (
    <>
      <div className="gm-api-status">
        {apiStatus.message}
      </div>


      <PageHeader title="🎓 Quản lý điểm số" subtitle="Hệ thống quản lý và theo dõi kết quả học tập của sinh viên" />
      {!currentClassId ? (
        <section className="gm-class-selection">
          <div className="gm-selection-icon">📚</div>
          <h2 className="gm-selection-title">Chọn lớp học</h2>
          <p className="gm-selection-subtitle">Vui lòng chọn lớp học để bắt đầu quản lý điểm</p>

          <div className="gm-class-select">
            <select
              className="gm-select-dropdown"
              onChange={(e) => handleClassSelection(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>-- Chọn lớp học --</option>
              {allClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.students_total} sinh viên
                </option>
              ))}
            </select>

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
                    {cls.name}
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
              <button className="gm-btn gm-btn-secondary"  >
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
    </>
  );
};

export default GradeManagement;