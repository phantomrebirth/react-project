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
import { useDispatch, useSelector } from 'react-redux';
import { navigateToAssignment } from '../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Button, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import { selectRole } from '../redux/slices/authSlice';
import { fetchCourses, selectCourses } from '../redux/slices/coursesSlice';
import LoadingSpinner from '../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from 'react-icons/hi';
import { PDFDocument } from 'pdf-lib';

const AllAssignments = () => {
  
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  const [showFirstAssignment, setShowFirstAssignment] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [submittedAssignmentId, setSubmittedAssignmentId] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [up, setUp] = useState(false)
  const [clickedAssignmentId, setClickedAssignmentId] = useState(null);
  const [clickedCourseId, setClickedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);
  
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
  }, 1000);
  
    return () => clearTimeout(timer);
  }, []);

  const { data: courses, currentCourseId } = useSelector(selectCourses);  

  useEffect(() => {
    if (!loading) {
      const allAssignments = courses.flatMap(course => {
        return course.assignments.map(assignment => ({
          ...assignment,
          courseId: course._id,
          course: course.name
        }));
      });
      setSubmittedAssignments(allAssignments);
    }
  }, [courses, loading]);
  
  const handleChange = (event) => {
    setDescription(event.target.value);
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
    
    // Clear after submission
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };
  
  const handleInProgressClick = (assignmentId, courseId) => {
    // Update the submitted assignment ID with the clicked assignment's ID
    setSubmittedAssignmentId(assignmentId);
    setClickedAssignmentId(assignmentId);
    setClickedCourseId(courseId);
    console.log('Submitted assignment ID:', assignmentId);
    console.log('course ID:', courseId);
    setShowFirstAssignment(false);
    setUp(true);
    dispatch(navigateToAssignment());
  };
  
  const assignmentPath = `https://ezlearn.onrender.com/course/getAssignments/${clickedCourseId}/${clickedAssignmentId}`;
  
  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };
  
  const handleAssignmentDownload = async (assignment) => {
    const { filename } = assignment;
    try {
      const response = await fetch(assignmentPath);
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
    setShowFirstAssignment(true);
    setSubmittedAssignmentId(null); // Reset the submitted assignment ID
    setSelectedFiles([]); // Clear selected files
    setDescription(''); // Clear description
    setUp(false); // Reset the "in progress" state
  };
  
  if (loading) {
    return <LoadingSpinner/>;
  }
  
  return (
    <>
      {student && (
        <>
          <Row style={{ marginLeft: "1%", marginRight: "0", marginBottom: "0", padding: "0"}} className='mt-3 assignments-container'>
            {!up && submittedAssignments.map((assignment, index) => (
              <React.Fragment key={index}>
                {(assignment._id !== submittedAssignmentId) && !assignment.submitted && (
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
                            <li>{assignment.course}</li>
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

export default AllAssignments;