// import React, { useState } from 'react';
// import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
// import NetworkFiles from '../../components/courses/network/NetworkFiles';
// import NetworkAssignments from '../../components/courses/network/NetworkAssignments';
// import NetworkProjects from '../../components/courses/network/NetworkProjects';
// import NetworkVideos from '../../components/courses/network/NetworkVideos';
// import NetworkQuizzes from '../../components/courses/network/NetworkQuizzes';
// import NetworkGrades from '../../components/courses/network/NetworkGrades';
// import NetworkAttendanceRate from '../../components/courses/network/NetworkAttendanceRate';
// import NetworkChat from '../../components/courses/network/NetworkChat';

// const Network = () => {
//     const [activeTab, setActiveTab] = useState('Tab 1');

//     const handleSelect = (selectedKey) => {
//       setActiveTab(selectedKey);
//     };

//   return (
//     <>
//       <h1 className='course-header'>Network</h1>
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
//                 </Nav>
//               </Navbar.Collapse>
//             </Navbar>
//           </Col>
//         </Row>
//       </Container>
//       <Container className='tabs-container' style={{margin: "0", padding: "0"}}>
//         <Row style={{margin: "0", padding: "0"}} className='courseRow2'>
//           <Col style={{padding: "0"}} className='tab-content'>
//             {activeTab === 'Tab 1' && <div><NetworkChat/></div>}
//             {activeTab === 'Tab 2' && <div><NetworkVideos/></div>}
//             {activeTab === 'Tab 3' && <div><NetworkFiles/></div>}
//             {activeTab === 'Tab 4' && <div><NetworkAssignments/></div>}
//             {activeTab === 'Tab 5' && <div><NetworkProjects/></div>}
//             {activeTab === 'Tab 6' && <div><NetworkQuizzes/></div>}
//             {activeTab === 'Tab 7' && <div><NetworkGrades/></div>}
//             {activeTab === 'Tab 8' && <div><NetworkAttendanceRate/></div>}
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Network;