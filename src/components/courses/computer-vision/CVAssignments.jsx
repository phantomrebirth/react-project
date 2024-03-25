import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { navigateToAssignment } from '../../../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Button, Form } from 'react-bootstrap';

const CVAssignments = () => {
  const dispatch = useDispatch();
  const [showFirstAssignment, setShowFirstAssignment] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');

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
    <div className='assignments-container'>
      {showFirstAssignment && (
       <>
        <div className='assignment-container'>
          <div className='assignment-header'>
            <ul className='ass-h'>
              <li>Assignment 1</li>
            </ul>
          </div>
          <div className='assignment'>
            <div className='assName-container'>
              <h5 className='ass-name'>CV Assignment</h5>
              <h6 className='ass-zeros'>00.00.0000</h6>
            </div>
            <button className='ass-btn'>Done</button>
          </div>
        </div>
        <div className="assignment-container2">
            <div className='assignment-header'>
            <ul className='ass-h'>
                <li>Assignment 2</li>
            </ul>
            </div>
            <div className='assignment'>
            <div className='assName-container'>
                <h5 className='ass-name'>Assignment 2</h5>
                <h6 className='ass-zeros'>00.00.0000</h6>
            </div>
            <button className='ass-btn2' onClick={handleInProgressClick}>
                In progress
            </button>
            </div>
        </div>
       </>
      )}
    </div>
      {!showFirstAssignment && (
       <>
        <div className='inProgress-ass'>
          <div className="assignment-container2" style={{marginLeft: "0px"}}>
            <div className='assignment-header'>
            <ul className='ass-h'>
                <li>Assignment 2</li>
            </ul>
            </div>
            <div className='assignment'>
            <div className='assName-container'>
                <h5 className='ass-name'>Assignment 2</h5>
                <h6 className='ass-zeros'>00.00.0000</h6>
            </div>
            <button className='ass-btn2'>
                In progress
            </button>
            </div>
          </div>
          <div className='upAss-container'>
              {/* Use label to trigger file input */}
              <label htmlFor='assignmentInput' className='headUp-ass'>
                Upload Assignment
                <TbFileUpload className='upAss-icon'/>
              </label>
              {/* file input, hidden */}
              <input
                id='assignmentInput'
                type='file'
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
          </div>
        </div>
        <div className='description-container'>
          <h4>Assignment Description</h4>
          <Form onSubmit={handleSubmit}>
              <Form.Group controlId="assignmentDescription">
              <Form.Label>Write your assignment description:</Form.Label>
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
    </>
  );
};

export default CVAssignments;