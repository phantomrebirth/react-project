import React, { useEffect, useRef, useState } from 'react';
import { ImUpload } from "react-icons/im";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { selectRole } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { PDFDocument } from 'pdf-lib';
import { HiOutlineDownload } from 'react-icons/hi';

const Projects = () => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [submittedProjectId, setSubmittedProjectId] = useState(null);
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const [up, setUp] = useState(false)
  // const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
    dispatch(fetchCourses());
  }, [role, dispatch]);
  const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //       setLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);
  

  const course = courses.find(course => course._id === currentCourseId);
  const projectPath = course.projects.map(project => `https://ezlearn.onrender.com/course/getProjects/${currentCourseId}/${project._id}`);
  const projectsPaths = course ? course.projects.map(project => {
    const matchingPath = projectPath.find(path => path.includes(project._id));
    return {
      ...project,
      path: matchingPath || ''
    };
  }): [];
  
  useEffect(() => {
    setSubmittedProjects(projectsPaths);
  }, [course]);

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Selected files:', selectedFiles);
    
    const submittedIndex = submittedProjects.findIndex(project => project._id === submittedProjectId);
    
    if (submittedIndex !== -1) {
      const updatedProjectsPaths = [...submittedProjects];
      
      updatedProjectsPaths[submittedIndex] = {
        ...updatedProjectsPaths[submittedIndex],
        submitted: true
      };
  
      setSubmittedProjects(updatedProjectsPaths);
      console.log('Submitted assignment:', updatedProjectsPaths[submittedIndex]);
    } else {
      console.log('Submitted assignment not found!');
    }
    
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };

  const handleInProgressClick = (projectId) => {
    setSubmittedProjectId(projectId);
    console.log('Submitted project ID:', projectId);
    setUp(true);
  };
  
  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };
  
  const handleProjectDownload = async (project) => {
    const { filename, path } = project;
    try {
      const response = await fetch(path);
      const fileData = await response.arrayBuffer();
      
      const pdfDoc = await PDFDocument.load(fileData);
      const newPdfDoc = await PDFDocument.create();

      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      
      pages.forEach((page) => {
        newPdfDoc.addPage(page);
      });
      
      const pdfBytes = await newPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    };
  }; 
  
  const handleCancel = () => {
    setSubmittedProjectId(null);
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };
  
  const handleUpButtonClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {student && (
      <>
          <Row style={{ margin: "0", padding: "0"}} className='assignments-container' key={course._id}>
            {!up && submittedProjects.map((project, index) => (
              <React.Fragment key={index}>
                {(project._id !== submittedProjectId) && !project.submitted && (
                  <Col key={index} style={{ margin: "0", padding: "0"}} className='asscol2'>
                    <div className="assignment-container2">
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                          <li>{course.name}</li>
                        </ul>
                      </div>
                      <div className='project' onClick={() => handleInProgressClick(project._id)} style={{cursor: "pointer", backgroundColor: "#f0f0f0"}} title='Open Assignmet'>
                        <div className='projectName-container'>
                          <h5 className='project-name'>{project.filename}</h5>
                          <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                        </div>
                        <button className='project-btn'>
                          In progress
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
                {(project._id === submittedProjectId || project.submitted) && (
                  <Col style={{margin: "0", padding: "0"}}>
                    <div className='project-container'>
                      <div className='projectH-container'>
                        <ul className='project-header'>
                          <li>{course.name}</li>
                        </ul>
                      </div>
                      <div className='project'>
                        <div className='projectName-container'>
                          <h5 className='project-name'>{project.filename} project</h5>
                          <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                        </div>
                        <button className='project-btn' style={{cursor: "unset", backgroundColor: "#7939ff"}}>
                          Submitted
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
          {up && (
        <Container className='projects-container' style={{margin: "0", padding: "0"}} fluid>
          <Row className='project-inProgress' style={{margin: "0", padding: "0"}}>
            <Col style={{margin: "0", padding: "0"}}>
              <div className='project-container'>
                <div className='projectH-container'>
                  <ul className='project-header'>
                    <li>{course.name}</li>
                  </ul>
                </div>
                {submittedProjects.map((project, index) => (
                        <React.Fragment key={index}>
                          {(project._id === submittedProjectId) && (
                            <div className='project' key={index} onClick={() => handleProjectDownload(project)} style={{cursor: "pointer"}} title={`Download ${project.filename}`}>
                              <div className='projectName-container'>
                                <h5 className='ass-name'>{project.filename}</h5>
                                <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                              </div>
                              <div className='downloadAss-container'>
                                <a>
                                  <HiOutlineDownload className='downloadFile-icon' title='Download' style={{ fontSize: "192%" }}/>
                                </a>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
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
                  <button className='projectUp-btn' onClick={handleUpButtonClick} title='Select file'>
                    <div className='projectUp-icon-container'>
                      <ImUpload className='projectUp-icon'/>
                    </div>
                    Upload Project
                  </button>
                </label>
                <Form onSubmit={handleSubmit} className='project-submit'>
                  <Button variant='primary' type='submit' className='project-submitBtn' disabled={selectedFiles.length === 0}>
                    Confirm
                  </Button>
                </Form>
                <div style={{height: "22vh", display: "flex", marginLeft: "7%"}} className='project-cancel'>
                  <Button variant="danger" className='project-cancelBtn' onClick={handleCancel} style={{height: "max-content"}}>
                      Close
                  </Button>
                </div>
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
          </Container>
          )}
      </>
      )}
      {teacher && (
        <div>_</div>
      )}
    </>
  );
};

export default Projects;