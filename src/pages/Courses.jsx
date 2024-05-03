// import { Container } from 'react-bootstrap';
// import Card from 'react-bootstrap/Card';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import { HiOutlineChartPie } from 'react-icons/hi';
// import { FaChevronRight } from "react-icons/fa6";
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { selectRole } from '../redux/slices/authSlice';

// const courses = [
//   { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
//   { title: 'Programming', progress: 0.85, path: '/courses/programming' },
//   { title: 'Artificial Intelligence', progress: 0.6, path: '/courses/artificial-intelligence' },
//   { title: 'Network', progress: 0.9, path: '/courses/network' },
//   { title: 'Software Engineering', progress: 0.75, path: '/courses/software-engineering' },
// ];

// function Courses() {

//   const role = useSelector(selectRole);
//   const [teacher, setTeacher] = useState(false);
//   const [student, setStudent] = useState(false);
//   console.log(role);
  
//   useEffect(() => {
//     if (role === 'student') {
//       setStudent(true);
//     } else if (role === 'teacher') {
//       setTeacher(true);
//     }
//   }, [role]);

//   return (
//     <>
//       {student && (
//         <Container className='cards-container' style={{padding: "0px"}} fluid>
//           <Row xs={1} md={2} className="g-4" style={{padding: "0"}} id='cardsRow'>
//             {courses.map((course, idx) => (
//               <Col key={idx} className='cards'>
//                 <Link to={course.path} className='cards-link'>
//                   <Card style={{minHeight: "252px"}}>
//                     <Card.Body>
//                       <Card.Title className='card-title'>{course.title}</Card.Title>
//                       {/* <Card.Text>
//                         <HiOutlineChartPie />
//                       </Card.Text> */}
//                       <div className='progress-container'>
//                         <h5 className='card-text'>Progress</h5>
//                         <div className="progress-bar">
//                           <div className="progress" style={{ width: `${course.progress * 100}%` }}></div>
//                         </div>
//                       </div>
//                       <div className='arrow-container'>
//                         <div className='arrow-tail'></div>
//                         <FaChevronRight className='arrow-head'/>
//                           {/*  */}
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Link>
//               </Col>
//             ))}
//           </Row>
//         </Container>
//       )}
//       {/* {teacher && (

//       )} */}
//     </>
//   );
// }

// export default Courses;

// import { Container } from 'react-bootstrap';
// import Card from 'react-bootstrap/Card';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import { HiOutlineChartPie } from 'react-icons/hi';
// import { FaChevronRight } from "react-icons/fa6";
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { selectRole, selectToken } from '../redux/slices/authSlice';
// import axios from 'axios';

// function Courses() {
//   // const role = useSelector(selectRole);
//   const token = useSelector(selectToken);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCourses() {
//       try {
//         const response = await axios.get('https://ezlearn.onrender.com/getCourse/all', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const courseData = response.data;
//         setCourses(courseData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//         setLoading(false);
//       }
//     }
  
//     fetchCourses();
//   }, [token]);

//   return (
//     <>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Container className='cards-container' style={{ padding: "0px" }} fluid>
//           <Row xs={1} md={2} className="g-4" style={{ padding: "0" }} id='cardsRow'>
//             {courses && courses.length > 0 && courses.map((course, idx) => (
//               <Col key={idx} className='cards'>
//                 <Link to={`/courses/${course.name}`} className='cards-link'>
//                   <Card style={{ minHeight: "252px" }}>
//                     <Card.Body>
//                       <Card.Title className='card-title'>{course.name}</Card.Title>
//                       {/* <Card.Text>
//                         <HiOutlineChartPie />
//                       </Card.Text> */}
//                       <div className='progress-container'>
//                         <h5 className='card-text'>Progress</h5>
//                         <div className="progress-bar">
//                           <div className="progress" style={{ width: `${course.progress * 100}%` }}></div>
//                         </div>
//                       </div>
//                       <div className='arrow-container'>
//                         <div className='arrow-tail'></div>
//                         <FaChevronRight className='arrow-head' />
//                         {/*  */}
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Link>
//               </Col>
//             ))}
//           </Row>
//         </Container>
//       )}
//     </>
//   );
// }

// export default Courses;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses } from '../redux/slices/coursesSlice';
import { Container, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa6";
import LoadingSpinner from '../redux/actions/LoadingSpinner';

function Courses() {
  const dispatch = useDispatch();
  const { data: courses, loading, error } = useSelector(selectCourses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  console.log('Courses:', courses);

  return (
    <>
      {loading ? (
        <LoadingSpinner/>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Container className='cards-container' style={{ padding: "0px" }} fluid>
          <Row xs={1} md={2} className="g-4" style={{ padding: "0" }} id='cardsRow'>
            {courses.map((course, idx) => (
              <Col key={idx} className='cards'>
                <Link to={`/courses/${course.path}`} className='cards-link'>
                  <Card style={{ minHeight: "252px" }}>
                    <Card.Body>
                      <Card.Title className='card-title'>{course.name}</Card.Title>
                      <div className='progress-container'>
                        <h5 className='card-text'>Progress</h5>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${course.progress * 100}%` }}></div>
                        </div>
                      </div>
                      <div className='arrow-container'>
                        <div className='arrow-tail'></div>
                        <FaChevronRight className='arrow-head' />
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </>
  );
}

export default Courses;