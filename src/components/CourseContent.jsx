// import React from 'react';
// import Chat from './courses/Chat';
// import Files from './courses/Files';
// import Videos from './courses/Videos';
// import Assignments from './courses/Assignments';
// import Projects from './courses/Projects';
// import Grades from './courses/Grades';
// import AttendanceRate from './courses/AttendanceRate';
// import Quizzes from './courses/Quizzes';

// const CourseContent = ({ course, activeTab }) => {

//     switch (activeTab) {
//         case 'Chat':
//             return <Chat courseId={course}/>;
//         case 'Videos':
//             return <Videos courseId={course} />;
//         case 'Files':
//             return <Files courseId={course} />;
//         case 'Assignments':
//             return <Assignments courseId={course} />;
//         case 'Projects':
//             return <Projects courseId={course} />;
//         case 'Quizzes':
//             return <Quizzes courseId={course} />;
//         case 'Grades':
//             return <Grades courseId={course} />;
//         case 'Attendance Rate':
//             return <AttendanceRate courseId={course} />;
//         default:
//             return <div>No content available</div>;
//     }
// };

// export default CourseContent;
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
import { selectCourses } from '../redux/slices/coursesSlice';
import Submitted from './courses/Submitted';

const CourseContent = ({ course, activeTab }) => {
    const {     coursesLoading    } = useSelector(selectCourses);

    return (
        <>
            {activeTab === 'Chat' && <Chat courseId={course} loading={coursesLoading} />}
            {activeTab === 'Files' && <Files courseId={course} loading={coursesLoading} />}
            {activeTab === 'Videos' && <Videos courseId={course} loading={coursesLoading} />}
            {activeTab === 'Assignments' && <Assignments courseId={course} loading={coursesLoading} />}
            {activeTab === 'Projects' && <Projects courseId={course} loading={coursesLoading} />}
            {activeTab === 'Grades' && <Grades courseId={course} loading={coursesLoading} />}
            {activeTab === 'Attendance Rate' && <AttendanceRate courseId={course} loading={coursesLoading} />}
            {activeTab === 'Quizzes' && <Quizzes courseId={course} loading={coursesLoading} />}
            {activeTab === 'Submitted' && <Submitted courseId={course} loading={coursesLoading} />}
        </>
    );
};

export default CourseContent;