import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "react-bootstrap"
import { selectRole } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const CVAnnouncements = () => {

    const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    console.log(role);
    
    useEffect(() => {
      if (role === 'student') {
        setStudent(true);
      } else if (role === 'teacher') {
        setTeacher(true);
      }
    }, [role]);

  return (
    <>
        {student && (
            <Container style={{margin: "0", padding: "0"}}>
                <Row style={{margin: "0", padding: "0"}}>
                    <Col md={12} style={{margin: "0", padding: "0"}}>
                        <div className='announcements-container'>
                            <div className='announcement-container'>
                                <div className='annIcon-container'>
                                    <h4 className='announcement-icon'> ! </h4>
                                </div>
                                <div className='annP-container'>
                                    <div className='announcement-p'>Computer Vision course started in 2023</div>
                                </div>
                            </div>
                            {/* <hr className='announcements-hr'/> */}
                            {/* <div className='announcement-container'>
                                <div className='annIcon-container'>
                                    <h4 className='announcement-icon'> ! </h4>
                                </div>
                                <div className='annP-container'>
                                    <div className='announcement-p'>Deadline of assignment will be 4/8</div>
                                </div>
                            </div> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        )}
        {teacher && (
            <div>_</div>
        )}
    </>
  );
};

export default CVAnnouncements;