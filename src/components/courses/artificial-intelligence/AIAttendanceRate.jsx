// import React, { useEffect, useState } from 'react'
// import { Col, Container, Row } from 'react-bootstrap';
// import { selectRole } from '../../../redux/slices/authSlice';
// import { useSelector } from 'react-redux';

// const AIAttendanceRate = () => {

//     const role = useSelector(selectRole);
//     const [teacher, setTeacher] = useState(false);
//     const [student, setStudent] = useState(false);
//     console.log(role);
    
//     useEffect(() => {
//       if (role === 'student') {
//         setStudent(true);
//       } else if (role === 'teacher') {
//         setTeacher(true);
//       }
//     }, [role]);

//   return (
//     <>
//         {student && (
//             <Container fluid className='mt-3 last-container' style={{padding: "0"}}>
//                 <Row className='grades-container' style={{ margin: "0", padding: "0"}}>
//                     <Col style={{ margin: "0" }}>
//                         <div className='AR-container'>
//                             <div className='AR-title'>
//                                 Artificial Intelligence
//                             </div>
//                             <div className='attendance-container'>
//                                 <div className='classes-container'>
//                                     <div className='classes'>
//                                         <p className='classes-num'>
//                                             8
//                                         </p>
//                                         <p className='total-classes'>
//                                             Total classes
//                                         </p>
//                                     </div>
//                                     <hr className='AR-hr'>
                                    
//                                     </hr>
//                                     <div className='total-absents'>
//                                         <p className='absent-num'>
//                                             2
//                                         </p>
//                                         <p className='absent'>
//                                             Absent
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className='rate-container'>
//                                     <p className='rate'>
//                                         75%
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Col>
//                 </Row>
//             </Container>
//         )}
//         {teacher && (
//             <div>_</div>
//         )}
//     </>
//   );
// };

// export default AIAttendanceRate;