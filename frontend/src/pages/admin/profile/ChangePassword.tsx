import { useState } from "react";
import "./ChangePassword.css";
import { useForm } from "react-hook-form";
import { teacherChangePassword } from "../../../services/authTeacherService";
import { HttpStatus } from "../../../enums/HttpStatus";

interface FormPassword {
    current_password: string,
    new_password: string,
    new_password_confirmation: string
}

const ChangePasswrod = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingChangePasswrod, setLoadingChangePassword] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogMessage, setShowDialogMessage] = useState('');
    const [showDialogStatus, setShowDialogStatus] = useState(false);
    const [checkNewPassword, setCheckNewPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormPassword>();
    const handleChangePassword = async (data: FormPassword) => {
        try {

            if (data.new_password !== data.new_password_confirmation) {
                setCheckNewPassword(true);
            } else {
                setLoadingChangePassword(true);
                const res = await teacherChangePassword(data.current_password, data.new_password, data.new_password_confirmation)
                if (res.data.status === HttpStatus.SUCCESS) {
                    setShowDialogMessage("Mật khẩu đã được cập nhật thành công!");
                    setShowDialog(true);
                    setShowDialogStatus(true);
                    reset();
                }

            }
        } catch (errors: any) {
            setShowDialog(true);
            setShowDialogStatus(false);
            if (errors.response.data.status === 422) {
                setShowDialogMessage("Mật khẩu hiện tại không đúng vui lòng kiểm tra lại.");
            } else {
                setShowDialogMessage("Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } finally {
            setLoadingChangePassword(false);
        }
    }
    return (
        <>
            {loadingChangePasswrod && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="cpw-container">
                <h2>🔒 Đổi mật khẩu</h2>
                <form onSubmit={handleSubmit(handleChangePassword)}>
                    <div className="cpw-form-group">
                        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                        <input type={showCurrentPassword ? "text" : "password"} id="currentPassword" {...register("current_password", { required: "Vui lòng nhập mật khẩu hiện tại" })} />
                        <button type="button" className="cpw-toggle-btn" onClick={() => setShowCurrentPassword(prev => !prev)}>
                            {showCurrentPassword ? "🙈" : "🐵"}
                        </button>
                    </div>
                    {errors.current_password && <p>{errors.current_password.message}</p>}
                    <div className="cpw-form-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input type={showNewPassword ? "text" : "password"} id="newPassword" {...register("new_password",
                            {
                                required: "Vui lòng nhập mật khẩu hiện mới",
                                minLength: {
                                    value: 6,
                                    message: "Mật khẩu phải có ít nhất 6 ký tự"
                                }
                            })} onChange={() => setCheckNewPassword(false)} />
                        <button type="button" className="cpw-toggle-btn" onClick={() => setShowNewPassword(prev => !prev)}>
                            {showNewPassword ? "🙈" : "🐵"}
                        </button>
                    </div>
                    {errors.new_password && <p>{errors.new_password.message}</p>}
                    <div className="cpw-form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                        <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" {...register("new_password_confirmation", {
                            required: "Vui lòng xác nhận mật khẩu mới",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự"
                            }
                        })} onChange={() => setCheckNewPassword(false)} />

                        <button type="button" className="cpw-toggle-btn" onClick={() => setShowConfirmPassword(prev => !prev)}>
                            {showConfirmPassword ? "🙈" : "🐵"}
                        </button>
                    </div>
                    {errors.new_password_confirmation ? <p>{errors.new_password_confirmation.message}</p> : !checkNewPassword ? '' : <p>Mật khẩu xác nhận không trùng khớp</p>}
                    <button type="submit" className="cpw-submit-btn">Cập nhật mật khẩu</button>
                </form>
            </div>

            {/*  Overlay popup  */}
            <div id="cpw-overlay" className={showDialog ? "cpw-overlay show" : "cpw-overlay"} onClick={() => setShowDialog(false)}>
                <div className="cpw-popup">
                    {showDialogStatus ? <h3>✅ Thành công</h3> : <h3 style={{ color: 'red' }}>❌ Thất bại</h3>}
                    {showDialogStatus ? <p>{showDialogMessage}</p> : <p style={{ color: 'red' }}>{showDialogMessage}</p>}
                    <button style={{ backgroundColor: showDialogStatus ? 'green' : 'red' }} className="cpw-ok-btn" onClick={() => setShowDialog(false)} >OK</button>
                </div>
            </div>
        </>
    )
}

export default ChangePasswrod