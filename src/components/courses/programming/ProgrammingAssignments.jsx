import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigateToAssignment } from '../../../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Button, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import { selectRole } from '../../../redux/slices/authSlice';

const ProgrammingAssignments = () => {

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

  const dispatch = useDispatch();
  const [showFirstAssignment, setShowFirstAssignment] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [submited, setSubmited] = useState(false);

  const handleChange = (event) => {
    setDescription(event.target.value);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log('Selected files:', selectedFiles);
    console.log('Assignment description:', description);
    // clear after submission
    setSelectedFiles([]);
    setDescription('');
    setSubmited(true);
  };

  const handleInProgressClick = () => {
    setShowFirstAssignment(false);
    dispatch(navigateToAssignment());
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  return (
    <>
      {student && (
        <>
          <Row style={{ margin: "0", padding: "0"}} className='assignments-container'>
            {showFirstAssignment && !submited && (
            <>
              <Col style={{ margin: "0", padding: "0"}} className='asscol2'>
                <div className="assignment-container2">
                  <div className='assignment-header'>
                    <ul className='ass-h'>
                        <li>Programming</li>
                    </ul>
                  </div>
                  <div className='assignment' onClick={handleInProgressClick} style={{cursor: "pointer", backgroundColor: "#f0f0f0"}}>
                    <div className='assName-container'>
                      <h5 className='ass-name'>Assignment 1</h5>
                      <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                    </div>
                    <button className='ass-btn2'>
                        In progress
                    </button>
                  </div>
                </div>
              </Col>
            </>
            )}
          </Row>
          {!showFirstAssignment && !submited && (
            <>
              <Row>
                <div className='inProgress-ass'>
                  <Col md={7} lg={7} xl={7}>
                    <div className="assignment-container2" style={{marginLeft: "0px"}}>
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                            <li>Programming</li>
                        </ul>
                      </div>
                      <div className='assignment'>
                        <div className='assName-container'>
                          <h5 className='ass-name'>Assignment 1</h5>
                          <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                        </div>
                        <button className='ass-btn2' style={{cursor: "unset"}}>
                            In progress
                        </button>
                      </div>
                    </div>
                  </Col>
                  <Col md={5} lg={5} xl={5} style={{marginLeft: "21px"}}>
                    <div className='upAss-container'>
                      <label htmlFor='assignmentInput' className='headUp-ass'>
                        Upload Assignment
                        <TbFileUpload className='upAss-icon'/>
                      </label>
                      <input
                        id='assignmentInput'
                        type='file'
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        />
                    </div>
                  </Col>
                </div>
              </Row>
              <div className='description-container'>
                <h4>Assignment Description</h4>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="assignmentDescription">
                      <Form.Label>
                        Write your assignment description:
                      </Form.Label>
                      <Form.Control
                              as="textarea"
                              value={description}
                              onChange={handleChange}
                              rows={4}
                              className='description-area'
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className='ass-submit'>
                        Submit
                    </Button>
                  </Form>
              </div>
            </>
          )}
          {submited && (
            <>
              <Col style={{ margin: "0", padding: "0"}} className='asscol1'>
                <div className='assignment-container'>
                  <div className='assignment-header'>
                    <ul className='ass-h'>
                      <li>Programming</li>
                    </ul>
                  </div>
                  <div className='assignment'>
                    <div className='assName-container'>
                      <h5 className='ass-name'>Assignment 1</h5>
                      <h6 className='ass-zeros'>uploaded 00/00 - submitted 00/00</h6>
                    </div>
                    <button className='ass-btn' style={{cursor: "unset"}}>
                          Done
                    </button>
                  </div>
                </div>
              </Col>
            </>
          )}
        </>
      )}
      {teacher && (
        <div>_</div>
      )}
    </>
  );
};

export default ProgrammingAssignments;