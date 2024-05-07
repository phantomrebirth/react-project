// import React, { useState } from 'react';
// import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
// import SWFiles from '../../components/courses/software-engineering/SWFiles';
// import SWAssignments from '../../components/courses/software-engineering/SWAssignments';
// import SWProjects from '../../components/courses/software-engineering/SWProjects';
// import SWVideos from '../../components/courses/software-engineering/SWVideos';
// import SWQuizzes from '../../components/courses/software-engineering/SWQuizzes';
// import SWGrades from '../../components/courses/software-engineering/SWGrades';
// import SWAttendanceRate from '../../components/courses/software-engineering/SWAttendanceRate';
// import SWChat from '../../components/courses/software-engineering/SWChat';

// const SoftwareEngineering = () => {
//     const [activeTab, setActiveTab] = useState('Tab 1');

//     const handleSelect = (selectedKey) => {
//       setActiveTab(selectedKey);
//     };

//   return (
//     <>
//       <h1 className='course-header'>Software Engineering</h1>
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
//             {activeTab === 'Tab 1' && <div><SWChat/></div>}
//             {activeTab === 'Tab 2' && <div><SWVideos/></div>}
//             {activeTab === 'Tab 3' && <div><SWFiles/></div>}
//             {activeTab === 'Tab 4' && <div><SWAssignments/></div>}
//             {activeTab === 'Tab 5' && <div><SWProjects/></div>}
//             {activeTab === 'Tab 6' && <div><SWQuizzes/></div>}
//             {activeTab === 'Tab 7' && <div><SWGrades/></div>}
//             {activeTab === 'Tab 8' && <div><SWAttendanceRate/></div>}
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SoftwareEngineering;