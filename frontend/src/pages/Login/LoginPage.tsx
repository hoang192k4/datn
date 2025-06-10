import { useDispatch, useSelector } from 'react-redux';
import { teacherLogin, teacherAuth } from '../../services/authService';
import './loginPage.css';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { Role } from '../../enums/Role';
import { useForm } from 'react-hook-form';
interface FormDataLogIn {
    email: string,
    password: string,
    role: string
}
const LoginPage = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit: validated, formState: { errors } } = useForm<FormDataLogIn>();
    const hanldeLogin = (dataForm: FormDataLogIn) => {
        if (dataForm.role === Role.Teacher) {
            teacherLogin(dataForm.email, dataForm.password)
                .then((data) => {
                    dispatch(login({ user: data.data.user }));
                })
                .catch();
        }
        else {
            alert('thực hiện student');
        }
    }
    return (
        <>
            <section className="login-section">
                <div className="login-card">
                    <h2>Đăng Nhập</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" {...register("email", { required: "Vui lòng nhập email" })} placeholder="Enter your email" />
                            {errors.email && <p>{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" {...register("password", { required: 'Vui lòng nhập passowrd' })} placeholder="Enter your password" />
                            {errors.password && <p>{errors.password.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Login as</label>
                            <select id="role" {...register("role")}>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
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