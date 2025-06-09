import { useDispatch, useSelector } from 'react-redux';
import { teacherLogin } from '../../services/authService';
import './loginPage.css';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
const LoginPage = () => {
    return (
        <>
            <section className="login-section">
                <div className="login-card">
                    <h2>Đăng Nhập</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Login as</label>
                            <select id="role" name="role">
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                        <button type="button" className="login-btn">Đăng Nhập</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage 