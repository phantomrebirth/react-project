import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { HiOutlineChartPie } from 'react-icons/hi';
import { FaChevronRight } from "react-icons/fa6";

const courses = [
  { title: 'Computer Vision', progress: 0.75 },
  { title: 'Programming', progress: 0.85 },
  { title: 'Deep Learning', progress: 0.6 },
  { title: 'html', progress: 0.9 },
  { title: 'htmx', progress: 0.75 }
];

function Courses() {
  return (
    <Container className='cards-container' fluid>
      <Row xs={1} md={2} className="g-4" style={{padding: "0", margin: "0"}} id='cardsRow'>
        {courses.map((course, idx) => (
          <Col key={idx} className='cards'>
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
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Courses;