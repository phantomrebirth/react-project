import React, { useEffect, useState } from 'react';
import { FaFolderClosed } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { PDFDocument } from 'pdf-lib';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { useSelector, useDispatch, connect } from 'react-redux';
// import { fetchCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, selectCourses, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/slices/coursesSlice';
// import { selectRole, selectToken } from '../../redux/slices/authSlice';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { TbFileUpload } from 'react-icons/tb';
import axios from 'axios';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { finishFileOperation, getCourseFile, getCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, setDeleteAlert, setFilesWithPaths, setUploadAlert, setWaitAlert, startFileOperation } from '../../redux/actions/courses';
import { login } from '../../redux/actions/auth';
import apiUrl from '../ApiUrl';

const Files = 
({
  role,
  token,
  fileIsLoading,
  courses,
  isLoading,
  courseFileData,
  getCourseFile,
  getCourses,
  // setFilesWithPaths,
  // filesWithPaths,
  waitAlert,
  uploadAlert,
  deleteAlert,
  currentCourseID,
  setWaitAlert,
  setDeleteAlert,
  setUploadAlert,
  resetDeleteAlert,
  resetUploadAlert,
  resetWaitAlert,
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
  const [filesWithPaths, setFilesWithPaths] = useState([]);
  // const [fileIDs, setFileIDs] = useState(course ? course.files.map(file => file._id) : []);
  // const [fileOperationInProgress, setFileOperationInProgress] = useState(false);
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);
  // const { coursesLoading, filesLoading, data: courses, currentCourseId } = useSelector(selectCourses);
  // const uploadAlert = useSelector(state => state.courses.uploadAlert);
  // const deleteAlert = useSelector(state => state.courses.deleteAlert);
  // const waitAlert = useSelector(state => state.courses.waitAlert);
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
  }, [uploadAlert, deleteAlert, waitAlert]);
  // if (course && course.files) {
    // const fileIDs = course ? course.files.map(file => file._id) : [];
    // console.log(fileIDs); // This will log the array of file IDs
  // } else {
  //   console.log('Course or files not found');
  // }
  const course = courses.find(course => course._id === currentCourseID);
  // if ((isLoading || fileIsLoading || !course) && isFileOperationInProgress) {
  //   return <LoadingSpinner />;
  // }
  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     if (fileIDs.length > 0) {
  //       for (const fileID of fileIDs) {
  //         await getCourseFile({ currentCourseID, fileID });
  //       }
  //     }
  //   };
  
  //   fetchFiles();
  // }, [currentCourseID, fileIDs]);
  // console.log(courseFileData)
  useEffect(() => {
    if (course && course.files && course.files.length > 0) {
        const basePath = `${apiUrl}/course/getFiles/${currentCourseID}/`;
        const files = course.files.map(file => ({
            ...file,
            path: `${basePath}${file._id}`,
        }));
        setFilesWithPaths(files);
    }
  }, [course, currentCourseID]);
  useEffect(() => {
    console.log('files Paths:', filesWithPaths);
  }, [filesWithPaths]);
    // useEffect(() => {
    //   const filePath = courseFileData;
    //   console.log('files Paths:', filePath);
    //   const files = course.files.map(file => {
    //     const matchingPath = filePath.find(path => path.includes(file._id));
    //     const basePath = `https://formally-eager-duckling.ngrok-free.app/course/getFiles/${currentCourseID}/`;
    //     return {
    //       ...file,
    //       path: matchingPath ? `${basePath}${file._id}` : '',
    //     };
    //   });
    //   setFilesWithPaths(files);
    //   console.log('files:', files);
    // }, [currentCourseID, courses, courseFileData]);
    // useEffect(() => {
  //   const filePath = courses.find(course => course._id === currentCourseId)?.files.map(file => `https://ezlearn.onrender.com/course/getFiles/${currentCourseId}/${file._id}`);
  //   const filesWithPaths = courses.find(course => course._id === currentCourseId)?.files.map(file => {
  //     const matchingPath = filePath.find(path => path.includes(file._id));
  //     return {
  //       ...file,
  //       path: matchingPath || ''
  //     };
  //   });
  //   setFilesWithPaths(filesWithPaths || []);
  // }, [courses, currentCourseId]);
  // console.log('Files with Paths:', filesWithPaths);
  const handleFileNameClick = (file) => {
    if (file.path) {
      window.open(file.path, '_blank');
    };
  };

  const handleFileDownload = async (file) => {
    const { filename, path } = file;
    try {
      const response = await fetch(path, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      const fileData = await response.arrayBuffer();
      console.log('Downloaded file data:', fileData);
  
      const pdfDoc = await PDFDocument.load(fileData);
      const newPdfDoc = await PDFDocument.create();
  
      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  
      pages.forEach((page) => {
        newPdfDoc.addPage(page);
      });
  
      const pdfBytes = await newPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
  
      document.body.appendChild(a);
      a.click();
  
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle specific error cases or display a user-friendly message
    }
  };
  
  
  

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    console.log(formData);
    // if (!uploadAlert && !deleteAlert) {
      setWaitAlert({ variant: 'info', message: 'Uploading... please wait' });
    // }

    startFileOperation()
    console.log(isFileOperationInProgress)
    try {
      const response = await axios.post(`${apiUrl}/course/files/${currentCourseID}`, formData, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          // 'User-Agent': 'CustomUserAgent',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log('response', response.data);
        // console.log(fileId);
        const { fileId, filename } = response.data;
        const newFile = {
          _id: fileId,
          filename: file.name,
          path: `${apiUrl}/course/getFiles/${currentCourseID}/${fileId}`,
          };
          // setFileIDs(prevFileIDs => [...prevFileIDs, fileId]);
          setFilesWithPaths(prevFiles => [...prevFiles, newFile]);
          // await getCourseFile({ currentCourseID, fileID: fileId });
          console.log(filesWithPaths)
          // const { fileId } = response.data;
          // const uploadedFile = {
        //   _id: fileId,
        //   // filename: event.target.files[0].name,
        // };
        getCourses();
        // dispatch({ type: 'courses/addFile', payload: { courseId: currentCourseId, file: uploadedFile } }); 
        setUploadAlert({ variant: 'primary', message: 'File uploaded successfully!' }); // Dispatch setUploadAlert action to set the upload alert
        // const updatedFiles = [...filesWithPaths, uploadedFile];
        // setFilesWithPaths(updatedFiles);
        // dispatch(fetchCourses(currentCourseId));
      } else {
        setUploadAlert({ variant: 'danger', message: `Failed to upload file: ${response.statusText}` }); // Dispatch setUploadAlert action to set the upload alert
        // setUploadAlert({ variant: 'danger', message: `Failed to upload file: ${response.statusText}` });
      }
    } catch (error) {
      setUploadAlert({ variant: 'danger', message: `Error uploading file: ${error.message}` }); // Dispatch setUploadAlert action to set the upload alert
      // setUploadAlert({ variant: 'danger', message: `Error uploading file: ${error.message}` });
    } finally {
      finishFileOperation(); // Reset file operation status
      resetWaitAlert();
    }
  };
  console.log(filesWithPaths)


  const handleFileDelete = async (file) => {
    // if (!uploadAlert && !deleteAlert) {
      setWaitAlert({ variant: 'info', message: 'Deleting... please wait' });
    // }
    startFileOperation();
    console.log(isFileOperationInProgress)
    try {
      const response = await axios.delete(`${apiUrl}/course/deleteFiles/${currentCourseID}/${file._id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          // 'User-Agent': 'CustomUserAgent',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log('test')
        // setFileIDs(prevFileIDs => prevFileIDs.filter(id => id !== file._id));
        // const updatedFiles = filesWithPaths.filter(f => f._id !== file._id);
        // setFilesWithPaths(updatedFiles);
        setFilesWithPaths(prevFiles => prevFiles.filter(f => f._id !== file._id));
        // await getCourseFile({ currentCourseID, fileID: file._id });
        getCourses();
        // const fileID = file._id;
        // getCourseFile({currentCourseID,fileID})   
        setDeleteAlert({ variant: 'primary', message: 'File deleted successfully!' }); // Dispatch setDeleteAlert action to set the delete alert
        // dispatch(fetchCourses(currentCourseId));
      } else {
        setDeleteAlert({ variant: 'danger', message: `Failed to delete file: ${response.statusText}` }); // Dispatch setDeleteAlert action to set the delete alert
        // setDeleteAlert({ variant: 'danger', message: `Failed to delete file: ${response.statusText}` });
      }
    } catch (error) {
      setDeleteAlert({ variant: 'danger', message: `Error deleting file: ${error.message}` }); // Dispatch setDeleteAlert action to set the delete alert
      // setDeleteAlert({ variant: 'danger', message: `Error deleting file: ${error.message}` });
    } finally {
      finishFileOperation(); // Reset file operation status
      resetWaitAlert();
    }
  };
console.log(isFileOperationInProgress)
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
      {student && (
        <div className='files-container' key={course._id}>
          {filesWithPaths.map((file, index) => (
            <div key={index}>
              <h6 className='file-header'>Week {index + 1}</h6>
              <div key={file._id} className='file-container'>
                <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick(file)}>
                  <FaFolderClosed className='folder-icon' />
                  <h5 className='file-name'>{file.filename}</h5>
                </div>
                <a onClick={() => handleFileDownload(file)}>
                  <HiOutlineDownload className='downloadFile-icon' title='Download' style={{ cursor: "pointer" }} />
                </a>
              </div>
              <hr className='files-hr' />
            </div>
          ))}
        </div>
      )}
      {teacher && !waitAlert &&(
        <Container style={{ margin: "0", padding: "0" }}>
          <Row>
            <Col md={5} lg={5} xl={5} style={{ paddingBottom: "2%", marginLeft: "1%" }}>
              <div className='mt-3 upAss-container'>
                <label htmlFor='assignmentInput' className='headUp-ass' title='Select file' style={{ fontSize: "116%" }}>
                  Upload new file
                  <TbFileUpload className='upAss-icon' />
                </label>
                <input
                  id='assignmentInput'
                  type='file'
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
              {/* <hr className='files-hr' /> */}
            </Col>
          </Row>
          <Row className='files-container' key={course._id}>
            {filesWithPaths.map((file, index) => (
              <div key={index}>
                <h6 className='file-header'>Week {index + 1}</h6>
                <div key={file._id} className='file-container'>
                  <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick(file)}>
                    <FaFolderClosed className='folder-icon' />
                    <h5 className='file-name'>{file.filename}</h5>
                  </div>
                  <a onClick={() => handleFileDownload(file)} className='fileDownload-container'>
                    <HiOutlineDownload className='downloadFile-icon' title='Download' style={{ cursor: "pointer" }} />
                  </a>
                  <a onClick={() => handleFileDelete(file)}>
                    <MdOutlineDeleteOutline className='deleteVideo-icon' title='Delete' />
                  </a>
                </div>
                <hr className='files-hr' />
              </div>
            ))}
          </Row>
        </Container>
      )}
      {Array.isArray(filesWithPaths) && filesWithPaths.length == 0 && (
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
          <p>No Files yet.</p>
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
  courseFileData: state.courses.courseFileData,
  // filesWithPaths: state.courses.filesWithPaths,
  fileIsLoading: state.courses.fileIsLoading,
  deleteAlert: state.courses.deleteAlert,
  uploadAlert: state.courses.uploadAlert,
  waitAlert: state.courses.waitAlert,
  error: state.courses.error,
  isFileOperationInProgress: state.courses.isFileOperationInProgress,
});

export default connect(mapStateToProps,
  {
    login,
    getCourseFile,
    getCourses,
    setUploadAlert,
    setWaitAlert,
    setDeleteAlert,
    resetUploadAlert,
    resetDeleteAlert,
    resetWaitAlert,
    startFileOperation,
    finishFileOperation,
    // setFilesWithPaths
  })
(Files);