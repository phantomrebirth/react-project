import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigateToAssignment } from '../../redux/slices/assignmentSlice';
import { TbFileUpload } from "react-icons/tb";
import { Button, Form } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import { selectRole } from '../../redux/slices/authSlice';
import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from 'react-icons/hi';
import { PDFDocument } from 'pdf-lib';

const Assignments = () => {
  
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  // const [showFirstAssignment, setShowFirstAssignment] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [submittedAssignmentId, setSubmittedAssignmentId] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [up, setUp] = useState(false)

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
  const { loading, data: courses, currentCourseId } = useSelector(selectCourses);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//         setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
// }, []);
  
  const course = courses.find(course => course._id === currentCourseId);
  const assignmentPath = course.assignments.map(assignment => `https://ezlearn.onrender.com/course/getAssignments/${currentCourseId}/${assignment._id}`);
  const assignmentsPaths = course.assignments.map(assignment => {
    const matchingPath = assignmentPath.find(path => path.includes(assignment._id));
    return {
      ...assignment,
      path: matchingPath || ''
    };
  });
  
  useEffect(() => {
    setSubmittedAssignments(assignmentsPaths);
  }, [course]);
  
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
    // setShowFirstAssignment(false);
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
    // setShowFirstAssignment(true);
    setSubmittedAssignmentId(null);
    setSelectedFiles([]);
    setDescription('');
    setUp(false);
  };
  
  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <>
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
                      <div className='assignment' onClick={() => handleInProgressClick(assignment._id)} style={{cursor: "pointer", backgroundColor: "#f0f0f0"}} title='Open Assignmet'>
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

export default Assignments;