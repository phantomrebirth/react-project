import '../bootstrap/css/bootstrap.min.css'
import '../bootstrap/css/all.min.css'
import './App.css'
import Login from './components/Login.jsx'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearToken, selectLoading, selectToken } from './redux/slices/authSlice.js'
import { useEffect, useState } from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import LoadingSpinner from './redux/actions/LoadingSpinner.jsx'

const App = () => {
  const navigate = useNavigate()
  const token = useSelector(selectToken);
  useEffect(() => {
    if (window.location.pathname === '/' && (token === null | token === undefined)) {
      clearToken();
      navigate("/login");
    }
    //  else if (token) {
    //   navigate('/');
    // }
  }, [token, clearToken, navigate]);
  
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="*" element={token ? <ProtectedRoutes/> : <Navigate to="/login" />} />
    </Routes>
  );
};
  
export default App;