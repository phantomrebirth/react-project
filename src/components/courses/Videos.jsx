import React, { useEffect, useRef, useState } from 'react'
import { Alert, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
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
import { finishFileOperation, getCourseVideo, getCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, resetWaitVideoAlert, setDeleteAlert, setUploadAlert, setWaitAlert, setWaitVideoAlert, startFileOperation } from '../../redux/actions/courses';
import { CircularProgress } from '@material-ui/core';
import apiUrl from '../ApiUrl';

const Videos = 
({
    role,
    token,
    videoIsLoading,
    courses,
    isLoading,
    getCourseVideo,
    courseVideoData,
    waitAlert,
    uploadAlert,
    deleteAlert,
    currentCourseID,
    resetDeleteAlert,
    resetUploadAlert,
    resetWaitAlert,
    setWaitAlert,
    setDeleteAlert,
    setUploadAlert,
    getCourses,
    setWaitVideoAlert,
    resetWaitVideoAlert,
    waitVideoAlert,
    isFileOperationInProgress,
    startFileOperation,
    finishFileOperation,
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
    }, [uploadAlert, deleteAlert, waitVideoAlert]);
    const fileInputRef = useRef(null);
    const course = courses.find(course => course._id === currentCourseID);
    useEffect(() => {
        if (course && course.videos && course.videos.length > 0) {
            const basePath = `${apiUrl}/course/getVideos/${currentCourseID}/`;
            const videos = course.videos.map(video => ({
                ...video,
                path: `${basePath}${video._id}`,
            }));
            setVideosPaths(videos);
        }
    }, [course, currentCourseID]);
    useEffect(() => {
        console.log('Videos Paths:', videosPaths);
    }, [videosPaths]);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        const fetchVideoUrl = async () => {
            try {
                const promises = videosPaths.map(async video => {
                    const response = await axios.get(
                        video.path,
                        {
                            headers: {
                                // 'Authorization': `Bearer ${token}`,
                                'ngrok-skip-browser-warning': 'true',
                            },
                            responseType: 'blob',
                        }
                    );
                    if (response.status === 200) {
                        const videoBlob = new Blob([response.data], { type: 'video/mp4' });
                        const videoUrl = URL.createObjectURL(videoBlob);
                        return { ...video, url: videoUrl };
                    } else {
                        console.error(`Failed to fetch video URL for video ${video._id}`);
                        return null;
                    }
                });
        
                const urls = await Promise.all(promises);
                // Assuming you want to set the first fetched video URL
                const firstValidUrl = urls.filter(url => url !== null);
                // if (firstValidUrl) {
                    setVideoUrl(firstValidUrl);
                // } else {
                    // console.error('No valid video URLs fetched');
                // }
            } catch (error) {
                console.error('Error fetching video URLs:', error);
            }
        };
  
        if (videosPaths.length > 0) {
            fetchVideoUrl();
        }
    }, [videosPaths, token]);
    console.log(videoUrl)
    // if ((isLoading || videoIsLoading || !course) && isFileOperationInProgress) {
    //     return <LoadingSpinner/>;
    // };
    // const videoPath = course.videos.map(video => `https://ezlearn.onrender.com/course/getVideos/${currentCourseID}/${video._id}`);
    // const videosPaths = course.videos.map(video => {
    //     const matchingPath = videoPath.find(path => path.includes(video._id));
    //     return {
    //         ...video,
    //         path: matchingPath || ''
    //     };
    // });

    // const handleVideoDownload = async (video) => {
    //     const { filename, path } = video;
    //     try {
    //         const response = await fetch(path);
    //         const fileData = await response.arrayBuffer();
    //         const a = document.createElement('a');
    //         a.href = URL.createObjectURL(new Blob([fileData]));
    //         a.download = filename;
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //     } catch (error) {
    //         console.error('Error downloading file:', error);
    //     };
    //   };

    const handleVideoDownload = async (video) => {
        const { filename, path } = video;
    
        try {
            const response = await fetch(path, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching the file: ${response.statusText}`);
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the video:', error);
        }
    };

    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('videos', file);
        // if (!uploadAlert && !deleteAlert) {
            // setWaitAlert({ variant: 'info', message: 'Uploading your video... please wait', progress: 0 });
            // }
        try {
            const response = await axios.post(`${apiUrl}/course/videos/${currentCourseID}`, formData, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    // 'User-Agent': 'CustomUserAgent',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload Progress:', progress);
                    setWaitVideoAlert({ variant: 'info', message: 'Uploading your video... please wait', progress });
                },
            });
            startFileOperation(); // Set file operation in progress
            if (response.status === 200 || response.status === 201) {
                console.log('Video uploaded successfully!');
                // const { video, filename } = response.data;
                // const newVideo = {
                //   _id: video,
                //   filename: file.name,
                //   path: `https://formally-eager-duckling.ngrok-free.app/course/getVideos/${currentCourseID}/${video}`,
                // };
                console.log(response.data)
                // console.log(newVideo);
                // console.log(newVideo._id)
                // await getCourseVideo({ currentCourseID, videoID: videoId })
                // setVideosPaths(prevVideos => [...prevVideos, newVideo]);
                await getCourses();
                // const videoID = response._id;
                // getCourseVideo({currentCourseID, videoID});
                setUploadAlert({ variant: 'primary', message: 'Video uploaded successfully!' });
            } else {
                console.error('Failed to upload video:', response.statusText);
                setUploadAlert({ variant: 'danger', message: `Failed to upload video: ${response.statusText}` });
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setUploadAlert({ variant: 'danger', message: `Error uploading video: ${error.message}` });
        } finally {
            finishFileOperation(); // Reset file operation status
            resetWaitVideoAlert();
        }
    };

    console.log('Videos Paths:', videosPaths);

    const handleVideoDelete = async (video) => {
        // if (!uploadAlert && !deleteAlert) {
            // setWaitAlert({ variant: 'info', message: 'Deleting your video... please wait', progress: 0 });
        // }
        try {
            const response = await axios.delete(`${apiUrl}/course/deleteVideos/${currentCourseID}/${video._id}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    // 'User-Agent': 'CustomUserAgent',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onDownloadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setWaitVideoAlert({ variant: 'info', message: 'Deleting your video... please wait', progress });
                },
            });
            startFileOperation(); // Set file operation in progress
            if (response.status === 200 || response.status === 201) {
                console.log('Video deleted successfully!');
                setVideosPaths(prevVideos => prevVideos.filter(item => item._id !== video._id));
                setVideoUrl(prevVideos => prevVideos.filter(item => item._id !== video._id));
                await getCourses();
                // const videoID = video._id;
                // getCourseVideo({currentCourseID,videoID});
                // setDeleteAlert({ variant: 'primary', message: 'Video deleted successfully!' });
            } else {
                console.error('Failed to delete video:', response.statusText);
                setDeleteAlert({ variant: 'danger', message: `Failed to delete video: ${response.statusText}` });
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            setDeleteAlert({ variant: 'danger', message: `Error deleting video: ${error.message}` });
        } finally {
            finishFileOperation(); // Reset file operation status
            resetWaitVideoAlert();
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
      {waitVideoAlert && (
        <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    textAlign: 'center'
        }}>
            <Alert variant= 'info'>
                {waitVideoAlert ? waitVideoAlert.message : 'Please wait...'}
                {waitVideoAlert.progress && (
                    <ProgressBar 
                                className="progress-custom"
                                now={waitVideoAlert.progress} 
                                label={<span style={{ color: "#fff" }}>{`${waitVideoAlert.progress}%`}</span>} 
                    />
                )}
            </Alert>
        </div>
      )}
        {student && (
            <Container className='videos-container' style={{ padding: "0", margin: "1rem 0 0 0", flexWrap: "wrap", maxWidth: "none" }}>
                {Array.isArray(videoUrl) && videoUrl.length > 0 && videosPaths.length > 0 ? videoUrl.slice().reverse().map((video, index) => {
                    const fileNameWithoutExtension = video.filename.split('.').slice(0, -1).join('.');                        
                    return (
                        <Row key={index} className='players-container' style={{ padding: "0", margin: "0", width: "auto" }}>
                            <div className='player-container'>
                                <div className='video-player'>
                                    <ReactPlayer className='video'
                                        url={video.url}
                                        controls={true}
                                        type="video/mp4"
                                        width='100%'
                                        height='100%'
                                        // config={{
                                        //     file: {
                                        //         attributes: {
                                        //             controlsList: 'nodownload' // Disable download button in some browsers
                                        //         }
                                        //     }
                                        // }}
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
                }) : course.videos && course.videos.length > 0 && (
                    <div style=
                                {{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    paddingTop: '6%'
                                }}
                    >
                        <CircularProgress color="inherit"
                                            size={50}
                                            thickness={4}
                                            style={{color: "#7939ff"}}
                        />
                    </div>
                )}
                {Array.isArray(videosPaths) && videosPaths.length == 0 && videoUrl.length == 0 && (
                    <div style=
                                {{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    paddingTop: '6%',
                                    fontSize: "125%"
                                }}
                    >
                        <p>No videos yet.</p>
                    </div>
                )}
            </Container>
        )}
        {teacher && !waitVideoAlert && !waitAlert &&(
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
            {Array.isArray(videoUrl) && videoUrl.length > 0 && videosPaths.length > 0 ? videoUrl.slice().reverse().map((video, index) => {
                const fileNameWithoutExtension = video.filename.split('.').slice(0, -1).join('.');                        
                return (
                    <Row key={index} className='players-container' style={{ padding: "0", margin: "0", width: "auto" }}>
                        <div className='player-container'>
                            <div className='video-player'>
                                <ReactPlayer className='video'
                                    url={video.url}
                                    controls={true}
                                    type="video/mp4"
                                    width='100%'
                                    height='100%'
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
            }) : course.videos && course.videos.length > 0 && (
                <div style=
                            {{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                paddingTop: '6%'
                            }}
                >
                    <CircularProgress color="inherit"
                                        size={50}
                                        thickness={4}
                                        style={{color: "#7939ff"}}
                    />
                </div>
            )}
            {Array.isArray(videosPaths) && videosPaths.length == 0 && videoUrl.length == 0 && (
                <div style=
                            {{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                paddingTop: '6%',
                                fontSize: "125%"
                            }}
                >
                    <p>No videos yet.</p>
                </div>
            )}
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
    waitVideoAlert: state.courses.waitVideoAlert,
    error: state.courses.error,
    isFileOperationInProgress: state.courses.isFileOperationInProgress,
});

export default connect(mapStateToProps,
    {
      login,
      getCourses,
      getCourseVideo,
      setUploadAlert,
      setWaitAlert,
      setDeleteAlert,
      resetUploadAlert,
      resetDeleteAlert,
      resetWaitAlert,
      setWaitVideoAlert,
      resetWaitVideoAlert,
      startFileOperation,
      finishFileOperation,
    })
(Videos);