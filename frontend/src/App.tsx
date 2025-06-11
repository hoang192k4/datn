import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import './assets/style/responsive.css';
import AppRoutes from './routes'
import { useDispatch } from 'react-redux';
import { teacherAuth } from './services/authService';
import { login, logout } from './store/slices/authSlice';
import { HttpStatus } from './enums/HttpStatus';
import { Navigate } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
 /*  useEffect(() => {
    teacherAuth().then((res) => {
      if (res.status === HttpStatus.SUCCESS) {
        dispatch(login({ user: res.data }));
      }
      else if (res.status === HttpStatus.AUTH_ERROR) {
        dispatch(logout());
      }
    }).catch((errors) => console.log(errors));

  }, [dispatch]); */
  return (
    <AppRoutes />
  )
}

export default App
