import { useDispatch, useSelector } from 'react-redux';
import { teacherLogin } from '../../services/authService';
import './loginPage.css';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
const LoginPage = () => {
    const dispatch = useDispatch();
    const tonggleForgotPassword = (roleSelect: any) => {
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (!forgotLink) return;
        if (roleSelect === 'teacher') {
            forgotLink.style.display = 'block';
        } else {
            forgotLink.style.display = 'none';
        }
    }

    function handleLogin() {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const role = document.getElementById('role') as HTMLInputElement;

        if (role.value === 'teacher') {
            teacherLogin(email.value, password.value)
                .then((data) => {
                    if (data.status == 200) {

                        console.log(data.status, data.data.user);
                        const user = data.data.user;
                        const role = data.data.role;
                        dispatch(login({ user, role }));
                    }
                });

        }
    }
    return (
        <>
            <section className="login-section">
                <div className="login-card">
                    <h2>Đăng Nhập</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Username</label>
                            <input type="text" id="email" name="email" placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Login as</label>
                            <select id="role" name="role" onChange={(e) => { tonggleForgotPassword(e.target.value) }}>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                        <div className="forgot-password" id="forgotPasswordLink" style={{ display: "none" }}>
                            <Link to="/forgotpassword">Quên mật khẩu?</Link>
                        </div>
                        <button type="button" className="login-btn" onClick={handleLogin}>Đăng Nhập</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage 