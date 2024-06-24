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
import AdminProfile from './pages/AdminProfile.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminCourses from './pages/AdminCourses.jsx'
import AdminNavbar from './components/AdminNav.jsx'

const App = ({ token, role }) => {
  const navigate = useNavigate()
  // // const token = useSelector(selectToken);
  useEffect(() => {
    if (window.location.pathname === '/' && (token === null | token === undefined)) {
      // clearToken();
      navigate("/login");
    } else if (role === 'admin' && window.location.pathname === '/') {
      navigate("/admin")
    } else if (role !== 'admin' && window.location.pathname === '/') {
      navigate("/")
    }
    //  else if (token) {
    //   navigate('/');
    // }
  }, [token, role, navigate]);
  
  return (
    <>
      <Routes>
        <Route path="/login" element={(token && (role !== 'admin')) ? <Navigate to="/" /> : (token && (role === 'admin')) ? <Navigate to="/admin" /> : <Login />} />
        <Route path="*" element={token ? <ProtectedRoutes/> : <Navigate to="/login" />} />
        {/* <Route path="/admin" element={token && role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/admin/profile" element={token && role === 'admin' ? <AdminProfile /> : <Navigate to="/login" />} />
        <Route path="/admin/courses" element={token && role === 'admin' ? <AdminCourses /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={token && role === 'admin' ? <AdminUsers /> : <Navigate to="/login" />} /> */}
          {/* <Route path="/admin" element={(token && role === 'admin') ? <Admin/> : <Navigate to="/login" />} /> */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="*" element={<ProtectedRoutes/>} /> */}
      </Routes>
      {token && role === 'admin' && (
        <AdminNavbar>
          <div style={{overflowY: "auto", width: "100%", height: "100vh", paddingBottom: "3rem"}}>
            <div className='adminBody'>
              <Routes>
                <Route path="/admin" element={token && role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
                <Route path="/admin/profile" element={token && role === 'admin' ? <AdminProfile /> : <Navigate to="/login" />} />
                <Route path="/admin/courses" element={token && role === 'admin' ? <AdminCourses /> : <Navigate to="/login" />} />
                <Route path="/admin/users" element={token && role === 'admin' ? <AdminUsers /> : <Navigate to="/login" />} />
              </Routes>
            </div>
          </div>
        </AdminNavbar>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  role: state.auth.role,
})
  
export default connect(mapStateToProps, { login})(App);