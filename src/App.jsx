import '../bootstrap/css/bootstrap.min.css'
import '../bootstrap/css/all.min.css'
import './App.css'
import Login from './components/Login.jsx'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
// import { clearToken, selectLoading, selectToken } from './redux/slices/authSlice.js'
import { useEffect, useState } from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import LoadingSpinner from './redux/actions/LoadingSpinner.jsx'
import { login } from './redux/actions/auth.jsx'
import Admin from './pages/Admin.jsx'

const App = ({ token, role }) => {
  const navigate = useNavigate()
  // // const token = useSelector(selectToken);
  useEffect(() => {
    if (window.location.pathname === '/' && (token === null | token === undefined)) {
      // clearToken();
      navigate("/login");
    }
    //  else if (token) {
    //   navigate('/');
    // }
  }, [token, 
    // clearToken, 
    navigate]);
  
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="*" element={token ? <ProtectedRoutes/> : <Navigate to="/login" />} />
      <Route path="/admin" element={(token && role === 'admin') ? <Admin/> : <Navigate to="/login" />} />
       {/* <Route path="/login" element={<Login />} />
      <Route path="*" element={<ProtectedRoutes/>} /> */}
    </Routes>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  role: state.auth.role,
})
  
export default connect(mapStateToProps, { login})(App);