import React, { useEffect, useState } from 'react';
// import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { Container, Card, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
import { IoAdd } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { IoArrowForward } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import { login } from '../redux/actions/auth';
import { connect } from 'react-redux';
import axios from 'axios';
import apiUrl from '../components/ApiUrl';

const Reminder = 
({
  token,
  role
}) => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteIds, setNoteIds] = useState([]);
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
      fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/getReminder/all`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedNotes = response.data.map(note => ({
        ...note,
        formattedDate: new Date(note.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      setNotes(formattedNotes);
      console.log(response.data)
      setNoteIds(response.data.map(note => note._id)); // Store the note IDs
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleNoteSave = async () => {
    if (noteTitle.trim() === '' || noteBody.trim() === '') {
      alert('Please fill in both title and body for the note.');
      return;
    }

    const newNote = {
      title: noteTitle,
      note: noteBody,
    };

    try {
      if (selectedNoteIndex !== null) {
        const noteID = noteIds[selectedNoteIndex];
        await axios.delete(`${apiUrl}/reminders/${noteID}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const response = await axios.post(`${apiUrl}/reminders`, newNote, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
      });
      const savedNote = {
        ...response.data,
        formattedDate: new Date(response.data.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
      setNotes([savedNote, ...notes]); // Add new note at the beginning
      setNoteIds([savedNote._id, ...noteIds]); // Add new note ID at the beginning

      await fetchNotes();
      setNoteTitle('');
      setNoteBody('');
      setShowNoteForm(false);
      setSelectedNoteIndex(null);
    } catch (error) {
      console.error('Error posting the note to the backend:', error);
    }
  };

  const handleCloseNoteForm = () => {
    setNoteTitle('');
    setNoteBody('');
    setShowNoteForm(false);
    setSelectedNoteIndex(null);
  };

  const handleEditNote = (index) => {
    const originalIndex = notes.length - 1 - index; // Adjust the index for the reversed array
    const selectedNote = notes[originalIndex];
    setNoteTitle(selectedNote.title);
    setNoteBody(selectedNote.note);
    setShowNoteForm(true);
    setSelectedNoteIndex(originalIndex);
  };

  const handleDeleteNote = async (noteID) => {
    try {
      await axios.delete(`${apiUrl}/reminders/${noteID}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchNotes(); // Fetch notes again to update the UI
    } catch (error) {
      console.error('Error deleting the note:', error);
    }
  };

  // const handleDeleteNote = (index) => {
  //   const updatedNotes = [...notes];
  //   updatedNotes.splice(index, 1);
  //   setNotes(updatedNotes);
  // };

  const handleOptionsButtonClick = (index) => {
    document.getElementById(`dropdown-${index}`).click();
  };

  return (
    <Container className='reminder-container' style={{ margin: "0" }}>
      <Row>
        {!showNoteForm && teacher && (
          <Col md={5} lg={3} xl={3} xxl={3} className='reminder-card'>
            <Card style={{ padding: "0" }} className='addR-container' onClick={() => setShowNoteForm(true)} title='Create note'>
              <Card.Body>
                <Card.Title className='addReminder-body'>
                  <IoAdd className='addReminder-icon'/>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        )}
        {!showNoteForm && notes.slice().reverse().map((note, index) => (
          <Col key={index} md={5} lg={3} xl={3} xxl={3} className='reminder-card'>
            <Card style={{ padding: "0" }} className='addedR-container'>
              <Card.Body className='addedReminder-body'>
                <Card.Title className='addedReminder-title'>
                  {note.title}
                </Card.Title>
                <Card.Text className='addedReminder-text'>
                  {note.note}
                </Card.Text>
                <Card.Footer style={{ padding: "0" }} className='addedR-footer'>
                  <div id='reminder-date'>
                    <span className="ml-auto" >{note.formattedDate}</span>
                  </div>
                  {teacher && (
                    <>
                      <div className='reminderO-container'>
                        <SlOptions  onClick={() => handleOptionsButtonClick(index)} className='reminder-options'/>
                      </div>
                      <Dropdown className="dropdown" style={{display: "contents"}}>
                        <Dropdown.Toggle variant="success" id={`dropdown-${index}`} style={{display: "none"}}/>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEditNote(index)}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDeleteNote(note._id)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {showNoteForm && (
        <Container className='note-container' style={{ padding: "0", marginLeft: "1rem" }}>
        <Form className='mt-5'>
          <Row>
            <Col xs={10} sm={8} md={5} lg={3} xg={2} style={{ padding: "0" }}>
              <Form.Label className='note-label'>
                Add Note
              </Form.Label>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xg={1} className='x-container' style={{ padding: "0" }}>
              <Button variant="link" 
                      onClick={handleCloseNoteForm} 
                      tabIndex="-1" 
                      className='close-noteBtn'
                      >
                        X
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={10} sm={8} md={5} lg={3} xg={2}>
              <Form.Group controlId="noteTitle">
                {/* <Form.Label>Title</Form.Label> */}
                <Form.Control
                  placeholder='Title'
                  className='noteH-input'
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={10} sm={8} md={5} lg={3} xg={2}>
              <Form.Group controlId="noteBody" className='noteB-text'>
                {/* <Form.Label>Note</Form.Label> */}
                <Form.Control
                  placeholder='Note'
                  className='noteB-input'
                  as="textarea"
                  rows={9}
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleNoteSave} className='save-noteBtn'>
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      )}
    </Container>
  );
  // const [createQuiz, setCreateQuiz] = useState(false);
  // const [questions, setQuestions] = useState([]);
  // const [currentQuestion, setCurrentQuestion] = useState({ question: '', answers: ['', '', '', ''] });
  // const [editingIndex, setEditingIndex] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  // const [highlightedAnswer, setHighlightedAnswer] = useState(null);
  // const [quizDetails, setQuizDetails] = useState({
  //   name: '',
  //   duration: '',
  //   startTime: '',
  //   endTime: ''
  // });

  // const handleCreateQuiz = () => {
  //   setCreateQuiz(true);
  // };

  // const handleExitCreateQuiz = () => {
  //   setShowModal(false);
  //   setCreateQuiz(false);
  //   setQuestions([]);
  //   setCurrentQuestion({ question: '', answers: ['', '', '', ''] });
  //   setEditingIndex(null);
  //   setQuizDetails({
  //     name: '',
  //     duration: '',
  //     startTime: '',
  //     endTime: ''
  //   });
  // };

  // const handleQuestionChange = (e) => {
  //   setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  // };

  // const handleAnswerChange = (index, value) => {
  //   const newAnswers = [...currentQuestion.answers];
  //   newAnswers[index] = value;
  //   setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  // };

  // const handleCorrectAnswerChange = (index) => {
  //   setCurrentQuestion({ ...currentQuestion, correctAnswer: index });
  // };

  // const handleSaveQuestion = () => {
  //   const newQuestions = [...questions];
  //   if (editingIndex !== null) {
  //     newQuestions[editingIndex] = currentQuestion;
  //     setEditingIndex(null);
  //   } else {
  //     newQuestions.push(currentQuestion);
  //   }
  //   setQuestions(newQuestions);
  //   setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswer: null });
  //   setHighlightedAnswer(currentQuestion.correctAnswer); // Highlight correct answer after saving
  // };

  // const handleEditQuestion = (index) => {
  //   setCurrentQuestion(questions[index]);
  //   setEditingIndex(index);
  // };

  // const handleDeleteQuestion = (index) => {
  //   const newQuestions = questions.filter((_, i) => i !== index);
  //   setQuestions(newQuestions);
  //   if (editingIndex !== null && editingIndex === index) {
  //     setEditingIndex(null);
  //     setCurrentQuestion({ question: '', answers: ['', '', '', ''], correctAnswer: null });
  //   } else if (editingIndex !== null && editingIndex > index) {
  //     setEditingIndex(editingIndex - 1);
  //   }
  // };

  // const handleSubmitQuiz = () => {
  //   const payload = {
  //     quizDetails,
  //     questions
  //   };
  //   console.log(payload)
  //   fetch('YOUR_BACKEND_ENDPOINT', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Success:', data);
  //     // Clear everything after successful submission
  //     // handleExitCreateQuiz();
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  //   handleExitCreateQuiz()
  // };

  // const handleQuizDetailsChange = (e) => {
  //   const { name, value } = e.target;
  //   setQuizDetails({ ...quizDetails, [name]: value });
  // };

  // const handleOpenModal = () => {
  //   setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   setQuizDetails({
  //     name: '',
  //     duration: '',
  //     startTime: '',
  //     endTime: ''
  //   });
  // };

  // const isSaveDisabled = !currentQuestion.question.trim() || currentQuestion.answers.some(answer => !answer.trim()) || currentQuestion.correctAnswer === null;
  // const isSubmitDisabled = questions.length === 0 || !quizDetails.name.trim() || !quizDetails.duration.trim() || !quizDetails.startTime.trim() || !quizDetails.endTime.trim();
  // const isOpenModalDisabled = questions.length === 0

  // return (
  //   <div>
  //     {!createQuiz && (
  //       <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "69vh" }}>
  //         <button className='createQuiz-btn' onClick={handleCreateQuiz}>
  //           Create quiz
  //           <IoArrowForward style={{ padding: "2% 0 0 3%", fontSize: "126%" }} />
  //         </button>
  //       </div>
  //     )}
  //     {createQuiz && (
  //       <div>
  //         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }} className='mt-3'>
  //           <h2>Create Quiz</h2>
  //           <button onClick={handleExitCreateQuiz} style={{ background: 'none', border: 'none', fontSize: '24px' }}>
  //             <IoClose style={{fontSize: "150%"}}/>
  //           </button>
  //         </div>
  //         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
  //           <div className='tQuestion-container'>
  //             <FloatingLabel controlId="floatingTextarea2" label={`Question ${editingIndex !== null ? editingIndex + 1 : questions.length + 1}`} className='tQuestion'>
  //               <Form.Control
  //                 as="textarea"
  //                 placeholder="Leave your question here"
  //                 value={currentQuestion.question}
  //                 onChange={handleQuestionChange}
  //                 style={{ height: '100px' }}
  //               />
  //             </FloatingLabel>
  //           </div>
  //         </div>
  //         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
  //           <div className='tAnswers-container' style={{ padding: "0", margin: "0" }}>
  //             <Row className='tAll-answers' style={{ padding: "0", margin: "0" }}>
  //               <Col md={12} style={{padding: "0 1rem"}}>
  //                 <div className='tAnswer-container'>
  //                 <Form.Check 
  //                   type="radio" 
  //                   name="correctAnswer" 
  //                   id="correctAnswerA" 
  //                   checked={currentQuestion.correctAnswer === 0}
  //                   onChange={() => handleCorrectAnswerChange(0)}
  //                   style={{ marginRight: "10px" }}
  //                   className='correct-check'
  //                 />
  //                 <FloatingLabel
  //                   controlId="floatingInputA"
  //                   label="Answer A"
  //                   className="tAnswer"
  //                 >
  //                   <Form.Control
  //                     as="textarea"
  //                     placeholder="Write your answer"
  //                     value={currentQuestion.answers[0]}
  //                     onChange={(e) => handleAnswerChange(0, e.target.value)}
  //                   />
  //                     {/* <Form.Check 
  //                       type="radio" 
  //                       name="correctAnswer" 
  //                       id="correctAnswerA" 
  //                       label="Correct Answer" 
  //                       checked={currentQuestion.correctAnswer === 0}
  //                       onChange={() => handleCorrectAnswerChange(0)}
  //                     /> */}
  //                   </FloatingLabel>
  //                 </div>
  //               </Col>
  //               <Col md={12} style={{padding: "0 1rem"}}>
  //                 <div className='tAnswer-container'>
  //                   <Form.Check 
  //                     type="radio" 
  //                     name="correctAnswer" 
  //                     id="correctAnswerB" 
  //                     checked={currentQuestion.correctAnswer === 1}
  //                     onChange={() => handleCorrectAnswerChange(1)}
  //                     style={{ marginRight: "10px" }}
  //                     className='correct-check'
  //                   />
  //                   <FloatingLabel
  //                     controlId="floatingInputB"
  //                     label="Answer B"
  //                     className="tAnswer"
  //                   >
  //                     <Form.Control
  //                       as="textarea"
  //                       placeholder="Write your answer"
  //                       value={currentQuestion.answers[1]}
  //                       onChange={(e) => handleAnswerChange(1, e.target.value)}
  //                     />
  //                     {/* <Form.Check 
  //                       type="radio" 
  //                       name="correctAnswer" 
  //                       id="correctAnswerB" 
  //                       label="Correct Answer" 
  //                       checked={currentQuestion.correctAnswer === 1}
  //                       onChange={() => handleCorrectAnswerChange(1)}
  //                     /> */}
  //                   </FloatingLabel>
  //                 </div>
  //               </Col>
  //             </Row>
  //             <Row className='tAll-answers' style={{ padding: "0", margin: "0" }}>
  //               <Col md={12} style={{padding: "0 1rem"}}>
  //                 <div className='tAnswer-container'>
  //                 <Form.Check 
  //                   type="radio" 
  //                   name="correctAnswer" 
  //                   id="correctAnswerC" 
  //                   checked={currentQuestion.correctAnswer === 2}
  //                   onChange={() => handleCorrectAnswerChange(2)}
  //                   style={{ marginRight: "10px" }}
  //                   className='correct-check'
  //                 />
  //                   <FloatingLabel
  //                     controlId="floatingInputC"
  //                     label="Answer C"
  //                     className="tAnswer"
  //                   >
  //                     <Form.Control
  //                       as="textarea"
  //                       placeholder="Write your answer"
  //                       value={currentQuestion.answers[2]}
  //                       onChange={(e) => handleAnswerChange(2, e.target.value)}
  //                     />
  //                     {/* <Form.Check 
  //                       type="radio" 
  //                       name="correctAnswer" 
  //                       id="correctAnswerC" 
  //                       label="Correct Answer" 
  //                       checked={currentQuestion.correctAnswer === 2}
  //                       onChange={() => handleCorrectAnswerChange(2)}
  //                     /> */}
  //                   </FloatingLabel>
  //                 </div>
  //               </Col>
  //               <Col md={12} style={{padding: "0 1rem"}}>
  //                 <div className='tAnswer-container'>
  //                 <Form.Check 
  //                   type="radio" 
  //                   name="correctAnswer" 
  //                   id="correctAnswerD" 
  //                   checked={currentQuestion.correctAnswer === 3}
  //                   onChange={() => handleCorrectAnswerChange(3)}
  //                   style={{ marginRight: "10px" }}
  //                   className='correct-check'
  //                 />
  //                   <FloatingLabel
  //                     controlId="floatingInputD"
  //                     label="Answer D"
  //                     className="tAnswer"
  //                   >
  //                     <Form.Control
  //                       as="textarea"
  //                       placeholder="Write your answer"
  //                       value={currentQuestion.answers[3]}
  //                       onChange={(e) => handleAnswerChange(3, e.target.value)}
  //                     />
  //                     {/* <Form.Check 
  //                       type="radio" 
  //                       name="correctAnswer" 
  //                       id="correctAnswerD" 
  //                       label="Correct" 
  //                       checked={currentQuestion.correctAnswer === 3}
  //                       onChange={() => handleCorrectAnswerChange(3)}
  //                       style={{marginLeft: "1%"}}
  //                     /> */}
  //                   </FloatingLabel>
  //                 </div>
  //               </Col>
  //             </Row>
  //           </div>
  //         </div>
  //         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: '20px' }}>
  //           <Button onClick={handleSaveQuestion} disabled={isSaveDisabled} className='tSave-question'>
  //             {editingIndex !== null ? 'Update Question' : 'Save Question'}
  //           </Button>
  //         </div>
  //         <div style={{ marginTop: '20px' }}>
  //           {questions.map((q, index) => (
  //             <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
  //               <div>Question {index + 1}: {q.question}</div>
  //               <ul>
  //                 {q.answers.map((answer, idx) => (
  //                   <li key={idx}>
  //                     answer {String.fromCharCode(65 + idx)}: &nbsp; {/* Add a non-breaking space */}
  //                     <span className={q.correctAnswer === idx ? 'correct-answer-text' : ''}>
  //                       {answer}
  //                     </span>
  //                   </li>
  //                 ))}
  //               </ul>
  //               <Button variant="secondary" onClick={() => handleEditQuestion(index)}>
  //                 Edit
  //               </Button>
  //               <Button variant="danger" onClick={() => handleDeleteQuestion(index)} style={{ marginLeft: '10px' }}>
  //                 Delete
  //               </Button>
  //             </div>
  //           ))}
  //         </div>
  //         <Modal show={showModal} onHide={handleCloseModal}>
  //           <Modal.Header closeButton>
  //             <Modal.Title>Quiz Details</Modal.Title>
  //           </Modal.Header>
  //           <Modal.Body>
  //             <Form>
  //               <FloatingLabel controlId="floatingName" label="Quiz Name" className="mb-3">
  //                 <Form.Control
  //                   type="text"
  //                   placeholder=""
  //                   name="name"
  //                   value={quizDetails.name}
  //                   onChange={handleQuizDetailsChange}
  //                 />
  //               </FloatingLabel>
  //               <FloatingLabel controlId="floatingDuration" label="Duration (minutes)" className="mb-3">
  //                 <Form.Control
  //                   type="number"
  //                   placeholder=""
  //                   name="duration"
  //                   value={quizDetails.duration}
  //                   onChange={handleQuizDetailsChange}
  //                 />
  //               </FloatingLabel>
  //               <FloatingLabel controlId="floatingStartTime" label="Start Time" className="mb-3">
  //                 <Form.Control
  //                   type="datetime-local"
  //                   placeholder="Enter start time"
  //                   name="startTime"
  //                   value={quizDetails.startTime}
  //                   onChange={handleQuizDetailsChange}
  //                 />
  //               </FloatingLabel>
  //               <FloatingLabel controlId="floatingEndTime" label="End Time" className="mb-3">
  //                 <Form.Control
  //                   type="datetime-local"
  //                   placeholder="Enter end time"
  //                   name="endTime"
  //                   value={quizDetails.endTime}
  //                   onChange={handleQuizDetailsChange}
  //                 />
  //               </FloatingLabel>
  //             </Form>
  //           </Modal.Body>
  //           <Modal.Footer>
  //             <Button variant="secondary" onClick={handleCloseModal}>
  //               Close
  //             </Button>
  //             <Button
  //               onClick={handleSubmitQuiz}
  //               variant="primary"
  //               disabled={isSubmitDisabled}
  //               className='tUpload-quizBtn'
  //               >
  //                 Upload Quiz
  //             </Button>
  //           </Modal.Footer>
  //         </Modal>
  //         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: '20px' }}>
  //           <Button
  //             variant="primary"
  //             onClick={handleOpenModal}
  //             disabled={isOpenModalDisabled}
  //             className='tSubmit-quizBtn'
  //             title='Click to confirm details'
  //           >
  //             Submit Quiz
  //           </Button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  role: state.auth.role,
})

export default connect(mapStateToProps, { login })(Reminder);


{/* <Card.Footer style={{ padding: "0" }} className='addedR-footer'> */}

// import React, { useState, useEffect } from 'react';
// import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';

// const Reminder = () => {
//   const [showNoteForm, setShowNoteForm] = useState(false);
//   const [notes, setNotes] = useState([]);
//   const [noteTitle, setNoteTitle] = useState('');
//   const [noteBody, setNoteBody] = useState('');

//   // Simulated user ID
//   const userId = '123';

//   // Function to fetch notes from backend API
//   const fetchNotes = async () => {
//     try {
//       const response = await fetch(`/api/notes/${userId}`);
//       const data = await response.json();
//       setNotes(data.notes);
//     } catch (error) {
//       console.error('Error fetching notes:', error);
//     }
//   };

//   // Fetch notes when component mounts
//   useEffect(() => {
//     fetchNotes();
//   }, []); // Empty dependency array to run only once

//   // Function to save a new note
//   const saveNote = async () => {
//     if (noteTitle.trim() === '' || noteBody.trim() === '') {
//       alert('Please fill in both title and body for the note.');
//       return;
//     }

//     const newNote = {
//       title: noteTitle,
//       body: noteBody,
//     };

//     try {
//       const response = await fetch(`/api/notes/${userId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newNote),
//       });
//       if (response.ok) {
//         // If the request was successful, fetch updated notes
//         fetchNotes();
//         setNoteTitle('');
//         setNoteBody('');
//         setShowNoteForm(false);
//       } else {
//         console.error('Failed to save note');
//       }
//     } catch (error) {
//       console.error('Error saving note:', error);
//     }
//   };

//   const handleCloseNoteForm = () => {
//     setNoteTitle('');
//     setNoteBody('');
//     setShowNoteForm(false);
//   };

//   return (
//     <Container>
//       <Row>
//         {!showNoteForm && (
//           <Col>
//             <Card style={{ width: '18rem' }} onClick={() => setShowNoteForm(true)}>
//               <Card.Body>
//                 <Card.Title>Add Note</Card.Title>
//                 <Card.Text>
//                   Click here to add a new note.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         )}
//         {!showNoteForm && notes.map((note, index) => (
//           <Col key={index}>
//             <Card style={{ width: '18rem' }}>
//               <Card.Body>
//                 <Card.Title>{note.title}</Card.Title>
//                 <Card.Text>
//                   {note.body}
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//       {showNoteForm && (
//         <Container>
//           <Form>
//             <Form.Group controlId="noteTitle">
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={noteTitle}
//                 onChange={(e) => setNoteTitle(e.target.value)}
//               />
//               <Button variant="link" onClick={handleCloseNoteForm}>X</Button>
//             </Form.Group>
//             <Form.Group controlId="noteBody">
//               <Form.Label>Note</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={noteBody}
//                 onChange={(e) => setNoteBody(e.target.value)}
//               />
//             </Form.Group>
//             <Button variant="primary" onClick={saveNote}>
//               Save Note
//             </Button>
//           </Form>
//         </Container>
//       )}
//     </Container>
//   );
// };

// export default Reminder;