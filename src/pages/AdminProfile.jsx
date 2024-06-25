import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import ProfileHead from '../components/ProfileHead';
import { connect } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Alert from 'react-bootstrap/Alert';
import { login, logout } from '../redux/actions/auth';

const Profile = ({ token, logout }) => {
  const [usersData, setUsersData] = useState({
    name: '',
    email: '',
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    fetchProfileData();
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showSuccess) {
        setShowSuccess(false);
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showSuccess]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('https://thankful-ample-shrimp.ngrok-free.app/users/me', {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `${token}`,
        }
      });
      const { name, email, password } = response.data;
      setUsersData(prevState => ({
        ...prevState,
        name,
        email,
        password,
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const body = {
        // name: userData.name,
        email: usersData.email,
        password: usersData.password
      };
      const response = await axios.patch('https://thankful-ample-shrimp.ngrok-free.app/users/update',
      body, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`
        }
      });
      fetchProfileData();
      setShowSuccess(true);
      setShowError(false);
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      setShowError(true);
      setShowSuccess(false);
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
        <Container fluid className='pfContainer'>
            {showSuccess && (
                <Alert variant="primary" onClose={() => setShowSuccess(false)} dismissible>
                    Profile updated successfully!
                </Alert>
            )}
            {showError && (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                    Error updating profile. Please try again.
                </Alert>
            )}
            <Row className="mt-4" id='pfContainer'>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h2 className='pfHeader'>Personal Information</h2>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mb-3">
                    <div className='headContainer'>
                        <ProfileHead/>
                    </div>
                </Col>
                <Form className='pfForm'>
                    <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                                    type="text" 
                                    placeholder="Enter your name" 
                                    name="name" 
                                    value={usersData.name} 
                                    onChange={(e) => setUsersData(prevState => ({
                                                    ...prevState,
                                                    name: e.target.value
                                    }))}
                                    readOnly
                    />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                                    type="email" 
                                    placeholder="Enter email" 
                                    name="email" 
                                    value={usersData.email} 
                                    onChange={(e) => setUsersData(prevState => ({
                                        ...prevState,
                                        email: e.target.value
                                        }))}
                                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="pfPass-input" style={{border: "none"}}>
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        name="password"
                        value={usersData.password || ''}
                        onChange={(e) => setUsersData(prevState => ({
                            ...prevState,
                            password: e.target.value
                            }))}
                            />
                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    </Form.Group>
                    <Button 
                            variant="primary" 
                            onClick={handleSaveChanges}
                            >
                            Save Changes
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
    </>
  );
};

const mapStateToProps = state => ({
    token: state.auth.token,
    name: state.profile.name,
    email: state.profile.email,
    password: state.profile.password,
});

export default connect(mapStateToProps, { login, logout })(Profile);