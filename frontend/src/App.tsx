import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import './assets/style/responsive.css';
import AppRoutes from './routes'
import { useDispatch } from 'react-redux';
import { teacherAuth } from './services/authTeacherService';
import { login, logout } from './store/slices/authSlice';
import { HttpStatus } from './enums/HttpStatus';
import { Navigate } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    teacherAuth()
      .then(res => {
        if (res.status === HttpStatus.SUCCESS) {
          dispatch(login({ user: res.data }));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => dispatch(logout()))
      .finally(() => setAuthLoading(false));
  }, [dispatch]);


  if (authLoading) {
    return (
      <div className="loading-overlay-layout">
        <div className="spinner-container">
          <div className="spinner-glow"></div>
          <div className="loading-text">Đang tải lại dữ liệu hệ thống hệ thống...</div>
        </div>
      </div>
    );
  }

  return (
    <AppRoutes />
  )
}

export default App
