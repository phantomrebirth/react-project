// import React, { useState, useRef, useEffect } from 'react';
// import { connect, useDispatch, useSelector } from 'react-redux';
// // import { setCroppedImageName } from '../redux/slices/croppedImageSlice';
// import ReactCrop, {
//   centerCrop,
//   makeAspectCrop,
//   convertToPixelCrop,
// } from 'react-image-crop';
// import { canvasPreview } from './canvasPreview';
// import { useDebounceEffect } from './useDebounceEffect';
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import 'react-image-crop/dist/ReactCrop.css';
// import { Modal , Alert } from 'react-bootstrap';
// // import axios from 'axios';
// import { login } from '../redux/actions/auth';
// import { deleteProfile, profile, profileUpdate } from '../redux/actions/profile';
// import { setCroppedImageName } from '../redux/actions/croppedImage';
// // import { selectToken } from '../redux/slices/authSlice';
// // import { selectImageUrl, selectIsLoading, selectError, fetchProfilePicture, setImageUrl } from "../redux/slices/profilePictureSlice";

// function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
//   return centerCrop(
//     makeAspectCrop(
//       {
//         unit: '%',
//         width: 90,
//       },
//       aspect,
//       mediaWidth,
//       mediaHeight
//     ),
//     mediaWidth,
//     mediaHeight
//   );
// }

// function ProfileHead({ token, profile, profileUpdate, deleteProfile, setCroppedImageName }) {
//   // const token = useSelector(selectToken);
//   const [imgSrc, setImgSrc] = useState('');
//   const previewCanvasRef = useRef(null);
//   // const dispatch = useDispatch();
//   const imgRef = useRef(null);
//   const [crop, setCrop] = useState();
//   const [completedCrop, setCompletedCrop] = useState();
//   const [scale, setScale] = useState(1);
//   const [rotate, setRotate] = useState(0);
//   const [aspect, setAspect] = useState(1 / 1);
//   const [showCropButton, setShowCropButton] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const imageUrl = useSelector((state) => state.profile.image);
//   console.log(imageUrl);
//   // const imageUrl = useSelector(selectImageUrl);
//   const [fetchedImage, setFetchedImage] = useState(imageUrl);
//   const isLoading = useSelector((state) => state.profile.isLoading);
//   const error = useSelector((state) => state.profile.error);
//   // const isLoading = useSelector(selectIsLoading);
//   // const error = useSelector(selectError);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);

//   // async function fetchImage() {
//   //   try {
//   //     const response = await axios.get('https://ezlearn.onrender.com/users/getpp',{
//   //       headers: {
//   //         Authorization: `Bearer ${token}`
//   //       },
//   //       responseType: 'blob'
//   //     });
//   //     const imageUrl = URL.createObjectURL(response.data);
//   //     dispatch(setImageUrl(imageUrl));
//   //     console.log(setImageUrl(imageUrl))
//   //     console.log(imageUrl);
//   //     console.log(fetchImage);
//   //     setFetchedImage(imageUrl);
//   //     setShowCropButton(true);
//   //   } catch (error) {
//   //     console.error('Error fetching image:', error);
//   //   }
//   // }

//   // useEffect(() => {
//   //   fetchImage();
//   // }, []);

//   useEffect(() => {
//     profile(token);
//   }, [token]);

//   useEffect(() => {
//     if (fetchedImage && previewCanvasRef.current) {
//       const canvas = previewCanvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const image = new Image();
//       image.onload = () => {
//         canvas.width = image.width;
//         canvas.height = image.height;
//         ctx.drawImage(image, 0, 0);
//       };
//       // Create object URL with the fetchedImage blob
//       const objectURL = URL.createObjectURL(new Blob([fetchedImage]));
//       image.src = objectURL;
//       image.src = fetchedImage;
//       // Clean up by revoking the object URL when component unmounts or fetchedImage changes
//       return () => {
//         URL.revokeObjectURL(objectURL);
//       };
//     }
//   }, [fetchedImage]);

//   function onSelectFile(e) {
//     if (e.target.files && e.target.files.length > 0) {
//       setCrop(undefined);
//       setShowCropButton(true);
//       setShowModal(true);
//       const reader = new FileReader();
//       reader.addEventListener('load', () =>
//         setImgSrc(reader.result?.toString() || '')
//       );
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   }

//   function onImageLoad(e) {
//     if (aspect) {
//       const { width, height } = e.currentTarget;
//       setCrop(centerAspectCrop(width, height, aspect));
//     }
//   }

//   useDebounceEffect(
//     async () => {
//       if (
//         completedCrop?.width &&
//         completedCrop?.height &&
//         imgRef.current &&
//         previewCanvasRef.current
//       ) {
//         canvasPreview(
//           imgRef.current,
//           previewCanvasRef.current,
//           completedCrop,
//           scale,
//           rotate
//         );
//       }
//     },
//     100,
//     [completedCrop, scale, rotate]
//   );

//   function handleToggleAspectClick() {
//     if (aspect) {
//       setAspect(undefined);
//     } else {
//       setAspect(1 / 1);

//       if (imgRef.current) {
//         const { width, height } = imgRef.current;
//         const newCrop = centerAspectCrop(width, height, 1 / 1);
//         setCrop(newCrop);
//         setCompletedCrop(convertToPixelCrop(newCrop, width, height));
//       }
//     }
//   }

//   const handleChooseImageClick = () => {
//     const fileInput = document.getElementById('fileInput');
//     if (fileInput) {
//       fileInput.click();
//     }
//   };

//   async function handleCropButtonClick() {
//     setCrop(undefined);
//     setImgSrc('');
//     setShowCropButton(false);
//     setShowModal(false);  
//     // console.log(completedCrop && imgRef.current)
    
//     try {
//       if (completedCrop && imgRef.current && imgRef.current.complete) {
//         // await new Promise((resolve) => imgRef.current.onload = resolve);
      
//         console.log("Cropped image dimensions:", completedCrop.width, "x", completedCrop.height);
        
//         // const randomName = Math.random().toString(36).substring(7);
//         const randomName = Math.floor(Math.random() * 1000000000); // Generates a random number between 0 and 999999999
//         const currentDate = new Date();
//         const formattedDate = currentDate.toISOString().split('T')[0];
//         const croppedImageName = `${randomName}_${formattedDate}.jpg`;
        
//         setCroppedImageName(croppedImageName);
        
        
//         // get the original dimensions of the image
//         const { naturalWidth, naturalHeight } = imgRef.current;
//         // console.log("Original image dimensions:", naturalWidth, "x", naturalHeight);

//       // calculate the scaling factors
//       const scaleX = naturalWidth / imgRef.current.width;
//       const scaleY = naturalHeight / imgRef.current.height;
      
//       // calculate the target width and height based on the desired aspect ratio
//       const targetWidth = 1080;
//       const targetHeight = 1080;

//       // calculate the cropped dimensions to maintain the aspect ratio
//       let croppedWidth = completedCrop.width * scaleX;
//       let croppedHeight = completedCrop.height * scaleY;

//       if (croppedWidth / croppedHeight > targetWidth / targetHeight) {
//         // if the cropped width/height ratio is greater than the target width/height ratio,
//         // adjust the cropped height to match the target height
//         croppedHeight = croppedWidth * (targetHeight / targetWidth);
//       } else {
//         // otherwise, adjust the cropped width to match the target width
//         croppedWidth = croppedHeight * (targetWidth / targetHeight);
//       }

//       // calculate the cropped coordinates to center the cropped area
//       const croppedX = (completedCrop.x * scaleX) + ((completedCrop.width * scaleX - croppedWidth) / 2);
//       const croppedY = (completedCrop.y * scaleY) + ((completedCrop.height * scaleY - croppedHeight) / 2);

//       // create a canvas element to draw the cropped image
//       const canvas = document.createElement('canvas');
//       canvas.width = targetWidth;
//       canvas.height = targetHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(
//         imgRef.current,
//         croppedX,
//         croppedY,
//         croppedWidth,
//         croppedHeight,
//         0,
//         0,
//         targetWidth,
//         targetHeight
//       );
//         // const crop = convertToPixelCrop(completedCrop, imgRef.current.width, imgRef.current.height);
//         // const canvas = document.createElement('canvas');
//         // canvas.width = crop.width;
//         // canvas.height = crop.height;
//         // const ctx = canvas.getContext('2d');
//         // ctx.drawImage(
//         //   imgRef.current,
//         //   crop.x,
//         //   crop.y,
//         //   crop.width,
//         //   crop.height,
//         //   0,
//         //   0,
//         //   crop.width,
//         //   crop.height
//         // );
        
//         // Convert the cropped image data to a Blob
//         canvas.toBlob(async (blob) => {
//           console.log("blob",blob);
//           const file = new File([blob], croppedImageName, { type: 'image/jpeg' });
//           console.log("file",file);
//           const formData = new FormData();
//           formData.append('avatar', file);
          
//           console.log('Sending request with FormData:', formData);
//           profileUpdate(formData);
//         // const response = await axios.post('https://ezlearn.onrender.com/users/profilePicture',
//         //   formData, {
//         //     headers: {
//         //       Authorization: `Bearer ${token}`,
//         //       // 'Content-Type': 'multipart/form-data'
//         //       'Content-Type': 'image/jpeg'
//         //     }
//         //   });
//           // console.log('Profile picture updated successfully:', response.data);
//           setShowSuccess(true); // Show success message
//           setShowError(false); // Hide error message
//           // fetchImage();
//           profile(token);
//         }, 'image/jpeg');
//       } else {
//         console.error('Completed crop or image ref not available');
//       }
//     } catch (error) {
//       console.error('Error updating profile picture:', error);
//       setShowError(true); // Show error message
//       setShowSuccess(false); // Hide success message
//     }
//   }
//   //     if (completedCrop && imgRef.current) {
//   //       const canvas = previewCanvasRef.current;
//   //       const crop = convertToPixelCrop(completedCrop, imgRef.current.width, imgRef.current.height);
//   //       canvasPreview(imgRef.current, canvas, crop, scale, rotate);
        
//   //       // Get base64-encoded image data from the canvas
//   //       const croppedImageData = canvas.toDataURL('image/png');
        
//   //       const croppedImageUrl = canvas.toDataURL('image/png');
//   //       setUserData(croppedImageData)
//   //       setFetchedImage(croppedImageUrl);
//   //       const body = {
//   //         avatar: croppedImageData
//   //       };
//   //       console.log(body);
//   //       // console.log(croppedImageUrl);
//   //       const response = await axios.post('https://ezlearn.onrender.com/admins/profilePicture',
//   //       body, {
//   //         headers: {
//   //           Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAwZWYwZTY4ZjczMGMzYmM4OThjNjciLCJpYXQiOjE3MTIwODE3NTd9.cKsx5rWFX8VOHFp8VrKCEjyEqE5_u-2PeiTS4Ey3Sbo',
//   //           'Content-Type': 'image/png'
//   //         }
//   //       });
//   //       console.log('Profile picture updated successfully:', response.data);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error updating profile picture:', error);
//   //   }
//   // }

//   // // Function to convert data URI to Blob
//   // function dataURItoBlob(dataURI) {
//   //   // Convert base64/URLEncoded data component to raw binary data
//   //   const byteString = atob(dataURI.split(',')[1]);
//   //   // Separate out the mime component
//   //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//   //   // Write the bytes of the string to an ArrayBuffer
//   //   const ab = new ArrayBuffer(byteString.length);
//   //   const ia = new Uint8Array(ab);
//   //   for (let i = 0; i < byteString.length; i++) {
//   //     ia[i] = byteString.charCodeAt(i);
//   //   }
//   //   // New Blob object using the mime type
//   //   return new Blob([ab], { type: mimeString });
//   // }

//   async function handleDeleteButtonClick() {
//     try {
//       // if (!fetchedImage | !completedCrop) {
//       //   console.error('No profile picture fetched for deletion');
//       //   return;
//       // }
//       deleteProfile(token);
//       // const avatar = await axios.delete('https://ezlearn.onrender.com/users/deletePP', {
//       // headers: {
//       //   Authorization: `Bearer ${token}`
//       // },
//       // data: {avatar: previewCanvasRef}, // empty object to pass as payload
//     // });
//     // console.log('Profile picture deleted successfully', avatar.data);
//     setFetchedImage(null);
//     setShowModal(false);
//     setCrop(null);
//     setImgSrc(null);
//     setCompletedCrop(null);
//     setShowDelete(true); // Show success message
//     setShowError(false); // Hide error message
//     } catch (error) {
//       console.error('Error deleting profile picture:', error);
//       setShowError(true); // Show error message
//       setShowDelete(false); // Hide success message
//     }
//   }

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setFetchedImage(null);
//     setCrop(null);
//     setImgSrc(null);
//     setCompletedCrop(null);
//   };
import React, { useState, useRef, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';
import { MdOutlineDeleteOutline } from "react-icons/md";
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Alert } from 'react-bootstrap';
import { deleteProfile, profile, profileUpdate } from '../redux/actions/profile';
import { setCroppedImageName } from '../redux/actions/croppedImage';
import { login } from '../redux/actions/auth';
import { PROFILE_UPDATE_SUCCESS } from '../redux/actions/type';

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

function ProfileHead({ token, profile, profileUpdate, deleteProfile, setCroppedImageName }) {
  const dispatch = useDispatch();
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
  const imageUrl = useSelector((state) => state.profile.image);
  const [fetchedImage, setFetchedImage] = useState(null);
  const isLoading = useSelector((state) => state.profile.isLoading);
  const error = useSelector((state) => state.profile.error);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  useEffect(() => {
    if (token) {
      profile(token);
    }
  }, [profile]);

  useEffect(() => {
    if (imageUrl) {
      setFetchedImage(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (fetchedImage && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      };
      image.src = fetchedImage;
    }
  }, [fetchedImage]);

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

  async function handleCropButtonClick() {
    setCrop(undefined);
    setImgSrc('');
    setShowCropButton(false);
    setShowModal(false);
  
    try {
      if (completedCrop && imgRef.current && imgRef.current.complete) {
        const randomName = Math.floor(Math.random() * 1000000000);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        const croppedImageName = `${randomName}_${formattedDate}.jpg`;
  
        setCroppedImageName(croppedImageName);
  
        const { naturalWidth, naturalHeight } = imgRef.current;
        const scaleX = naturalWidth / imgRef.current.width;
        const scaleY = naturalHeight / imgRef.current.height;
  
        const targetWidth = 1080;
        const targetHeight = 1080;
  
        let croppedWidth = completedCrop.width * scaleX;
        let croppedHeight = completedCrop.height * scaleY;
  
        if (croppedWidth / croppedHeight > targetWidth / targetHeight) {
          croppedHeight = croppedWidth * (targetHeight / targetWidth);
        } else {
          croppedWidth = croppedHeight * (targetWidth / targetHeight);
        }
  
        const croppedX = (completedCrop.x * scaleX) + ((completedCrop.width * scaleX - croppedWidth) / 2);
        const croppedY = (completedCrop.y * scaleY) + ((completedCrop.height * scaleY - croppedHeight) / 2);
  
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          imgRef.current,
          croppedX,
          croppedY,
          croppedWidth,
          croppedHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );
  
        canvas.toBlob(async (blob) => {
          const file = new File([blob], croppedImageName, { type: 'image/jpeg' });
          const formData = new FormData();
          formData.append('avatar', file);
          formData.append('token', token);  // Add the token to the formData
          try {

          const response = await profileUpdate(formData);
          console.log(response)
          console.log(formData)
          // dispatch({
          //   type: PROFILE_UPDATE_SUCCESS,
          //   payload: URL.createObjectURL(blob) // Use blob URL as payload
          // });
            const newImageUrl = URL.createObjectURL(blob);
            setFetchedImage(newImageUrl);
            setShowSuccess(true);
            setShowError(false);
          }
          catch (error) {
          console.error('Error updating profile:', error);
          setShowError(true);
          setShowSuccess(false);
        }
          profile(token)
        }, 'image/jpeg');
        } else {
        console.error('Completed crop or image ref not available');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      setShowError(true);
      setShowSuccess(false);
    }
  }

  async function handleDeleteButtonClick() {
    try {
      deleteProfile(token);
      setFetchedImage(null);
      setShowModal(false);
      setCrop(null);
      setImgSrc(null);
      setCompletedCrop(null);
      setShowDelete(true);
      setShowError(false);
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      setShowError(true);
      setShowDelete(false);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
    // setFetchedImage(null);
    setCrop(null);
    setImgSrc(null);
    setCompletedCrop(null);
  };
    
  return (
    <div className="profile-head">
      {showSuccess && (
        <Alert variant="primary" onClose={() => setShowSuccess(false)} dismissible>
          Profile picture updated successfully!
        </Alert>
      )}
      {showDelete && (
        <Alert variant="secondary" onClose={() => setShowSuccess(false)} dismissible>
          Profile picture deleted successfully!
        </Alert>
      )}
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          Error updating profile picture. Please try again.
        </Alert>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
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
            aspect={1 / 1}
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
      {/* !!completedCrop && */}
      {(!!fetchedImage || !!completedCrop) && (
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
      {/* {(!!completedCrop && !fetchedImage) &&(
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
      )} */}
          {/* {!!fetchedImage && (
            <img src={fetchedImage} alt=''
            style={{width: "200px",height: "200px"}}
            />
          )} */}
          { (
            <>
              <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              id="fileInput"
              style={{ display: 'none' }}
              />
              <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                <div className='crop-settings'>
                  <button className='chooseImage' 
                          onClick={handleChooseImageClick}>
                            Choose Image
                  </button>
                  {(!!fetchedImage || !!completedCrop) && (
                    <MdOutlineDeleteOutline className='deleteBtn' onClick={handleDeleteButtonClick} />
                  )}
                  {/* {!!completedCrop && (
                  <MdOutlineDeleteOutline className='deleteBtn' 
                                          onChange={handleDeleteButtonClick}>
                  </MdOutlineDeleteOutline>
                  )} */}
                </div>
              </div>
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

const mapStateToProps = state => ({
  token: state.auth.token,
  image: state.profile.image,
  isLoading: state.profile.isLoading,
  error: state.profile.error,
  // croppedImageName: state.croppedImageReducer.croppedImageName,
})

export default connect(mapStateToProps, { login, profile, deleteProfile, profileUpdate, setCroppedImageName })(ProfileHead);