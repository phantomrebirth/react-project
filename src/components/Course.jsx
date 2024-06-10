import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../redux/actions/LoadingSpinner';
// import { selectCourses, setCurrentAssignmentId, setCurrentCourseId, setCurrentFileId, setCurrentProjectId, setCurrentVideoId } from '../redux/slices/coursesSlice';
// import { fetchCourses } from '../redux/slices/coursesSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
// import CourseContent from './CourseContent';
import { CircularProgress } from '@material-ui/core';
// import { selectRole } from '../redux/slices/authSlice';
// import { selectSubmittedProjects, setSubmittedProjects } from '../redux/slices/ProjectsSlice';
import { getCourseAssignment, getCourseFile, getCourseProject, getCourseVideo, getCourses, setCurrentCourseID } from '../redux/actions/courses';
import { login } from '../redux/actions/auth';
import CourseContent from './CourseContent';

const Course = ({
    role,
    isLoading,
    error,
    courses,
    getCourses,
    getCourseVideo,
    getCourseFile,
    getCourseAssignment,
    getCourseProject,
    setCurrentCourseID,
    courseVideoData,
    courseProjectData,
    courseAssignmentData,
    courseFileData,
    videoIsLoading,
    projectIsLoading,
    fileIsLoading,
    assignmentIsLoading
}) => {
    const dispatch = useDispatch();
    const { path } = useParams();
    // const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    // const submittedProjects = useSelector(selectSubmittedProjects) ?? [];
    const [hasFetchedProjects, setHasFetchedProjects] = useState(false);
    useEffect(() => {
      if (role === 'student') {
        setStudent(true);
      } else if (role === 'teacher') {
        setTeacher(true);
      }
    }, [role]);
    const [activeTab, setActiveTab] = useState('Chat');
    const hasFetchedCourses = useRef(false);
    const hasFetchedDetails = useRef(false);
    const arraysEqual = (a, b) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i]._id !== b[i]._id) return false;
        }
        return true;
    };
    // const currentCourseID = 
    // const {
        // coursesLoading,
        // filesLoading,
        // assignmentsLoading,
        // projectsLoading,
        // videosLoading,
        // data: courses,
        // currentCourseId,
        // error
    // } = useSelector(selectCourses);
    const currentCourse = courses.find(course => course.path === path);
    console.log(currentCourse);
    // const course = courses.find(course => course._id);
    // console.log(course);
    const currentCourseID = currentCourse ? currentCourse._id : null;
    console.log(currentCourseID);
    useEffect(() => {
        if (!hasFetchedCourses.current && !currentCourse && !isLoading) {
            getCourses();
            hasFetchedCourses.current = true;
        }
    }, []);
    useEffect(() => {
        if (!hasFetchedDetails.current && currentCourse && !isLoading) {
            // dispatch(setCurrentCourseId(currentCourse._id));
            
            if (currentCourse.files && !arraysEqual(currentCourse.files, courseFileData)) {
                const fileID = currentCourse.files.map(file => file._id);
                // dispatch(setCurrentFileId(fileIds));
                getCourseFile({currentCourseID,fileID});
            }
    
            if (currentCourse.assignments && !arraysEqual(currentCourse.assignments, courseAssignmentData)) {
                const assignmentID = currentCourse.assignments.map(assignment => assignment._id);
                // dispatch(setCurrentAssignmentId(assignmentIds));
                getCourseAssignment({currentCourseID,assignmentID});
            }
    
            if (currentCourse.projects && !arraysEqual(currentCourse.projects, courseProjectData)) {
                const projectID = currentCourse.projects.map(project => project._id);
                // dispatch(setCurrentProjectId(projectIds));
                getCourseProject({currentCourseID,projectID});
            }
    
            if (currentCourse.videos && !arraysEqual(currentCourse.videos, courseVideoData)) {
                const videoID = currentCourse.videos.map(video => video._id);
                // dispatch(setCurrentVideoId(videoIds));
                getCourseVideo({currentCourseID,videoID});
            }
            hasFetchedDetails.current = true;
        }
        setCurrentCourseID(currentCourseID);
    }, [isLoading,
        currentCourse,
        currentCourseID,
        courseFileData,
        courseAssignmentData,
        courseProjectData,
        courseVideoData
    ]);
    // console.log(courseAssignmentData);
    // useEffect(() => {
    //     if (currentCourseId && !hasFetchedProjects) {
    //       fetchProjects();
    //     //   dispatch(setSubmittedProjects(submittedProjects));
    //       setHasFetchedProjects(true);
    //     }
    //     console.log(currentCourse)
    //   }, [currentCourseId, currentCourse, course]);
      
    //   const fetchProjects = async () => {
    //     if (!currentCourseId) return; // Ensure currentCourseId is valid
    //   console.log(currentCourseId)
    //   console.log(currentCourse.projects)
    //     // const course = courses.find(course => course._id === currentCourseId);
    //     // if (!course) return; // Ensure the course is found
      
    //     const projectPath = currentCourse.projects.map(project => `https://ezlearn.onrender.com/course/getProjects/${currentCourse._id}/${project._id}`);
    //     const projectRequests = projectPath.map(project => fetch(project));
    //     const responses = await Promise.all(projectRequests);
    //     const buffers = await Promise.all(responses.map(response => response.arrayBuffer()));
        
    //     const projects = currentCourse.projects.map((project, index) => ({
    //       ...project,
    //       _id: project._id,
    //       path: projectPath[index],
    //       buffer: buffers[index] // Store the buffer
    //     }));
        
    //     if (projects.length > 0 && currentCourse) {
    //         dispatch(setSubmittedProjects(projects));
    //         // dispatch(setSubmittedProjects(submittedProjects));
    //     } 
    //   };

    const nameLoading = () => {
        if (isLoading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '100%',  paddingLeft: "50%" }}
                >
                  <CircularProgress color="inherit"
                                    size={50}
                                    thickness={4}
                                    style={{color: "#7939ff"}}
                                    />
                </div>
            );
        };
        return null;
    };
    const courseName = currentCourse ? currentCourse.name : nameLoading();
    // const courseIndex = courses.findIndex(course => course.path === path);

    // const courseId = courseIdArray[courseIndex];
    // const fileId = fileIdArray[courseIndex];

    // console.log(courseName);


    const handleSelect = (selectedKey) => {
        setActiveTab(selectedKey);
        setRefreshKey((prevKey) => prevKey + 1);
    };

    if (
        isLoading ||
        fileIsLoading ||
        assignmentIsLoading ||
        projectIsLoading ||
        videoIsLoading
    ) {
        return (
            <LoadingSpinner/>
        );
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
          {student && (
            <>
                <h1 className='course-header'>{courseName}</h1>
                <Container fluid className='course-container' style={{ margin: "0", padding: "0" }}>
                    <Row style={{ margin: "0", padding: "0" }} className='courseRow1'>
                        <Col className='navtabs-container' style={{ padding: "0" }} >
                            <Navbar className='course-navbar'>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className='collapse-tabs'>
                                    <Nav id='nav-tabs' className="mr-auto" activeKey={activeTab} onSelect={handleSelect}>
                                        {/* Assuming you have a list of tab names */}
                                        {['Chat', 'Videos', 'Files', 'Assignments', 'Projects', 'Quizzes', 'Grades', 'Attendance Rate'].map(tabName => (
                                            <Nav.Link key={tabName} id='tabz' className='tab-link' eventKey={tabName}>{tabName}</Nav.Link>
                                        ))}
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </Col>
                    </Row>
                </Container>
                <Container className='tabs-container' style={{ margin: "0", padding: "0" }} fluid>
                    <Row style={{ margin: "0", padding: "0" }} className='courseRow2'>
                        <Col style={{ padding: "0" }} className='tab-content'>
                            {/* Render course content based on selected tab */}
                            <CourseContent key={refreshKey} course={path} activeTab={activeTab} />
                        </Col>
                    </Row>
                </Container>
            </>
          )}
          {teacher && (
            <>
                <h1 className='course-header'>{courseName}</h1>
                <Container fluid className='course-container' style={{ margin: "0", padding: "0" }}>
                    <Row style={{ margin: "0", padding: "0" }} className='courseRow1'>
                        <Col className='navtabs-container' style={{ padding: "0" }} >
                            <Navbar className='course-navbar'>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className='collapse-tabs'>
                                    <Nav id='nav-tabs' className="mr-auto" activeKey={activeTab} onSelect={handleSelect}>
                                        {['Chat', 'Videos', 'Files', 'Assignments', 'Projects', 'Quizzes', 'Submitted', 'Attendance Rate'].map(tabName => (
                                            <Nav.Link key={tabName} id='tabz' className='tab-link' eventKey={tabName}>{tabName}</Nav.Link>
                                        ))}
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </Col>
                    </Row>
                </Container>
                <Container className='tabs-container' style={{ margin: "0", padding: "0" }} fluid>
                    <Row style={{ margin: "0", padding: "0" }} className='courseRow2'>
                        <Col style={{ padding: "0" }} className='tab-content'>
                            <CourseContent key={refreshKey} course={path} activeTab={activeTab} />
                        </Col>
                    </Row>
                </Container>
            </>
          )}
        </>
    );
};

const mapStateToProps = state => ({
    role: state.auth.role,
    courses: state.courses.coursesData,
    isLoading: state.courses.isLoading,
    courseVideoData: state.courses.courseVideoData,
    videoIsLoading: state.courses.videoIsLoading,
    courseFileData: state.courses.courseFileData,
    fileIsLoading: state.courses.fileIsLoading,
    courseAssignmentData: state.courses.courseAssignmentData,
    assignmentIsLoading: state.courses.assignmentIsLoading,
    courseProjectData: state.courses.courseProjectData,
    projectIsLoading: state.courses.projectIsLoading,
    error: state.courses.error,
});

export default connect(mapStateToProps, { login, getCourses, getCourseAssignment, getCourseFile, getCourseProject, getCourseVideo, setCurrentCourseID })(Course);