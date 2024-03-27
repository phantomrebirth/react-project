import React, { useRef, useState } from 'react'
import { ImUpload } from "react-icons/im";
import { Button, Form } from 'react-bootstrap';

const AIProjects = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);

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
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles([...files]);
  };

  const handleUpButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='projects-container'>
      <div className='project-inProgress'>
        <div className='project-container'>
          <div className='projectH-container'>
            <ul className='project-header'>
              <li>Project 1</li>
            </ul>
          </div>
          <div className='project'>
            <div className='projectName-container'>
              <h5 className='project-name'>AI Project</h5>
              <h6 className='project-zeros'>00.00.0000</h6>
            </div>
            <button className='project-btn' style={{cursor: "unset"}}>
              In progress
            </button>
          </div>
        </div>
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
      </div>
      <div className='projectDescription-container'>
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
      </div>
    </div>
  );
};

export default AIProjects;