import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { 
  finishFileOperation, getCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, 
  setDeleteAlert, setUploadAlert, setWaitAlert, startFileOperation 
} from '../../redux/actions/courses';
import { login } from '../../redux/actions/auth';
import axios from 'axios';
import apiUrl from '../ApiUrl';

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString(); // This will display only the date part
};

const Submitted = ({
  role, 
  token, 
  isLoading,
  courses, 
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

  const [projectSolutions, setProjectSolutions] = useState([]);
  const [assignmentSolutions, setAssignmentSolutions] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [submittedProjects, setSubmittedProjects] = useState([]);

  const course = courses.find(course => course._id === currentCourseID);

  useEffect(() => {
    if (course) {
      const basePath = `${apiUrl}/course`;
      if (course.assignments?.length) {
        setSubmittedAssignments(course.assignments
          .filter(assignment => assignment.solutions?.length)
          .map(assignment => ({ ...assignment, 
            path: `${basePath}/getAssignments/${currentCourseID}/${assignment._id}` ,
            uploadtime: formatDateTime(assignment.uploadtime),
            deadline: formatDateTime(assignment.deadline),
          }))
        );
      }
      if (course.projects?.length) {
        setSubmittedProjects(course.projects
          .filter(project => project.solutions?.length)
          .map(project => ({ ...project, 
            path: `${basePath}/getProjects/${currentCourseID}/${project._id}` ,
            uploadtime: formatDateTime(project.uploadtime),
            deadline: formatDateTime(project.deadline),
          }))
        );
      }
    }
  }, [course, currentCourseID, waitAlert, deleteAlert, uploadAlert]);
  useEffect(() => {
    const fetchSolutions = async (submittedItems, setSolutions, itemType) => {
      try {
        const promises = submittedItems.flatMap(item =>
          item.solutions?.map(solution => axios.get(
            `${apiUrl}/course/${itemType}/solution/${currentCourseID}/${item._id}/${solution._id}`,
            { headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }, responseType: 'blob' }
          )) || []
        );

        const responses = await Promise.all(promises);
        setSolutions(responses);
      } catch (error) {
        console.error(`Error fetching ${itemType}:`, error);
      }
    };

    if (submittedAssignments.length) fetchSolutions(submittedAssignments, setAssignmentSolutions, 'getAssignments');
    if (submittedProjects.length) fetchSolutions(submittedProjects, setProjectSolutions, 'getProjects');
  }, [submittedAssignments, submittedProjects, currentCourseID, token]);

  const openPDF = (pdfBlob) => {
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  };

  const renderItems = (items, solutions, openPDF, type) => (
    <div style={{display: "flex", alignItems: "start", justifyContent: "space-evenly"}}>
      {!waitAlert && (
        <Row className='mt-3 assignments-container' style={{ marginLeft: "1%", marginRight: "0", marginBottom: "0", padding: "0", flexDirection: "column"}}>
          {items.length ? items.map((item, index) => (
            <Col key={item.id || index} className='asscol2' style={{ margin: "1rem 0 0 0", padding: "0"}}>
              <div className="assignment-container2">
                <div className='assignment-header'>
                  <ul className='ass-h'>
                    <li>{course.name} - {type}</li>
                  </ul>
                </div>
                <div
                  className='assignment'
                  style={{ cursor: "pointer", backgroundColor: "#f0f0f0", boxShadow: "0 0 16px rgba(0, 0, 0, 0.2), 0 8px 10px -5px rgba(0, 0, 0, 0.2)" }}
                  onClick={() => {
                    const solution = solutions.find(sol => sol.config.url.includes(item._id));
                    if (solution) openPDF(solution.data);
                  }}
                  title={`Open ${type}`}
                >
                  <div className='assName-container' style={{ margin: "0", width: "100%" }}>
                    <h5 className='ass-name' style={{ textAlign: "center", fontSize: "111%", color: "#000" }}>
                      {item.filename}
                    </h5>
                    <div style={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center" }}>
                      <h6 className='ass-zeros' style={{ fontSize: "78%", margin: "3% 4% 0 0" }}>
                        Submitted {item.uploadtime}
                      </h6>
                      <h6 className='ass-zeros' style={{ fontSize: "78%", margin: "3% 4% 0 0" }}>
                        - 
                      </h6>
                      <h6 className='ass-zeros' style={{ fontSize: "78%", margin: "3% 4% 0 0" }}>
                        Deadline {item.deadline}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )) : null}
        </Row>
      )}
    </div>
  );

  return (
    <div style={{display: "flex", alignItems: "start", justifyContent: "space-evenly"}}>
        {submittedAssignments.length > 0 && renderItems(submittedAssignments, assignmentSolutions, openPDF, 'Assignment')}
        {submittedProjects.length > 0 && renderItems(submittedProjects, projectSolutions, openPDF, 'Project')}
        {submittedAssignments.length === 0 && submittedProjects.length === 0 && 
          <div style=
                    {{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      paddingTop: '6%',
                      fontSize: "125%"
                    }}
          >
            <p>No assignments or projects with solutions available.</p>
          </div>
        }
    </div>
  );
};

const mapStateToProps = state => ({
  role: state.auth.role,
  token: state.auth.token,
  courses: state.courses.coursesData,
  currentCourseID: state.courses.currentCourseID,
  isLoading: state.courses.isLoading,
  deleteAlert: state.courses.deleteAlert,
  uploadAlert: state.courses.uploadAlert,
  waitAlert: state.courses.waitAlert,
  error: state.courses.error,
  isFileOperationInProgress: state.courses.isFileOperationInProgress,
});

export default connect(mapStateToProps, {
  login,
  setUploadAlert,
  setWaitAlert,
  setDeleteAlert,
  resetUploadAlert,
  resetDeleteAlert,
  resetWaitAlert,
  startFileOperation,
  finishFileOperation,
  getCourses
})(Submitted);