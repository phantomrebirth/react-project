import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaChevronRight } from "react-icons/fa6";
import { HiArrowLongRight } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectRole } from '../redux/slices/authSlice';

const courses = [
  { title: 'Network', progress: 0.9, path: '/courses/network' },
  { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
];

const HomePage = () => {
  
  const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  console.log(role);
  
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);

  return (
    <>
    {student && (
      <Container style={{display: "flex", justifyContent: "center", padding: "0"}}>
      <Container style={{padding: "0px", margin: "0", width: "100%", maxWidth:"100%"}} className='homepage-container'>
        <Container style={{padding: "0px", margin: "0", width: "100%", maxWidth:"100%", display: "inline-block"}}>
          <Row>
            <h1 className='homepage-description'>
              {/* <span style={{color: "#7939ff"}}
                >EZ
              </span> */}
              the e-learning we <span style={{textDecoration: "line-through", fontWeight: "normal"}}
                >know
              </span> deserve.
            </h1>
          </Row>
          <Row>
            <h5 style={{marginTop: "0.75rem", display: "flex" , alignItems: "center", marginLeft: "1rem"}}
                className='latest-updates'
            >
                Latest updates
                <span className="arrow-animation" style={{marginLeft: "1rem"}}
                  >&#9660;
                </span>
            </h5>
          </Row>
        </Container>
        <Container style={{padding: "0", margin: "0", width: "100%", maxWidth:"100%"}} className='homeCourses-container'>
          <Container className='cards-container' style={{padding: "0", width: "100%"}} fluid>
            <Row xs={1} md={2} xl={12} className="g-4" style={{padding: "0",
                                                               flexWrap: "nowrap",
                                                               justifyContent: "space-between",
                                                               width: "100%",
                                                               maxWidth:"100%"}}
                                       id='cardsRow'
            >
              {courses.map((course, idx) => (
              // margin: "1rem 3% 1rem 4px",
                <Col key={idx} className='cards' style={{margin: "1rem 5% 1rem 5px", padding: "0 4px 0 0", maxWidth: "34rem"}}>
                  <Link to={course.path} className='cards-link'>
                    <Card style={{transform: "none",
                                  minHeight: "252px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #000",
                                  // outline: "1px solid rgb(121 57 255 / 10%)",
                                  // outlineOffset: "4px",
                                  boxShadow: "0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.3) inset, 0 0 8px rgba(121, 57, 255, 0.3) inset",
                                }} 
                          title='Open course'
                    >
                      <Card.Body>
                        <Card.Title className='card-title' style={{color: "#000"}}>{course.title}</Card.Title>
                        <div className='progress-container'>
                          <h5 className='card-text' style={{color: "#000"}}>Progress</h5>
                          <div className="progress-bar" style={{backgroundColor: "#bbb"}}>
                            <div className="progress" style={{ width: `${course.progress * 100}%`, backgroundColor: "#7939ff" }}></div>
                          </div>
                        </div>
                        <div className='arrow-container'>
                          <div className='arrow-tail' style={{backgroundColor: "#000"}}></div>
                          <FaChevronRight className='arrow-head' style={{color: "#000"}}/>
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
          <Container style={{maxWidth: "100%", display: "inline-block"}}
                     className='home-AssContainer'
          >
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
          {/* paddingBottom: "1%", */}
          <Container style={{ maxWidth: "100%", margin: "0.5rem 0 0 0"}}
                     className='home-QuizContainer'
          >
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
    )}
    {teacher && (
      <div>ana mo3id</div>
    )}

      </>
  );
};

export default HomePage;