import { useDispatch } from 'react-redux';
import { teacherLogin } from '../../services/authTeacherService';
import './loginPage.css';
import { login } from '../../store/slices/authSlice';
import { Role } from '../../enums/Role';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { HttpStatus } from '../../enums/HttpStatus';
import { studentLogin } from '../../services/authStudentService';
import { getFCMToken } from '../../services/deviceTokenService';
import Loadding from '../../components/ui/Loadding';
import { toast, ToastContainer } from 'react-toastify';
interface FormDataLogIn {
    email: string,
    password: string,
}

interface Props {
    role: string;
}
const LoginPage = ({ role }: Props) => {
    const [errorPassword, setErrorPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit: validated, formState: { errors } } = useForm<FormDataLogIn>();
    const hanldeLogin = async (dataForm: FormDataLogIn) => {
        try {
            setLoading(true);
            if (role === Role.Teacher) {
                const data = await teacherLogin(dataForm.email, dataForm.password);
                dispatch(login({ user: data.data.user }));
                getFCMToken();
                setErrorPassword(false);
            } else {
                const data = await studentLogin(dataForm.email, dataForm.password);
                dispatch(login({ user: data.data.user }));
                getFCMToken();
                setErrorPassword(false);
            }
        } catch (errors: any) {
            if (errors.status === HttpStatus.AUTH_ERROR) {
                setErrorPassword(true);
            }
            if (errors.response.status === HttpStatus.FORBIDDEN) {
                toast.warning(errors.response.data.error);
            }
        } finally {
            setLoading(false);
        }
    }
    const roleName = role === Role.Teacher ? 'Giảng Viên' : 'Sinh Viên';
    return (
        <>
            <ToastContainer />
            <section className="login-section">
                {loading && <Loadding />}
                <div className="login-card">
                    <h2>Đăng Nhập {roleName}</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email {roleName}</label>
                            <input type="email" id="email" {...register("email", { required: "Vui lòng nhập email" })} placeholder="Nhập email..." onChange={() => setErrorPassword(false)} />
                            {errors.email && <p>{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật Khẩu {roleName}</label>
                            <input type="password" id="password" {...register("password", {
                                required: 'Vui lòng nhập passowrd', validate: (value) =>
                                    !/\s/.test(value) || 'Password không được chứa khoảng trắng'
                            })} placeholder="Nhập mật khẩu..." onChange={() => setErrorPassword(false)} />
                            {errors.password ? <p>{errors.password.message}</p> : errorPassword && <p>Email hoặc mật khẩu không đúng</p>}
                        </div>
                        <button type="button" className="login-btn" onClick={validated(hanldeLogin)}>Đăng Nhập</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage 