import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { selectRole } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses } from '../redux/slices/coursesSlice';
import LoadingSpinner from '../redux/actions/LoadingSpinner';

const AttendanceRates = () => {
    const dispatch = useDispatch();
    const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);

    useEffect(() => {
        if (role === 'student') {
            setStudent(true);
        } else if (role === 'teacher') {
            setTeacher(true);
        }
    }, [role]);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const { loading, data: courses } = useSelector(selectCourses);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {student && (
                <Container fluid className='mt-4 last-container'>
                    <Row className='grades-container' style={{ margin: "0", padding: "0" }}>
                        {courses.map(course => (
                            <Col key={course._id} style={{ margin: "0", padding: "2%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div className='AR-container'>
                                    <div className='AR-title'>
                                        {course.name}
                                    </div>
                                    <div className='attendance-container'>
                                        <div className='classes-container'>
                                            <div className='classes'>
                                                <p className='classes-num'>
                                                    {/* {course.totalClasses} */}
                                                    9
                                                </p>
                                                <p className='total-classes'>
                                                    Total classes
                                                </p>
                                            </div>
                                            <hr className='AR-hr'>
                                            </hr>
                                            <div className='total-absents'>
                                                <p className='absent-num'>
                                                    {/* {course.absent} */}
                                                    2
                                                </p>
                                                <p className='absent'>
                                                    Absent
                                                </p>
                                            </div>
                                        </div>
                                        <div className='rate-container'>
                                            <p className='rate'>
                                                {/* {((course.totalClasses - course.absent) / course.totalClasses * 100).toFixed(2)}% */}
                                                80%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}
            {teacher && (
                <div>_</div>
            )}
        </>
    );
};

export default AttendanceRates;
