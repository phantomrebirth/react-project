import React, { useEffect, useState } from 'react';
import '../../src/Admin.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { Spinner, Container, Row, Col, ListGroup, Alert, Button, Form } from 'react-bootstrap';

const AdminCourses = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: '' });
  const [formDataCourse, setFormDataCourse] = useState({
    courseId: '',
    newCourseId: '',
    courseName: '',
    coursePath: '',
    teacherId: []
  });

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://thankful-ample-shrimp.ngrok-free.app/course/all', {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      setCourses(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courses.length === 0 && isLoading) {
      fetchCourses();
    }
  }, [isLoading]);

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`https://thankful-ample-shrimp.ngrok-free.app/course/delete/${courseId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      await fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const generateCoursePath = (courseName) => {
    return courseName.trim().toLowerCase().replace(/\s+/g, '-');
  };

  const onChangeCourse = (e) => {
    const { name, value } = e.target;
    if (name === 'teacherId') {
      // Split teacherId input by comma and trim each value
      const teacherIds = value.split(',').map(id => id.trim());
      setFormDataCourse({
        ...formDataCourse,
        [name]: teacherIds,
      });
    } else {
      setFormDataCourse({
        ...formDataCourse,
        [name]: value,
        coursePath: name === 'courseName' ? generateCoursePath(value) : formDataCourse.coursePath
      });
    }
  };

  const onUpdateCourse = async (e) => {
    e.preventDefault();
    const { courseId, newCourseId, courseName, coursePath, teacherId } = formDataCourse;
    try {
      const payload = {
        _id: newCourseId,
        name: courseName,
        path: coursePath,
        teacherId: teacherId
      };
  
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };
  
      const res = await axios.patch(
        `https://thankful-ample-shrimp.ngrok-free.app/update/admin/${courseId}`,
        payload,
        { headers }
      );
  
      setNotification({ show: true, message: 'Course updated successfully!', variant: 'success' });
      setFormDataCourse({ courseId: '', newCourseId: '', courseName: '', coursePath: '', teacherId: [] });
      fetchCourses();
    } catch (error) {
      setNotification({ show: true, message: 'Failed to update course. Please try again.', variant: 'danger' });
    }
  };
  

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" role="status" size="lg">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    console.log(error);
    return <Alert variant="danger" className="mt-3">Error: {error}</Alert>;
  }

  return (
    <Container>
      <h2 className="my-4">All Courses</h2>
      {showAlert && (
        <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
          Please select exactly 5 photos if you choose to upload photos.
        </Alert>
      )}
      {notification.show && (
        <Alert variant={notification.variant} onClose={() => setNotification({ ...notification, show: false })} dismissible>
          {notification.message}
        </Alert>
      )}
      <ListGroup>
        {courses.map(course => (
          <ListGroup.Item key={course._id} className="mb-3">
            <Row>
              <Col md={3}>
                <strong>Course Name:</strong> {course.name}
              </Col>
              <Col md={3}>
                <strong>Course ID:</strong> {course._id}
              </Col>
              <Col md={3}>
                <strong>Teacher IDs:</strong> {course.teacherId.join(', ')}
              </Col>
              <Col md={3} className="text-right">
                <Button variant="danger" onClick={() => handleDelete(course._id)}>Delete</Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Row className="justify-content-md-center" style={{ overflowY: "auto" }}>
        <Col className="mx-auto d-flex align-items-center">
          <div className="rounded" style={{ minWidth: "360px" }}>
            <h2 className="mb-4">Update Course</h2>
            <Form onSubmit={onUpdateCourse}>
              <Form.Group controlId="formCourseId">
                <Form.Label>Current Course ID</Form.Label>
                <Form.Control
                  type="text"
                  name="courseId"
                  value={formDataCourse.courseId}
                  onChange={onChangeCourse}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNewCourseId">
                <Form.Label>New Course ID</Form.Label>
                <Form.Control
                  type="text"
                  name="newCourseId"
                  value={formDataCourse.newCourseId}
                  onChange={onChangeCourse}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCourseName">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  name="courseName"
                  value={formDataCourse.courseName}
                  onChange={onChangeCourse}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCoursePath" style={{ display: 'none' }}>
                <Form.Control
                  type="text"
                  name="coursePath"
                  value={formDataCourse.coursePath}
                  onChange={onChangeCourse}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCourseTeacherId">
                <Form.Label>Teacher IDs (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="teacherId"
                  value={formDataCourse.teacherId.join(', ')}
                  onChange={onChangeCourse}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="mt-3">
                Update Course
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(AdminCourses);