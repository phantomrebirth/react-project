import React from 'react'
import { Container, Row, Col } from "react-bootstrap"
const CVAnnouncements = () => {
  return (
    <Container style={{margin: "0", padding: "0"}}>
        <Row style={{margin: "0", padding: "0"}}>
            <Col md={12} style={{margin: "0", padding: "0"}}>
                <div className='announcements-container'>
                    <div className='announcement-container'>
                        <div className='annIcon-container'>
                            <h4 className='announcement-icon'> ! </h4>
                        </div>
                        <div className='annP-container'>
                            <div className='announcement-p'>Course started in 2021</div>
                        </div>
                    </div>
                    <hr className='announcements-hr'/>
                    <div className='announcement-container'>
                        <div className='annIcon-container'>
                            <h4 className='announcement-icon'> ! </h4>
                        </div>
                        <div className='annP-container'>
                            <div className='announcement-p'>Deadline of assignment will be 4/8</div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
  );
};

export default CVAnnouncements;