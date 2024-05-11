import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigateToAssignment } from '../../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import { selectRole, selectToken } from '../../redux/slices/authSlice';
import { resetDeleteAlert, resetUploadAlert, selectCourses, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from 'react-icons/hi';
import { PDFDocument } from 'pdf-lib';
import { IoAdd } from 'react-icons/io5';
import { VscFiles } from 'react-icons/vsc';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import axios from 'axios';

const Assignments = () => {
  
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const token = useSelector(selectToken);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [assignmentsPaths, setAssignmentsPaths] = useState([]);
  const [submittedAssignmentId, setSubmittedAssignmentId] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [assignmentName, setAssignmentName] = useState('');
  const [tUploaded, setTUploaded] = useState();
  const [tUpload, setTUpload] = useState();
  const [up, setUp] = useState(false)
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);
  const { coursesLoading, assignmentsLoading, data: courses, currentCourseId } = useSelector(selectCourses);
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
  if (coursesLoading || assignmentsLoading || !course) {
    return <LoadingSpinner />;
  }
  useEffect(() => {
  const assignmentPath = course.assignments.map(assignment => `https://ezlearn.onrender.com/course/getAssignments/${currentCourseId}/${assignment._id}`);
  const assignmentsPaths = course.assignments.map(assignment => {
    const matchingPath = assignmentPath.find(path => path.includes(assignment._id));
    return {
      ...assignment,
      path: matchingPath || ''
    };
  });
  setAssignmentsPaths(assignmentsPaths || []);
  }, [currentCourseId]);
  useEffect(() => {
    setSubmittedAssignments(assignmentsPaths);
  }, [course, assignmentsPaths]);
  
  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAssignmentNameChange = (event) => {
    setAssignmentName(event.target.value);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Selected files:', selectedFiles);
    // Find the index of the submitted assignment in the submittedAssignments array
    const submittedIndex = submittedAssignments.findIndex(assignment => assignment._id === submittedAssignmentId);
    
    if (submittedIndex !== -1) {
      // Create a copy of the submittedAssignments array
      const updatedAssignmentsPaths = [...submittedAssignments];
      
      // Update the submitted assignment's status to "submitted"
      updatedAssignmentsPaths[submittedIndex] = {
        ...updatedAssignmentsPaths[submittedIndex],
        submitted: true // Assuming "submitted" is a boolean field
      };
      
      // Update the state with the modified submittedAssignments array
      setSubmittedAssignments(updatedAssignmentsPaths); // Update state with modified array
      // setSubmittedAssignmentId(null); // Reset the submitted assignment ID
      console.log('Submitted assignment:', updatedAssignmentsPaths[submittedIndex]);
    } else {
      console.log('Submitted assignment not found!');
    }
    
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
    
    // // Make the API call to submit the assignment
    // try {
    //   const formData = new FormData();
    //   formData.append('assignment', selectedFiles); // Assuming only one file is selected
    //   formData.append('description', description); // Add any additional metadata
    
    //   const response = await fetch('', {
    //     method: 'POST',
    //     body: formData,
    //     // Add any necessary headers, such as authentication tokens or content-type
    //   });
    
    //   if (response.ok) {
    //     console.log('Assignment submitted successfully');
    //     // Handle any further actions after successful submission
    //   } else {
    //     console.error('Failed to submit assignment');
    //     // Handle error scenarios
    //   }
    // } catch (error) {
    //   console.error('Error submitting assignment:', error);
    //   // Handle network errors or other exceptions
    // }
  };
  
  const handleInProgressClick = (assignmentId) => {
    // Update the submitted assignment ID with the clicked assignment's ID
    setSubmittedAssignmentId(assignmentId);
    console.log('Submitted assignment ID:', assignmentId);
    setUp(true);
    dispatch(navigateToAssignment());
  };
  
  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };
  
  const handleAssignmentDownload = async (assignment) => {
    const { filename, path } = assignment;
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
    setSubmittedAssignmentId(null);
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };

  const handleTUpload = () => {
    setTUpload(true);
  };

  const handleTUploaded = (assignmentId) => {
    setTUploaded(true);
    setSubmittedAssignmentId(assignmentId);
  };

  const handleAssignmentNameClick = (assignment) => {
    if (assignment.path) {
      window.open(assignment.path, '_blank');
    };
  };

  const handleAssignmentUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData();
    // Append selected files to the FormData object
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('assignments', selectedFiles[i]);
    }
    formData.append('name', assignmentName); // Append assignment name to FormData
    if (!uploadAlert && !deleteAlert) {
      dispatch(setWaitAlert({ variant: 'info', message: 'Uploading... please wait' }));
    }
    try {
      const response = await axios.post(`https://ezlearn.onrender.com/course/assignments/${currentCourseId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log('test')
        const { assignmentId } = response.data;
        console.log(assignmentId);
        const uploadedAssignment = {
          _id: assignmentId,
          filename: selectedFiles[0].name,
        };
        const updatedAssignments = [...submittedAssignments, uploadedAssignment];
        setSubmittedAssignments(updatedAssignments);
        dispatch(setUploadAlert({ variant: 'primary', message: 'assignment uploaded successfully!' }));
      } else {
        dispatch(setUploadAlert({ variant: 'danger', message: `Failed to upload assignment: ${response.statusText}` }));
      }
    } catch (error) {
      dispatch(setUploadAlert({ variant: 'danger', message: `Error uploading assignment: ${error.message}` }));
    }
  };

  const handleAssignmentDelete = async (assignment) => {
    if (!uploadAlert && !deleteAlert) {
      dispatch(setWaitAlert({ variant: 'info', message: 'Deleting... please wait' }));
    }

    try {
      const response = await axios.delete(`https://ezlearn.onrender.com/course/deleteAssignments/${currentCourseId}/${assignment._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        dispatch(setDeleteAlert({ variant: 'primary', message: 'Assignment deleted successfully!' }));
        const updatedAssignments = submittedAssignments.filter(item => item._id !== assignment._id);
        setSubmittedAssignments(updatedAssignments);
      } else {
        dispatch(setDeleteAlert({ variant: 'danger', message: `Failed to delete assignment: ${response.statusText}` }));
      }
    } catch (error) {
      dispatch(setDeleteAlert({ variant: 'danger', message: `Error deleting assignment: ${error.message}` }));
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
            {!up && submittedAssignments.map((assignment, index) => (
              <React.Fragment key={index}>
                {(assignment._id !== submittedAssignmentId) && !assignment.submitted && (
                  <Col key={index} style={{ margin: "0", padding: "0"}} className='asscol2'>
                    <div className="assignment-container2">
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                          <li>{course.name}</li>
                        </ul>
                      </div>
                      <div className='assignment'
                           onClick={() => handleInProgressClick(assignment._id)}
                           style={{cursor: "pointer", backgroundColor: "#f0f0f0"}}
                           title='Open Assignmet'
                      >
                        <div className='assName-container'>
                          <h5 className='ass-name'>{assignment.filename}</h5>
                          <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                        </div>
                        <button className='ass-btn2'>
                          In progress
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
                {(assignment._id === submittedAssignmentId || assignment.submitted) && (
                  <Col key={index} style={{ margin: "0", padding: "0"}} className='asscol1'>
                    <div className='assignment-container'>
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                          <li>{course.name}</li>
                        </ul>
                      </div>
                      <div key={assignment.filename} className='assignment'>
                        <div className='assName-container'>
                          <h5 className='ass-name'>{assignment.filename}</h5>
                          <h6 className='ass-zeros'>uploaded {assignment.uploaded} - submitted {assignment.submitted}</h6>
                        </div>
                        <button className='ass-btn' style={{cursor: "unset"}}>
                          {assignment.submitted ? "Submitted" : "Done"}
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
          {up && (
            <>
              <Row>
                <div className='inProgress-ass'>
                  <Col md={7} lg={7} xl={7}>
                    <div className="assignment-container2" style={{marginLeft: "0px"}}>
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                            <li>{course.name}</li>
                        </ul>
                      </div>
                      {submittedAssignments.map((assignment, index) => (
                        <React.Fragment key={index}>
                          {(assignment._id === submittedAssignmentId) && (
                            <div className='assignment' key={index}
                                 onClick={() => handleAssignmentDownload(assignment)}
                                 style={{cursor: "pointer"}}
                                 title={`Download ${assignment.filename}`}
                            >
                              <div className='assName-container'>
                                <h5 className='ass-name'>{assignment.filename}</h5>
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
                  <Col md={5} lg={5} xl={5} style={{marginLeft: "21px"}}>
                    <div className='upAss-container'>
                      <label htmlFor='assignmentInput' className='headUp-ass' title='Click to select files'>
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
                    <Button variant="primary" type="submit" className='ass-submit' disabled={selectedFiles.length === 0}>
                        Submit
                    </Button>
                    <Button variant="danger" className='ass-cancel' onClick={handleCancel}>
                      Close
                    </Button>
                  </Form>
              </div>
            </>
          )}
        </>
      )}
      {teacher && (
        <>
          {!tUpload && !tUploaded && (
            <>
              {/* {submittedAssignments.map((assignment, index) => ( */}
                <Container className='mt-5' style={{display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
                  <div style={{width: "100%"}}>
                    <div className='tUpload'>
                      <button className='tUpload-btn' title='Add assignment' onClick={handleTUpload}>
                        <IoAdd className='tUpload-icon'/>
                      </button>
                      <button className='tUploaded-btn' title='Open assignments' onClick={() => handleTUploaded()}>
                        <VscFiles className='tUploaded-icon'/>
                        Uploaded
                      </button>
                    </div>
                  </div>
                </Container>
              {/* ))} */}
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
                                      placeholder="Enter assignment name"
                                      // name="name"
                                      value={assignmentName} 
                                      onChange={handleAssignmentNameChange}
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
                    <Col md={4} lg={4} xl={4} style={{marginLeft: "21px"}}>
                      <div className='upAss-container'>
                        <label htmlFor='assignmentInput' className='headUp-ass' title='Click to select files'>
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
                  {/* <h4>Assignment Description</h4> */}
                    <Form onSubmit={handleAssignmentUpload}>
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
                {submittedAssignments.map((assignment, index) => (
                  <React.Fragment key={index}>
                    <Col key={index} style={{ margin: "0", padding: "1% 0"}} className='asscol2'>
                      <div className='assignment'
                           key={index}
                           onClick={() => handleAssignmentNameClick(assignment)}
                           style={{cursor: "pointer"}}
                           title={`Open ${assignment.filename}`}
                      >
                        <div className='assName-container'>
                          <h5 className='ass-name'>{assignment.filename}</h5>
                          <h6 className='ass-zeros'>uploaded 00/00 - deadline 00/00</h6>
                        </div>
                        <div className='downloadAss-container'>
                          <a onClick={(event) => { event.stopPropagation(); handleAssignmentDelete(assignment);}} className='delete-ass'>
                            <MdOutlineDeleteOutline className='deleteAss-icon' title='Delete'/>
                          </a>
                        </div>
                      </div>
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
              <Col className='mt-5'>
                <Button variant="danger" className='ass-cancel' onClick={handleCancel} style={{margin: "0"}}>
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

export default Assignments;