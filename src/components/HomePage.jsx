// import React from 'react';
// import { Container } from 'react-bootstrap';
// import Card from 'react-bootstrap/Card';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import { FaChevronRight } from "react-icons/fa6";
// import { Link } from 'react-router-dom';

// const courses = [
//   { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
//   { title: 'Programming', progress: 0.85, path: '/courses/programming' },
//   { title: 'AI', progress: 0.6, path: '/courses/artificial-intelligence' },
//   { title: 'Network', progress: 0.9, path: '/courses/network' },
//   { title: 'Software Engineering', progress: 0.75, path: '/courses/software-engineering' },
// ];

// const HomePage = () => {

//   return (
//     <Container style={{padding: "0px", margin: "0", width: "100%", maxWidth:"100%"}} className='homepage-container'>
//       <Container style={{padding: "0px", margin: "0", width: "100%", maxWidth:"100%"}} className='homeCourses-container'>
//         <Container className='cards-container' style={{padding: "0px", width: "100%"}} fluid>
//           <Row xs={1} md={2} xl={12} className="g-4" style={{padding: "0", flexWrap: "nowrap", justifyContent: "normal", width: "100%", maxWidth:"100%"}} id='cardsRow'>
//             {courses.map((course, idx) => (
//               <Col key={idx} className='cards' style={{margin: "1rem 3% 1rem 0%"}}>
//                 <Link to={course.path} className='cards-link'>
//                   <Card style={{transform: "none", minHeight: "252px"}}>
//                     <Card.Body>
//                       <Card.Title className='card-title'>{course.title}</Card.Title>
//                       <div className='progress-container'>
//                         <h5 className='card-text'>Progress</h5>
//                         <div className="progress-bar">
//                           <div className="progress" style={{ width: `${course.progress * 100}%` }}></div>
//                         </div>
//                       </div>
//                       <div className='arrow-container'>
//                         <div className='arrow-tail'></div>
//                         <FaChevronRight className='arrow-head'/>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Link>
//               </Col>
//             ))}
//           </Row>
//         </Container>
//       </Container>
//       <Container style={{padding: "0px", margin: "0", width: "100%", maxWidth:"100%"}}>
            
//       </Container>
//     </Container>
//   );
// };

// export default HomePage;

import React from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaChevronRight } from "react-icons/fa6";
import { HiArrowLongRight } from "react-icons/hi2";
import { Link } from 'react-router-dom';

const courses = [
  { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
  { title: 'Network', progress: 0.9, path: '/courses/network' },
];

const HomePage = () => {

  return (
    <Container style={{display: "flex", justifyContent: "center", padding: "0"}}>
    <Container style={{padding: "0px", margin: "0", width: "100%", maxWidth:"100%"}} className='homepage-container'>
      <Container style={{padding: "0", margin: "0", width: "100%", maxWidth:"100%"}} className='homeCourses-container'>
        <Container className='cards-container' style={{padding: "0", width: "100%"}} fluid>
          <Row xs={1} md={2} xl={12} className="g-4" style={{padding: "0", flexWrap: "nowrap", justifyContent: "normal", width: "100%", maxWidth:"100%"}} id='cardsRow'>
            {courses.map((course, idx) => (
              <Col key={idx} className='cards' style={{margin: "1rem 3% 1rem 0%"}}>
                <Link to={course.path} className='cards-link'>
                  <Card style={{transform: "none", minHeight: "252px"}}>
                    <Card.Body>
                      <Card.Title className='card-title'>{course.title}</Card.Title>
                      <div className='progress-container'>
                        <h5 className='card-text'>Progress</h5>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${course.progress * 100}%` }}></div>
                        </div>
                      </div>
                      <div className='arrow-container'>
                        <div className='arrow-tail'></div>
                        <FaChevronRight className='arrow-head'/>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>
      <Container style={{padding: "0", margin: "0", width: "100%", maxWidth:"100%"}}>
        <Container style={{maxWidth: "100%", display: "inline-block"}} className='home-AssContainer'>
          <Row>
            <h3 className='home-myAssHeader'>
              My Assignments
            </h3>
          </Row>
          <Row>
            <div className='home-myAssContainer'>
              <div className='home-myAssTitleContainer'>
                <h4 className='home-myAssTitle'>
                  Computer Vision
                </h4>
                <div className='home-myAssNameContainer'>
                  <h6 className='home-myAssName'>
                    Assignment 1 , 
                  </h6>
                  <h6 className='home-myAssDate'>
                    6-2-2024
                  </h6>
                </div>
              </div>
              <div className='home-myAssBtnContainer'>
                <button className='home-myAssBtn'>
                  Completed
                </button>
              </div>
            </div>
          </Row>
          <Row>
            <div className='home-myAssContainer'>
              <div className='home-myAssTitleContainer'>
                <h4 className='home-myAssTitle'>
                  Network
                </h4>
                <div className='home-myAssNameContainer'>
                  <h6 className='home-myAssName'>
                    Assignment 1 , 
                  </h6>
                  <h6 className='home-myAssDate'>
                    6-2-2024
                  </h6>
                </div>
              </div>
              <div className='home-myAssBtnContainer'>
                <button className='home-myAssBtn'>
                  Completed
                </button>
              </div>
            </div>
          </Row>
        </Container>
        <Container style={{padding: "0 0 0 2%", maxWidth: "100%", margin: "1.5rem 0 0 0"}} className='home-QuizContainer'>
          <Row>
            <h3 className='home-QuizHeader'>
              Quiz
            </h3>
          </Row>
          <Row>
            <div className='home-myQuizContainer'>
              <div className='home-QuizTitleContainer'>
                <h4 className='home-QuizTitle'>
                  Network
                </h4>
                <div className='home-QuizDateContainer'>
                  <h5 className='home-QuizDate'>
                    6/2/2024
                  </h5>
                  <div className='home-quizArrowContainer'>
                    <HiArrowLongRight className='home-quizArrow'/>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </Container>
    </Container>
    </Container>
  );
};

export default HomePage;

// import React, { useState, useEffect } from 'react';
// import { Container } from 'react-bootstrap';
// import Card from 'react-bootstrap/Card';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import { FaChevronRight } from "react-icons/fa6";
// import { Link } from 'react-router-dom';

// const courses = [
//   { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
//   { title: 'Programming', progress: 0.85, path: '/courses/programming' },
//   { title: 'AI', progress: 0.6, path: '/courses/artificial-intelligence' },
//   { title: 'Network', progress: 0.9, path: '/courses/network' },
//   { title: 'Software Engineering', progress: 0.75, path: '/courses/software-engineering' },
// ];

// const HomePage = () => {
//   const [currentIndices, setCurrentIndices] = useState([0, 1]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndices(prevIndices => prevIndices.map(index => (index + 1) % courses.length));
//     }, 6000); // 6000 milliseconds = 6 seconds

//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <Container fluid className='homepage-container'>
//       <Row className='cards-row'>
//         {currentIndices.map((index) => (
//           <Col key={index} className='cards'>
//             <Link to={courses[index].path} className='cards-link'>
//               <Card className='card' style={{ opacity: currentIndices.includes(index) ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}>
//                 <Card.Body>
//                   <Card.Title className='card-title'>{courses[index].title}</Card.Title>
//                   <div className='progress-container'>
//                     <h5 className='card-text'>Progress</h5>
//                     <div className="progress-bar">
//                       <div className="progress" style={{ width: `${courses[index].progress * 100}%` }}></div>
//                     </div>
//                   </div>
//                   <div className='arrow-container'>
//                     <div className='arrow-tail'></div>
//                     <FaChevronRight className='arrow-head' />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Link>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default HomePage;