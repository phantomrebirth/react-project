import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaCamera } from 'react-icons/fa';
import { IoMicOutline } from "react-icons/io5";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import CameraModal from '../CameraModel';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { selectCourses } from '../../redux/slices/coursesSlice';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { login } from '../../redux/actions/auth';

const Chat = 
({
  role,
  token,
  courses,
  currentCourseID,
  isLoading
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [intentToSend, setIntentToSend] = useState('message');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedPhotoPending, setCapturedPhotoPending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // const audioInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording && recordingStartTime) {
        const elapsed = (new Date() - recordingStartTime) / 1000;
        setRecordingDuration(Math.floor(elapsed));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (capturedPhotoPending) {
      inputRef.current.focus();
    }
  }, [capturedPhotoPending]);
  const course = courses.find(course => course._id === currentCourseID);
  if (isLoading || !course) {
    return <LoadingSpinner />;
  }
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMessages = [...messages, { text: newMessage, sender: 'user', timestamp: new Date().toLocaleTimeString() }];
      setMessages(newMessages);
      setNewMessage('');
      setIsRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(0);
      setIntentToSend('message');
      inputRef.current.focus();
    }
    handleSendCapturedPhoto();
  };
  const handleSendRecordedBlob = () => {
    
    if (recordedBlob && intentToSend === 'recording') {
      const audioUrl = URL.createObjectURL(recordedBlob);
      const voiceNoteMessage = { audioUrl, sender: 'user', timestamp: new Date().toLocaleTimeString() };
      setMessages([...messages, voiceNoteMessage]);
      setRecordedBlob(null);
      setIsRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(0);
      setIntentToSend('message');
      chunksRef.current = [];
      scrollToBottom();
    } else {
      console.log("Unable to send recorded blob");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (intentToSend === 'message') {
        handleSendMessage();
      } else if (intentToSend === 'recording') {
        handleSendRecordedBlob();
      }
    }
  };
  
  const handleMicClick = () => {
    if (!isRecording) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = e => {
              chunksRef.current.push(e.data);
            };
            mediaRecorderRef.current.onstop = () => {
              const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
              setRecordedBlob(blob);
              setIsRecording(false);
              setRecordingStartTime(null);
              setRecordingDuration(0);
              setIntentToSend('recording');
              chunksRef.current = [];
            };
            mediaRecorderRef.current.start();
            setRecordingStartTime(new Date());
            setIsRecording(true);
          })
          .catch(error => console.error('Error accessing microphone:', error));
        } else {
          console.error('getUserMedia not supported on your browser');
        }
      } else {
        mediaRecorderRef.current.stop();
      }
    };
    
    const formatDuration = (duration) => {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
  const handleDeleteRecording = () => {
    setRecordedBlob(null);
    setIntentToSend('message');
    
    if (isRecording) {
      setMessages([...messages]);
      setRecordedBlob(null);
      setIsRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(0);
      setIntentToSend('message');
      chunksRef.current = [];
      scrollToBottom();
    }
    
    scrollToBottom();
  };
  
  const handlePhotoInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const fileExtension = file.name.split('.').pop();
        const blob = new Blob([reader.result], { type: file.type });
        const renamedFile = new File([blob], `${randomNumber}.${fileExtension}`, { type: file.type });
        
        const photoUrl = URL.createObjectURL(renamedFile);
        const photoMessage = { photoUrl, sender: 'user', timestamp: new Date().toLocaleTimeString() };
        setMessages([...messages, photoMessage]);
        scrollToBottom();
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  const handleCapturePhoto = (photoUrl) => {
    setCapturedPhoto(photoUrl);
    setCapturedPhotoPending(true);
  };
  
  const handleSendCapturedPhoto = () => {
    if (capturedPhoto) {
      const photoMessage = {
        photoUrl: capturedPhoto,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, photoMessage]);
      setCapturedPhoto(null);
      setCapturedPhotoPending(false);
      scrollToBottom();
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
    
  // if (loading) {
  //   return <LoadingSpinner/>;
  // }

  return (
    <>
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text && (
              <div className="message-content">
                {message.text}
              </div>
            )}
            {message.audioUrl && (
              <audio controls>
                <source src={message.audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            )}
            {message.photoUrl && (
              <div className="message-content">
                <img src={message.photoUrl} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}
            <div className="message-timestamp">
              {message.sender === 'user' ? '' : message.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        {capturedPhotoPending && (
          <div className="captured-photo-container">
            <img src={capturedPhoto} alt="Captured" className='captured-photo'/>
              <button className="captured-deleteBtn" onClick={handleDeleteCapturedPhoto} title='Cancel'>
                X
              </button>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {!recordedBlob && (
          <button className={`chat-mic ${isRecording ? 'recording' : ''}`} onClick={handleMicClick}>
            {!isRecording && (
              <IoMicOutline className='mic-icon' title='Record voice note'/>
            )}
            {isRecording && (
              <>
                <span className='recorded-time' title='Stop recording'>
                  {formatDuration(recordingDuration)}
                </span>
              </>
            )}
          </button>
        )}
        {recordedBlob && intentToSend === 'recording' && (
        <>
          <button className="send-button" onClick={handleSendRecordedBlob} onKeyDown={handleKeyPress}>
            <FaPaperPlane className='send-icon' title='Send voice note'/>
          </button>
        </>
        )}
        {isRecording && !recordedBlob && (
          <button className="chat-recordDelete" 
          onClick={() => { handleDeleteRecording(); }}
          >
              <MdOutlineDeleteOutline className='delete-record' title='Delete record'/>
          </button>
        )}
        {recordedBlob && !isRecording &&(
          <button className="chat-deleteRecord" 
          onClick={() => { handleDeleteRecording(); }}
          >
              <MdOutlineDeleteOutline className='delete-record' title='Delete record'/>
          </button>
        )}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoInputChange}
        />
        <button className="chat-gallery" onClick={() => photoInputRef.current.click()}>
          <HiOutlinePhotograph className='gallery-icon' title='Open gallery'/>
        </button>
        <button className="chat-camera" onClick={handleCameraClick}>
          <FaCamera className='camera-icon' title='take a picture'/>
        </button>
        {!recordedBlob && !isRecording && (
          <button className="send-button" onClick={handleSendMessage} onKeyDown={handleKeyPress}>
            <FaPaperPlane className='send-icon' title='Send message'/>
          </button>
        )}
        {isRecording && (
          <button className="send-button" onClick={handleSendMessage} onKeyDown={handleKeyPress}>
            <FaPaperPlane className='send-icon' title="Can't send message while recording"/>
          </button>
        )}
      </div>
    </div>
      {showCamera && !capturedPhotoPending && (
    <div className='camera-model-container'>
        <CameraModal
          onClose={handleCloseCamera}
          onCapture={handleCapturePhoto}
        />
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
(Chat);