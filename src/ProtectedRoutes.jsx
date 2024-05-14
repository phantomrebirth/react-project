import HomePage from './components/HomePage.jsx'
import Courses from './pages/Courses.jsx'
// import Assignments from './pages/Assignments.jsx'
// import Messages from './pages/Messages.jsx'
import Reminder from './pages/Reminder.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import Layout from './Layout.jsx'
// import ComputerVision from './pages/courses/ComputerVision.jsx'
// import Programming from './pages/courses/Programming.jsx'
// import AI from './pages/courses/AI.jsx'
// import Network from './pages/courses/Network.jsx'
// import SoftwareEngineering from './pages/courses/SoftwareEngineering.jsx'
// import AttendanceRate from './pages/AttendanceRate.jsx'
import { Route, Routes } from 'react-router-dom'
import Course from './components/Course.jsx'
// import Assignments from './components/courses/Assignments.jsx'
import AllAssignments from './pages/AllAssignments.jsx'
import AttendanceRates from './pages/AttendanceRates.jsx'
import Grades from './pages/Grades.jsx'

const ProtectedRoutes = () => {

    return (
      <Layout>
            <Routes>
                <Route exact path="/" element={<HomePage />}/>
                <Route path="/profile" element={<Profile />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:path/*" element={<Course />} />
                {/* <Route path="/courses/programming" element={<Programming />} /> */}
                {/* <Route path="/courses/artificial-intelligence" element={<AI />} /> */}
                {/* <Route path="/courses/network" element={<Network />} /> */}
                {/* <Route path="/courses/software-engineering" element={<SoftwareEngineering />} /> */}
                <Route path="/assignments" element={<AllAssignments />} />
                {/* <Route path="/messages" element={<Messages />} /> */}
                <Route path="/reminder" element={<Reminder />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/attendance-rate" element={<AttendanceRates />} />
                <Route path="/grades" element={<Grades />} />
            </Routes>
      </Layout>
    );
};

export default ProtectedRoutes;