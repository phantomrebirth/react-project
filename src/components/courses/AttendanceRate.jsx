import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap';
// import { selectRole } from '../../redux/slices/authSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { login } from '../../redux/actions/auth';

const AttendanceRate = 
({
    role,
    token,
    courses,
    currentCourseID,
    isLoading
}) => {

    // const dispatch = useDispatch();
    // const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
        } else if (role === 'teacher') {
          setTeacher(true);
        }
        // dispatch(fetchCourses());
    }, [role]);
    // const { loading, data: courses, currentCourseId } = useSelector(selectCourses);

    const course = courses.find(course => course._id === currentCourseID);
    if (isLoading || !course) {
      return <LoadingSpinner />;
    }

  return (
    <>
        {student && (
            <Container fluid className='mt-3 last-container' style={{padding: "0"}}>
                <Row className='grades-container' style={{ margin: "0", padding: "0"}}>
                    <Col style={{ margin: "0" }}>
                        <div className='AR-container'>
                            <div className='AR-title'>
                                {course.name}
                            </div>
                            <div className='attendance-container'>
                                <div className='classes-container'>
                                    <div className='classes'>
                                        <p className='classes-num'>
                                            9
                                        </p>
                                        <p className='total-classes'>
                                            Total classes
                                        </p>
                                    </div>
                                    <hr className='AR-hr'>
                                    
                                    </hr>
                                    <div className='total-absents'>
                                        <p className='absent-num'>
                                            2
                                        </p>
                                        <p className='absent'>
                                            Absent
                                        </p>
                                    </div>
                                </div>
                                <div className='rate-container'>
                                    <p className='rate'>
                                        80%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        )}
        {teacher && (
            <div>
                <Table responsive className='mt-1'>
                    <thead>
                        <tr style={{textAlign: "center"}}>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Classes</th>
                            <th>Absent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{textAlign: "center"}}>
                            <td>1</td>
                            <td>Ahmed</td>
                            <td>8</td>
                            <td>2</td>
                        </tr>
                        <tr style={{textAlign: "center"}}>
                            <td>2</td>
                            <td>Yassin</td>
                            <td>8</td>
                            <td>1</td>
                        </tr>
                        <tr style={{textAlign: "center"}}>
                            <td>3</td>
                            <td>Harpy</td>
                            <td>9</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )}
    </>
  );
};

const mapStateToProps = state => ({
    role: state.auth.role,
    token: state.auth.token,
    courses: state.courses.coursesData,
    currentCourseID: state.courses.currentCourseID,
    isLoading: state.courses.isLoading,
});

export default connect(mapStateToProps,
    {
      login,
    })
(AttendanceRate);