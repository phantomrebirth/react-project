import React, { useEffect, useState } from 'react'
import Quiz from '../Quiz';
import { Col, Row } from 'react-bootstrap';
import { selectRole } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';

const Quizzes = () => {

    const dispatch = useDispatch();
    const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    const [showFinishedQuiz, setShowFinishedQuiz] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);

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

    const course = courses.find(course => course._id === currentCourseId);

    if (!course) {
      return <div>No projects available</div>;
    };
  
    if (loading) {
      return <LoadingSpinner />;
    }

    const handleAttemptQuizClick = () => {
        setShowFinishedQuiz(false);
    };

    const handleStartQuizClick = () => {
        setShowQuiz(true);  
    };

  return (
    <div>
        {student && (
            <>
                {showFinishedQuiz && !showQuiz && (
                <>
                    <Row className='quizzes-container' style={{ margin: "0", padding: "0"}}>
                        <Col style={{ margin: "0", padding: "0"}} className='quiz-col2'>
                            <div className='aQ-container'>
                                <div className='quiz-header'>
                                    <ul className='q-head'>
                                        <li>{course.name}</li>
                                    </ul>
                                </div>
                                <div className='attempt-quiz' onClick={handleAttemptQuizClick} style={{cursor: "pointer"}}>
                                    <div className='aQName-container'>
                                        <h5 className='aQ-name'>Quiz</h5>
                                        <h6 className='ass-zeros'>uploaded 00/00</h6>
                                    </div>
                                    <button className='aQ-btn'>
                                        Attempt Quiz
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
                )}
                <div>
                    {!showFinishedQuiz && !showQuiz &&(
                        <>
                        <Row style={{ margin: "0", padding: "0" }} className='attempt-container'>
                            <Col style={{ margin: "0", padding: "0"}}>
                                <div className='aQ-container' style={{marginLeft: "0px"}}>
                                    <div className='quiz-header'>
                                        <ul className='q-head'>
                                            <li>{course.name}</li>
                                        </ul>
                                    </div>
                                    <div className='attempt-quiz'>
                                        <div className='aQName-container'>
                                            <h5 className='aQ-name'>Quiz</h5>
                                            {/* <h6 className='ass-zeros'>uploaded 00/00</h6> */}
                                        </div>
                                        <button className='aQ-btn' style={{cursor: "unset"}}>
                                            Attempt now
                                        </button>
                                    </div>
                                </div>
                            </Col>
                            <Col style={{ margin: "0", padding: "0"}} md={7} lg={7} xl={7}>
                                <div className='startQ-container'>
                                    <button className='startQ-btn' onClick={handleStartQuizClick}>
                                        Start Quiz
                                    </button>
                                </div>
                            </Col>
                        </Row>
                            <div className='qd-container'>
                                <div className='qdHeader-container'>
                                    <h4 className='qd-header'>Quiz Details</h4>
                                </div>
                                <div className='quiz-details'>
                                    <p>
                                        13/2/2024
                                    </p>
                                    <p>
                                        Open:     18:00
                                    </p>
                                    <p>
                                        Close:    18:30
                                    </p>
                                    <p>
                                        No. of questions: 15
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div>
                    {showQuiz &&(
                        <>
                            <Quiz/>
                        </>
                    )}
                </div>
            </>
        )}
        {teacher && (
            <div>_</div>
        )}
    </div>
  );
};

export default Quizzes;