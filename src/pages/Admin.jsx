import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../../src/Admin.css';
import { logout } from '../redux/actions/auth';
import { connect } from 'react-redux';
import axios from 'axios';
import { profile } from '../redux/actions/profile';
import apiUrl from '../components/ApiUrl';

const Admin = ({ logout, image, error, isLoading, token, profile }) => {
  const [formDataUser, setFormDataUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    courseIds: []
  });
  const [files, setFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: '' });
  const [formDataCourse, setFormDataCourse] = useState({
    courseId: '',
    courseName: '',
    coursePath: '',
    teacherId: []
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showAlert) {
        setShowAlert(false);
        setNotification({ show: false, message: '', variant: '' })
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showAlert, notification]);

  const { name, email, password, courseIds, role } = formDataUser;

  const onChangeUser = (e) => setFormDataUser({ ...formDataUser, [e.target.name]: e.target.value });

  const onCourseIdsChangeUser = (e) => {
    const coursesArray = e.target.value.split(',').map(course => course.trim());
    setFormDataUser({ ...formDataUser, courseIds: coursesArray });
  };

  const onFileChangeUser = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...files, ...selectedFiles].slice(0, 5);
    setFiles(newFiles);
  };

  const onChangeRole = (e) => {
    setFormDataUser({ ...formDataUser, role: e.target.value });
  };

  const onSubmitUser = async (e) => {
    e.preventDefault();
    if (files.length === 0 || files.length > 5) {
      setShowAlert(true);
      return;
    }
  
    try {
      const dataToSend = new FormData();
      dataToSend.append('name', name);
      dataToSend.append('email', email);
      dataToSend.append('password', password);
      dataToSend.append('role', role);
      dataToSend.append('courseIds', courseIds);
 
      files.forEach((file, index) => {
        dataToSend.append('registerImage', file);
      });
      console.log(name,email,password,role,courseIds)
      const res = await axios.post(`${apiUrl}/users`, dataToSend, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data)
      setNotification({ show: true, message: 'User created successfully!', variant: 'success' });
      setFormDataUser({ name: '', email: '', password: '', role: '', courseIds: [] });
      setFiles([]);
    } catch (error) {
      setNotification({ show: true, message: 'Failed to create user. Please try again.', variant: 'danger' });
      console.error(error)
    }
  };

  // const generateCoursePath = (courseName) => {
  //   return courseName.trim().toLowerCase().replace(/\s+/g, '-');
  // };

  // const onChangeCourse = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'teacherId') {
  //     // Split teacherId input by comma and trim each value
  //     const teacherIds = value.split(',').map(id => id.trim());
  //     setFormDataCourse({
  //       ...formDataCourse,
  //       [name]: teacherIds,
  //     });
  //   } else {
  //     setFormDataCourse({
  //       ...formDataCourse,
  //       [name]: value,
  //       coursePath: name === 'courseName' ? generateCoursePath(value) : formDataCourse.coursePath
  //     });
  //   }
  // };

  // const onSubmitCourse = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const dataToSend = new FormData();
  //     dataToSend.append('_id', formDataCourse.courseId);
  //     dataToSend.append('name', formDataCourse.courseName);
  //     dataToSend.append('path', formDataCourse.coursePath);
  //     dataToSend.append('teacherId', JSON.stringify(formDataCourse.teacherId));
  //     const res = await axios.post('https://thankful-ample-shrimp.ngrok-free.app/course', dataToSend, {
  //       headers: {
  //         'ngrok-skip-browser-warning': 'true'
  //       }
  //     });

  //     setNotification({ show: true, message: 'Course created successfully!', variant: 'success' });
  //     setFormDataCourse({ courseId: '', courseName: '', coursePath: '', teacherId: [] });
  //   } catch (error) {
  //     setNotification({ show: true, message: 'Failed to create course. Please try again.', variant: 'danger' });
  //   }
  // };

  return (
    <Container className="mt-4" style={{overflowY: "auto"}}>
      <Row className="justify-content-md-center" style={{overflowY: "auto"}}>
        <Col md={6} style={{overflowY: "auto", paddingBottom: "2rem"}}>
          <h2>Create New User</h2>
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
          <Form onSubmit={onSubmitUser}>
            <Form.Group controlId="formNameUser">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={onChangeUser}
                required
              />
              <Form.Text className="text-muted">
                Must contain at least four names.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formEmailUser">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={onChangeUser}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPasswordUser">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={password}
                onChange={onChangeUser}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoleUser">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={role}
                onChange={onChangeRole}
                required
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCourseIdsUser">
              <Form.Label>Course IDs</Form.Label>
              <Form.Control
                type="text"
                name="courseIds"
                value={courseIds.join(', ')}
                onChange={onCourseIdsChangeUser}
                // required
                placeholder="1020, 1050, 1080"
              />
              <Form.Text className="text-muted">
                Enter course IDs separated by commas (e.g., 1020, 1050, 1080).
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formFileUser">
              <Form.Label>Upload Photos</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={onFileChangeUser}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                You can upload up to 5 photos (optional). If you choose to upload, exactly 5 photos are required.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Submit User
            </Button>
          </Form>
        </Col>
        {/* <Col md={8} lg={6} className="mx-auto d-flex align-items-center justify-content-center">
          <div className="p-4 border rounded text-center" style={{minWidth: "360px"}}>
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
        </Col> */}
      </Row>
    </Container>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  image: state.profile.image,
  isLoading: state.profile.isLoading,
  error: state.profile.error,
})

export default connect(mapStateToProps, { logout, profile })(Admin);