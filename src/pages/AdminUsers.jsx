import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Table, Spinner, Alert, Form } from 'react-bootstrap';
import '../../src/Admin.css';
import { profile } from '../redux/actions/profile';
import apiUrl from '../components/ApiUrl';

const AdminUsers = ({ image, token, profile, isLoading }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: '' });
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    courseId: [],
    password: '',
  });

  useEffect(() => {
    if (users.length === 0 && loading) {
      fetchUsers();
    }
  }, [loading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showAlert) {
        setShowAlert(false);
        setNotification({ show: false, message: '', variant: '' })
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showAlert, notification]);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${apiUrl}/users/all`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          // Authorization: `Bearer ${token}`
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${apiUrl}/users/delete/${userId}`, {
        'ngrok-skip-browser-warning': 'true',
        // headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers()
      setNotification({ show: true, message: 'User deleted successfully!', variant: 'success' });
    } catch (error) {
      setError(error.message);
      setNotification({ show: true, message: 'Failed to delete user. Please try again.', variant: 'danger' });
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      courseId: user.courseId || [],
      password: '',
    });
  };

  const handleCancelEdit = () => {
    setEditUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      courseId: [],
      password: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'courseId') {
      setFormData({
        ...formData,
        courseId: value.split(',').map(course => course.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdateUser = async () => {
    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        courseId: formData.courseId, // Ensure courseId is sent correctly formatted
      };
      console.log(editUser._id)
      console.log(dataToSend)
      await axios.patch(`${apiUrl}/users/update/admin/${editUser._id}`, dataToSend, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          // Authorization: `Bearer ${token}`
        },
      });
  
      setEditUser(null);
      await fetchUsers();
      setNotification({ show: true, message: 'User updated successfully!', variant: 'success' });
    } catch (error) {
      setError(error.message);
      setNotification({ show: true, message: 'Failed to update user. Please try again.', variant: 'danger' });
    }
  };
  

  if (loading || fetching) {
    return (
      <div className="adminSpinner-container">
        <Spinner animation="border" role="status" size="lg">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  const filteredUsers = users.filter(user => user.role !== 'admin');

  return (
    <div className='container mt-5'>
      <h1 className='mb-4'>Users</h1>
      {showAlert && (
        <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
          {error}
        </Alert>
      )}
      {notification.show && (
        <Alert variant={notification.variant} onClose={() => setNotification({ ...notification, show: false })} dismissible>
          {notification.message}
        </Alert>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Course IDs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <React.Fragment key={user._id}>
              <tr>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{Array.isArray(user.courseId) ? user.courseId.join(', ') : 'N/A'}</td>
                <td style={{display: "flex", alignItems: "center"}}>
                  {editUser === user ? (
                    <>
                      <Button variant='success' onClick={handleUpdateUser} style={{marginRight: "1rem"}} disabled={!formData.password}>
                        Update
                      </Button>{' '}
                      <Button variant='secondary' onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant='primary' onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                  )}
                  {' '}
                  {editUser !== user && (
                    <Button variant='danger' onClick={() => deleteUser(user._id)} style={{marginLeft: "1rem"}}>
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
              {editUser === user && (
                <tr>
                  <td colSpan="6">
                    <Form>
                      <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter new password"
                          name="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          as="select"
                          name="role"
                          value={formData.role}
                          onChange={handleFormChange}
                        >
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formCourseId">
                        <Form.Label>Course IDs (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter course IDs"
                          name="courseId"
                          value={formData.courseId.join(', ')}
                          onChange={handleFormChange}
                        />
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  image: state.profile.image,
  isLoading: state.profile.isLoading,
  error: state.profile.error,
});

export default connect(mapStateToProps, { profile })(AdminUsers);