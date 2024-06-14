import React, { useEffect, useState } from 'react'
import Quiz from '../Quiz';
import { Alert, Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
// import { selectRole } from '../../redux/slices/authSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { login } from '../../redux/actions/auth';
import { IoArrowForward } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import { finishFileOperation, getCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, setDeleteAlert, setUploadAlert, setWaitAlert, startFileOperation } from '../../redux/actions/courses';

const Quizzes = 
({
    role,
    token,
    courses,
    currentCourseID,
    isLoading,
    getCourses,
    waitAlert,
    uploadAlert,
    deleteAlert,
    setWaitAlert,
    setDeleteAlert,
    setUploadAlert,
    resetDeleteAlert,
    resetUploadAlert,
    resetWaitAlert,
    isFileOperationInProgress,
    startFileOperation,
    finishFileOperation,
}) => {
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    const [showFinishedQuiz, setShowFinishedQuiz] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [createQuiz, setCreateQuiz] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({ question: '', answers: ['', '', '', ''] });
    const [editingIndex, setEditingIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [highlightedAnswer, setHighlightedAnswer] = useState(null);
    const [quizDetails, setQuizDetails] = useState({
      name: '',
      duration: '',
      startTime: '',
      endTime: ''
    });
    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
        } else if (role === 'teacher') {
          setTeacher(true);
        }
        // dispatch(fetchCourses());
    }, [role]);
    // const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
    const course = courses.find(course => course._id === currentCourseID);
    // if (isLoading || !course) {
    //   return <LoadingSpinner />;
    // }

    const handleAttemptQuizClick = () => {
        setShowFinishedQuiz(false);
    };
    
    const handleStartQuizClick = () => {
        setShowQuiz(true);  
    };
  
    const handleCreateQuiz = () => {
      setCreateQuiz(true);
    };
  
    const handleExitCreateQuiz = () => {
      setShowModal(false);
      setCreateQuiz(false);
      setQuestions([]);
      setCurrentQuestion({ question: '', answers: ['', '', '', ''] });
      setEditingIndex(null);
      setQuizDetails({
        name: '',
        duration: '',
        startTime: '',
        endTime: ''
      });
    };
  
    const handleQuestionChange = (e) => {
      setCurrentQuestion({ ...currentQuestion, question: e.target.value });
    };
  
    const handleAnswerChange = (index, value) => {
      const newAnswers = [...currentQuestion.answers];
      newAnswers[index] = value;
      setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
    };
  
    const handleCorrectAnswerChange = (index) => {
      setCurrentQuestion({ ...currentQuestion, correctAnswer: index });
    };
  
    const handleSaveQuestion = () => {
      const newQuestions = [...questions];
      if (editingIndex !== null) {
        newQuestions[editingIndex] = currentQuestion;
        setEditingIndex(null);
      } else {
        newQuestions.push(currentQuestion);
      }
      setQuestions(newQuestions);
      setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswer: null });
      setHighlightedAnswer(currentQuestion.correctAnswer); // Highlight correct answer after saving
    };
  
    const handleEditQuestion = (index) => {
      setCurrentQuestion(questions[index]);
      setEditingIndex(index);
    };
  
    const handleDeleteQuestion = (index) => {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      if (editingIndex !== null && editingIndex === index) {
        setEditingIndex(null);
        setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswer: null });
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
    };
  
    const handleSubmitQuiz = () => {
      const payload = {
        quizDetails,
        questions
      };
      console.log(payload)
      fetch('YOUR_BACKEND_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Clear everything after successful submission
        // handleExitCreateQuiz();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      handleExitCreateQuiz()
    };
  
    const handleQuizDetailsChange = (e) => {
      const { name, value } = e.target;
      setQuizDetails({ ...quizDetails, [name]: value });
    };
  
    const handleOpenModal = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setQuizDetails({
        name: '',
        duration: '',
        startTime: '',
        endTime: ''
      });
    };
  
    const isSaveDisabled = !currentQuestion.question.trim() || currentQuestion.answers.some(answer => !answer.trim()) || currentQuestion.correctAnswer === null;
    const isSubmitDisabled = questions.length === 0 || !quizDetails.name.trim() || !quizDetails.duration.trim() || !quizDetails.startTime.trim() || !quizDetails.endTime.trim();
    const isOpenModalDisabled = questions.length === 0

  return (
    <div>
      {waitAlert && (
        <Alert variant={waitAlert.variant}>
          {waitAlert.message}
        </Alert>
      )}
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
        {teacher && !waitAlert &&(
        <div>
            {!createQuiz && (
                <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "69vh" }}>
                <button className='createQuiz-btn' onClick={handleCreateQuiz}>
                    Create quiz
                    <IoArrowForward style={{ padding: "2% 0 0 3%", fontSize: "126%" }} />
                </button>
                </div>
            )}
            {createQuiz && (
                <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }} className='mt-3'>
                    <h2>Create Quiz</h2>
                    <button onClick={handleExitCreateQuiz} style={{ background: 'none', border: 'none', fontSize: '24px' }}>
                    <IoClose style={{fontSize: "150%"}}/>
                    </button>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div className='tQuestion-container'>
                    <FloatingLabel controlId="floatingTextarea2" label={`Question ${editingIndex !== null ? editingIndex + 1 : questions.length + 1}`} className='tQuestion'>
                        <Form.Control
                        as="textarea"
                        placeholder="Leave your question here"
                        value={currentQuestion.question}
                        onChange={handleQuestionChange}
                        style={{ height: '100px' }}
                        />
                    </FloatingLabel>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div className='tAnswers-container' style={{ padding: "0", margin: "0" }}>
                    <Row className='tAll-answers' style={{ padding: "0", margin: "0" }}>
                        <Col md={12} style={{padding: "0 1rem"}}>
                        <div className='tAnswer-container'>
                        <Form.Check 
                            type="radio" 
                            name="correctAnswer" 
                            id="correctAnswerA" 
                            checked={currentQuestion.correctAnswer === 0}
                            onChange={() => handleCorrectAnswerChange(0)}
                            style={{ marginRight: "10px" }}
                            className='correct-check'
                        />
                        <FloatingLabel
                            controlId="floatingInputA"
                            label="Answer A"
                            className="tAnswer"
                        >
                            <Form.Control
                            as="textarea"
                            placeholder="Write your answer"
                            value={currentQuestion.answers[0]}
                            onChange={(e) => handleAnswerChange(0, e.target.value)}
                            />
                            {/* <Form.Check 
                                type="radio" 
                                name="correctAnswer" 
                                id="correctAnswerA" 
                                label="Correct Answer" 
                                checked={currentQuestion.correctAnswer === 0}
                                onChange={() => handleCorrectAnswerChange(0)}
                            /> */}
                            </FloatingLabel>
                        </div>
                        </Col>
                        <Col md={12} style={{padding: "0 1rem"}}>
                        <div className='tAnswer-container'>
                            <Form.Check 
                            type="radio" 
                            name="correctAnswer" 
                            id="correctAnswerB" 
                            checked={currentQuestion.correctAnswer === 1}
                            onChange={() => handleCorrectAnswerChange(1)}
                            style={{ marginRight: "10px" }}
                            className='correct-check'
                            />
                            <FloatingLabel
                            controlId="floatingInputB"
                            label="Answer B"
                            className="tAnswer"
                            >
                            <Form.Control
                                as="textarea"
                                placeholder="Write your answer"
                                value={currentQuestion.answers[1]}
                                onChange={(e) => handleAnswerChange(1, e.target.value)}
                            />
                            {/* <Form.Check 
                                type="radio" 
                                name="correctAnswer" 
                                id="correctAnswerB" 
                                label="Correct Answer" 
                                checked={currentQuestion.correctAnswer === 1}
                                onChange={() => handleCorrectAnswerChange(1)}
                            /> */}
                            </FloatingLabel>
                        </div>
                        </Col>
                    </Row>
                    <Row className='tAll-answers' style={{ padding: "0", margin: "0" }}>
                        <Col md={12} style={{padding: "0 1rem"}}>
                        <div className='tAnswer-container'>
                        <Form.Check 
                            type="radio" 
                            name="correctAnswer" 
                            id="correctAnswerC" 
                            checked={currentQuestion.correctAnswer === 2}
                            onChange={() => handleCorrectAnswerChange(2)}
                            style={{ marginRight: "10px" }}
                            className='correct-check'
                        />
                            <FloatingLabel
                            controlId="floatingInputC"
                            label="Answer C"
                            className="tAnswer"
                            >
                            <Form.Control
                                as="textarea"
                                placeholder="Write your answer"
                                value={currentQuestion.answers[2]}
                                onChange={(e) => handleAnswerChange(2, e.target.value)}
                            />
                            {/* <Form.Check 
                                type="radio" 
                                name="correctAnswer" 
                                id="correctAnswerC" 
                                label="Correct Answer" 
                                checked={currentQuestion.correctAnswer === 2}
                                onChange={() => handleCorrectAnswerChange(2)}
                            /> */}
                            </FloatingLabel>
                        </div>
                        </Col>
                        <Col md={12} style={{padding: "0 1rem"}}>
                        <div className='tAnswer-container'>
                        <Form.Check 
                            type="radio" 
                            name="correctAnswer" 
                            id="correctAnswerD" 
                            checked={currentQuestion.correctAnswer === 3}
                            onChange={() => handleCorrectAnswerChange(3)}
                            style={{ marginRight: "10px" }}
                            className='correct-check'
                        />
                            <FloatingLabel
                            controlId="floatingInputD"
                            label="Answer D"
                            className="tAnswer"
                            >
                            <Form.Control
                                as="textarea"
                                placeholder="Write your answer"
                                value={currentQuestion.answers[3]}
                                onChange={(e) => handleAnswerChange(3, e.target.value)}
                            />
                            {/* <Form.Check 
                                type="radio" 
                                name="correctAnswer" 
                                id="correctAnswerD" 
                                label="Correct" 
                                checked={currentQuestion.correctAnswer === 3}
                                onChange={() => handleCorrectAnswerChange(3)}
                                style={{marginLeft: "1%"}}
                            /> */}
                            </FloatingLabel>
                        </div>
                        </Col>
                    </Row>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: '20px' }}>
                    <Button onClick={handleSaveQuestion} disabled={isSaveDisabled} className='tSave-question'>
                    {editingIndex !== null ? 'Update Question' : 'Save Question'}
                    </Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    {questions.map((q, index) => (
                    <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                        <div>Question {index + 1}: {q.question}</div>
                        <ul>
                        {q.answers.map((answer, idx) => (
                            <li key={idx}>
                            answer {String.fromCharCode(65 + idx)}: &nbsp; {/* Add a non-breaking space */}
                            <span className={q.correctAnswer === idx ? 'correct-answer-text' : ''}>
                                {answer}
                            </span>
                            </li>
                        ))}
                        </ul>
                        <Button variant="secondary" onClick={() => handleEditQuestion(index)}>
                        Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteQuestion(index)} style={{ marginLeft: '10px' }}>
                        Delete
                        </Button>
                    </div>
                    ))}
                </div>
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Quiz Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <FloatingLabel controlId="floatingName" label="Quiz Name" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder=""
                            name="name"
                            value={quizDetails.name}
                            onChange={handleQuizDetailsChange}
                        />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingDuration" label="Duration (minutes)" className="mb-3">
                        <Form.Control
                            type="number"
                            placeholder=""
                            name="duration"
                            value={quizDetails.duration}
                            onChange={handleQuizDetailsChange}
                        />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingStartTime" label="Start Time" className="mb-3">
                        <Form.Control
                            type="datetime-local"
                            placeholder="Enter start time"
                            name="startTime"
                            value={quizDetails.startTime}
                            onChange={handleQuizDetailsChange}
                        />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingEndTime" label="End Time" className="mb-3">
                        <Form.Control
                            type="datetime-local"
                            placeholder="Enter end time"
                            name="endTime"
                            value={quizDetails.endTime}
                            onChange={handleQuizDetailsChange}
                        />
                        </FloatingLabel>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSubmitQuiz}
                        variant="primary"
                        disabled={isSubmitDisabled}
                        className='tUpload-quizBtn'
                        >
                        Upload Quiz
                    </Button>
                    </Modal.Footer>
                </Modal>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: '20px' }}>
                    <Button
                    variant="primary"
                    onClick={handleOpenModal}
                    disabled={isOpenModalDisabled}
                    className='tSubmit-quizBtn'
                    title='Click to confirm details'
                    >
                    Submit Quiz
                    </Button>
                </div>
                </div>
            )}
            </div>
        )}
    </div>
  );
};

const mapStateToProps = state => ({
    role: state.auth.role,
    token: state.auth.token,
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
      getCourses,
      setUploadAlert,
      setWaitAlert,
      setDeleteAlert,
      resetUploadAlert,
      resetDeleteAlert,
      resetWaitAlert,
      startFileOperation,
      finishFileOperation,
    })
(Quizzes);