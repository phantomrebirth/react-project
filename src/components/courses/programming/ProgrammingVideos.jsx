import React from 'react'
import { Container, Row } from 'react-bootstrap';
import ReactPlayer from 'react-player';

const ProgrammingVideos = () => {
  const videoUrl = "https://www.youtube.com/watch?v=fkZK4MqqNTY"
    // const videoUrl = require('/home/phantom/Documents/react-project/src/assets/test/vid0.mp4');
    // const thumbnailUrl = "https://www.rollingstone.com/wp-content/uploads/2020/02/THE-WEEKND-by-Duncan-Loudon.jpg?w=1600&h=900&crop=1"
    const thumbnailUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nme.com%2Fwp-content%2Fuploads%2F2021%2F08%2FWeeknd-May-2021.jpg&f=1&nofb=1&ipt=84d351d89baf82c8fc1770c8a1d010db1ad5b96bb7c268b1c852c6697e98ce57&ipo=images"
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
    <Container className='videos-container' style={{padding: "0"}}>
      <Row className='players-container' style={{padding: "0", margin: "0"}}>
          <div className='player-container'>
              <div className='video-player'>
                  <ReactPlayer className='video'
                              url={videoUrl} 
                              controls 
                              light={thumbnailUrl}>
                  </ReactPlayer>
              </div>
              <p className='video-title'>
                  Section 1
              </p>
          </div>
          <div className='player-container'>
              <div className='video-player'>
                  <ReactPlayer className='video'
                              url={videoUrl} 
                              controls 
                              light={thumbnailUrl}>
                  </ReactPlayer>
              </div>
              <p className='video-title'>
                  Section 2
              </p>
          </div>
      </Row>
      <Row className='players-container' style={{padding: "0", margin: "0"}}>
          <div className='player-container'>
              <div className='video-player'>
                  <ReactPlayer className='video'
                              url={videoUrl} 
                              controls 
                              light={thumbnailUrl}>
                  </ReactPlayer>
              </div>
              <p className='video-title'>
                  Section 3
              </p>
          </div>
          <div className='player-container'>
              <div className='video-player'>
                  <ReactPlayer className='video'
                              url={videoUrl} 
                              controls 
                              light={thumbnailUrl}>
                  </ReactPlayer>
              </div>
              <p className='video-title'>
                  Section 4
              </p>
          </div>
      </Row>
    </Container>
  );
};

export default ProgrammingVideos;