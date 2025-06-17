import React, { useState, useEffect, useRef } from 'react';
import './GradeManagement.css';
import PageHeader from '../../../components/ui/PageHeader';
import { getCourseSectionByTeacher } from '../../../services/courseSectionService';
import { HttpStatus } from '../../../enums/HttpStatus';
import SelectWithPagination from '../../../components/ui/SelectWithPagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GradeColumnManagerModal from './GradeColumnManagerModal';
import { addGradeColumnToCourseSection, createGrade, getGradeTypes, getStudentByCourseSectionId, updateGradeById, updateSummaryScore } from '../../../services/gradeStudentService';
import Swal from 'sweetalert2';
import { SummaryGrade } from '../../../enums/SummaryGrade';
import { Evaluation } from '../../../enums/Evaluation';


interface GradeType {
  id: number;
  name: string;
}

interface CourseSection {
  id?: number;
  name: string;
  students: number;
}

interface Grade {
  id: number;
  score: number;
  course_section_id: number;
  student_id: number;
  attempt: number;
  score_visibility: number;
  grade_type: GradeType;
}
interface Student {
  id?: number | null;
  name: string;
  student_code: string;
  grades?: any[];
  summary_grade: {
    id: number;
    attendance_score?: number;
    avg_score: number;
    exam1_score?: number;
    exam2_score?: number;
    final_score?: number;
    note: string;
    evaluation: string | any;
  };
}

interface gradeTypeCounts {
  [typeId: number]: any;
}


const GradeManagement: React.FC = () => {
  // State management
  const [currentClassId, setCurrentClassId] = useState<number>(0);
  const [gradeTypeCounts, setGradeTypeCounts] = useState<gradeTypeCounts>({});
  const [gradeTypeOrder, setGradeTypeOrder] = useState<number[]>([]);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedGradeType, setSelectedGradeType] = useState<string>('');
  const [gradeLoading, setGradeLoading] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string | number>('');
  const [gradeTypes, setGradeTypes] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [totalColumn, setTotalColumn] = useState<number | undefined | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [gradeColumn, setGradeColumn] = useState([]);


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
      console.log(loading);
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

  const handleClassSelection = (classId: { value: string }) => {
    if (classId) {
      setCurrentClassId(parseInt(classId.value));
      fetchGrades(parseInt(classId.value));
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

  const fetchGradesNoLoading = async (courseSectionId: any, key: string = '') => {
    if (!courseSectionId) return;

    try {
      const response = await getStudentByCourseSectionId(courseSectionId, key);
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

  const prepareGradeTypeData = (data: any) => {
    const counts: any = {};
    const order: any = [];
    let column: any = {};
    let total: number = 0;
    data.forEach((student: Student) => {
      student.grades?.forEach(gradeGroup => {
        gradeGroup.forEach((grade: any) => {
          const typeId = grade.grade_type.id;
          if (!counts[typeId]) {
            counts[typeId] = 0;
            if (!order.includes(typeId)) {
              order.push(typeId);
            }
          }

          if (!column[typeId]) {
            column[typeId] = [];
          }

          if (!column[typeId].some((item: any) => { return item.attempt === grade.attempt && item.typeName == grade.grade_type.name })) {
            column[typeId].push({ attempt: grade.attempt, typeName: grade.grade_type.name, scoreVisibility: grade.score_visibility });
          }

          counts[typeId] = Math.max(counts[typeId], grade.attempt);
          total += Math.max(counts[typeId], grade.attempt);
        });
      });
      total = total + 9;
    });
    setGradeColumn(column);
    setGradeTypeCounts(counts);
    setGradeTypeOrder(order);
    setTotalColumn(total);
  };

  const addGradeColumn = async () => {
    console.log('selectedGradeType:', selectedGradeType);
    if (!selectedGradeType) {
      toast.warning('Vui lòng chọn loại điểm!');
      return;
    }

    const typeId: number | never = parseInt(selectedGradeType);
    const currentCount = gradeTypeCounts[typeId] || 0;

    setGradeTypeCounts(prev => ({
      ...prev,
      [typeId]: currentCount + 1
    }));

    if (!gradeTypeOrder.includes(typeId)) {
      setGradeTypeOrder((prev: any[]) => [...prev, typeId]);
    }

    try {
      const response = await addGradeColumnToCourseSection(currentClassId, typeId);
      if (response.status === HttpStatus.SUCCESS) {
        toast.success('Thêm cột điểm mới thành công');
        fetchGradesNoLoading(currentClassId, '');
      }

    } catch (e) {

    }

  };


  const handleCellDoubleClick = (cellType: any, studentId: any, gradeTypeId = null, attempt: number | null = null, gradeId = null, summaryId: number | null = null) => {
    const cellKey: string = `${cellType}-${studentId}-${gradeTypeId || ''}-${attempt || ''}-${gradeId || ''}-${summaryId || ''}`;
    setEditingCell(cellKey);
    let currentValue: string | number = '';
    const student = studentData.find(s => s.id === studentId);
    if (!student) return;

    if (cellType === 'grade' && gradeTypeId && attempt) {
      const grade = getGradeValue(student, gradeTypeId, attempt);
      currentValue = grade.score;
    } else if (cellType === 'exam1_score') {
      currentValue = student.summary_grade?.exam1_score || '';
    } else if (cellType === 'exam2_score') {
      currentValue = student.summary_grade?.exam2_score || '';
    }

    setTempValue(currentValue ? currentValue.toString() : 0);
  };

  const handleInputChange = (e: any) => {
    setTempValue(e.target.value);
  };

  const handleInputBlur = () => {
    saveEditedValue();
  };

  const handleInputKeyPress = (e: any) => {
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
      const score = parseFloat(tempValue.toString());
      if (!isNaN(score) && score >= 0 && score <= 10) {
        updateGrade(parsedStudentId, parseInt(gradeTypeId), parseInt(attempt), tempValue, gradeId);
      }
      else {
        Swal.fire({
          title: 'Dữ liệu không phù hợp',
          icon: 'warning',
          text: 'Vui lòng chỉ nhập điểm từ 0 đến 10',

        })
      }
    } else if (cellType === 'notes') {
      updateStudentNotes(parsedStudentId, tempValue);
    } else if (cellType.includes('exam') || cellType.includes('attendance')) {
      const score = parseFloat(tempValue.toString());

      if (!isNaN(score) && score >= 0 && score <= 10) {
        updateExamScore(parsedStudentId, cellType, score, summaryId);
      }
    }


    setEditingCell(null);
    setTempValue('');
  };

  const updateGrade = async (studentId: any, gradeTypeId: any, attempt: any, value: any, gradeId: any) => {
    const score = parseFloat(value);

    if (isNaN(score) || score < 0 || score > 10) {
      Swal.fire({
        title: 'Dữ liệu không phù hợp',
        icon: 'warning',
        text: 'Vui lòng chỉ nhập điểm từ 0 đến 10',

      })
      return;
    }

    setStudentData(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedGrades = student.grades ? [...student.grades] : [];

        // Find or create grade group for this type
        let gradeGroupIndex = updatedGrades.findIndex(group =>
          group.some((g: Grade) => g.grade_type.id === gradeTypeId)
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
            grade_type: gradeTypes.find((t: GradeType) => t.id === gradeTypeId),
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
          fetchGradesNoLoading(currentClassId, debouncedKeyword);
        }
      } catch (e) {

      }
    }

    try {
      const response = await updateGradeById(gradeId, score);
      if (response.status === HttpStatus.SUCCESS) {
        toast.success("Cập nhật điểm thành công!");

        fetchGradesNoLoading(currentClassId, debouncedKeyword);

      }
    } catch (e) {

    }
  };

  const updateExamScore = async (studentId: any, examType: any, score: any, summaryId: any) => {
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
    if (score > 10 || score < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Dữ liệu không phù hợp',
        text: 'Vui lòng chỉ nhập giá trị từ 0 đến 10!'
      })
    }
    try {
      const response = await updateSummaryScore(summaryId, examType, score);
      if (response.status === HttpStatus.SUCCESS) {
        if (examType === SummaryGrade.EXAM1_SCORE)
          toast.success("Cập nhật điểm thi lần 1 thành công!");
        if (examType === SummaryGrade.EXAM2_SCORE)
          toast.success("Cập nhật điểm thi lần 2 thành công!");
        if (examType === SummaryGrade.ATTENDANCE_SCORE)
          toast.success("Cập nhật điểm chuyên cần thành công!");
        fetchGradesNoLoading(currentClassId, debouncedKeyword);
      }
    } catch (error: any) {
      if (error.response.status) {
        toast.error("Cập nhật điểm thất bại!");
      }
    }
  };

  const updateStudentNotes = (studentId: any, notes: any) => {
    setStudentData((prev: any[]) => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, notes };
      }
      return student;
    }));
  };

  const getGradeValue = (student: any, gradeTypeId: any, attempt: any) => {
    if (!student.grades) return {};

    for (const gradeGroup of student.grades) {
      const grade = gradeGroup.find((g: Grade) =>
        g.grade_type.id === gradeTypeId && g.attempt === attempt
      );
      if (grade) return grade || {};
    }
    return {};
  };

  const getSelectedClassInfo = (): CourseSection => {
    return allClasses.find((c: any) => c.id === currentClassId) || { name: '', students: 0 };
  };

  const renderTableHeaders = () => {
    const headers = ['STT', 'Họ tên', 'C. Cần'];

    gradeTypeOrder.forEach(typeId => {
      const gradeType: GradeType = gradeTypes.find((t: GradeType) => t.id === typeId) || { id: 0, name: '' };
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

  const renderEditableCell = (cellType: any, studentId: any, value: any, gradeTypeId: any = null, attempt: number | null = null, gradeId = null, summaryId: number | null = null) => {
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

  // Add summary cells

  const renderStudentRow = (student: Student, index: number) => {
    const summary = student.summary_grade;
    const cells = [
      <td key="stt" className="gm-table-cell gm-cell-center">{index + 1}</td>,
      <td key="name" className="gm-table-cell">
        <div className="gm-student-info">
          <div className="gm-student-details">
            <h4 className="gm-student-name">{student.name}</h4>
            <div className="gm-student-id">{student.student_code}</div>
          </div>
        </div>
      </td>,
      <td key="attendance" className="gm-table-cell">
        {renderEditableCell('attendance_score', student.id, summary?.attendance_score, null, null, null, summary?.id)}
      </td>
    ];

    // Add grade input cells
    gradeTypeOrder.forEach((typeId: number) => {
      const count = gradeTypeCounts[typeId] || 0;

      for (let attempt: number | null = 1; attempt <= count; attempt++) {
        const grade = getGradeValue(student, typeId, attempt);
        cells.push(
          <td key={`${typeId}-${attempt}`} className="gm-table-cell gm-cell-center">
            {renderEditableCell('grade', student.id, grade.score, typeId, attempt, grade.id)}
          </td>
        );
      }
    });

    cells.push(
      <td key="avg" className="gm-table-cell gm-cell-center">{summary?.avg_score || '-'}</td>,
      <td key="exam1" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam1_score', student.id, summary?.exam1_score, null, null, null, summary?.id)}
      </td>,
      <td key="exam2" className="gm-table-cell gm-cell-center">
        {renderEditableCell('exam2_score', student.id, summary?.exam2_score, null, null, null, summary?.id)}
      </td>,
      <td key="final" className="gm-table-cell gm-cell-center">{summary?.final_score || '-'}</td>,
      <td key="evaluation" className="gm-table-cell gm-cell-center">
        {Evaluation[summary?.evaluation as keyof typeof Evaluation]}
      </td>,
      <td key="notes" className="gm-table-cell">
        {renderEditableCell('notes', student.id, summary?.note)}
      </td>
    );

    return cells;
  };


  useEffect(() => {
    if (currentClassId == null) return;
    if (!debouncedKeyword || debouncedKeyword.trim() === '') {
      setDebouncedKeyword('');
    }
    const fetchData = async () => {
      try {
        setGradeLoading(true);
        const response = await getStudentByCourseSectionId(currentClassId, debouncedKeyword);
        if (response.status == HttpStatus.SUCCESS) {
          setGradeLoading(false);
          setStudentData(response.data.data);
        }

      } catch (error) {
        console.error('Lỗi khi gọi API:', error);

      }
    }
    fetchData()
  }, [debouncedKeyword]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 500);
    return () => clearTimeout(handler)
  }, [keyword]);

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }
  return (
    <>
      <ToastContainer />
      <PageHeader title="🎓 Quản lý điểm số" subtitle="Hệ thống quản lý và theo dõi kết quả học tập của sinh viên" />
      {!currentClassId ? (
        <section className="gm-class-selection">
          <div className="gm-selection-icon">📚</div>
          <h2 className="gm-selection-title">Chọn lớp học</h2>
          <p className="gm-selection-subtitle">Vui lòng chọn lớp học để bắt đầu quản lý điểm</p>

          <div className="gm-class-select">
            <SelectWithPagination handleClassSelection={handleClassSelection} />
          </div>
        </section>
      ) : (
        <section className="gm-grade-section">
          <div className="gm-grade-header">
            <div className="gm-selected-class-info">
              <div className="gm-class-details">
                <h3>{getSelectedClassInfo()?.name}</h3>
                <p>{getSelectedClassInfo()?.students} sinh viên</p>
              </div>
            </div>

            <div className="gm-grade-actions">
              <SelectWithPagination handleClassSelection={handleClassSelection} />
            </div>
          </div>

          <div className="gm-grade-controls">
            <div className="gm-control-group">
              <label className="gm-control-label">Loại điểm:</label>
              <select
                className="gm-select-dropdown"
                value={selectedGradeType ?? ''}
                onChange={(e) => setSelectedGradeType(e.target.value)}
                style={{ minWidth: '180px' }}
              >
                <option value="">-- Chọn loại điểm --</option>
                {gradeTypes.map((type: GradeType) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <button className="gm-btn gm-btn-primary" onClick={addGradeColumn}>
                ➕ Thêm cột
              </button>
            </div>
            <div className="gm-control-group">
              <button className="gm-btn gm-btn-secondary" style={{ padding: '10px 10px' }} onClick={() => { setIsOpenModal(true) }}>
                📊 Quản lý cột điểm
              </button>
              <button className="gm-btn gm-btn-secondary" style={{ padding: '10px 10px' }} >
                📊 Xuất điểm
              </button>
            </div>
            <div className="gm-control-group">
              <div className="search-container">
                <input type="text" placeholder="Tìm kiếm sinh viên..." onChange={handleChangeSearchInput} />
                <span className="icon">🔍</span>
              </div>
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
                  {studentData.length > 0 ? (studentData.map((student: Student, index) => (
                    <tr key={student.id}>
                      {renderStudentRow(student, index)}
                    </tr>
                  ))) : (<tr style={{ width: "100%", textAlign: 'center', gridColumn: 1 / -1 }} > <td colSpan={totalColumn ?? undefined}>Không tìm thấy sinh viên phù hợp</td> </tr>)}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      <GradeColumnManagerModal isOpen={isOpenModal} onClose={() => { setIsOpenModal(false) }} gradeColumn={gradeColumn} courseSectionId={currentClassId} fetchGradesNoLoading={() => fetchGradesNoLoading(currentClassId)} />
    </>
  );
};

export default GradeManagement;