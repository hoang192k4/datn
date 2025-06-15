import React, { useState } from 'react';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp");
      return;
    }

    // Gọi API đổi mật khẩu ở đây
    console.log({ oldPassword, newPassword });

    onClose(); // Đóng modal sau khi xử lý
  };

  return (
    <div className="modal-overlay modal-container">
      <div className="modal-content">
        <h2>Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Mật khẩu cũ:
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu mới:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Xác nhận mật khẩu mới:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">Cập nhật</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
