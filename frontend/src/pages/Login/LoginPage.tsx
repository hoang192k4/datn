import { useDispatch, useSelector } from 'react-redux';
import { teacherLogin, teacherAuth } from '../../services/authTeacherService';
import './loginPage.css';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { Role } from '../../enums/Role';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { HttpStatus } from '../../enums/HttpStatus';
interface FormDataLogIn {
    email: string,
    password: string,
    role: string
}


const LoginPage = () => {
    const [errorPassword, setErrorPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit: validated, formState: { errors } } = useForm<FormDataLogIn>();
    const hanldeLogin = async (dataForm: FormDataLogIn) => {
        setLoading(true);
        try {
            if (dataForm.role === Role.Teacher) {
                const data = await teacherLogin(dataForm.email, dataForm.password);
                dispatch(login({ user: data.data.user }));
                setErrorPassword(false);
            } else {
                alert('thực hiện student');
            }
        } catch (errors: any) {
            if (errors.status === HttpStatus.AUTH_ERROR) {
                setErrorPassword(true);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="login-section">
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                )}
                <div className="login-card">
                    <h2>Đăng Nhập</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" {...register("email", { required: "Vui lòng nhập email" })} placeholder="Nhập email..." />
                            {errors.email && <p>{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật Khẩu</label>
                            <input type="password" id="password" {...register("password", { required: 'Vui lòng nhập passowrd' })} placeholder="Nhập mật khẩu..." />
                            {errors.password ? <p>{errors.password.message}</p> : errorPassword && <p>Email hoặc mật khẩu không đúng</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Vai Trò</label>
                            <select id="role" {...register("role")}>
                                <option value="student">Sinh Viên</option>
                                <option value="teacher">Giảng Viên</option>
                            </select>
                        </div>
                        <button type="button" className="login-btn" onClick={validated(hanldeLogin)}>Đăng Nhập</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage 