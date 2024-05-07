// import React, { useState } from 'react';
// import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
// import CVFiles from '../../components/courses/computer-vision/CVFiles';
// import CVAssignments from '../../components/courses/computer-vision/CVAssignments';
// import CVProjects from '../../components/courses/computer-vision/CVProjects';
// import CVQuizzes from '../../components/courses/computer-vision/CVQuizzes';
// import CVVideos from '../../components/courses/computer-vision/CVVideos';
// import CVGrades from '../../components/courses/computer-vision/CVGrades';
// import CVAttendanceRate from '../../components/courses/computer-vision/CVAttendanceRate';
// import CVChat from '../../components/courses/computer-vision/CVChat';

// const ComputerVision = () => {
//     const [activeTab, setActiveTab] = useState('Tab 1');

//     const handleSelect = (selectedKey) => {
//       setActiveTab(selectedKey);
//     };

//   return (
//     <>
//       <h1 className='course-header'>Computer Vision</h1>
//       <Container fluid className='course-container' style={{margin: "0", padding: "0"}}>
//         <Row style={{margin: "0", padding: "0"}} className='courseRow1'>
//           <Col className='navtabs-container' style={{padding: "0"}} >
//             <Navbar className='course-navbar'>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//               <Navbar.Collapse id="basic-navbar-nav" className='collapse-tabs'>
//                 <Nav id='nav-tabs' className="mr-auto" activeKey={activeTab} onSelect={handleSelect}>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 1">Chat</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 2">Videos</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 3">Files</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 4">Assignments</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 5">Projects</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 6">Quizzes</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 7">Grades</Nav.Link>
//                   <Nav.Link id='tabz' className='tab-link' eventKey="Tab 8">Attendance Rate</Nav.Link>
//                   {/* <div className="nav-line"></div> */}
//                 </Nav>
//               </Navbar.Collapse>
//             </Navbar>
//           </Col>
//         </Row>
//       </Container>
//       <Container className='tabs-container' style={{margin: "0", padding: "0"}} fluid>
//         <Row style={{margin: "0", padding: "0"}} className='courseRow2'>
//           <Col style={{padding: "0"}} className='tab-content'>
//             {activeTab === 'Tab 1' && <div><CVChat/></div>}
//             {activeTab === 'Tab 2' && <div><CVVideos/></div>}
//             {activeTab === 'Tab 3' && <div><CVFiles/></div>}
//             {activeTab === 'Tab 4' && <div><CVAssignments/></div>}
//             {activeTab === 'Tab 5' && <div><CVProjects/></div>}
//             {activeTab === 'Tab 6' && <div><CVQuizzes/></div>}
//             {activeTab === 'Tab 7' && <div><CVGrades/></div>}
//             {activeTab === 'Tab 8' && <div><CVAttendanceRate/></div>}
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default ComputerVision;