import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../redux/actions/LoadingSpinner';
import { selectCourses, setCurrentCourseId, setCurrentFileId } from '../redux/slices/coursesSlice';
import { fetchCourses } from '../redux/slices/coursesSlice';
import { useDispatch, useSelector } from 'react-redux';
import CourseContent from './CourseContent';
import { CircularProgress } from '@material-ui/core';

const Course = () => {
    const { path } = useParams();
    const dispatch = useDispatch();
    // console.log(path);

    const [activeTab, setActiveTab] = useState('Chat');
    const [loading, setLoading] = useState(true);
    const { data: courses, currentFileId } = useSelector(selectCourses);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Find the course object by matching the path
    const currentCourse = courses.find(course => course.path === path);
    // console.log(currentCourse);
    // Extract the course name from the current course object
    
    const nameLoading = () => {
        if (nameLoading) {
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
    };
    const courseName = currentCourse ? currentCourse.name : nameLoading();
    // const courseIndex = courses.findIndex(course => course.path === path);

    // const courseId = courseIdArray[courseIndex];
    // const fileId = fileIdArray[courseIndex];

    // console.log(courseName);

    useEffect(() => {
        if (currentCourse) {
            dispatch(setCurrentCourseId(currentCourse._id));
            const fileIds = currentCourse.files.map(file => file._id);
            dispatch(setCurrentFileId(fileIds));
            const assignmentIds = currentCourse.assignments.map(assignment => assignment._id);
            dispatch(setCurrentFileId(assignmentIds));
        }
    }, [currentCourse, dispatch]);

    const handleSelect = (selectedKey) => {
        setActiveTab(selectedKey);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
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
                        <CourseContent course={path} activeTab={activeTab} />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Course;