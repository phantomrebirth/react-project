import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FaChevronRight } from "react-icons/fa6";
import { HiArrowLongRight } from "react-icons/hi2";
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../redux/actions/auth';
import { connect } from 'react-redux';
import { getCourses } from '../redux/actions/courses';
import LoadingSpinner from '../redux/actions/LoadingSpinner';
// import { selectRole } from '../redux/slices/authSlice';

const homeCourses = [
  { title: 'Network', progress: 0.9, path: '/courses/network' },
  { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
];

const HomePage = 
({ 
  role,
  courses,
  isLoading,
  getCourses,
  token
}) => {
  
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
    if (courses.length === 0 && !isLoading) {
      getCourses();
    }
  }, [role, isLoading]);
  
  // useEffect(() => {
  //   if (courses.length === 0 && !isLoading) {
  //     getCourses();
  //   }
  // }, [isLoading]);

  if (isLoading) {
    return (
        <LoadingSpinner/>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
  };

  const lastTwoCourses = courses.slice(-2); // Get the last two courses

  const renderAssignments = () => {
    if (courses.length === 0) {
      return null;
    }

    const renderAssignmentStatus = (assignment) => {
      if (!assignment) return 'No assignment';
      return assignment.solutions && assignment.solutions.length > 0 ? 'Completed' : 'In progress';
    };

    const firstCourseAssignment = courses[0].assignments[0]?.filename || 'No assignment';
    const firstCourseAssignmentTime = formatDate(courses[0].assignments[0]?.uploadtime) || '';
    const firstCourseAssignmentStatus = renderAssignmentStatus(courses[0].assignments[0]);

    const secondCourseAssignment = courses[1].assignments[0]?.filename || 'No assignment';
    const secondCourseAssignmentTime = formatDate(courses[1].assignments[0]?.uploadtime) || '';
    const secondCourseAssignmentStatus = renderAssignmentStatus(courses[1].assignments[0]);

    return (
      <>
        <Row>
          <div className='home-myAssContainer'>
            <div className='home-myAssTitleContainer'>
              <h4 className='home-myAssTitle'>
                {courses[0].name}
              </h4>
              <div className='home-myAssNameContainer'>
                <h6 className='home-myAssName'>
                  {firstCourseAssignment},
                </h6>
                <h6 className='home-myAssDate'>
                  Uploaded at: {firstCourseAssignmentTime}
                </h6>
              </div>
            </div>
            <div className='home-myAssBtnContainer'>
              <button className='home-myAssBtn'>
                {firstCourseAssignmentStatus}
              </button>
            </div>
          </div>
        </Row>
        <Row>
          <div className='home-myAssContainer'>
            <div className='home-myAssTitleContainer'>
              <h4 className='home-myAssTitle'>
                {courses[1].name}
              </h4>
              <div className='home-myAssNameContainer'>
                <h6 className='home-myAssName'>
                  {secondCourseAssignment},
                </h6>
                <h6 className='home-myAssDate'>
                  Uploaded at: {secondCourseAssignmentTime}
                </h6>
              </div>
            </div>
            <div className='home-myAssBtnContainer'>
              <button className='home-myAssBtn'>
                {secondCourseAssignmentStatus}
              </button>
            </div>
          </div>
        </Row>
      </>
    );
  };

  console.log(role);

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
                {courses.slice(-2).reverse().map((course, idx) => (
                // margin: "1rem 3% 1rem 4px",
                  <Col key={idx} className='cards' style={{margin: "1rem 5% 1rem 5px", padding: "0 4px 0 0", maxWidth: "34rem"}}>
                    <Link to={`/courses/${course.path}`} className='cards-link'>
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
                          <Card.Title className='card-title' style={{color: "#000"}}>{course.name}</Card.Title>
                          <div className='progress-container'>
                            <h5 className='card-text' style={{color: "#000"}}>Progress</h5>
                            <div className="progress-bar" style={{backgroundColor: "#bbb"}}>
                            {/* <div className="progress" style={{ width: `${course.progress * 100}%`, backgroundColor: "#7939ff" }}></div> */}
                              <div className="progress" style={{ width: `${70}%`, backgroundColor: "#7939ff" }}></div>
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
              {/* <Row>
                <div className='home-myAssContainer'>
                  <div className='home-myAssTitleContainer'>
                    <h4 className='home-myAssTitle'>
                      {courses[0].title}
                    </h4>
                    <div className='home-myAssNameContainer'>
                      <h6 className='home-myAssName'>
                        {firstCourseAssignment},
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
              </Row> */}
              {renderAssignments()}
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
        <div>
          <Container style={{display: "flex", justifyContent: "center", padding: "0"}}>
            <Container style={{padding: "0", margin: "0", width: "100%", maxWidth:"100%"}} className='homeCourses-container'>
              <Container className='cards-container' style={{padding: "0", width: "100%"}} fluid>
                <Row xs={1} md={2} xl={12} className="g-4" style={{padding: "0",
                                                                    flexWrap: "nowrap",
                                                                    justifyContent: "center",
                                                                    width: "100%",
                                                                    maxWidth:"100%"}}
                                            id='cardsRow'
                >
                  {courses.map((course, idx) => (
                    <Col key={idx} className='cards' style={{margin: "1rem 0% 1rem 5px", padding: "0 24px 0 20px", maxWidth: "34rem"}}>
                      <Link to={`/courses/${course.path}`} className='cards-link'>
                      <Card style=
                        {{
                          // transform: "none",
                          minHeight: "252px",
                          backgroundColor: "#fff",
                          border: "1px solid #000",
                          boxShadow: "0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.1), 0 0 8px rgba(121, 57, 255, 0.3) inset, 0 0 8px rgba(121, 57, 255, 0.3) inset",
                        }} 
                        title='Open course'
                      >
                          <Card.Body>
                            <Card.Title className='card-title' style={{color: "#000"}}>{course.name}</Card.Title>
                            <div className='progress-container'>
                              <h5 className='card-text' style={{color: "#000"}}>Progress</h5>
                              <div className="progress-bar" style={{backgroundColor: "#bbb"}}>
                                <div className="progress" style={{ width: `${course.progress * 100}%`, backgroundColor: "#7939ff" }}></div>
                              </div>
                            </div>
                            <div className='arrow-container'>
                              <div className='arrow-tail' style={{backgroundColor: "#000"}}></div>
                              <FaChevronRight className='arrow-head' style={{color: "#000"}} />
                            </div>
                          </Card.Body>
                      </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Container>
            </Container>
          </Container>
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  role: state.auth.role,
  courses: state.courses.coursesData,
  isLoading: state.courses.isLoading,
  token: state.auth.token,
});

export default connect(mapStateToProps, { login, getCourses })(HomePage);