import React from 'react'
import CVAttendanceRate from '../components/courses/computer-vision/CVAttendanceRate';
import AIAttendanceRate from '../components/courses/artificial-intelligence/AIAttendanceRate';
import ProgrammingAttendanceRate from '../components/courses/programming/ProgrammingAttendanceRate';
import NetworkAttendanceRate from '../components/courses/network/NetworkAttendanceRate';
import SWAttendanceRate from '../components/courses/software-engineering/SWAttendanceRate';
import { Container, Row } from 'react-bootstrap'

const AttendanceRate = () => {
  return (
    <Container fluid className='mt-4' style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
      {/* <Row style={{display: "flex", flexWrap: "wrap"}}> */}
        <div style={{padding: "2%"}}>
          <CVAttendanceRate/>
        </div>
        <div style={{padding: "2%"}}>
          <ProgrammingAttendanceRate/>
        </div>
        <div style={{padding: "2%"}}>
          <AIAttendanceRate/>
        </div>
        <div style={{padding: "2%"}}>
          <NetworkAttendanceRate/>
        </div>
        <div style={{padding: "2%"}}>
          <SWAttendanceRate/>
        </div>
      {/* </Row> */}
    </Container>
  );
};

export default AttendanceRate;