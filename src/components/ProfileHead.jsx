import React, { useState, useRef } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';
import { Modal } from 'react-bootstrap';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ProfileHead() {
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(1 / 1);
  const [showCropButton, setShowCropButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      setShowCropButton(true);
      setShowModal(true);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(1 / 1);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 1 / 1);
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const handleChooseImageClick = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  function handleCropButtonClick() {
    setCrop(undefined);
    setImgSrc('');
    setShowCropButton(false);
    setShowModal(false);
  }

  return (
    <div className="profile-head">
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Body className='pfModalBody'>
          {imgSrc && (
            <div className="Crop-Controls">
              {/* <div>
                <label htmlFor="scale-input">Scale: </label>
                <input
                  id="scale-input"
                  type="number"
                  step="0.1"
                  value={scale}
                  disabled={!imgSrc}
                  onChange={(e) => setScale(Number(e.target.value))}
                  />
                </div> */}
              {/* <div>
                <label htmlFor="rotate-input">Rotate: </label>
                <input
                id="rotate-input"
                type="number"
                value={rotate}
                disabled={!imgSrc}
                onChange={(e) =>
                  setRotate(
                      Math.min(180, Math.max(-180, Number(e.target.value)))
                    )
                  }
                  />
                </div> */}
              {/* <div>
                <button onClick={handleToggleAspectClick}>
                Toggle aspect {aspect ? 'off' : 'on'}
                </button>
              </div> */}
              {showCropButton && (
                <div>
                  <button className='cropBtn' onClick={handleCropButtonClick}>Confirm</button>
                </div>
              )}
            </div>
          )}
          {!!imgSrc && (
            <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
                />
            </ReactCrop>
          )}
        </Modal.Body>
      </Modal>
      {!!completedCrop && (
          <div className='profile-picture'>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                // width: completedCrop.width,
                // height: completedCrop.height,
                width: 200,
                height: 200,
              }}
              width={200}
              height={200}
              />
          </div>
          )}
          {!imgSrc && (
            <>
              <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              id="fileInput"
              style={{ display: 'none' }}
              />
              <button className='chooseImage' onClick={handleChooseImageClick}>Choose Image</button>
            </>
          )}
          {/* <div>
            {showCropButton && (
              <button
              onClick={() => {
                const canvas = previewCanvasRef.current;
                if (canvas) {
                  const croppedImageUrl = canvas.toDataURL('image/png');
                    setShowCropButton(false);
                    // Show the cropped image directly
                    window.open(croppedImageUrl);
                  }
                }}
                >
                Show Cropped Image
                </button>
            )}
          </div> */}
    </div>
  );
};