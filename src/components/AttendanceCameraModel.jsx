import React, { useRef, useEffect, useState } from 'react';

const AttendanceCameraModal = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setMediaStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => console.error('Error accessing camera:', error));
    } else {
      console.error('getUserMedia not supported on your browser');
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photoUrl = canvas.toDataURL('image/png');
      onCapture(photoUrl);
      onClose(); // Close the modal after capturing the photo
    }
  };

  const handleClose = () => {
    stopCamera(); // Stop camera before closing modal
    onClose();
  };

  return (
    <div className="camera-modal" style={{height: "100%", width: "100%", top: "0", zIndex: "9999"}}>
      <div className="modal-overlay" style={{top: "0"}} onClick={handleClose}></div>
      <div className="modal-content" style={{top: "0", display: "flex", justifyContent: "center"}}>
        {/* <div style={{width: "960px", height: "540px", margin: "auto", maxWidth: "none", borderRadius: "1rem"}} className='attendance-video-container'> */}
          <video ref={videoRef} autoPlay playsInline style={{height: "540px", width: "720px", margin: "auto", maxWidth: "none", borderRadius: "1rem"}} className='attendance-video'/>
        {/* </div> */}
        <div style={{display: "flex", justifyContent: "space-evenly"}}>
          <button onClick={handleCapturePhoto} className='take-photo'>Capture Photo</button>
          <button onClick={handleClose} className='close-camera'>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCameraModal;