import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { selectRole } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { HiOutlineDownload } from "react-icons/hi";

const Videos = () => {

    const dispatch = useDispatch();

    const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
        } else if (role === 'teacher') {
          setTeacher(true);
        }
        dispatch(fetchCourses());
    }, [role, dispatch]);
    const { loading, data: courses, currentCourseId } = useSelector(selectCourses);
  
    const course = courses.find(course => course._id === currentCourseId);
    const videoPath = course.videos.map(video => `https://ezlearn.onrender.com/course/getVideos/${currentCourseId}/${video._id}`);
    const videosPaths = course.videos.map(video => {
        const matchingPath = videoPath.find(path => path.includes(video._id));
      return {
          ...video,
          path: matchingPath || ''
      };
    });

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

//   const videoUrl = "https://www.youtube.com/watch?v=fkZK4MqqNTY"
    // const videoUrl = require('/home/phantom/Documents/react-project/src/assets/test/vid0.mp4');
    // const thumbnailUrl = "https://www.rollingstone.com/wp-content/uploads/2020/02/THE-WEEKND-by-Duncan-Loudon.jpg?w=1600&h=900&crop=1"
    const thumbnailUrl = "rgb(240, 240, 240)"
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

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <>
        {student && (
            <Container className='videos-container' style={{ padding: "0" }}>
                {videosPaths.map((video, index) => {
                    const fileNameWithoutExtension = video.filename.split('.').slice(0, -1).join('.');                        
                    return (
                        <Row key={index} className='players-container' style={{ padding: "0", margin: "0" }}>
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
            <div>_</div>
        )}
    </>
  );
};

export default Videos;