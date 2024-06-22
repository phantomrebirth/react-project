import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { navigateToAssignment } from '../../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
// import { selectRole, selectToken } from '../../redux/slices/authSlice';
// import { resetDeleteAlert, resetUploadAlert, selectCourses, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from 'react-icons/hi';
import { PDFDocument } from 'pdf-lib';
import { IoAdd } from 'react-icons/io5';
import { VscFiles } from 'react-icons/vsc';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import axios from 'axios';
// import { selectAssignmentsPaths, selectSubmittedAssignments, setAssignmentsPaths, setSubmittedAssignments, updateAssignmentsPaths } from '../../redux/slices/assignmentsSlice';
import { login } from '../../redux/actions/auth';
import { finishFileOperation, getCourseAssignment, getCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, setDeleteAlert, setUploadAlert, setWaitAlert, startFileOperation } from '../../redux/actions/courses';
import { useParams } from 'react-router-dom';

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString(); // This will display only the date part
};

const Assignments = 
 ({ 
  role, 
  token, 
  isLoading, 
  assignmentIsLoading, 
  courseAssignmentData,
  courses, 
  getCourses,
  getCourseAssignment,
  waitAlert,
  uploadAlert,
  deleteAlert,
  setWaitAlert,
  setDeleteAlert,
  setUploadAlert,
  resetDeleteAlert,
  resetUploadAlert,
  resetWaitAlert,
  currentCourseID,
  isFileOperationInProgress,
  startFileOperation,
  finishFileOperation,
 }) => {
  const dispatch = useDispatch();
  // const { path } = useParams();
  // const role = useSelector(selectRole);
  // const token = useSelector(selectToken);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  // const assignmentsPaths = useSelector(selectAssignmentsPaths);
  // const submittedAssignments = useSelector((state) => state.courses.courseAssignmentData || []);
  const [deadline, setDeadline] = useState(''); // State variable for deadline
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [submittedAssignmentId, setSubmittedAssignmentId] = useState(null);
  const [assignmentName, setAssignmentName] = useState('');
  const [tUploaded, setTUploaded] = useState();
  const [tUpload, setTUpload] = useState();
  const [up, setUp] = useState(false);
  const [tUp, setTUp] = useState();
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
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
  useEffect(() => {
    if (course && course.assignments && course.assignments.length > 0) {
      const basePath = `https://thankful-ample-shrimp.ngrok-free.app/course/getAssignments/${currentCourseID}/`;
      const assignments = course.assignments.map(assignment => {
        // Format assignment's uploadtime and deadline
        const formattedAssignment = {
          ...assignment,
          path: `${basePath}${assignment._id}`,
          uploadtime: formatDateTime(assignment.uploadtime), // Assuming formatDateTime is a function that formats the date
          deadline: formatDateTime(assignment.deadline),
        };  
        // Format solutions' uploadtime if solutions array exists
        if (assignment.solutions && assignment.solutions.length > 0) {
          const formattedSolutions = assignment.solutions.map(solution => ({
            ...solution,
            uploadtime: formatDateTime(solution.uploadtime), // Format each solution's uploadtime
          }));
          formattedAssignment.solutions = formattedSolutions;
        }

        return formattedAssignment;
      });
      setSubmittedAssignments(assignments);
      // localStorage.setItem('submittedAssignments', JSON.stringify(assignments));
      console.log(assignments)
    }
  }, [course, currentCourseID]);
  useEffect(() => {
    console.log('Submitted Assignments:', submittedAssignments);
  }, [submittedAssignments]);

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAssignmentNameChange = (event) => {
    setAssignmentName(event.target.value);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Find the index of the submitted assignment in the submittedAssignments array
    const submittedIndex = submittedAssignments.findIndex(assignment => assignment._id === submittedAssignmentId);
  
    if (submittedIndex !== -1) {
      // Create a copy of the submittedAssignments array
      const updatedAssignments = [...submittedAssignments];
      setWaitAlert({ variant: 'info', message: 'Uploading... please wait' })

      try {
        const formData = new FormData();
  
        if (selectedFiles && selectedFiles.length > 0) {
          for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('assignments-solution', selectedFiles[i], selectedFiles[i].name);
            const uploadDate = new Date().toLocaleDateString();
            formData.append('uploadtime', uploadDate);
          }
        } else {
          console.error('No files selected');
          return;
        }
  
        const response = await fetch(`https://thankful-ample-shrimp.ngrok-free.app/course/assignments/solution/${currentCourseID}/${submittedAssignmentId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`,
          },
        });
        startFileOperation();
        if (response.ok) {
          updatedAssignments[submittedIndex] = {
            ...updatedAssignments[submittedIndex],
            submitted: "Submitted",
            submittedtime: new Date().toLocaleDateString(),
          };
          getCourses()
          console.log(response.data)
          setSubmittedAssignments(updatedAssignments);
          setUploadAlert({ variant: 'primary', message: 'Assignment submitted successfully!' });
        } else {
          setUploadAlert({ variant: 'danger', message: `Failed to submit assignment: ${response.statusText}` });
        }
      } catch (error) {
        console.error('Error submitting assignment:', error);
        setUploadAlert({ variant: 'danger', message: `Error submitting assignment: ${error.message}` });
      } finally {
        finishFileOperation(); // Reset file operation status
        resetWaitAlert();
      }
    } else {
      console.log('Submitted assignment not found!');
    }
  
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };
  
  const handleInProgressClick = (assignmentId) => {
    setUp(true);
    setSubmittedAssignmentId(assignmentId);
  };
  
  const handleFileSelect = (event) => {
    const files = event.target.files;
    console.log('Files selected:', files);
    setSelectedFiles(files);
  };
  
  const handleAssignmentDownload = async (assignment) => {
    const { filename, path } = assignment;
    console.log(filename);
    console.log(path);
    console.log(assignment);
    try {
      const response = await fetch(path, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
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
    console.log(submittedAssignments)
  };

  const handleAssignmentNameClick = (assignment) => {
    if (assignment.path) {
      window.open(assignment.path, '_blank');
    };
  };

  const handleAssignmentUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData();
    // append selected files to the FormData object
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('assignments', selectedFiles[i]);
    }
    formData.append('filename', assignmentName);
    formData.append('deadline', deadline);
    formData.append('uploadtime', new Date().toISOString());
    // if (!uploadAlert && !deleteAlert) {
    //   dispatch(setWaitAlert({ variant: 'info', message: 'Uploading... please wait' }));
    setWaitAlert({ variant: 'info', message: 'Uploading... please wait' })
    // }
    try {
      const response = await axios.post(`https://thankful-ample-shrimp.ngrok-free.app/course/assignments/${currentCourseID}`, formData, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          // 'User-Agent': 'CustomUserAgent',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      startFileOperation(); // Set file operation in progress
      if (response.status === 200 || response.status === 201) {
        console.log('test')
        // dispatch(setUploadAlert({ variant: 'primary', message: 'assignment uploaded successfully!' }));
        const { assignmentId } = response.data;
        console.log(assignmentId);
        const uploadedAssignment = {
          _id: assignmentId,
          filename: selectedFiles[0].name,
          path: `https://thankful-ample-shrimp.ngrok-free.app/course/getAssignments/${currentCourseID}/${assignmentId}`,
          uploadtime: new Date().toLocaleDateString(),
          deadline: deadline,
          // submitted: "notSubmitted"
        };
        console.log(response.data)
        console.log(uploadedAssignment)
        setSubmittedAssignments(prevAssignments => [...prevAssignments, uploadedAssignment]);
        // const assignmentID = assignmentId;
        // getCourseAssignment({currentCourseID, assignmentID});
        // const updatedAssignments = [.uploadedAssignment];
        // const updatedSubmittedAssignments = [...assignmentsPaths, uploadedAssignment];
        // dispatch(updateAssignmentsPaths(updatedAssignments));
        // dispatch(setAssignmentsPaths(updatedAssignments));
        // console.log(assignmentsPaths)
        // console.log(submittedAssignments);
        getCourses();
        // dispatch(setSubmittedAssignments(updatedSubmittedAssignments));
        setTUp(true);
        setSelectedFiles([]);
        setAssignmentName('');
        setDeadline('');
        setUploadAlert({ variant: 'primary', message: 'Assignment uploaded successfully!' })
      } else {
        // dispatch(setUploadAlert({ variant: 'danger', message: `Failed to upload assignment: ${response.statusText}` }));
        setUploadAlert({ variant: 'danger', message: `Failed to upload assignment: ${response.statusText}` })
      }
    } catch (error) {
      // dispatch(setUploadAlert({ variant: 'danger', message: `Error uploading assignment: ${error.message}` }));
      setUploadAlert({ variant: 'danger', message: `Error uploading assignment: ${error.message}` })
    } finally {
      finishFileOperation(); // Reset file operation status
      resetWaitAlert();
    }
  };

  const handleAssignmentDelete = async (assignment) => {
    // if (!uploadAlert && !deleteAlert) {
      // dispatch(setWaitAlert({ variant: 'info', message: 'Deleting... please wait' }));
      setWaitAlert({ variant: 'info', message: 'Deleting... please wait' });
    // }

    try {
      const response = await axios.delete(`https://thankful-ample-shrimp.ngrok-free.app/course/deleteAssignments/${currentCourseID}/${assignment._id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          // 'User-Agent': 'CustomUserAgent',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      startFileOperation(); // Set file operation in progress
      if (response.status === 200 || response.status === 201) {
        // dispatch(setDeleteAlert({ variant: 'primary', message: 'Assignment deleted successfully!' }));
        setSubmittedAssignments(prevAssignments => prevAssignments.filter(item => item._id !== assignment._id));
        // const updatedAssignments = assignmentsPaths.filter(item => item._id !== assignment._id);
        // const updatedSubmittedAssignments = submittedAssignments.filter(item => item._id !== assignment._id);
        // const assignmentID = assignment._id;
        // getCourseAssignment({currentCourseID, assignmentID});
        getCourses();
        setDeleteAlert({ variant: 'primary', message: 'Assignment deleted successfully!' })
      } else {
        // dispatch(setDeleteAlert({ variant: 'danger', message: `Failed to delete assignment: ${response.statusText}` }));
        setDeleteAlert({ variant: 'danger', message: `Failed to delete assignment: ${response.statusText}` })
      }
    } catch (error) {
      // dispatch(setDeleteAlert({ variant: 'danger', message: `Error deleting assignment: ${error.message}` }));
      setDeleteAlert({ variant: 'danger', message: `Error deleting assignment: ${error.message}` })
    } finally {
      finishFileOperation(); // Reset file operation status
      resetWaitAlert();
    }
  };
  

  return (
    <>
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
      {Array.isArray(submittedAssignments) && submittedAssignments.length == 0 && tUploaded &&(
        <div style=
                    {{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      paddingTop: '6%'
                    }}
        >
          <p>No assignments yet.</p>
        </div>
      )}
      {student && (
        <>
          {Array.isArray(submittedAssignments) && submittedAssignments.length == 0 &&(
            <div style=
                        {{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          paddingTop: '6%'
                        }}
            >
              <p>No assignments yet.</p>
            </div>
          )}
          <Row style={{ margin: "0", padding: "0"}} className='assignments-container' key={course._id}>
          {!up && submittedAssignments && submittedAssignments.map((assignment, index) => (
              <React.Fragment key={index}>
                {(assignment._id !== submittedAssignmentId && assignment.solutions.length === 0) && (
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
                          <h6 className='ass-zeros'>Uploaded {assignment.uploadtime} - Deadline {assignment.deadline}</h6>
                        </div>
                        <button className='ass-btn2'>
                          In progress
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
                {(assignment._id === submittedAssignmentId || assignment.solutions.length !== 0) && (
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
                          <h6 className='ass-zeros'>Submitted {assignment.solutions.length > 0 ? assignment.solutions[0].uploadtime : '...'}</h6>
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
                      {submittedAssignments && submittedAssignments.map((assignment, index) => (
                        <React.Fragment key={index}>
                          {(assignment._id === submittedAssignmentId) && (
                            <div className='assignment' key={index}
                                 onClick={() => handleAssignmentDownload(assignment)}
                                 style={{cursor: "pointer"}}
                                 title={`Download ${assignment.filename}`}
                            >
                              <div className='assName-container'>
                                <h5 className='ass-name'>{assignment.filename}</h5>
                                <h6 className='ass-zeros'>Uploaded {assignment.uploadtime} - Deadline {assignment.deadline}</h6>
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
          {!tUpload && !tUploaded && !waitAlert && (
            <>
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
                        <Form.Control
                          className='pfEmail'
                          type="date"
                          placeholder="YYYY-MM-DD"
                          value={deadline} // Assuming 'deadline' is a state variable
                          onChange={(e) => setDeadline(e.target.value)} // Assuming 'setDeadline' updates the state
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
                {submittedAssignments && submittedAssignments.map((assignment, index) => (
                  <React.Fragment key={index}>
                    <Col key={index} style={{ margin: "0", padding: "1% 0"}} className='asscol2'>
                      <div className='assignment'
                           key={index}
                           onClick={() => handleAssignmentNameClick(assignment)}
                           style={{cursor: assignment.path ? "pointer" : "default"}}
                           title={assignment.path ? `Open ${assignment.filename}` : `Refresh to open new files`}
                      >
                        <div className='assName-container'>
                          <h5 className='ass-name'>{assignment.filename}</h5>
                          <h6 className='ass-zeros'>Uploaded {assignment.uploadtime} - Deadline {assignment.deadline}</h6>
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

const mapStateToProps = state => ({
  role: state.auth.role,
  token: state.auth.token,
  courses: state.courses.coursesData,
  currentCourseID: state.courses.currentCourseID,
  isLoading: state.courses.isLoading,
  courseAssignmentData: state.courses.courseAssignmentData,
  assignmentIsLoading: state.courses.assignmentIsLoading,
  deleteAlert: state.courses.deleteAlert,
  uploadAlert: state.courses.uploadAlert,
  waitAlert: state.courses.waitAlert,
  error: state.courses.error,
  isFileOperationInProgress: state.courses.isFileOperationInProgress,
});

export default connect(mapStateToProps,
  {
    login,
    getCourseAssignment,
    setUploadAlert,
    setWaitAlert,
    setDeleteAlert,
    resetUploadAlert,
    resetDeleteAlert,
    resetWaitAlert,
    startFileOperation,
    finishFileOperation,
    getCourses
  })
(Assignments);