import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import './assets/style/responsive.css';
import AppRoutes from './routes'
import { useDispatch } from 'react-redux';
import { teacherAuth } from './services/authService';
import { login } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Kiểm tra auth khi app khởi động

  }, []);
  return (
    <AppRoutes />
  )
}

export default App
