// import React, { useState } from 'react';
// import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
// import ProgrammingFiles from '../../components/courses/programming/ProgrammingFiles';
// import ProgrammingAssignments from '../../components/courses/programming/ProgrammingAssignments';
// import ProgrammingProjects from '../../components/courses/programming/ProgrammingProjects';
// import ProgrammingVideos from '../../components/courses/programming/ProgrammingVideos';
// import ProgrammingQuizzes from '../../components/courses/programming/ProgrammingQuizzes';
// import ProgrammingGrades from '../../components/courses/programming/ProgrammingGrades';
// import ProgrammingAttendanceRate from '../../components/courses/programming/ProgrammingAttendanceRate';
// import ProgrammingChat from '../../components/courses/programming/ProgrammingChat';

// const Programming = () => {
//     const [activeTab, setActiveTab] = useState('Tab 1');

//     const handleSelect = (selectedKey) => {
//       setActiveTab(selectedKey);
//     };

//   return (
//     <>
//       <h1 className='course-header'>Programming</h1>
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
//             {activeTab === 'Tab 1' && <div><ProgrammingChat/></div>}
//             {activeTab === 'Tab 2' && <div><ProgrammingVideos/></div>}
//             {activeTab === 'Tab 3' && <div><ProgrammingFiles/></div>}
//             {activeTab === 'Tab 4' && <div><ProgrammingAssignments/></div>}
//             {activeTab === 'Tab 5' && <div><ProgrammingProjects/></div>}
//             {activeTab === 'Tab 6' && <div><ProgrammingQuizzes/></div>}
//             {activeTab === 'Tab 7' && <div><ProgrammingGrades/></div>}
//             {activeTab === 'Tab 8' && <div><ProgrammingAttendanceRate/></div>}
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Programming;