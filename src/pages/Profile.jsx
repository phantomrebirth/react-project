import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import ProfileHead from '../components/ProfileHead';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('https://ezlearn.onrender.com/admins/me', {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAwZWYwZTY4ZjczMGMzYmM4OThjNjciLCJpYXQiOjE3MTIwODE3NTd9.cKsx5rWFX8VOHFp8VrKCEjyEqE5_u-2PeiTS4Ey3Sbo'
        }
      });
      const { name, email } = response.data;
      setUserData(prevState => ({
        ...prevState,
        name,
        email,
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const body = {
        name: userData.name,
        // email: userData,
      };      console.log(body);
      const response = await axios.patch('https://ezlearn.onrender.com/admins/update',
      body, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAwZWYwZTY4ZjczMGMzYmM4OThjNjciLCJpYXQiOjE3MTIwODE3NTd9.cKsx5rWFX8VOHFp8VrKCEjyEqE5_u-2PeiTS4Ey3Sbo'
        }
      });
      fetchProfileData();
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
          // Update state with new data
    // const { name, email } = response.data;
    //   setUserData(prevState => ({
    //       ...prevState,
    //       name,
    //       email,
    //   }));
    // } catch (error) {
    //   console.error('Error updating profile:', error);
    // }
  };

  // const handleChange = (e) => {
  //   const { name, nameValue } = e.target;
  //   const { email, emailValue } = e.target;
  //   confirm,
  //   setUserData(prevState => ({
  //     ...prevState,
  //     [name]: nameValue,
  //     [email]: emailValue,
  //   }));
  // };

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
              <Form.Control className='pfName' 
                            type="text" 
                            placeholder="Enter your name" 
                            name="name" 
                            value={userData.name} 
                            onChange={(e) => setUserData(prevState => ({
                                             ...prevState,
                                             name: e.target.value
                            }))}  
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control className='pfEmail' 
                            type="email" 
                            placeholder="Enter email" 
                            name="email" 
                            value={userData.email} 
                            readOnly 
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control className='pfPass' 
                            type="password" 
                            placeholder="Password" 
                            name="password" 
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control className='pfNewPass' 
                            type="password" 
                            placeholder="New Password" 
                            name="newPassword" 
              />
            </Form.Group>
            <Button className='pfBtn' 
                    variant="primary" 
                    onClick={handleSaveChanges}
                    >
                      Save Changes
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import axios from 'axios';
// import ProfileHead from '../components/ProfileHead';

// const Profile = () => {
//   const [userData, setUserData] = useState();
//   const [data, setData] = useState("");
//   // useEffect(() => {
//   //   fetchProfileData();
//   // }, []);
  
//   const fetchProfileData = async () => {
//     try {
//       const response = await axios.get('https://ezlearn.onrender.com/admins/me', {
//       headers: {
//         Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAwZWYwZTY4ZjczMGMzYmM4OThjNjciLCJpYXQiOjE3MTIwODE3NTd9.cKsx5rWFX8VOHFp8VrKCEjyEqE5_u-2PeiTS4Ey3Sbo'
//       }
//       });
//       setUserData(prevState => response.data);
//     } catch (error) {
//       console.error('Error fetching profile data:', error);
//     }
//   };
  
//   const handleSaveChanges = async () => {
//     setData("name")
//     try {
//       // let form_data = new FormData();
//       // form_data.append("name", data.name);
//       const body = {
//         name: data, // Assuming 'data' holds the updated name value
//         email: data,
//       };      console.log(body);
//       const response = await axios.patch('https://ezlearn.onrender.com/admins/update',
//       body,{
//       headers: {
//         Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAwZWYwZTY4ZjczMGMzYmM4OThjNjciLCJpYXQiOjE3MTIwODE3NTd9.cKsx5rWFX8VOHFp8VrKCEjyEqE5_u-2PeiTS4Ey3Sbo'
//       }
//     });
    
//     // After saving changes, fetch updated data
//     fetchProfileData();
//     console.log('Profile updated successfully:', response.data);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setUserData(prevState => ({
//   //     ...prevState,
//   //     [name]: value,
//   //   }));
//   // };

//   return (
//     <Container fluid className='pfContainer'>
//       <Row className="mt-4" id='pfContainer'>
//         <Col xs={12} sm={12} md={12} lg={12} xl={12}>
//           <h2 className='pfHeader'>Profile Information</h2>
//           <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mb-3">
//             <div className='headContainer'>
//               <ProfileHead/>
//             </div>
//           </Col>
//           <Form className='pfForm'>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control className='pfName' type="text" placeholder="Enter your name" name="name"  
//                             onChange={(e) => setData(e.target.value)}/>
//             </Form.Group>
//             <Form.Group controlId="formEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control className='pfEmail' type="email" placeholder="Enter email" name="email" readOnly />
//             </Form.Group>
//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control className='pfPass' type="password" placeholder="Password" name="password"  />
//             </Form.Group>
//             <Form.Group controlId="formNewPassword">
//               <Form.Label>New Password</Form.Label>
//               <Form.Control className='pfNewPass' type="password" placeholder="New Password" name="newPassword" />
//             </Form.Group>
//             <Button className='pfBtn' variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Profile;