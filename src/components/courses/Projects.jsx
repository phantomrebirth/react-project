import React, { useEffect, useRef, useState } from 'react';
import { ImUpload } from "react-icons/im";
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { selectRole, selectToken } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetDeleteAlert, resetUploadAlert, selectCourses, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { PDFDocument } from 'pdf-lib';
import { HiOutlineDownload } from 'react-icons/hi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { VscFiles } from 'react-icons/vsc';
import { IoAdd } from 'react-icons/io5';
import axios from 'axios';

const Projects = () => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const token = useSelector(selectToken);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [projectsPaths, setProjectsPaths] = useState([]);
  const [submittedProjectId, setSubmittedProjectId] = useState(null);
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [tUploaded, setTUploaded] = useState();
  const [tUpload, setTUpload] = useState();
  const [up, setUp] = useState(false)
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);
  const { coursesLoading, projectsLoading, data: courses, currentCourseId } = useSelector(selectCourses);
  const uploadAlert = useSelector(state => state.courses.uploadAlert);
  const deleteAlert = useSelector(state => state.courses.deleteAlert);
  const waitAlert = useSelector(state => state.courses.waitAlert);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (uploadAlert) {
        dispatch(resetUploadAlert());
      }
      if (deleteAlert) {
        dispatch(resetDeleteAlert());
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [uploadAlert, deleteAlert, waitAlert, dispatch]);
  const course = courses.find(course => course._id === currentCourseId);
  if (coursesLoading || projectsLoading || !course) {
    return <LoadingSpinner />;
  }
  useEffect(() => {
    const projectPath = course.projects.map(project => `https://ezlearn.onrender.com/course/getProjects/${currentCourseId}/${project._id}`);
    const projectsPaths = course.projects.map(project => {
      const matchingPath = projectPath.find(path => path.includes(project._id));
      return {
        ...project,
        path: matchingPath || ''
      };
    });
    setProjectsPaths(projectsPaths || []);
  }, [currentCourseId]);
  
  useEffect(() => {
    setSubmittedProjects(projectsPaths);
  }, [course, projectsPaths]);

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
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
    setTUpload(null);
    setTUploaded(null);
    setSubmittedProjectId(null);
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };
  
  const handleUpButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleTUpload = () => {
    setTUpload(true);
  };

  const handleTUploaded = (projectId) => {
    setTUploaded(true);
    setSubmittedProjectId(projectId);
  };

  const handleProjectNameClick = (project) => {
    if (project.path) {
      window.open(project.path, '_blank');
    };
  };


  const handleProjectUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData();
    // Append selected files to the FormData object
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('projects', selectedFiles[i]);
    }
    formData.append('name', projectName);
    if (!uploadAlert && !deleteAlert) {
      dispatch(setWaitAlert({ variant: 'info', message: 'Uploading... please wait' }));
    }
    try {
      const response = await axios.post(`https://ezlearn.onrender.com/course/projects/${currentCourseId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log('test')
        const { projectId } = response.data;
        console.log(projectId);
        const uploadedProject = {
          _id: projectId,
          filename: selectedFiles[0].name,
        };
        const updatedProjects = [...submittedProjects, uploadedProject];
        setSubmittedProjects(updatedProjects);
        dispatch(setUploadAlert({ variant: 'primary', message: 'project uploaded successfully!' }));
      } else {
        dispatch(setUploadAlert({ variant: 'danger', message: `Failed to upload project: ${response.statusText}` }));
      }
    } catch (error) {
      dispatch(setUploadAlert({ variant: 'danger', message: `Error uploading project: ${error.message}` }));
    }
  };

  const handleProjectDelete = async (project) => {
    if (!uploadAlert && !deleteAlert) {
      dispatch(setWaitAlert({ variant: 'info', message: 'Deleting... please wait' }));
    }

    try {
      const response = await axios.delete(`https://ezlearn.onrender.com/course/deleteProjects/${currentCourseId}/${project._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        dispatch(setDeleteAlert({ variant: 'primary', message: 'Project deleted successfully!' }));
        const updatedProjects = submittedProjects.filter(item => item._id !== project._id);
        setSubmittedProjects(updatedProjects);
      } else {
        dispatch(setDeleteAlert({ variant: 'danger', message: `Failed to delete project: ${response.statusText}` }));
      }
    } catch (error) {
      dispatch(setDeleteAlert({ variant: 'danger', message: `Error deleting project: ${error.message}` }));
    }
  };

  return (
    <>
      {uploadAlert && (
        <Alert variant={uploadAlert.variant} onClose={() => dispatch(setUploadAlert(null))} dismissible>
          {uploadAlert.message}
        </Alert>
      )}
      {deleteAlert && (
        <Alert variant={deleteAlert.variant} onClose={() => dispatch(setDeleteAlert(null))} dismissible>
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
        <>
          {!tUpload && !tUploaded && (
            <>
              <Container className='mt-5' style={{display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
                <div style={{width: "100%"}}>
                  <div className='tUpload'>
                    <button className='tUploadProject-btn' title='Add project' onClick={handleTUpload}>
                      <IoAdd className='tUpload-icon'/>
                    </button>
                    <button className='tUploadedProject-btn' title='Open projects' onClick={() => handleTUploaded()}>
                      <VscFiles className='tUploaded-icon'/>
                      Uploaded
                    </button>
                  </div>
                </div>
              </Container>
            </>
          )}
          {tUpload && !waitAlert &&(
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
              <div style={{width: "70%"}}>
                <Row className='mt-4'>
                  <div className='inProgress-ass'>
                    <Col >
                      <Form.Group controlId="formName" style={{width: "88%"}}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control className='pfEmail' 
                                      type="text"
                                      placeholder="Enter project name"
                                      // name="name"
                                      value={projectName} 
                                      onChange={handleProjectNameChange}
                        />
                      </Form.Group>
                      <div>
                      <Form.Group controlId="formDeadline" style={{width: "69%"}}>
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control className='pfEmail' 
                                      type="text"
                                      placeholder="00/00"
                                      name="name"
                                      // value={userData.name} 
                                      // onChange={(e) => setUserData(prevState => ({
                                      //                  ...prevState,
                                      //                  name: e.target.value
                                      // }))}
                        />
                      </Form.Group>
                      </div>
                    </Col>
                    <Col md={4} lg={4} xl={4}>
                      <input
                      ref={fileInputRef}
                      id='projectInput'
                      type='file'
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                      />
                      <label htmlFor='projectInput' className='headUp-project'>
                        <button className='projectUp-btn' onClick={handleUpButtonClick} title='Select file' style={{backgroundColor: "transparent", color: "#555", border: "2px solid #666"}}>
                          <div className='projectUp-icon-container'>
                            <ImUpload className='projectUp-icon' style={{color: "#555"}}/>
                          </div>
                          Upload Project
                        </button>
                      </label>
                    </Col>
                  </div>
                </Row>
                <div className='description-container'>
                  {/* <h4>Assignment Description</h4> */}
                    <Form onSubmit={handleProjectUpload}>
                      {/* <Form.Group controlId="assignmentDescription">
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
                      </Form.Group> */}
                      <Button variant="primary" type="submit" className='ass-submit' disabled={selectedFiles.length === 0}>
                        Confirm
                      </Button>
                      <Button variant="danger" className='ass-cancel' onClick={handleCancel}>
                        Close
                      </Button>
                    </Form>
                </div>
              </div>
            </div>
          )}
          {tUploaded && !waitAlert && (
            <div className='mt-4'>
              <Row style={{ margin: "0", padding: "0"}} className='assignments-container' key={course._id}>
              {submittedProjects.map((project, index) => (
                        <React.Fragment key={index}>
                                              <Col key={index} style={{ margin: "0", padding: "1% 0"}} className='asscol2'>
                            <div className='project' key={index} onClick={() => handleProjectNameClick(project)} style={{cursor: "pointer"}} title={`Open ${project.filename}`}>
                              <div className='projectName-container'>
                                <h5 className='ass-name'>{project.filename}</h5>
                                <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                              </div>
                              <div className='downloadAss-container'>
                              <a onClick={(event) => { event.stopPropagation(); handleProjectDelete(project);}} className='delete-project'>
                            <MdOutlineDeleteOutline className='deleteAss-icon' title='Delete' style={{color: "#f00"}}/>
                          </a>
                              </div>
                            </div>
                          </Col>
                        </React.Fragment>
                      ))}
              </Row>
              <Col className='mt-5'>
                <Button variant="danger" className='project-close' onClick={handleCancel} style={{margin: "0", border: "1px solid #7939ff", backgroundColor: "transparent", color: "#7939ff"}}>
                    Close
                </Button>
              </Col>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Projects;