import React, { useRef, useEffect, useState } from 'react';

const CameraModal = ({ onClose, onCapture }) => {
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
    <div className="camera-modal">
      <div className="modal-overlay" onClick={handleClose}></div>
      <div className="modal-content">
        <video ref={videoRef} autoPlay playsInline />
        <button onClick={handleCapturePhoto}>Capture Photo</button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default CameraModal;