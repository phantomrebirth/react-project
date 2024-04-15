import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
import { IoAdd } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";

const Reminder = () => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  const handleNoteSave = () => {
    if (noteTitle.trim() === '' || noteBody.trim() === '') {
      alert('Please fill in both title and body for the note.');
      return;
    }

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const newNote = {
      title: noteTitle,
      body: noteBody,
      date: new Date().toLocaleDateString('en-US', options),
    };

    if (selectedNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[selectedNoteIndex] = newNote;
      setNotes(updatedNotes);
    } else {
      // setNotes([newNote, ...notes]); to display the last one first
      setNotes([...notes, newNote]);
    }

    setNoteTitle('');
    setNoteBody('');
    setShowNoteForm(false);
    setSelectedNoteIndex(null);
  };

  const handleCloseNoteForm = () => {
    setNoteTitle('');
    setNoteBody('');
    setShowNoteForm(false);
    setSelectedNoteIndex(null);
  };

  const handleEditNote = (index) => {
    const selectedNote = notes[index];
    setNoteTitle(selectedNote.title);
    setNoteBody(selectedNote.body);
    setShowNoteForm(true);
    setSelectedNoteIndex(index);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const handleOptionsButtonClick = (index) => {
    document.getElementById(`dropdown-${index}`).click();
  };

  return (
    <Container className='reminder-container' style={{ margin: "0" }}>
      <Row>
        {!showNoteForm && (
          <Col md={5} lg={3} xl={3} xxl={3} className='reminder-card'>
            <Card style={{ padding: "0" }} className='addR-container' onClick={() => setShowNoteForm(true)}>
              <Card.Body>
                <Card.Title className='addReminder-body'>
                  <IoAdd className='addReminder-icon'/>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        )}
        {!showNoteForm && notes.map((note, index) => (
          <Col key={index} md={5} lg={3} xl={3} xxl={3} className='reminder-card'>
            <Card style={{ padding: "0" }} className='addedR-container'>
              <Card.Body className='addedReminder-body'>
                <Card.Title className='addedReminder-title'>
                  {note.title}
                </Card.Title>
                <Card.Text className='addedReminder-text'>
                  {note.body}
                </Card.Text>
                <Card.Footer style={{ padding: "0" }} className='addedR-footer'>
                  <div id='reminder-date'>
                    <span className="ml-auto" >{note.date}</span>
                  </div>
                  <div className='reminderO-container'>
                    <SlOptions  onClick={() => handleOptionsButtonClick(index)} className='reminder-options'/>
                  </div>
                  <Dropdown className="dropdown" style={{display: "contents"}}>
                    <Dropdown.Toggle variant="success" id={`dropdown-${index}`} style={{display: "none"}}/>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEditNote(index)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteNote(index)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
};

export default Reminder;


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
