import React, { useEffect, useRef, useState } from 'react'
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import ReactPlayer from 'react-player';
// import { selectRole, selectToken } from '../../redux/slices/authSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from "react-icons/hi";
import axios from 'axios';
import { IoAdd } from 'react-icons/io5';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { login } from '../../redux/actions/auth';
import { getCourseVideo, resetDeleteAlert, resetUploadAlert, resetWaitAlert, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/actions/courses';

const Videos = 
({
    role,
    token,
    videoIsLoading,
    courses,
    isLoading,
    courseVideoData,
    waitAlert,
    uploadAlert,
    deleteAlert,
    currentCourseID,
    error
}) => {
    // const dispatch = useDispatch();
    // const role = useSelector(selectRole);
    // const token = useSelector(selectToken);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    const [videosPaths, setVideosPaths] = useState([]);
    // const [uploadAlert, setUploadAlert] = useState(null);
    // const [deleteAlert, setDeleteAlert] = useState(null);
    useEffect(() => {
        if (role === 'student') {
            setStudent(true);
        } else if (role === 'teacher') {
            setTeacher(true);
        }
        // dispatch(fetchCourses());
    }, [role]);
    const fileInputRef = useRef(null);
    console.log('Current Course ID:', currentCourseID);
    const course = courses.find(course => course._id === currentCourseID);
    console.log('Course:', course);
    if (isLoading || videoIsLoading || !course) {
        return <LoadingSpinner/>;
    }
    useEffect(() => {
        const videoPath = courseVideoData;
        console.log('Video Paths:', videoPath);
        const videos = course.videos.map(video => {
          const matchingPath = videoPath.find(path => path.includes(video._id));
          const basePath = `https://ezlearn.onrender.com/course/getVideos/${currentCourseID}/`;
          return {
            ...video,
            path: matchingPath ? `${basePath}${video._id}` : ''
          };
        });
        setVideosPaths(videos);
        console.log('Videos:', videos);
      }, [currentCourseID, courses, courseVideoData]);
      useEffect(() => {
        console.log('Videos Paths:', videosPaths);
      }, [videosPaths]);
    // const videoPath = course.videos.map(video => `https://ezlearn.onrender.com/course/getVideos/${currentCourseID}/${video._id}`);
    // const videosPaths = course.videos.map(video => {
    //     const matchingPath = videoPath.find(path => path.includes(video._id));
    //     return {
    //         ...video,
    //         path: matchingPath || ''
    //     };
    // });

    const handleVideoDownload = async (video) => {
      const { filename, path } = video;
      try {
          const response = await fetch(path);
          const fileData = await response.arrayBuffer();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([fileData]));
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      } catch (error) {
          console.error('Error downloading file:', error);
      };
    };

    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('videos', file);
    
        try {
            const response = await axios.post(`https://ezlearn.onrender.com/course/videos/${currentCourseID}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200 || response.status === 201) {
                console.log('Video uploaded successfully!');
                const videoID = response._id;
                setUploadAlert({ variant: 'primary', message: 'Video uploaded successfully!' });
                getCourseVideo({currentCourseID, videoID});
            } else {
                console.error('Failed to upload video:', response.statusText);
                setUploadAlert({ variant: 'danger', message: `Failed to upload video: ${response.statusText}` });
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setUploadAlert({ variant: 'danger', message: `Error uploading video: ${error.message}` });
        }
    };

    const handleVideoDelete = async (video) => {
    
        try {
            const response = await axios.delete(`https://ezlearn.onrender.com/course/deleteVideos/${currentCourseID}/${video._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200 || response.status === 201) {
                console.log('Video deleted successfully!');
                const videoID = video._id;
                setDeleteAlert({ variant: 'primary', message: 'Video deleted successfully!' });
                getCourseVideo({currentCourseID,videoID});
            } else {
                console.error('Failed to delete video:', response.statusText);
                setDeleteAlert({ variant: 'danger', message: `Failed to delete video: ${response.statusText}` });
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            setDeleteAlert({ variant: 'danger', message: `Error deleting video: ${error.message}` });
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const thumbnailUrl = "rgb(240, 240, 240)"
//   const videoUrl = "https://www.youtube.com/watch?v=fkZK4MqqNTY"
    // const videoUrl = require('/home/phantom/Documents/react-project/src/assets/test/vid0.mp4');
    // const thumbnailUrl = "https://www.rollingstone.com/wp-content/uploads/2020/02/THE-WEEKND-by-Duncan-Loudon.jpg?w=1600&h=900&crop=1"
  // const [videoUrl, setVideoUrl] = useState('');

  // useEffect(() => {
  //   // Fetch the video URL from Google Drive using the API
  //   // Replace 'YOUR_FILE_ID' with the actual file ID of your Google Drive video
  //   fetchGoogleDriveVideoUrl('YOUR_FILE_ID').then(url => {
  //     setVideoUrl(url);
  //   });
  // }, []);

  // // Function to fetch video URL from Google Drive API
  // const fetchGoogleDriveVideoUrl = async fileId => {
  //   // Make API request to get video URL
  //   // Replace 'YOUR_API_KEY' with your actual Google Drive API key
  //   const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?key=YOUR_API_KEY`);
  //   const data = await response.json();
  //   // Extract video URL from the response
  //   const videoUrl = data && data.webContentLink;
  //   return videoUrl;
  // };

  return (
    <>
        {uploadAlert && <Alert variant={uploadAlert.variant} onClose={() => resetUploadAlert()} dismissible>{uploadAlert.message}</Alert>}
        {deleteAlert && <Alert variant={deleteAlert.variant} onClose={() => resetDeleteAlert()} dismissible>{deleteAlert.message}</Alert>}
        {student && (
            <Container className='videos-container' style={{ padding: "0", margin: "1rem 0 0 0", flexWrap: "wrap", maxWidth: "none" }}>
                {videosPaths.slice().reverse().map((video, index) => {
                    const fileNameWithoutExtension = video.filename.split('.').slice(0, -1).join('.');                        
                    return (
                        <Row key={index} className='players-container' style={{ padding: "0", margin: "0", width: "auto" }}>
                            <div className='player-container'>
                                <div className='video-player'>
                                    <ReactPlayer className='video'
                                        url={video.path}
                                        controls
                                        type="video/mp4"
                                        light={thumbnailUrl}>
                                    </ReactPlayer>
                                </div>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "0.3rem 0% 0.5rem 0% "}}>
                                    <p className='video-title'>
                                        {/* {`Section ${index + 1}`} */}
                                        {fileNameWithoutExtension}
                                    </p>
                                    <a onClick={() => handleVideoDownload(video)}>
                                        <HiOutlineDownload className='downloadVideo-icon' title='Download' style={{cursor: "pointer"}}/>
                                    </a>
                                </div>
                            </div>
                        </Row>
                    );
                })}
            </Container>
        )}
        {teacher && (
          <Container className='videos-container' style={{ padding: "0", margin: "1rem 0 0 0", flexWrap: "wrap", maxWidth: "none" }}>
            <Row className='players-container' style={{ padding: "0", margin: "0", display: "block", width: "auto" }}>
                <div style={{justifyContent: "center", width: "100%"}}>
                <div style={{ paddingBottom: "10%"}}>
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload} 
                        style={{ display: 'none' }}
                    />
                    <Col className='reminder-card' style={{ padding: "0", margin: "0" }}>
                        <Card style={{ padding: "0", width: "25rem", height: "16.6rem", margin: "0", borderRadius: "1.25rem" }}
                              className='addR-container'
                              onClick={handleButtonClick}
                              title='Upload video'
                        >
                        <Card.Body>
                            <Card.Title className='addReminder-body'>
                            <IoAdd className='addReminder-icon'/>
                            </Card.Title>
                        </Card.Body>
                        </Card>
                    </Col>
                </div>
                </div>
            </Row>
            {videosPaths.slice().reverse().map((video, index) => {
                const fileNameWithoutExtension = video.filename.split('.').slice(0, -1).join('.');                        
                return (
                    <Row key={index} className='players-container' style={{ padding: "0", margin: "0", width: "auto" }}>
                        <div className='player-container'>
                            <div className='video-player'>
                                <ReactPlayer className='video'
                                    url={video.path}
                                    controls
                                    type="video/mp4"
                                    light={thumbnailUrl}>
                                </ReactPlayer>
                            </div>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "0.3rem 0% 0.5rem 0% "}}>
                                <p className='video-title'>
                                    {/* {`Section ${index + 1}`} */}
                                    {fileNameWithoutExtension}
                                </p>
                                <a onClick={() => handleVideoDownload(video)}>
                                    <HiOutlineDownload className='downloadVideo-icon' title='Download'/>
                                </a>
                                <a onClick={() => handleVideoDelete(video)}>
                                    <MdOutlineDeleteOutline className='deleteVideo-icon' title='Delete'/>
                                </a>
                            </div>
                        </div>
                    </Row>
                );
            })}
          </Container>        
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
    courseVideoData: state.courses.courseVideoData,
    videoIsLoading: state.courses.videoIsLoading,
    deleteAlert: state.courses.deleteAlert,
    uploadAlert: state.courses.uploadAlert,
    waitAlert: state.courses.waitAlert,
    error: state.courses.error,
});

export default connect(mapStateToProps,
    {
      login,
      getCourseVideo,
      setUploadAlert,
      setWaitAlert,
      setDeleteAlert,
      resetUploadAlert,
      resetDeleteAlert,
      resetWaitAlert
    })
(Videos);