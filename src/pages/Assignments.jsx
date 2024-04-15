import React from 'react'
import CVAssignments from '../components/courses/computer-vision/CVAssignments';
import ProgrammingAssignments from '../components/courses/programming/ProgrammingAssignments';
import AIAssignments from '../components/courses/artificial-intelligence/AIAssignments';
import NetworkAssignments from '../components/courses/network/NetworkAssignments';
import SWAssignments from '../components/courses/software-engineering/SWAssignments';
import { Container, Row, Col } from 'react-bootstrap'

const Assignments = () => {
  return (
    <Container  fluid className='mt-4 side-assContainer'>
      <Row style={{width: "100%"}}>
        <Row  className='side-assRow'>
          <Col style={{padding: "1.2%"}} xl={12} lg={12}>
            <CVAssignments/>
          </Col>
          <Col style={{padding: "1.2%"}} xl={12} lg={12}>
            <ProgrammingAssignments/>
          </Col>
          <Col style={{padding: "1.2%"}} xl={12} lg={12}>
            <SWAssignments/>
          </Col>
        </Row>
        <Row  className='side-assRow'>
          <Col style={{padding: "1.2%"}} xl={12} lg={12}>
            <AIAssignments/>
          </Col>
          <Col style={{padding: "1.2%"}} xl={12} lg={12}>
            <NetworkAssignments/>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Assignments;