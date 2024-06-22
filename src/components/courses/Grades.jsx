import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { login } from '../../redux/actions/auth';
import axios from 'axios';
import { format } from 'date-fns';

const Grades = 
({
    role,
    token,
    courses,
    currentCourseID,
    isLoading
}) => {
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
          fetchQuizzes();
        } else if (role === 'teacher') {
          setTeacher(true);
        }
    }, [role]);
    const fetchQuizzes = async () => {
        try {
          const response = await axios.get(`https://thankful-ample-shrimp.ngrok-free.app/quiz/${currentCourseID}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Authorization': `Bearer ${token}`
            }
          });
          const quizzesWithFormattedTime = response.data.quiz.map(async quiz => {
            const availabilityResponse = await axios.get(`https://thankful-ample-shrimp.ngrok-free.app/quiz/availability/${quiz._id}`);
            const { available } = availabilityResponse.data;
            const endTime = new Date(quiz.startTime).getTime() + quiz.duration * 60000;
            return {
              ...quiz,
              available,
              endTime: endTime,
              formattedStartDate: format(new Date(quiz.startTime), 'PP'),
              formattedStartTime: format(new Date(quiz.startTime), 'HH:mm a'),
              formattedEndTime: format(new Date(endTime), 'HH:mm a'),
              formattedQuizStartTime: format(new Date(quiz.startTime), 'PPpp')
            };
          });
          const quizzesData = await Promise.all(quizzesWithFormattedTime);
          setQuizzes(quizzesData);
        } catch (error) {
            console.error("Error fetching quizzes: ", error);
        }
    };

    // const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //       setLoading(false);
    // }, 1000);
    
    //   return () => clearTimeout(timer);
    // }, []);

    const course = courses.find(course => course._id === currentCourseID);
    if (isLoading || !course) {
      return <LoadingSpinner />;
    }
console.log(quizzes)
  return (
    <>
        {student && quizzes && quizzes.map((quiz, index) => (
            <>
              {quiz.grades.length > 0 && (
                <Row key={index} className='grades-container' style={{ margin: "0", padding: "0"}}>
                    <Col style={{ margin: "0", padding: "0"}}>
                        <div className='fQ-container'>
                            <div className='quiz-header'>
                                <ul className='q-head'>
                                    <li>{course.name}</li>
                                </ul>
                            </div>
                            <div className='finished-quiz'>
                                <div className='fQName-container'>
                                    <h5 className='fQ-name'>{quiz.title}</h5>
                                    <h6 className='fQ-zeros'>Submitted {quiz.formattedStartDate}</h6>
                                </div>
                                <div>
                                    <p className='grade'>
                                        {quiz.grades[0].score}/{quiz.questions.length}
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
            </>
        ))}
        {student && quizzes && quizzes.map((quiz, index) => (
            <div key={index}>
                {quiz.grades.length === 0 && (
                    <div style=
                            {{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                paddingTop: '6%'
                            }}
                    >
                        You haven't submitted any quizzes yet.
                    </div>
                )}
            </div>
        ))}
        {student && quizzes.length === 0 && (
            <div style=
                    {{
                       display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        paddingTop: '6%'
                    }}
            >
                You haven't submitted any quizzes yet.
            </div>
        )}
        {teacher && (
            <div>_</div>
        )}
    </>
  );
};

const mapStateToProps = state => ({
    role: state.auth.role,
    token: state.auth.token,
    courses: state.courses.coursesData,
    currentCourseID: state.courses.currentCourseID,
    isLoading: state.courses.isLoading,
});

export default connect(mapStateToProps,
    {
      login,
    })
(Grades);