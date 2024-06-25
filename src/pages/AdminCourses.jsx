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
    courseName: '',
    coursePath: '',
    teacherId: []
  });
  const [updateCourseId, setUpdateCourseId] = useState(null);

  useEffect(() => {
    if (courses.length === 0 && isLoading) {
      fetchCourses();
    }
  }, [isLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showAlert) {
        setShowAlert(false);
        setNotification({ show: false, message: '', variant: '' })
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showAlert, notification]);

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

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`https://thankful-ample-shrimp.ngrok-free.app/course/delete/${courseId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      await fetchCourses();
      setNotification({ show: true, message: 'Course deleted successfully!', variant: 'success' });
    } catch (err) {
      setError(err.message);
      setNotification({ show: true, message: 'Failed to delete course. Please try again.', variant: 'danger' });
    }
  };

  const handleUpdateClick = (course) => {
    setFormDataCourse({
      courseId: course._id,
      courseName: course.name,
      coursePath: course.path,
      teacherId: course.teacherId
    });
    setUpdateCourseId(course._id);
  };

  const handleCancelUpdate = () => {
    setUpdateCourseId(null);
    setFormDataCourse({
      courseId: '',
      courseName: '',
      coursePath: '',
      teacherId: []
    });
  };

  const generateCoursePath = (courseName) => {
    return courseName.trim().toLowerCase().replace(/\s+/g, '-');
  };

  const onChangeCourse = (e) => {
    const { name, value } = e.target;
    if (name === 'teacherId') {
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
    const { courseName, coursePath, teacherId } = formDataCourse;
    try {
      const payload = {
        name: courseName,
        path: coursePath,
        teacherId: teacherId
      };

      const res = await axios.patch(
        `https://thankful-ample-shrimp.ngrok-free.app/course/update/admin/${updateCourseId}`,
        payload,
        { headers: {
          'ngrok-skip-browser-warning': 'true'
        } }
      );

      setNotification({ show: true, message: 'Course updated successfully!', variant: 'success' });
      setFormDataCourse({ courseId: '', courseName: '', coursePath: '', teacherId: [] });
      setUpdateCourseId(null);
      fetchCourses();
    } catch (error) {
      setNotification({ show: true, message: 'Failed to update course. Please try again.', variant: 'danger' });
    }
  };

  const onSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        _id: formDataCourse.courseId,
        name: formDataCourse.courseName,
        path: formDataCourse.coursePath,
        teacherId: formDataCourse.teacherId
      };

      const res = await axios.post('https://thankful-ample-shrimp.ngrok-free.app/course', dataToSend, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      setNotification({ show: true, message: 'Course created successfully!', variant: 'success' });
      setFormDataCourse({ courseId: '', courseName: '', coursePath: '', teacherId: [] });
      fetchCourses();
    } catch (error) {
      setNotification({ show: true, message: 'Failed to create course. Please try again.', variant: 'danger' });
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
              <Col md={2}>
                <strong>Course Name:</strong> {course.name}
              </Col>
              <Col md={2}>
                <strong>Course ID:</strong> {course._id}
              </Col>
              <Col md={4}>
                <strong>Teacher IDs:</strong> {course.teacherId.join(', ')}
              </Col>
              <Col md={4} className="text-right">
                <Button variant="warning" onClick={() => handleUpdateClick(course)} style={{marginRight: "1rem"}}>Update</Button>
                <Button variant="danger" onClick={() => handleDelete(course._id)} className="ml-2">Delete</Button>
              </Col>
            </Row>
            {updateCourseId === course._id && (
              <Form onSubmit={onUpdateCourse} className="mt-3">
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
                <Form.Group controlId="formCourseTeacherId" className="mt-1">
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
                <Button variant="secondary" onClick={handleCancelUpdate} className="mt-3 ml-2" style={{marginLeft: "1rem"}}>
                  Cancel
                </Button>
              </Form>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div className="p-4 border rounded text-center mt-4" style={{minWidth: "360px"}}>
        <h2 className="mb-4">Create New Course</h2>
        <Form onSubmit={onSubmitCourse}>
          <Form.Group controlId="formCourseId">
            <Form.Label>Course ID</Form.Label>
            <Form.Control
              type="text"
              name="courseId"
              value={formDataCourse.courseId}
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
          <Button variant="primary" type="submit" className="mt-3">
            Submit Course
          </Button>
        </Form>
      </div>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(AdminCourses);
