// import React, { useState, useRef, useEffect } from 'react';
// import { FaPaperPlane, FaCamera } from 'react-icons/fa';
// import { IoMicOutline } from "react-icons/io5";
// import { HiOutlinePhotograph } from "react-icons/hi";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import CameraModal from '../CameraModel';
// import { connect } from 'react-redux';
// import LoadingSpinner from '../../redux/actions/LoadingSpinner';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { format } from 'date-fns';
// import socket from '../../Socket';

// const Chat = ({
//   token,
//   courses,
//   currentCourseID,
//   isLoading,
//   name
// }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingStartTime, setRecordingStartTime] = useState(null);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   const [intentToSend, setIntentToSend] = useState('message');
//   const [showCamera, setShowCamera] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [capturedPhotoPending, setCapturedPhotoPending] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const photoInputRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   // const socketRef = useRef();

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isRecording && recordingStartTime) {
//         const elapsed = (new Date() - recordingStartTime) / 1000;
//         setRecordingDuration(Math.floor(elapsed));
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isRecording, recordingStartTime]);

//   const socketRef = useRef();

//   useEffect(() => {
//     // Connect to WebSocket server
//     socketRef.current = io('https://chatapp3-9h76.onrender.com', {
//       transports: ['websocket'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       autoConnect: true
//     });

//     const handleIncomingMessage = (message) => {
//       console.log('Received message:', message);
//       setMessages(prevMessages => [...prevMessages, message]);
//       scrollToBottom();
//     };

//     // Handle incoming messages
//     // socketRef.current.on('message', (message) => {
//     //   console.log('Received message:', message);
//     //   setMessages(prevMessages => [...prevMessages, message]);
//     //   scrollToBottom();
//     // });
//     socketRef.current.on('message', handleIncomingMessage);

//     // Handle disconnect
//     // socketRef.current.on('disconnect', () => {
//     //   console.log('Disconnected from server');
//     //   // Optionally handle reconnection logic here
//     // });

//     // Clean up socket on unmount or when component is re-initialized
//     return () => {
//       socketRef.current.off('message', handleIncomingMessage); // Remove the event listener
//       socketRef.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//     // fetchMedia();
//   }, []);
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
  
//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get('https://chatapp3-9h76.onrender.com/api/messages');
//       setMessages(response.data.reverse());
//       console.log(response.data)
//     } catch (error) {
//       console.error('Failed to fetch messages:', error);
//     }
//   };

//   // const fetchMedia = async () => {
//   //   try {
//   //     const response = await axios.get('https://chatapp3-9h76.onrender.com/api/upload');
//   //     setMessages(response.data.reverse());
//   //   } catch (error) {
//   //     console.error('Failed to fetch media:', error);
//   //   }
//   // };

// console.log(name)

// const sendMessage = (message) => {
//   socketRef.current.emit('chatMessage', message);
// };

// const handleSendMessage = () => {
//   if (newMessage.trim() !== '') {
//     const newMessageObj = { text: newMessage, sender: 'user', createdAt: new Date().toISOString() };
//     console.log('Sending message:', newMessageObj);
//     sendMessage(newMessageObj);
//     setNewMessage('');
//     inputRef.current.focus();
//   }
// };

//   // const handleSendMessage = async () => {
//   //   if (newMessage.trim() !== '') {
//   //     try {
//   //       const response = await axios.post('https://chatapp3-9h76.onrender.com/api/messages', {
//   //         text: newMessage  // Ensure 'text' matches backend
//   //       }, {
//   //         headers: {
//   //             'Content-Type': 'application/json',
//   //             // 'Authorization': `Bearer ${token}`
//   //         }
//   //       });
//   //       const newMessageObj = { text: newMessage, sender: 'user', createdAt: new Date().toISOString() };
//   //       sendMessage(newMessageObj); // Emit the new message to server
//   //       setMessages(prevMessages => [...prevMessages, newMessageObj]); // Update state
//   //       // fetchMessages();
//   //       setNewMessage('');
//   //       setIsRecording(false);
//   //       setRecordingStartTime(null);
//   //       setRecordingDuration(0);
//   //       setIntentToSend('message');
//   //       inputRef.current.focus();
//   //       console.log(response.data)
//   //     } catch (error) {
//   //       console.error('Failed to send message:', error);
//   //     }
//   //   }
//   //   // handleSendCapturedPhoto();
//   // };

//   // const sendMessage = (message) => {
//   //   socketRef.current.emit('chatMessage', message);
//   // };

//   // const handleSendRecordedBlob = () => {
    
//   //   if (recordedBlob && intentToSend === 'recording') {
//   //     const audioUrl = URL.createObjectURL(recordedBlob);
//   //     const voiceNoteMessage = { audioUrl, sender: 'user', timestamp: new Date().toISOString() };
//   //     setMessages([...messages, voiceNoteMessage]);
//   //     setRecordedBlob(null);
//   //     setIsRecording(false);
//   //     setRecordingStartTime(null);
//   //     setRecordingDuration(0);
//   //     setIntentToSend('message');
//   //     chunksRef.current = [];
//   //     scrollToBottom();
//   //   } else {
//   //     console.log("Unable to send recorded blob");
//   //   }
//   // };

  
//   const handlePhotoInputChange = async (e) => {
//     const file = e.target.files[0]; // Get the first selected file
//     if (file) {
//       const formData = new FormData();
//       formData.append('media', file); // Append the file to FormData under key 'media'
  
//       try {
//         const response = await axios.post('https://chatapp3-9h76.onrender.com/api/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             // 'Authorization': `Bearer ${token}`
//           }
//         });
  
//         const photoMessage = {
//           photoUrl: response.data.file,
//           sender: 'user',
//           timestamp: new Date().toLocaleTimeString(),
//         };
//         console.log(photoMessage)
//         console.log(response.data)
//         sendMessage(photoMessage); // Send photo message via socket
//       } catch (error) {
//         console.error('Failed to upload photo:', error);
//       }
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       if (intentToSend === 'message') {
//         handleSendMessage();
//       } else if (intentToSend === 'recording') {
//         handleSendRecordedBlob();
//       }
//     }
//   };

//   // const handleMicClick = () => {
//   //   if (!isRecording) {
//   //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   //       navigator.mediaDevices.getUserMedia({ audio: true })
//   //       .then(stream => {
//   //           mediaRecorderRef.current = new MediaRecorder(stream);
//   //           mediaRecorderRef.current.ondataavailable = e => {
//   //             chunksRef.current.push(e.data);
//   //           };
//   //           mediaRecorderRef.current.onstop = () => {
//   //             const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
//   //             setRecordedBlob(blob);
//   //             setIsRecording(false);
//   //             setRecordingStartTime(null);
//   //             setRecordingDuration(0);
//   //             setIntentToSend('recording');
//   //             chunksRef.current = [];
//   //           };
//   //           mediaRecorderRef.current.start();
//   //           setRecordingStartTime(new Date());
//   //           setIsRecording(true);
//   //         })
//   //         .catch(error => console.error('Error accessing microphone:', error));
//   //     } else {
//   //       console.error('getUserMedia not supported on your browser');
//   //     }
//   //   } else {
//   //     mediaRecorderRef.current.stop();
//   //   }
//   // };

//   // const formatDuration = (duration) => {
//   //   const minutes = Math.floor(duration / 60);
//   //   const seconds = duration % 60;
//   //   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   // };

//   // const handleDeleteRecording = () => {
//   //   setRecordedBlob(null);
//   //   setIntentToSend('message');
    
//   //   if (isRecording) {
//   //     setMessages([...messages]);
//   //     setRecordedBlob(null);
//   //     setIsRecording(false);
//   //     setRecordingStartTime(null);
//   //     setRecordingDuration(0);
//   //     setIntentToSend('message');
//   //     chunksRef.current = [];
//   //     scrollToBottom();
//   //   }
    
//   //   scrollToBottom();
//   // };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleCapturePhoto = (photoUrl) => {
//     setCapturedPhoto(photoUrl);
//     setCapturedPhotoPending(true);
//   };
  
//   const handleSendCapturedPhoto = async () => {
//     if (capturedPhoto) {
//       const formData = new FormData();
//       formData.append('media', capturedPhoto);
  
//       try {
//         const response = await axios.post('https://chatapp3-9h76.onrender.com/api/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             // 'Authorization': `Bearer ${token}`
//           }
//         });
  
//         const photoMessage = {
//           photoUrl: response.data.file,
//           sender: 'user',
//           timestamp: new Date().toLocaleTimeString(),
//         };
  
//         setMessages(prevMessages => [...prevMessages, photoMessage]);
//         setCapturedPhoto(null);
//         setCapturedPhotoPending(false);
//         scrollToBottom();
//       } catch (error) {
//         console.error('Failed to upload photo:', error);
//       }
//     }
//   };

//   const handleDeleteCapturedPhoto = () => {
//     setCapturedPhoto(null);
//     setCapturedPhotoPending(false);
//   };
  
//   const handleCameraClick = () => {
//     setShowCamera(true);
//   };
  
//   const handleCloseCamera = () => {
//     setShowCamera(false);
//   };

//   const renderMessageContent = (message) => {
//     if (message.text) {
//       return <div className="message-content">{message.text}</div>;
//     // } else if (message.audioUrl) {
//     //   return (
//     //     <audio controls>
//     //       <source src={message.audioUrl} type="audio/webm" />
//     //       Your browser does not support the audio element.
//     //     </audio>
//     //   );
//     } else if (message.photoUrl) {
//       return (
//         <div className="message-content">
//           <img src={message.photoUrl} alt="Selected" />
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <>
//       <div className="chat-container">
//         <div className="chat-messages">
//           {messages.map((message, index) => (
//             <div key={index} className="message-wrapper">
//               <div className="message-sender">{message.sender === 'user' ? 'You' : name}</div>
//               <div className={`message ${message.sender}`}>
//                 {renderMessageContent(message)}
//                 <div className="message-timestamp">
//                   {/* {format(new Date(message.createdAt), 'MM/dd/yyyy hh:mm a')} */}
//                   {format(new Date(message.createdAt), 'hh:mm a')}
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         <div style={{display: "flex", justifyContent: "center"}}>
//           {capturedPhotoPending && (
//             <div className="captured-photo-container">
//               <img src={capturedPhoto} alt="Captured" className='captured-photo'/>
//                 <button className="captured-deleteBtn" onClick={handleDeleteCapturedPhoto} title='Cancel'>
//                   X
//                 </button>
//             </div>
//           )}
//         </div>
//         <div className="chat-input">
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={handleKeyPress}
//           />
//           {/* {!recordedBlob && (
//             <button className={`chat-mic ${isRecording ? 'recording' : ''}`} onClick={handleMicClick}>
//               {!isRecording && (
//                 <IoMicOutline className='mic-icon' title='Record voice note'/>
//               )}
//               {isRecording && (
//                 <>
//                   <span className='recorded-time' title='Stop recording'>
//                     {formatDuration(recordingDuration)}
//                   </span>
//                 </>
//               )}
//             </button>
//           )}
//           {recordedBlob && intentToSend === 'recording' && (
//           <>
//             <button className="send-button" onClick={handleSendRecordedBlob} onKeyDown={handleKeyPress}>
//               <FaPaperPlane className='send-icon' title='Send voice note'/>
//             </button>
//           </>
//           )}
//           {isRecording && !recordedBlob && (
//             <button className="chat-recordDelete" 
//             onClick={() => { handleDeleteRecording(); }}
//             >
//                 <MdOutlineDeleteOutline className='delete-record' title='Delete record'/>
//             </button>
//           )}
//           {recordedBlob && !isRecording &&(
//             <button className="chat-deleteRecord" 
//             onClick={() => { handleDeleteRecording(); }}
//             >
//                 <MdOutlineDeleteOutline className='delete-record' title='Delete record'/>
//             </button>
//           )} */}
//           <input
//             ref={photoInputRef}
//             type="file"
//             accept="image/*"
//             style={{ display: 'none' }}
//             onChange={handlePhotoInputChange}
//           />
//           <button className="chat-gallery" onClick={() => photoInputRef.current.click()}>
//             <HiOutlinePhotograph className='gallery-icon' title='Open gallery'/>
//           </button>
//           <button className="chat-camera" onClick={handleCameraClick}>
//             <FaCamera className='camera-icon' title='take a picture'/>
//           </button>
//           {/* {!recordedBlob && !isRecording && ( */}
//             <button className="send-button" onClick={handleSendMessage} onKeyDown={handleKeyPress}>
//               <FaPaperPlane className='send-icon' title='Send message'/>
//             </button>
//           {/* )} */}
//           {/* {isRecording && (
//             <button className="send-button" onClick={handleSendMessage} onKeyDown={handleKeyPress}>
//               <FaPaperPlane className='send-icon' title="Can't send message while recording"/>
//             </button>
//           )} */}
//         </div>
//       </div>
//       {showCamera && (
//         <div className='camera-model-container'>
//           <CameraModal
//             onClose={handleCloseCamera}
//             onCapture={handleCapturePhoto}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// const mapStateToProps = state => ({
//   token: state.auth.token,
//   name: state.auth.name,
//   courses: state.courses.coursesData,
//   currentCourseID: state.courses.currentCourseID,
//   isLoading: state.courses.isLoading,
// });

// export default connect(mapStateToProps)(Chat);


import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaCamera } from 'react-icons/fa';
import { IoMicOutline } from "react-icons/io5";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import CameraModal from '../CameraModel';
import { connect } from 'react-redux';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import axios from 'axios';
import io from 'socket.io-client';
import { format } from 'date-fns';
import socket from '../../Socket';
import apiUrl from '../ApiUrl';
import { useParams } from 'react-router-dom';

const Chat = ({
  token,
  courses,
  currentCourseID,
  isLoading,
  name
}) => {
  const { chatId } = useParams();
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
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // const socketRef = useRef();

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

  const socketRef = useRef();

  // useEffect(() => {
  //   // Connect to WebSocket server
  //   socketRef.current = io(`${apiUrl}`, {
  //     transports: ['websocket'],
  //     reconnectionAttempts: 5,
  //     reconnectionDelay: 1000,
  //     autoConnect: true
  //   });

  //   const handleIncomingMessage = (message) => {
  //     console.log('Received message:', message);
  //     setMessages(prevMessages => [...prevMessages, message]);
  //     scrollToBottom();
  //   };

  //   // Handle incoming messages
  //   // socketRef.current.on('message', (message) => {
  //   //   console.log('Received message:', message);
  //   //   setMessages(prevMessages => [...prevMessages, message]);
  //   //   scrollToBottom();
  //   // });
  //   socketRef.current.on('message', handleIncomingMessage);

  //   // Handle disconnect
  //   // socketRef.current.on('disconnect', () => {
  //   //   console.log('Disconnected from server');
  //   //   // Optionally handle reconnection logic here
  //   // });

  //   // Clean up socket on unmount or when component is re-initialized
  //   return () => {
  //     socketRef.current.off('message', handleIncomingMessage); // Remove the event listener
  //     socketRef.current.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    fetchMessages();
    // fetchMedia();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/chats/${chatId}/messages`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`
        },
        // responseType: 'arraybuffer' // Ensure binary data is handled correctly
      });
  
      const messages = response.data.messages || response.data;
  
      const updatedMessages = messages.map(message => {
        if (message.media) {
          const mediaUrl = `data:${message.contentType};base64,${message.media}`;
          message.mediaUrl = mediaUrl;  
        }
        if (message.voice) {
          const binaryData = atob(message.voice); // Decode base64 string to binary data
          const byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([byteArray.buffer], { type: 'audio/webm' });
          const voiceUrl = URL.createObjectURL(blob);
          message.voiceUrl = voiceUrl;  
        }
        return message;
      });
  
      setMessages(updatedMessages);
      setIsLoadingMessages(false);
      console.log(updatedMessages);
  
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };  
  
console.log(messages)
  // const fetchMedia = async () => {
  //   try {
  //     const response = await axios.get('https://chatapp3-9h76.onrender.com/api/upload');
  //     setMessages(response.data.reverse());
  //   } catch (error) {
  //     console.error('Failed to fetch media:', error);
  //   }
  // };

console.log(name)

// const sendMessage = (message) => {
//   socketRef.current.emit('message', message);
// };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && !capturedPhoto) {
      const newMessageObj = { text: newMessage };
      console.log('Sending message:', newMessageObj);

      try {
        // Sending the message to the server using POST request
        await axios.post(`${apiUrl}/chats/${chatId}/messages`, newMessageObj, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`
          }
        });
        // If POST is successful, emit the message via socket
        // sendMessage(newMessageObj);
        // Clear the input field after sending the message
        await fetchMessages();
        setNewMessage('');
        inputRef.current.focus();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      handleSendCapturedPhoto();
    }
  };

  const handleSendRecordedBlob = async () => {
    if (recordedBlob && intentToSend === 'recording') {
      console.log("Preparing to send recorded blob");
      // const response = await fetch(recordedBlob);
      // const updatedBlob = await response.blob(([recordedBlob], { type: 'audio/webm' }));
      const formData = new FormData();
      formData.append('media', recordedBlob, 'recording.webm');
      console.log(recordedBlob)
      try {
        console.log("Sending the recorded blob via axios");
        const response = await axios.post(`${apiUrl}/chats/${chatId}/messages`, formData, {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Recorded blob sent successfully:", response.data);
        await fetchMessages();
        setNewMessage('');
        setRecordedBlob(null);
        setIsRecording(false);
        setRecordingStartTime(null);
        setRecordingDuration(0);
        setIntentToSend('message');
        chunksRef.current = [];
        scrollToBottom();
      } catch (error) {
        console.error('Failed to upload recording:', error.response?.data || error.message);
      }
    } else {
      console.log("No recorded blob to send or intentToSend is not 'recording'");
    }
  };
  
  

  const handlePhotoInputChange = async (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      const formData = new FormData();
      formData.append('media', file); // Append the file to FormData under key 'media'
  
      try {
        const response = await axios.post(`${apiUrl}/chats/${chatId}/messages`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`
          }
        });
  
        await fetchMessages();
        setNewMessage('');
        inputRef.current.focus();
        console.log(response.data);
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
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
              console.log("Recorded Blob:", blob.size, blob.type); // Log blob details for debugging
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendCapturedPhoto = async () => {
    if (capturedPhoto) {
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();

      // Create FormData and append blob with filename
      const formData = new FormData();
      // formData.append('courseId', currentCourseID);
      formData.append('media', blob, 'captured_photo.png');
      console.log(blob)
  
      try {
        const response = await axios.post(`${apiUrl}/chats/${chatId}/messages`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data)
        // const photoMessage = {
        //   photoUrl: response.data.file,
        //   sender: 'user',
        //   timestamp: new Date().toLocaleTimeString(),
        // };
        await fetchMessages();
        setNewMessage('');
        // setMessages(prevMessages => [...prevMessages, photoMessage]);
        setCapturedPhoto(null);
        setCapturedPhotoPending(false);
        scrollToBottom();
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
    }
  };
  const handleCapturePhoto = (photoUrl) => {
    setCapturedPhoto(photoUrl);
    setCapturedPhotoPending(true);
    handleSendCapturedPhoto()
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

  const renderMessage = (message, index) => {
    const isSender = message.sender.name === name; // Check if the message is from the sender
    const messageClass = isSender ? 'outgoing-message' : 'incoming-message';
  
    return (
      <div key={index} className={`message ${messageClass}`}>
        <div className={`sender ${message.sender.name === name ? 'user' : 'others'}`}>
          {message.sender.name !== name ? message.sender.name.split(' ').slice(0, 2).join(' ') : ''}
        </div>
        <div className="message-content">
          {message.media ? ( // Conditionally render image or audio
            <img src={message.mediaUrl} alt="Uploaded media" style={{padding: "0.5rem 0.125rem 0.25rem 0.125rem"}} />
            ) : (
            message.voiceUrl && (
              <audio controls src={message.voiceUrl} style={{padding: "0.5rem 0.125rem 0.25rem 0.125rem"}} />
            )
          )}
          {message.text && <div>{message.text}</div>}
          <div className="message-timestamp">{format(new Date(message.createdAt), 'hh:mm a')}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="chat-container">
        {isLoadingMessages ? (
          <LoadingSpinner />
          ) : (
            <div className="chat-messages">
              {messages.map((message, index) => (
                <>
                  {/* <div className={`sender ${message.sender.name === name ? 'user' : 'others'}`}>
                    {message.sender.name.split(' ').slice(0, 2).join(' ')}
                  </div> */}
                  {renderMessage(message,index)}
                </>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
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
      {showCamera && (
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
  token: state.auth.token,
  name: state.auth.name,
  courses: state.courses.coursesData,
  currentCourseID: state.courses.currentCourseID,
  isLoading: state.courses.isLoading,
});

export default connect(mapStateToProps)(Chat);