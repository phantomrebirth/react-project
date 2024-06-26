// import React, { useState } from 'react';
// import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
// import AIFiles from '../../components/courses/artificial-intelligence/AIFiles';
// import AIAssignments from '../../components/courses/artificial-intelligence/AIAssignments';
// import AIProjects from '../../components/courses/artificial-intelligence/AIProjects';
// import AIVideos from '../../components/courses/artificial-intelligence/AIVideos';
// import AIQuizzes from '../../components/courses/artificial-intelligence/AIQuizzes';
// import AIGrades from '../../components/courses/artificial-intelligence/AIGrades';
// import AIAttendanceRate from '../../components/courses/artificial-intelligence/AIAttendanceRate';
// import AIChat from '../../components/courses/artificial-intelligence/AIChat';

// const AI = () => {
//     const [activeTab, setActiveTab] = useState('Tab 1');

//     const handleSelect = (selectedKey) => {
//       setActiveTab(selectedKey);
//     };

//   return (
//     <>
//       <h1 className='course-header'>Artificial Intelligence</h1>
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
//             {activeTab === 'Tab 1' && <div><AIChat/></div>}
//             {activeTab === 'Tab 2' && <div><AIVideos/></div>}
//             {activeTab === 'Tab 3' && <div><AIFiles/></div>}
//             {activeTab === 'Tab 4' && <div><AIAssignments/></div>}
//             {activeTab === 'Tab 5' && <div><AIProjects/></div>}
//             {activeTab === 'Tab 6' && <div><AIQuizzes/></div>}
//             {activeTab === 'Tab 7' && <div><AIGrades/></div>}
//             {activeTab === 'Tab 8' && <div><AIAttendanceRate/></div>}
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default AI;