import React, { useState, useRef, useEffect } from 'react';
import './GradeManagement.css';
import { submitGradeStatus } from '../../../services/courseSectionService';
import { HttpStatus } from '../../../enums/HttpStatus';
import Swal from 'sweetalert2';

interface UnlockScoreProps {
  courseSectionId: number;
}

const UnlockScore: React.FC<UnlockScoreProps> = ({ courseSectionId }) => {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState<string>('');

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {

    try {
      const response = await submitGradeStatus(courseSectionId, checked);
      if (response.status === HttpStatus.SUCCESS) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: `Đã mở khóa và cho phép cập nhật điểm ${checked === 'draft_exam' ? 'chuyên cần và kiểm tra' : checked === 'submitted_exam' ? 'thi lần 1' : 'thi lần 2'}.`,
          confirmButtonText: 'OK'
        });
      } else {
        console.error('Failed to update grade status:', response.data);
      }
    } catch (error) {
      console.error('Error handling click:', error);
    }
  }

  return (
    <div className="unlock-container" ref={ref}>
      <button className="gm-btn gm-btn-secondary" style={{ padding: '10px 10px' }} onClick={() => setShow(!show)}>
        Mở khóa điểm ▼
      </button>
      {show && (
        <div className="unlock-dropdown">
          <label>
            <input
              type="radio"
              name="unlock-option"
              value="draft_exam"
              checked={checked === "draft_exam"}
              onChange={() => setChecked('draft_exam')}
            />
            Điểm kiểm tra
          </label>
          <label>
            <input
              type="radio"
              name="unlock-option"
              checked={checked === "submitted_exam"}
              onChange={() => setChecked('submitted_exam')}
            />
            Thi lần 1
          </label>
          <label>
            <input
              type="radio"
              name="unlock-option"
              checked={checked === "submitted_exam1"}
              onChange={() => setChecked('submitted_exam1')}
            />
            Thi lần 2
          </label>
          <button className="submit-btn" onClick={(e) => {
            handleClick(e);
            setShow(false);
          }}>
            Lưu lựa chọn
          </button>
        </div>
      )}
    </div>
  );
};

export default UnlockScore;
