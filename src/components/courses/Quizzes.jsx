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
import axios from 'axios';
import { format } from 'date-fns';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import quizIcon from '../../assets/images/quiz.png';
import apiUrl from '../ApiUrl';

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
    const [quizzesAvailability, setQuizzesAvailability] = useState({});
    const [editingQuizId, setEditingQuizId] = useState(null); // Track quiz ID being edited
    const [quizDetails, setQuizDetails] = useState({
      name: '',
      duration: '',
      startTime: '',
    });
    const [quizzes, setQuizzes] = useState([]);
    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
        } else if (role === 'teacher') {
          setTeacher(true);
        }
        fetchQuizzes();
    }, [role]);
    useEffect(() => {
        const timeout = setTimeout(() => {
          if (uploadAlert) {
            resetUploadAlert();
          }
          if (deleteAlert) {
            resetDeleteAlert();
          }
        }, 4000);
        return () => clearTimeout(timeout);
      }, [uploadAlert, deleteAlert, waitAlert]);
    const course = courses.find(course => course._id === currentCourseID);
    const fetchQuizzes = async () => {
        try {
          const response = await axios.get(`${apiUrl}/quiz/${currentCourseID}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(response.data)
          const quizzesWithFormattedTime = response.data.quizzes.map(async quiz => {
            const availabilityResponse = await axios.get(`${apiUrl}/quiz/availability/${quiz._id}`);
            const { available } = availabilityResponse.data;
            const endTime = new Date(quiz.startTime).getTime() + quiz.duration * 60000;
            return {
              ...quiz,
              available,
              endTime: endTime,
              formattedStartDate: format(new Date(quiz.startTime), 'PP'),
              formattedStartTime: format(new Date(quiz.startTime), 'hh:mm a'),
              formattedEndTime: format(new Date(endTime), 'hh:mm a'),
              formattedQuizStartTime: format(new Date(quiz.startTime), 'PPpp')
            };
          });
          const quizzesData = await Promise.all(quizzesWithFormattedTime);
          setQuizzes(quizzesData);
          updateQuizzesAvailability(quizzesData); // Update availability state
        } catch (error) {
            console.error("Error fetching quizzes: ", error);
        }
    };

    const updateQuizzesAvailability = (quizzesData) => {
        const availabilityMap = {};
        quizzesData.forEach(quiz => {
          availabilityMap[quiz._id] = quiz.available;
        });
        setQuizzesAvailability(availabilityMap);
    };
    console.log(quizzes)
    // const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
    // if (isLoading || !course) {
    //   return <LoadingSpinner />;
    // }

    const handleAttemptQuizClick = (quiz) => {
        const currentTime = new Date();
        const quizStartTime = new Date(quiz.startTime);
        if (currentTime >= quizStartTime) {
            setShowFinishedQuiz(false);
        }
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
      setCurrentQuestion({ ...currentQuestion, correctAnswerIndex: index });
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
      setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswerIndex: null });
      setHighlightedAnswer(currentQuestion.correctAnswerIndex); // Highlight correct answer after saving
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
        setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswerIndex: null });
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
    };
  
    const handleSubmitQuiz = async () => {
        setWaitAlert({ variant: 'info', message: 'Deleting... please wait' });

        const payload = {
          title: quizDetails.name,
          duration: quizDetails.duration,
          startTime: quizDetails.startTime,
          courseId: currentCourseID,
          questions: questions.map(q => ({
            question: q.question,
            answers: q.answers,
            correctAnswerIndex: q.correctAnswerIndex
          }))
        };
      
        try {
            startFileOperation();
            if (editingQuizId) {
                await axios.patch(`${apiUrl}/quiz/${editingQuizId}`, payload, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUploadAlert({ variant: 'primary', message: 'Quiz updated successfully!' });
            } else {
                await axios.post(`${apiUrl}/quiz`, payload, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUploadAlert({ variant: 'primary', message: 'Quiz created successfully!' });
            }
        } catch (error) {
            console.error('Error creating/updating quiz:', error);
        } finally {
            handleExitCreateQuiz();
            fetchQuizzes();
            resetWaitAlert();
        }
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
      });
    };

    const handleEditQuiz = (quiz) => {
        if (quiz.grades.length === 0) {
            setCreateQuiz(true);
            setEditingQuizId(quiz._id); // Set quiz ID being edited
            // Fetch quiz details and populate form (if needed)
            const quizToEdit = quizzes.find(quiz => quiz._id);
            if (quizToEdit) {
            setQuestions(quizToEdit.questions);
            setCurrentQuestion({ question: '', answers: ['', '', '', ''] });
            setQuizDetails({
                name: quizToEdit.title,
                duration: quizToEdit.duration,
                startTime: quizToEdit.startTime,
            });
            }
        }
    };

    const handleQuizDelete = async (quizId) => {
        setWaitAlert({ variant: 'info', message: 'Deleting... please wait' });

        try {
            const response = await axios.delete(`${apiUrl}/quiz/${quizId}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            startFileOperation();
            if (response.status === 200 || response.status === 201) {
                setDeleteAlert({ variant: 'primary', message: 'Quiz deleted successfully!' });
                fetchQuizzes();
                handleExitCreateQuiz();
                setQuizzes([]);
                setEditingQuizId(null);
            } else {
                setDeleteAlert({ variant: 'danger', message: `Failed to delete quiz: ${response.statusText}` });
            }
        } catch (error) {
            setDeleteAlert({ variant: 'danger', message: `Error deleting quiz: ${error.message}` });
        } finally {
            finishFileOperation();
            resetWaitAlert();
        }
    };
  
    const isSaveDisabled = !currentQuestion.question.trim() || currentQuestion.answers.some(answer => !answer.trim()) || currentQuestion.correctAnswerIndex == null;
    const isSubmitDisabled = questions.length === 0 || !quizDetails.name.trim() || !quizDetails.startTime.trim();
    const isOpenModalDisabled = questions.length === 0;
    const isCreateQuizDisabled = quizzes.length !== 0;
console.log(quizzesAvailability)

  return (
    <div>
      {uploadAlert && (
        <Alert variant={uploadAlert.variant} onClose={() => resetUploadAlert()} dismissible>
          {uploadAlert.message}
        </Alert>
      )}
      {deleteAlert && (
        <Alert variant={deleteAlert.variant} onClose={() => resetDeleteAlert()} dismissible>
          {deleteAlert.message}
        </Alert>
      )}
      {waitAlert && (
        <Alert variant={waitAlert.variant}>
          {waitAlert.message}
        </Alert>
      )}
        {student && (
            <>
                {showFinishedQuiz && !showQuiz && Array.isArray(quizzes) && quizzes.length !== 0 && quizzesAvailability && new Date(quizzes[0].endTime) > new Date() && (
                  <>
                    {quizzes && quizzes.map((quiz, index) => (
                      <>
                        {quiz.grades.length === 0 && (
                            <Row key={index} className='quizzes-container' style={{ margin: "0", padding: "0"}}>
                                <Col style={{ margin: "0", padding: "0"}} className='quiz-col2'>
                                    <div className='aQ-container'>
                                        <div className='quiz-header'>
                                            <ul className='q-head'>
                                                <li>{course.name}</li>
                                            </ul>
                                        </div>
                                        <div className='attempt-quiz' onClick={() => handleAttemptQuizClick(quiz)} 
                                            style={{
                                                cursor: new Date(quiz.startTime) <= new Date() ? 'pointer' : 'not-allowed',
                                                pointerEvents: new Date(quiz.startTime) <= new Date() ? 'auto' : 'none',
                                            }}
                                        >
                                            <div className='aQName-container'>
                                                <h5 className='aQ-name'>Quiz - {quiz.title}</h5>
                                                <h6 className='ass-zeros'>starts at: {quiz.formattedQuizStartTime}</h6>
                                            </div>
                                            <button className='aQ-btn'>
                                                Attempt Quiz
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                      </>
                    ))}
                  </>
                )}
                <div>
                    {!showFinishedQuiz && !showQuiz && quizzes && quizzes.map((quiz, index) =>(
                        <>
                            <Row key={index} style={{ margin: "0", padding: "0" }} className='attempt-container'>
                                <Col style={{ margin: "0", padding: "0"}}>
                                    <div className='aQ-container' style={{marginLeft: "0px"}}>
                                        <div className='quiz-header'>
                                            <ul className='q-head'>
                                                <li>{course.name}</li>
                                            </ul>
                                        </div>
                                        <div className='attempt-quiz'>
                                            <div className='aQName-container'>
                                                <h5 className='aQ-name'>Quiz - {quiz.title}</h5>
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
                                        {quiz.formattedStartDate}
                                    </p>
                                    <p>
                                        Open:     {quiz.formattedStartTime}
                                    </p>
                                    <p>
                                        Close:    {quiz.formattedEndTime}
                                    </p>
                                    <p>
                                        No. of questions: {quiz.questions.length}
                                    </p>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                <div>
                    {showQuiz && quizzes.length !== 0 && (
                        <>
                            <Quiz/>
                        </>
                    )}
                </div>
                {(quizzes.length === 0 || (quizzes.length > 0 && (quizzes[0].grades.length !== 0 || new Date(quizzes[0].endTime) <= new Date()))) && (
                    <div style=
                                {{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    paddingTop: '6%',
                                    fontSize: "125%"
                                }}
                    >
                        No quiz is currently available. Please check back later.
                    </div>
                )}
            </>
        )}
        {teacher && !waitAlert &&(
        <div>
            {!createQuiz && (
                <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexWrap: "wrap" }}>
                    <div style={{ margin: "auto" }}>
                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <button className='createQuiz-btn' onClick={handleCreateQuiz} disabled={isCreateQuizDisabled}>
                                Create quiz
                                <IoArrowForward style={{ padding: "2% 0 2% 3%", fontSize: "150%" }} />
                            </button>
                        </div>
                        {quizzes && quizzes.map((quiz, index) => (
                            <Row key={index} className='quizzes-container' style={{ margin: "3rem 0 0 0", padding: "0", justifyContent: "center" }}>
                                <Col style={{ margin: "0", padding: "0"}} className='quiz-col2'>
                                    <div className='aQ-container' style={{margin: "3rem 0 0 0 !important"}}>
                                        <div className='attempt-quiz' onClick={() => handleEditQuiz(quiz)} 
                                            style={{
                                                    cursor: quiz.grades.length === 0 ? 'pointer' : 'default',
                                                    // pointerEvents: quiz.grades.length === 0 ? 'auto' : 'none',
                                            }}
                                            title={quiz.grades.length === 0 ? `Edit quiz ${quiz.title}` : `Delete the last quiz first`}
                                        >
                                            <div className='aQName-container'>
                                                <h5 className='aQ-name'>Quiz - {quiz.title}</h5>
                                                <h6 className='ass-zeros'>starts at: {quiz.formattedQuizStartTime}</h6>
                                            </div>
                                            <div className='downloadAss-container'>
                                                <a onClick={(event) => { event.stopPropagation(); handleQuizDelete(quiz._id);}} className='delete-ass'>
                                                    <MdOutlineDeleteOutline className='deleteAss-icon' title='Delete' style={{cursor: "pointer"}}/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </div>
                    <div className='quizIcon-container'>
                        <img src={quizIcon} alt="Quiz Icon" className= 'quiz-icon' />
                    </div>
                </div>
            )}
            {createQuiz && (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }} className='mt-3'>
                        <h2>{editingQuizId ? 'Edit Quiz' : 'Create Quiz'}</h2>
                        <button onClick={handleExitCreateQuiz} style={{ background: 'none', border: 'none', fontSize: '24px' }}>
                            <IoClose style={{fontSize: "150%"}}/>
                        </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "99%" }}>
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
                                    checked={currentQuestion.correctAnswerIndex === 0}
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
                                </FloatingLabel>
                            </div>
                            </Col>
                            <Col md={12} style={{padding: "0 1rem"}}>
                            <div className='tAnswer-container'>
                                <Form.Check 
                                    type="radio" 
                                    name="correctAnswer" 
                                    id="correctAnswerB" 
                                    checked={currentQuestion.correctAnswerIndex === 1}
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
                                checked={currentQuestion.correctAnswerIndex === 2}
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
                                </FloatingLabel>
                            </div>
                            </Col>
                            <Col md={12} style={{padding: "0 1rem"}}>
                            <div className='tAnswer-container'>
                            <Form.Check 
                                type="radio" 
                                name="correctAnswer" 
                                id="correctAnswerD" 
                                checked={currentQuestion.correctAnswerIndex === 3}
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
                                        <span className={q.correctAnswerIndex === idx ? 'correct-answer-text' : ''}>
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
                                {/* <FloatingLabel controlId="floatingEndTime" label="End Time" className="mb-3">
                                <Form.Control
                                    type="datetime-local"
                                    placeholder="Enter end time"
                                    name="endTime"
                                    value={quizDetails.endTime}
                                    onChange={handleQuizDetailsChange}
                                />
                                </FloatingLabel> */}
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
                                {editingQuizId ? 'Update Quiz' : 'Upload Quiz'}
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