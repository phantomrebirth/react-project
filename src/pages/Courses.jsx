import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { HiOutlineChartPie } from 'react-icons/hi';
import { FaChevronRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const courses = [
  { title: 'Computer Vision', path: '/courses/computer-vision', progress: 0.75 },
  { title: 'Programming', progress: 0.85, path: '/courses/programming' },
  { title: 'AI', progress: 0.6, path: '/courses/artificial-intelligence' },
  { title: 'Network', progress: 0.9, path: '/courses/network' },
  { title: 'Software Engineering', progress: 0.75, path: '/courses/software-engineering' },
];

function Courses() {
  return (
    <Container className='cards-container' style={{padding: "0px"}} fluid>
      <Row xs={1} md={2} className="g-4" style={{padding: "0"}} id='cardsRow'>
        {courses.map((course, idx) => (
          <Col key={idx} className='cards'>
            <Link to={course.path} className='cards-link'>
              <Card>
                <Card.Body>
                  <Card.Title className='card-title'>{course.title}</Card.Title>
                  {/* <Card.Text>
                    <HiOutlineChartPie />
                  </Card.Text> */}
                  <div className='progress-container'>
                    <h5 className='card-text'>Progress</h5>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${course.progress * 100}%` }}></div>
                    </div>
                  </div>
                  <div className='arrow-container'>
                    <div className='arrow-tail'></div>
                    <FaChevronRight className='arrow-head'/>
                      {/*  */}
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Courses;