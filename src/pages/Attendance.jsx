import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaCamera } from 'react-icons/fa';
import { IoMicOutline } from "react-icons/io5";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { connect } from 'react-redux';
import { login } from '../redux/actions/auth';
import CameraModal from '../components/CameraModel';
import LoadingSpinner from '../redux/actions/LoadingSpinner';
import io from 'socket.io-client';
import apiUrl from '../components/ApiUrl';

const Attendance = ({ role, token, courses, currentCourseID, isLoading }) => {
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
  const photoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${apiUrl}`);

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      socketRef.current.emit('join', currentCourseID);
    });

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentCourseID]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (capturedPhotoPending) {
      inputRef.current.focus();
    }
  }, [capturedPhotoPending]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        chatId: currentCourseID,
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      socketRef.current.emit('sendMessage', message);
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
      const message = {
        chatId: currentCourseID,
        sender: 'user',
        audioUrl,
        timestamp: new Date().toLocaleTimeString(),
      };
      socketRef.current.emit('sendMessage', message);
      setRecordedBlob(null);
      setIsRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(0);
      setIntentToSend('message');
      chunksRef.current = [];
      scrollToBottom();
    } else {
      console.log('Unable to send recorded blob');
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
          .then((stream) => {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (e) => {
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
          .catch((error) => console.error('Error accessing microphone:', error));
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
        const message = {
          chatId: currentCourseID,
          sender: 'user',
          photoUrl,
          timestamp: new Date().toLocaleTimeString(),
        };
        socketRef.current.emit('sendMessage', message);
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
      const message = {
        chatId: currentCourseID,
        sender: 'user',
        photoUrl: capturedPhoto,
        timestamp: new Date().toLocaleTimeString(),
      };
      socketRef.current.emit('sendMessage', message);
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

  return (
    <>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text && (
                <div className="message-content">{message.text}</div>
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          {isRecording && (
            <div className="recording-indicator">
              Recording: {formatDuration(recordingDuration)}
              <MdOutlineDeleteOutline className="delete-icon" onClick={handleDeleteRecording} />
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isRecording || capturedPhotoPending}
          />
          <button onClick={handleSendMessage} disabled={isRecording || capturedPhotoPending}>
            <FaPaperPlane />
          </button>
          <button onClick={handleMicClick}>
            <IoMicOutline />
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoInputChange}
          />
          <button onClick={() => photoInputRef.current.click()}>
            <HiOutlinePhotograph />
          </button>
          <button onClick={handleCameraClick}>
            <FaCamera />
          </button>
        </div>
      </div>
      <CameraModal
        show={showCamera}
        onCapture={handleCapturePhoto}
        onClose={handleCloseCamera}
      />
      {isLoading && <LoadingSpinner />}
    </>
  );
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
  token: state.auth.token,
  courses: state.courses.courses,
  currentCourseID: state.courses.currentCourseID,
  isLoading: state.isLoading,
});

const mapDispatchToProps = {
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Attendance);