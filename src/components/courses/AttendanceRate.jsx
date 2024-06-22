import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
// import { selectRole } from '../../redux/slices/authSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { login } from '../../redux/actions/auth';
import { FaCamera } from 'react-icons/fa6';
import AttendanceCameraModal from '../AttendanceCameraModel';
import axios from 'axios';

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
    const [showCamera, setShowCamera] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [capturedPhotoPending, setCapturedPhotoPending] = useState(false);
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

    const handleCapturePhoto = (photoUrl) => {
        setCapturedPhoto(photoUrl);
        setCapturedPhotoPending(true);
    };

    console.log(currentCourseID)
      
    const handleSendCapturedPhoto = async () => {
        if (capturedPhoto) {
            try {
                // Convert base64 photo to blob
                const response = await fetch(capturedPhoto);
                const blob = await response.blob();
    
                // Create FormData and append blob with filename
                const formData = new FormData();
                formData.append('courseId', currentCourseID);
                formData.append('image', blob, 'captured_photo.png'); // Set filename here
    
                // Send FormData with axios
                const axiosResponse = await axios.post('https://glorious-expert-koala.ngrok-free.app/attendance', formData, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                console.log('Photo sent successfully:', axiosResponse.data);
                // Handle success scenario (e.g., show success message)
            } catch (error) {
                console.error('Error sending photo:', error);
                // Handle error scenario (e.g., show error message)
            }
        }
    };

    
    const handleDeleteCapturedPhoto = () => {
        setCapturedPhoto(null);
        setCapturedPhotoPending(false);
    };
      
    const handleCameraClick = () => {
        setShowCamera(true);
    };
      
    const handleCloseCamera = () => {
        setShowCamera(false);
    };

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
                {/* <Table responsive className='mt-1'>
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
                </Table> */}

                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    {capturedPhotoPending && (
                        <div className="captured-photo-container" style={{maxWidth: "666px", maxHeight: "400px", bottom: "0"}}>
                            <img src={capturedPhoto} alt="Captured" className='captured-photo' style={{maxWidth: "none"}}/>
                            <button className="captured-deleteBtn" onClick={handleDeleteCapturedPhoto} title='Cancel'>
                                X
                            </button>
                        </div>
                    )}
                </div>
                <div style={{width: "100%", height: "50vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {!capturedPhotoPending && (
                        <Button variant= 'primary' className="attendance-cameraBtn" onClick={handleCameraClick} disabled={capturedPhotoPending}>
                            <FaCamera className='camera-icon' style={{ fontSize: "2rem", marginRight: "1rem"}} title='Open camera'/>
                            Take Attendance
                        </Button>
                    )}    
                    {capturedPhotoPending && (
                        <button className="attendance-cameraBtn" onClick={handleSendCapturedPhoto}>
                            Send Photo
                        </button>
                    )}
                </div>
                {showCamera && (
                    <div className='camera-model-container'>
                        <AttendanceCameraModal
                            onClose={handleCloseCamera}
                            onCapture={handleCapturePhoto}
                        />
                    </div>
                )}
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