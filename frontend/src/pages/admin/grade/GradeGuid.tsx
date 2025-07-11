import React, { useState } from "react";
import "./GradeManagement.css";

const GradeGuide: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button className="btn btn-primary" onClick={openModal}>
                📘 Hướng dẫn tính điểm
            </button>

            {isOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h3>📘 Cách tính điểm</h3>

                        <h4>1. Điểm trung bình kiểm tra (TBKT):</h4>
                        <p>
                            TBKT = (điểm hệ số 1 lần 1 × 1) + (điểm hệ số 1 lần 2 × 1) +
                            (điểm hệ số 2 lần 1 × 2) + ... + (điểm hệ số N lần M * N) / tổng hệ số
                        </p>
                        <h4>2. Điểm tổng kết:</h4>
                        <p>
                            Tổng kết = Chuyên cần × 10% +  TBKT × 40% + Điểm thi (cao nhất trong
                            2 lần nếu có thi lại) × 50%
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default GradeGuide;
