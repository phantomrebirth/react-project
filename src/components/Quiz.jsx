import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { login } from '../redux/actions/auth';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import LoadingSpinner from '../redux/actions/LoadingSpinner';

const Quiz = 
({
    token,
    role,
    currentCourseID,
    courses,
    userID
}) => {
  const [activePage, setActivePage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizID, setQuizID] = useState(null)
  const [submissionTime, setSubmissionTime] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    } else if (timeLeft === 0) {
        handleFinishClick();
    }
}, [timeLeft]);

  const course = courses.find(course => course._id === currentCourseID);

  const fetchQuizzes = async () => {
    try {
        const response = await axios.get(`https://thankful-ample-shrimp.ngrok-free.app/quiz/${currentCourseID}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Authorization': `Bearer ${token}`
            }
        });

        const quizzesWithFormattedTime = response.data.quiz.map(quiz => {
            const durationSeconds = quiz.duration * 60; // convert duration from minutes to seconds
            setQuizID(quiz._id);
            return {
                ...quiz,
                formattedStartDate: format(new Date(quiz.startTime), 'PP'),
                formattedStartTime: format(new Date(quiz.startTime), 'HH:mm a'),
                formattedEndTime: format(new Date(new Date(quiz.startTime).getTime() + quiz.duration * 60000), 'HH:mm a'),
                formattedDuration: durationSeconds,
                formattedQuizStartTime: format(new Date(quiz.startTime), 'PPpp')
            };
        });
        setQuizData(quizzesWithFormattedTime);
        setSelectedAnswers(Array(quizzesWithFormattedTime[0].questions.length).fill(null));
        
        // Calculate the remaining time based on current time and start time
        const currentTime = new Date();
        const quizStartTime = new Date(quizzesWithFormattedTime[0].startTime);
        const elapsedTime = Math.floor((currentTime - quizStartTime) / 1000);
        setTimeLeft(quizzesWithFormattedTime[0].formattedDuration - elapsedTime);
    } catch (error) {
        console.error("Error fetching quizzes: ", error);
    }
  };

  const handlePageClick = (pageNum) => {
    setActivePage(pageNum);
  };

  const handleAnswerClick = (index) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[activePage - 1] = index;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextClick = () => {
    const nextQuiz = quizData[0].questions
    if (activePage === nextQuiz.length) {
      return;
    }
    setActivePage(prevPage => prevPage + 1);
  };

  const handleFinishClick = async () => {
    try {
      await axios.post(`https://thankful-ample-shrimp.ngrok-free.app/quiz/submit/${quizID}`, {
        answers: selectedAnswers
      }, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Submission successful');
    } catch (error) {
      console.error('Error submitting quiz: ', error);
    }
    setShowQuiz(false);
    setSubmissionTime(new Date());
    console.log(selectedAnswers)
  };

  if (!showQuiz) {
    const currentTime = submissionTime ? submissionTime.toLocaleTimeString() : '';
    return (
        <>
          {quizData && quizData.map((quiz, index) => (
            <Col key={index} style={{ margin: "0", padding: "0" }} className='quiz-col1'>
                <div className='fQ-container'>
                    <div className='quiz-header'>
                        <ul className='q-head'>
                            <li>{course.name}</li>
                        </ul>
                    </div>
                    <div className='finished-quiz'>
                        <div className='fQName-container'>
                            <h5 className='fQ-name'>{quiz.title}</h5>
                            <h6 className='fQ-zeros'>Submitted {quiz.formattedStartDate} at {currentTime}</h6>
                        </div>
                        <button className='fQ-btn'>Finished</button>
                    </div>
                </div>
            </Col>
          ))}
        </>
    );
  }

  if (!quizData) {
    return (
        <div>
            <LoadingSpinner/>
        </div>
    )
  };

  const formatTimeLeft = (time) => {
    const safeTime = Math.max(time, 0); // Ensure time is never negative
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;
    return `${minutes}:${seconds}`;
  };

  return (
    <>
      {quizData && quizData.map((quiz, index) => (
        <Container className='quiz-container' style={{padding: "0", margin: "0"}} fluid key={index} >
            <Row style={{padding: "0", margin: "0"}}>
            {/* xs={12} sm={12} md={10} lg={8} xl={8} */}
                <Col style={{padding: "0", margin: "0"}}>
                    <div className='questions-container'>
                        <div className='allQuestions-container'>
                            <Col >
                                <div className='QA-container'>
                                    <div style={{display: "flex"}}>
                                    <div className='photoOrAudio-container'>
                                        <p className='photoOrAudio'>
                                            Photo/Audio
                                        </p>
                                    </div>
                                    <div className='quiz-timeContainer'>
                                        <div className='quiz-timeLeft'>
                                            Time left {formatTimeLeft(timeLeft)}
                                        </div>
                                    </div>
                                    </div>
                                    <div className='page-container'>
                                        <div className='question-container'>
                                            <p className='question'>
                                                {quiz.questions[activePage - 1]?.question || 'Loading question...'}
                                            </p>
                                        </div>
                                        <div className='answers-container' style={{padding: "0", margin: "0"}}>
                                            <Row className='all-answers' style={{padding: "0", margin: "0"}}>
                                              {/* {quiz.questions[activePage - 1]?.answers.map((answer, index) => ( */}
                                                <>
                                                    <Col md={12} key={index} >
                                                    <div className='answer-container'>
                                                        <button className={`answer ${selectedAnswers[activePage - 1] === 0 ? 'selected' : ''}`} 
                                                                onClick={() => handleAnswerClick(0)}
                                                                >
                                                            A. {quiz.questions[activePage - 1]?.answers[0]}
                                                        </button>
                                                    </div>
                                                    </Col>
                                                    <Col md={12}>
                                                    <div className='answer-container'>
                                                        <button className={`answer ${selectedAnswers[activePage - 1] === 1 ? 'selected' : ''}`}
                                                                onClick={() => handleAnswerClick(1)}
                                                                >
                                                            B. {quiz.questions[activePage - 1]?.answers[1]}
                                                        </button>
                                                    </div>
                                                    </Col>
                                                </>
                                              {/* ))} */}
                                            </Row>
                                            <Row className='all-answers' style={{padding: "0", margin: "0"}}>
                                                <Col md={12}>
                                                <div className='answer-container'>
                                                    <button className={`answer ${selectedAnswers[activePage - 1] === 2 ? 'selected' : ''}`}
                                                            onClick={() => handleAnswerClick(2)}
                                                            >
                                                        C. {quiz.questions[activePage - 1]?.answers[2]}
                                                    </button>
                                                </div>
                                                </Col>
                                                <Col md={12}>
                                                <div className='answer-container'>
                                                    <button className={`answer ${selectedAnswers[activePage - 1] === 3 ? 'selected' : ''}`}
                                                            onClick={() => handleAnswerClick(3)}
                                                            >
                                                        D. {quiz.questions[activePage - 1]?.answers[3]}
                                                    </button>
                                                </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <div className='qPages-container'>
                                <div className='question-pages'>
                                    {[...Array(quiz.questions.length)].map((_, index) => (
                                        <div className='question-page' key={index}>
                                        <button
                                            className={`page-num ${activePage === index + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageClick(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='nextBtn-container'>
                            <Button className='nextBtn' onClick={activePage === quiz.questions.length ? handleFinishClick : handleNextClick}>
                                {activePage === quiz.questions.length ? "Finish" : "Next"}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
      ))}
    </>
  );
};

const mapStateToProps = state => ({
    role: state.auth.role,
    token: state.auth.token,
    userID: state.auth.userID,
    courses: state.courses.coursesData,
    currentCourseID: state.courses.currentCourseID,
    isLoading: state.courses.isLoading,
    deleteAlert: state.courses.deleteAlert,
    uploadAlert: state.courses.uploadAlert,
    waitAlert: state.courses.waitAlert,
    error: state.courses.error,
    isFileOperationInProgress: state.courses.isFileOperationInProgress,
});

export default connect(mapStateToProps,
    {
      login,
    //   getCourses,
    //   setUploadAlert,
    //   setWaitAlert,
    //   setDeleteAlert,
    //   resetUploadAlert,
    //   resetDeleteAlert,
    //   resetWaitAlert,
    //   startFileOperation,
    //   finishFileOperation,
    })
(Quiz);