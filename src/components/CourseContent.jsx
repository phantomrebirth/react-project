import React from 'react';
import { useSelector } from 'react-redux';
import Chat from './courses/Chat';
import Files from './courses/Files';
import Videos from './courses/Videos';
import Assignments from './courses/Assignments';
import Projects from './courses/Projects';
import Grades from './courses/Grades';
import AttendanceRate from './courses/AttendanceRate';
import Quizzes from './courses/Quizzes';

const CourseContent = ({ course, activeTab }) => {
    // // Assuming you have Redux state to manage the active course content
    // const courseContent = useSelector(state => state.courseContent);

    switch (activeTab) {
        case 'Chat':
            return <Chat />;
        case 'Videos':
            return <Videos />;
        case 'Files':
            return <Files courseId={course} />;
        case 'Assignments':
            return <Assignments />;
        case 'Projects':
            return <Projects />;
        case 'Quizzes':
            return <Quizzes />;
        case 'Grades':
            return <Grades />;
        case 'Attendance Rate':
            return <AttendanceRate />;
        default:
            return <div>No content available</div>;
    }
};

export default CourseContent;