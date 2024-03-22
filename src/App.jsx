// import '../bootstrap/css/bootstrap.min.css'
// import '../bootstrap/css/all.min.css'
// import './App.css'
// import Login from './components/Login.jsx'
// import { Route, Routes } from 'react-router-dom'
// import HomePage from './components/HomePage.jsx'
// import Courses from './pages/Courses.jsx'
// import Assignments from './pages/Assignments.jsx'
// import Messages from './pages/Messages.jsx'
// import Reminder from './pages/Reminder.jsx'
// import Settings from './pages/Settings.jsx'
// import LogOut from './pages/LogOut.jsx'
// import Profile from './pages/Profile.jsx'
// import Layout from './Layout.jsx'

// const App = () => {
//   return (
//     <>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//       </Routes>
//       <Layout>
//         <Routes>
//           <Route exact path="/" element={<HomePage />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/assignments" element={<Assignments />} />
//           <Route path="/messages" element={<Messages />} />
//           <Route path="/reminder" element={<Reminder />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/logout" element={<LogOut />} />
//           </Routes>
//       </Layout>
//     </>
//   );
// };

// export default App;
import '../bootstrap/css/bootstrap.min.css'
import '../bootstrap/css/all.min.css'
import './App.css'
import Login from './components/Login.jsx'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import Courses from './pages/Courses.jsx'
import Assignments from './pages/Assignments.jsx'
import Messages from './pages/Messages.jsx'
import Reminder from './pages/Reminder.jsx'
import Settings from './pages/Settings.jsx'
import LogOut from './pages/LogOut.jsx'
import Profile from './pages/Profile.jsx'
import Layout from './Layout.jsx'
import ComputerVision from './pages/courses/ComputerVision.jsx'
import Programming from './pages/courses/Programming.jsx'
import AI from './pages/courses/AI.jsx'
import Network from './pages/courses/Network.jsx'
import SoftwareEngineering from './pages/courses/SoftwareEngineering.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/computer-vision" element={<ComputerVision />} />
        <Route path="/courses/programming" element={<Programming />} />
        <Route path="/courses/artificial-intelligence" element={<AI />} />
        <Route path="/courses/network" element={<Network />} />
        <Route path="/courses/software-engineering" element={<SoftwareEngineering />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<LogOut />} />
      </Routes>
    </Layout>
  );
};

export default App;