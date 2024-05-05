// import React, { useEffect, useState } from 'react'
// import { Col, Row } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
// import { selectRole } from '../../../redux/slices/authSlice';

// const SWGrades = () => {

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
//     <div>
//         {student && (
//             <Row className='grades-container' style={{ margin: "0", padding: "0"}}>
//                 <Col style={{ margin: "0", padding: "0"}}>
//                     <div className='fQ-container'>
//                         <div className='quiz-header'>
//                             <ul className='q-head'>
//                                 <li>Software Engineering</li>
//                             </ul>
//                         </div>
//                         <div className='finished-quiz'>
//                             <div className='fQName-container'>
//                                 <h5 className='fQ-name'>Quiz 1</h5>
//                                 <h6 className='fQ-zeros'>00.00.0000</h6>
//                             </div>
//                             <div>
//                                 <p className='grade'>
//                                     17/20
//                                 </p>
//                             </div>
//                             <button className='fQ-btn'>
//                                 Finished
//                             </button>
//                         </div>
//                     </div>
//                 </Col>
//             </Row>
//         )}
//         {teacher && (
//             <div>_</div>
//         )}
//     </div>
//   );
// };

// export default SWGrades;