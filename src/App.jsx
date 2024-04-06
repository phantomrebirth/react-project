import '../bootstrap/css/bootstrap.min.css'
import '../bootstrap/css/all.min.css'
import './App.css'
import Login from './components/Login.jsx'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import Courses from './pages/Courses.jsx'
import Assignments from './pages/Assignments.jsx'
import Messages from './pages/Messages.jsx'
import Reminder from './pages/Reminder.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import Layout from './Layout.jsx'
import ComputerVision from './pages/courses/ComputerVision.jsx'
import Programming from './pages/courses/Programming.jsx'
import AI from './pages/courses/AI.jsx'
import Network from './pages/courses/Network.jsx'
import SoftwareEngineering from './pages/courses/SoftwareEngineering.jsx'
import AttendanceRate from './pages/Attendance Rate.jsx'
// import { useSelector } from 'react-redux'

const App = () => {
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ProtectedRoutes />} />
    </Routes>
      // <Routes>
      //   <Route path="/login" element={<Login />} />
      //   {token ? <PrivateRoutes /> : <Navigate to="/login" />}
      // </Routes>
    // <Routes>
    //   <Route path="/login" element={<Login />} />
    //   <Route
    //     path="/*"
    //     element={token ? <PrivateRoutes /> : <Navigate to="/login" replace />}
    //   />
    // </Routes>
  );
};

const ProtectedRoutes = () => {
  
  // if (!token) {
  //   return <Navigate to="/login" />;
  // }
  // const currentRoute = useSelector(state => state.assignment.currentRoute);
  
  return (
    <Layout>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        {/* <Route index element={<HomePage />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/computer-vision/*" element={<ComputerVision />} />
        <Route path="/courses/programming" element={<Programming />} />
        <Route path="/courses/artificial-intelligence" element={<AI />} />
        <Route path="/courses/network" element={<Network />} />
        <Route path="/courses/software-engineering" element={<SoftwareEngineering />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/attendance" element={<AttendanceRate />} />
      </Routes>
    </Layout>
  );
};

export default App;