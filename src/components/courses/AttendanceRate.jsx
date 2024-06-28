import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
// import { selectRole } from '../../redux/slices/authSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { login } from '../../redux/actions/auth';
import { FaCamera, FaPaperPlane } from 'react-icons/fa6';
import AttendanceCameraModal from '../AttendanceCameraModel';
import axios from 'axios';
import * as XLSX from 'xlsx';
import apiUrl from '../ApiUrl';
import { TbFileDownload } from 'react-icons/tb';
import { resetDeleteAlert, resetUploadAlert, resetWaitAlert, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/actions/courses';
import attendanceImage from '../../assets/images/attendance.png'

const AttendanceRate = 
({
    role,
    token,
    courses,
    currentCourseID,
    isLoading,
    setWaitAlert,
    setDeleteAlert,
    setUploadAlert,
    resetDeleteAlert,
    resetUploadAlert,
    resetWaitAlert,
    waitAlert,
    uploadAlert,
    deleteAlert,
}) => {

    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [capturedPhotoPending, setCapturedPhotoPending] = useState(false);
    const [photoSent, setPhotoSent] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [firstBtns, setFirstBtns] = useState(true);
    const [post, setPost] = useState(true)

    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
        } else if (role === 'teacher') {
          setTeacher(true);
        }
    }, [role]);
    useEffect(() => {
        const timeout = setTimeout(() => {
          if (uploadAlert) {
            resetUploadAlert();
          }
          if (deleteAlert) {
            resetDeleteAlert();
          }
          // if (waitAlert) {
          //   resetWaitAlert();
          // }
        }, 4000);
        return () => clearTimeout(timeout);
      }, [uploadAlert, deleteAlert, waitAlert]);

    const course = courses.find(course => course._id === currentCourseID);
    if (isLoading || !course) {
      return <LoadingSpinner />;
    }

    const handleCapturePhoto = (photoUrl) => {
        setCapturedPhoto(photoUrl);
        setCapturedPhotoPending(true);
    };

    console.log(currentCourseID)
      
    const handlePostRequest = async () => {

        setWaitAlert({ variant: 'info', message: 'Marking students... please wait' });

        try {
            const response = await axios.post(`${apiUrl}/mark_absent`, {
                courseId: currentCourseID,
            }, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    // 'Authorization': `Bearer ${token}`
                }
            });
            setUploadAlert({ variant: 'primary', message: 'Attendance marked successfully!' });
            setPost(false);
            console.log('Post request successful:', response.data);
            // Handle success scenario (e.g., show success message)
        } catch (error) {
            console.error('Error in post request:', error);
            setUploadAlert({ variant: 'danger', message: `Error marking attendance: ${error.message}` });
        } finally {
            resetWaitAlert();
        }
    };

    const handleSendCapturedPhoto = async () => {
        if (capturedPhoto) {
            setWaitAlert({ variant: 'info', message: 'Sending captured image... please wait' });
            try {
                // Convert base64 photo to blob
                const response = await fetch(capturedPhoto);
                const blob = await response.blob();
    
                // Create FormData and append blob with filename
                const formData = new FormData();
                formData.append('courseId', currentCourseID);
                formData.append('attendanceImage', blob, 'captured_photo.png'); // Set filename here
                console.log(blob)
                console.log(capturedPhoto)
                // Send FormData with axios
                const axiosResponse = await axios.post(`${apiUrl}/attendance`, formData, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        // 'Authorization': `Bearer ${token}`
                    }
                });
                setUploadAlert({ variant: 'primary', message: 'Photo sent successfully!' });
                console.log('Photo sent successfully:', axiosResponse.data);
                setPhotoSent(true);
                setFirstBtns(false)
            } catch (error) {
                console.error('Error sending photo:', error);
                setUploadAlert({ variant: 'danger', message: `Error sending photo: ${error.message}` });
            } finally {
                setCapturedPhotoPending(false);
                resetWaitAlert();
            }
        }
    };

    const handleGetAttendance = async () => {

        setWaitAlert({ variant: 'info', message: 'Saving attendance file... please wait' });

        try {
            const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
            console.log(currentDate);
    
            const response = await axios.get(`https://thankful-ample-shrimp.ngrok-free.app/attendance/${currentCourseID}/${currentDate}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${token}`
                }
            });
            setUploadAlert({ variant: 'primary', message: 'Attendance file saved successfully!' });
            setPhotoSent(false);
            setFirstBtns(true)
            console.log('Attendance data:', response.data);
    
            const attendanceData = response.data;
    
            // Prepare data for Excel
            const presentStudents = attendanceData.presentStudents.map(student => ({
                'Student ID': student.studentId,
                'Name': student.name || 'N/A',
                'Status': 'Present',
                'Date': attendanceData.date
            }));
    
            const absentStudents = attendanceData.absentStudents.map(student => ({
                'Student ID': student.studentId,
                'Name': student.name || 'N/A',
                'Status': 'Absent',
                'Date': attendanceData.date
            }));
    
            // Combine present and absent students
            const combinedData = [...presentStudents, ...absentStudents];
    
            // Create a new workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(combinedData);
    
            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
            // Generate an Excel file and download it
            XLSX.writeFile(wb, 'attendance.xlsx');
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setUploadAlert({ variant: 'danger', message: `Error saving attendance file: ${error.message}` });
        } finally {
            setSelectedFile(null)
            setCapturedPhoto(null)
            resetWaitAlert();
        }
    };
    
    
    const handleSendSelectedPhoto = async () => {

        setWaitAlert({ variant: 'info', message: 'Sending selected photo... please wait' });

        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('courseId', currentCourseID);
                formData.append('attendanceImage', selectedFile, 'selected_photo.png');
                
                const axiosResponse = await axios.post(`${apiUrl}/attendance`, formData, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        // 'Authorization': `Bearer ${token}`
                    }
                });
                setUploadAlert({ variant: 'primary', message: 'Photo sent successfully!' });
                console.log('Photo sent successfully:', axiosResponse.data);
                setPhotoSent(true);
                setFirstBtns(false)
            } catch (error) {
                console.error('Error sending photo:', error);
                setUploadAlert({ variant: 'danger', message: `Error sending selected photo: ${error.message}` });
            } finally {
                setSelectedFile(null)
                resetWaitAlert();
            }
        }
    };

    const handleSendPhoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
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
      {uploadAlert && (
        <Alert variant={uploadAlert.variant} onClose={() => resetUploadAlert()} dismissible>
          {uploadAlert.message}
        </Alert>
      )}
      {deleteAlert && (
        <Alert variant={deleteAlert.variant} onClose={() => resetDeleteAlert()} dismissible>
          {deleteAlert.message}
        </Alert>
      )}
      {waitAlert && (
        <Alert variant={waitAlert.variant}>
          {waitAlert.message}
        </Alert>
      )}
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
                {photoSent && !capturedPhotoPending && !firstBtns && (
                    <div className='postRequestBtn-container mt-5'>
                        <Button variant='primary' className="post-request-btn" onClick={handlePostRequest}>
                            Mark Attendance
                        </Button>
                    </div>
                )}
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                    {capturedPhotoPending && (
                        <div className="attendance-photo-container">
                            <img src={capturedPhoto} alt="Captured" className='attendance-photo'/>
                            <button className="captured-deleteBtn" style={{right: "-2rem"}} onClick={handleDeleteCapturedPhoto} title='Cancel'>
                                X
                            </button>
                        </div>
                    )}
                </div>
                <div className='cameraBtn-container mt-3'>
                    {!capturedPhotoPending && (
                        <>
                            {!photoSent && firstBtns ? (
                            <Button variant='primary' className="attendance-cameraBtn" onClick={handleCameraClick} disabled={capturedPhotoPending || selectedFile}>
                                <FaCamera className='camera-icon' style={{ fontSize: "2rem", marginRight: "1rem"}} title='Open camera'/>
                                Take Picture
                            </Button>
                            ) : (
                                <>
                                    <Button variant='outline-secondary'
                                            className="save-attendanceBtn mt-5"
                                            onClick={handleGetAttendance}
                                            disabled={post}
                                            title='Create new file'
                                    >
                                        <TbFileDownload className='camera-icon' style={{ fontSize: "2.5rem", marginRight: "0.75rem"}}/>
                                        Save Attendance
                                    </Button>
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", flexDirection: "column", marginTop: "3.5rem"}}>
                                        <img src={attendanceImage} alt='' className='attendance-vector' />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className='sendAttendanceBtn-container'>
                    {capturedPhotoPending && (
                        <button className="attendance-sendBtn" onClick={handleSendCapturedPhoto}>
                            Take Attendance
                            <FaPaperPlane style={{margin: "0 0 0 1rem"}}/>
                        </button>
                    )}
                </div>
                {!capturedPhotoPending && !capturedPhoto && firstBtns && (
                    <>
                        <Container className="mt-4" style={{overflowY: "auto"}}>
                            <Row className="justify-content-md-center" style={{overflowY: "auto"}}>
                                <Col md={6} style={{overflowY: "auto", paddingBottom: "2rem"}}>
                                    <Form.Group>
                                        <Form.Label style={{textAlign: "center", width: "100%"}}>Upload Photo</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={handleSendPhoto}
                                            accept="image/*"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                        <div className='cameraBtn-container'>
                            <Button variant='primary' className="attendance-cameraBtn" style={{borderRadius: "3rem", height: "4rem"}} onClick={handleSendSelectedPhoto} disabled={capturedPhotoPending || !selectedFile}>
                                    Send Photo
                                    <FaPaperPlane style={{ margin: "0 0 0 1rem" }} />
                            </Button>
                        </div>
                    </>
                )}
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
    deleteAlert: state.courses.deleteAlert,
    uploadAlert: state.courses.uploadAlert,
    waitAlert: state.courses.waitAlert,
});

export default connect(mapStateToProps,
    {
      login,
      setUploadAlert,
      setWaitAlert,
      setDeleteAlert,
      resetUploadAlert,
      resetDeleteAlert,
      resetWaitAlert,
    })
(AttendanceRate);