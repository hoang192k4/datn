import './loginPage.css';
import { Link } from 'react-router-dom';
const LoginPage = () => {

    const tonggleForgotPassword = (roleSelect: any) => {
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (!forgotLink) return;
        if (roleSelect === 'teacher') {
            forgotLink.style.display = 'block';
        } else {
            forgotLink.style.display = 'none';
        }
    }
    return (
        <>
            <section className="login-section">
                <div className="login-card">
                    <h2>Đăng Nhập</h2>
                    <form action="#" method="post">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" placeholder="Enter your username" required />
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
                        <button type="submit" className="login-btn">Đăng Nhập</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage 