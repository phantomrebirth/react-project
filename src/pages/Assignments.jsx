import React from 'react'
import CVAssignments from '../components/courses/computer-vision/CVAssignments';
import ProgrammingAssignments from '../components/courses/programming/ProgrammingAssignments';
import AIAssignments from '../components/courses/artificial-intelligence/AIAssignments';
import NetworkAssignments from '../components/courses/network/NetworkAssignments';
import SWAssignments from '../components/courses/software-engineering/SWAssignments';
import { Container, Row, Col } from 'react-bootstrap'

const Assignments = () => {
  return (
    <Container style={{ margin: "0"}} className='mt-4'>
      <Row> 
        <Col style={{padding: "1.2%"}}>
          <CVAssignments/>
        </Col>
      </Row>
      <Row>
        <Col style={{padding: "1.2%"}}>
          <ProgrammingAssignments/>
        </Col>
      </Row>
      <Row>
        <Col style={{padding: "1.2%"}}>
          <AIAssignments/>
        </Col>
      </Row>
      <Row>
        <Col style={{padding: "1.2%"}}>
          <NetworkAssignments/>
        </Col>
      </Row>
      <Row>
        <Col style={{padding: "1.2%"}}>
          <SWAssignments/>
        </Col>
      </Row>
    </Container>
  );
};

export default Assignments;