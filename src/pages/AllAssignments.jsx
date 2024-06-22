// import React from 'react'
// import CVAssignments from '../components/courses/computer-vision/CVAssignments';
// import ProgrammingAssignments from '../components/courses/programming/ProgrammingAssignments';
// import AIAssignments from '../components/courses/artificial-intelligence/AIAssignments';
// import NetworkAssignments from '../components/courses/network/NetworkAssignments';
// import SWAssignments from '../components/courses/software-engineering/SWAssignments';
// import { Container, Row, Col } from 'react-bootstrap'

// const Assignments = () => {
//   return (
//     <Container  fluid className='mt-4 side-assContainer'>
//       <Row style={{width: "100%"}}>
//         <Row  className='side-assRow'>
//           <Col style={{padding: "1.2%"}} xl={12} lg={12}>
//             <CVAssignments/>
//           </Col>
//           <Col style={{padding: "1.2%"}} xl={12} lg={12}>
//             <ProgrammingAssignments/>
//           </Col>
//           <Col style={{padding: "1.2%"}} xl={12} lg={12}>
//             <SWAssignments/>
//           </Col>
//         </Row>
//         <Row  className='side-assRow'>
//           <Col style={{padding: "1.2%"}} xl={12} lg={12}>
//             <AIAssignments/>
//           </Col>
//           <Col style={{padding: "1.2%"}} xl={12} lg={12}>
//             <NetworkAssignments/>
//           </Col>
//         </Row>
//       </Row>
//     </Container>
//   );
// };

// export default Assignments;

import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { navigateToAssignment } from '../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Button, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
// import { selectRole } from '../redux/slices/authSlice';
// import { fetchCourses, selectCourses } from '../redux/slices/coursesSlice';
import LoadingSpinner from '../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from 'react-icons/hi';
import { PDFDocument } from 'pdf-lib';
import { finishFileOperation, getCourseAssignment, getCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, setDeleteAlert, setUploadAlert, setWaitAlert, startFileOperation } from '../redux/actions/courses';
import { login } from '../redux/actions/auth';

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString(); // This will display only the date part
};

const AllAssignments = 
({
    role,
    token, 
    isLoading, 
    assignmentIsLoading, 
    courseAssignmentData,
    courses,
    // currentCourseID,
    getCourses,
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
  
//   const dispatch = useDispatch();
//   const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  // const [showFirstAssignment, setShowFirstAssignment] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [submittedAssignmentId, setSubmittedAssignmentId] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [up, setUp] = useState(false)
  const [clickedAssignmentId, setClickedAssignmentId] = useState(null);
  const [clickedCourseId, setClickedCourseId] = useState(null);

  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
    getCourses();
  }, [role, courseAssignmentData]);
//   const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
  useEffect(() => {
    if (!isLoading || !assignmentIsLoading) {
      const allAssignments = courses.flatMap(course => course.assignments.map(assignment => {
          const formattedAssignment = {
            ...assignment,
            courseId: course._id,
            course: course.name,
            uploadtime: formatDateTime(assignment.uploadtime), // Assuming formatDateTime is a function that formats the date
            deadline: formatDateTime(assignment.deadline),
          };
          if (assignment.solutions && assignment.solutions.length > 0) {
            const formattedSolutions = assignment.solutions.map(solution => ({
              ...solution,
              uploadtime: formatDateTime(solution.uploadtime), // Format each solution's uploadtime
            }));
            formattedAssignment.solutions = formattedSolutions;
          }
    
          return formattedAssignment;
        }));
      setSubmittedAssignments(allAssignments);
    }
  }, [courses, isLoading, assignmentIsLoading]);
  
  const handleChange = (event) => {
    setDescription(event.target.value);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Find the index of the submitted assignment in the submittedAssignments array
    const submittedIndex = submittedAssignments.findIndex(assignment => assignment._id === submittedAssignmentId);
  
    if (submittedIndex !== -1) {
      // Create a copy of the submittedAssignments array
      const updatedAssignments = [...submittedAssignments];
  
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
  
        const response = await fetch(`https://glorious-expert-koala.ngrok-free.app/course/assignments/solution/${clickedCourseId}/${clickedAssignmentId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`,
          },
        });
  
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
  
  const handleInProgressClick = (assignmentId, courseId) => {
    setSubmittedAssignmentId(assignmentId);
    setClickedAssignmentId(assignmentId);
    setClickedCourseId(courseId);
    console.log('Submitted assignment ID:', assignmentId);
    console.log('course ID:', courseId);
    // setShowFirstAssignment(false);
    setUp(true);
    // dispatch(navigateToAssignment());
  };
  
  const assignmentPath = `https://glorious-expert-koala.ngrok-free.app/course/getAssignments/${clickedCourseId}/${clickedAssignmentId}`;
  
  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const handleAssignmentDownload = async (assignment) => {
    const { filename } = assignment;
    console.log(filename);
    console.log(assignmentPath);
    console.log(assignment);
    try {
      const response = await fetch(assignmentPath, {
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
    // setShowFirstAssignment(true);
    setSubmittedAssignmentId(null);
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };
  
  if (isLoading || assignmentIsLoading) {
    return <LoadingSpinner/>;
  }
  console.log(submittedAssignments)
  console.log(submittedAssignmentId)
  console.log(clickedAssignmentId)
  
  return (
    <>
      {student && (
        <>
          <Row style={{ marginLeft: "1%", marginRight: "0", marginBottom: "0", padding: "0"}} className='mt-3 assignments-container'>
            {!up && submittedAssignments.map((assignment, index) => (
              <React.Fragment key={index}>
                {(assignment._id !== submittedAssignmentId && assignment.solutions.length === 0) && (
                  <Col key={index} style={{ margin: "0", padding: "0"}} className='asscol2'>
                    <div className="assignment-container2">
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                          <li>{assignment.course}</li>
                        </ul>
                      </div>
                      <div className='assignment' onClick={() => handleInProgressClick(assignment._id, assignment.courseId)} style={{cursor: "pointer", backgroundColor: "#f0f0f0"}} title='Open Assignmet'>
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
                            <li>{assignment.course}</li>
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
            <div style={{marginLeft: "1%"}}>
              <Row>
                <div className='inProgress-ass'>
                  <Col md={7} lg={7} xl={7}>
                    <div className="assignment-container2" style={{marginLeft: "0px"}}>
                      <div className='assignment-header'>
                        <ul className='ass-h'>
                          {submittedAssignments.map((assignment, index) => {
                            if (assignment._id === submittedAssignmentId) {
                              return <li key={index}>{assignment.course}</li>;
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                      {submittedAssignments.map((assignment, index) => (
                        <React.Fragment key={index}>
                          {(assignment._id === submittedAssignmentId) && (
                            <div className='assignment' key={index} onClick={() => handleAssignmentDownload(assignment)} style={{cursor: "pointer"}} title={`Download ${assignment.filename}`}>
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
            </div>
          )}
          {courses[0].assignments.length === 0 && (
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
        </>
      )}
      {teacher && (
        <div>_</div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  role: state.auth.role,
  token: state.auth.token,
  courses: state.courses.coursesData,
  // currentCourseID: state.courses.currentCourseID,
  isLoading: state.courses.isLoading,
  courseAssignmentData: state.courses.courseAssignmentData,
  assignmentIsLoading: state.courses.assignmentIsLoading,
  deleteAlert: state.courses.deleteAlert,
  uploadAlert: state.courses.uploadAlert,
  waitAlert: state.courses.waitAlert,
  error: state.courses.error,
  isFileOperationInProgress: state.courses.isFileOperationInProgress
});

export default connect(mapStateToProps,
    {
      login,
      getCourseAssignment,
      getCourses,
      setUploadAlert,
      setWaitAlert,
      setDeleteAlert,
      resetUploadAlert,
      resetDeleteAlert,
      resetWaitAlert,
      startFileOperation,
      finishFileOperation,
    })
(AllAssignments);