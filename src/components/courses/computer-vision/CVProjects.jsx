import React, { useEffect, useRef, useState } from 'react'
import { ImUpload } from "react-icons/im";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectRole } from '../../../redux/slices/authSlice';

const CVProjects = () => {

  const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  console.log(role);
  
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log('Selected files:', selectedFiles);
    console.log('Project description:', description);
    // clear after submission
    setSelectedFiles([]);
    setDescription('');
    setSubmitted(true);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles([...files]);
  };

  const handleUpButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {student && (
        <Container className='projects-container' style={{margin: "0", padding: "0"}} fluid>
          {!submitted && (
          <>
          <Row className='project-inProgress' style={{margin: "0", padding: "0"}}>
            <Col style={{margin: "0", padding: "0"}}>
              <div className='project-container'>
                <div className='projectH-container'>
                  <ul className='project-header'>
                    <li>Project 1</li>
                  </ul>
                </div>
                <div className='project'>
                  <div className='projectName-container'>
                    <h5 className='project-name'>CV Project</h5>
                    <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                  </div>
                  <button className='project-btn' style={{cursor: "unset"}}>
                    In progress
                  </button>
                </div>
              </div>
            </Col>
            <Col style={{margin: "0", padding: "0"}}>
              <div className='projectUp-container'>
                <input
                    ref={fileInputRef}
                    id='projectInput'
                    type='file'
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <label htmlFor='projectInput' className='headUp-project'>
                  <button className='projectUp-btn' onClick={handleUpButtonClick}>
                    <div className='projectUp-icon-container'>
                      <ImUpload className='projectUp-icon'/>
                    </div>
                    Upload Project
                  </button>
                </label>
                <Form onSubmit={handleSubmit} className='project-submit'>
                  <Button variant='primary' type='submit' className='project-submitBtn'>
                    Confirm
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
          <Row style={{ padding: "0"}} className='projectDescription-container'>
            <Col style={{margin: "0", padding: "0"}} className='projectD-col' md={12} lg={12} xl={9}>
              <h4>Project Description</h4>
              <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="projectDescription">
                  <Form.Label>Write your project description:</Form.Label>
                  <Form.Control
                      as="textarea"
                      value={description}
                      onChange={handleChange}
                      rows={4}
                      className='description-area'
                  />
                  </Form.Group>
              </Form>
            </Col>
          </Row>
          </>
          )}
          {submitted && (
          <>
            <Col style={{margin: "0", padding: "0"}}>
              <div className='project-container'>
                <div className='projectH-container'>
                  <ul className='project-header'>
                    <li>Project 1</li>
                  </ul>
                </div>
                <div className='project'>
                  <div className='projectName-container'>
                    <h5 className='project-name'>CV Project</h5>
                    <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                  </div>
                  <button className='project-btn' style={{cursor: "unset", backgroundColor: "#7939ff"}}>
                    Submitted
                  </button>
                </div>
              </div>
            </Col>
          </>
          )}
        </Container>
      )}
      {teacher && (
        <div>_</div>
      )}
    </>
  );
};

export default CVProjects;