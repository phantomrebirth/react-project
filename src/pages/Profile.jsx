import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'react-image-crop/dist/ReactCrop.css'
import ProfileHead from '../components/ProfileHead';

const Profile = () => {
  const [name, setName] = useState('Johnny Cash');
  const [email] = useState('johnnycash13@heaven.com');
  const [password, setPassword] = useState('********');
  const [newPassword, setNewPassword] = useState('');
  
  const handleSaveChanges = () => {
    console.log('Changes saved!');
  };

  return (
    <Container fluid className='pfContainer'>
      <Row className="mt-4" id='pfContainer'>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <h2 className='pfHeader'>Profile Information</h2>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mb-3">
            <div className='headContainer'>
              <ProfileHead/>
            </div>
          </Col>
          <Form className='pfForm'>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control className='pfName' type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control className='pfEmail' type="email" placeholder="Enter email" value={email} readOnly />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control className='pfPass' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control className='pfNewPass' type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Form.Group>
            <Button className='pfBtn' variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
          </Form>
        </Col>
        {/* <Col xs={12} md={4} lg={3} xl={2} className="text-center mb-3">
          <ProfileHead/>
        </Col> */}
      </Row>
    </Container>
  );
};

export default Profile;