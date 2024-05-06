import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { selectRole } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';

const Grades = () => {

    const dispatch = useDispatch();
    const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    // const [loading, setLoading] = useState(true);

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

    const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //       setLoading(false);
    // }, 1000);
    
    //   return () => clearTimeout(timer);
    // }, []);

    const course = courses.find(course => course._id === currentCourseId);
  
    if (loading) {
      return <LoadingSpinner />;
    }

  return (
    <div>
        {student && (
            <Row className='grades-container' style={{ margin: "0", padding: "0"}}>
                <Col style={{ margin: "0", padding: "0"}}>
                    <div className='fQ-container'>
                        <div className='quiz-header'>
                            <ul className='q-head'>
                                <li>{course.name}</li>
                            </ul>
                        </div>
                        <div className='finished-quiz'>
                            <div className='fQName-container'>
                                <h5 className='fQ-name'>Quiz</h5>
                                <h6 className='fQ-zeros'>00.00.0000</h6>
                            </div>
                            <div>
                                <p className='grade'>
                                    20/20
                                </p>
                            </div>
                            <button className='fQ-btn'>
                                Finished
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
        )}
        {teacher && (
            <div>_</div>
        )}
    </div>
  );
};

export default Grades;