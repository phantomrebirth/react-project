import React, { useEffect, useState } from 'react';
import { FaFolderClosed } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { PDFDocument } from 'pdf-lib';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses, resetDeleteAlert, resetUploadAlert, resetWaitAlert, selectCourses, setDeleteAlert, setUploadAlert, setWaitAlert } from '../../redux/slices/coursesSlice';
import { selectRole, selectToken } from '../../redux/slices/authSlice';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { TbFileUpload } from 'react-icons/tb';
import axios from 'axios';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const Files = () => {

  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const token = useSelector(selectToken);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  const [filesWithPaths, setFilesWithPaths] = useState([]);
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);
  const { coursesLoading, filesLoading, data: courses, currentCourseId } = useSelector(selectCourses);
  const uploadAlert = useSelector(state => state.courses.uploadAlert);
  const deleteAlert = useSelector(state => state.courses.deleteAlert);
  const waitAlert = useSelector(state => state.courses.waitAlert);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (uploadAlert) {
        dispatch(resetUploadAlert());
      }
      if (deleteAlert) {
        dispatch(resetDeleteAlert());
      }
      // if (waitAlert) {
      //   dispatch(resetWaitAlert());
      // }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [uploadAlert, deleteAlert, waitAlert, dispatch]);
  const course = courses.find(course => course._id === currentCourseId);
  if (coursesLoading || filesLoading || !course) {
    return <LoadingSpinner />;
  }
  useEffect(() => {
    const filePath = courses.find(course => course._id === currentCourseId)?.files.map(file => `https://ezlearn.onrender.com/course/getFiles/${currentCourseId}/${file._id}`);
    const filesWithPaths = courses.find(course => course._id === currentCourseId)?.files.map(file => {
      const matchingPath = filePath.find(path => path.includes(file._id));
      return {
        ...file,
        path: matchingPath || ''
      };
    });
    setFilesWithPaths(filesWithPaths || []);
  }, [courses, currentCourseId]);
  // console.log('Files with Paths:', filesWithPaths);
  const handleFileNameClick = (file) => {
    if (file.path) {
      window.open(file.path, '_blank');
    };
  };

  const handleFileDownload = async (file) => {
    const { filename, path } = file;
    try {
      const response = await fetch(path);
      const fileData = await response.arrayBuffer();

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
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    if (!uploadAlert && !deleteAlert) {
      dispatch(setWaitAlert({ variant: 'info', message: 'Uploading... please wait' }));
    }

    try {
      const response = await axios.post(`https://ezlearn.onrender.com/course/files/${currentCourseId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log('test');
        const { fileId } = response.data;
        console.log(fileId);
        const uploadedFile = {
          _id: fileId,
          filename: event.target.files[0].name,
        };
        // dispatch({ type: 'courses/addFile', payload: { courseId: currentCourseId, file: uploadedFile } });    
        dispatch(setUploadAlert({ variant: 'primary', message: 'File uploaded successfully!' })); // Dispatch setUploadAlert action to set the upload alert
        const updatedFiles = [...filesWithPaths, uploadedFile];
        setFilesWithPaths(updatedFiles);
        // dispatch(fetchCourses(currentCourseId));
      } else {
        dispatch(setUploadAlert({ variant: 'danger', message: `Failed to upload file: ${response.statusText}` })); // Dispatch setUploadAlert action to set the upload alert
        // setUploadAlert({ variant: 'danger', message: `Failed to upload file: ${response.statusText}` });
      }
    } catch (error) {
      dispatch(setUploadAlert({ variant: 'danger', message: `Error uploading file: ${error.message}` })); // Dispatch setUploadAlert action to set the upload alert
      // setUploadAlert({ variant: 'danger', message: `Error uploading file: ${error.message}` });
    }
  };


  const handleFileDelete = async (file) => {
    if (!uploadAlert && !deleteAlert) {
      dispatch(setWaitAlert({ variant: 'info', message: 'Deleting... please wait' }));
    }

    try {
      const response = await axios.delete(`https://ezlearn.onrender.com/course/deleteFiles/${currentCourseId}/${file._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log('test')
        const updatedFiles = filesWithPaths.filter(f => f._id !== file._id);
        setFilesWithPaths(updatedFiles);
        dispatch(setDeleteAlert({ variant: 'primary', message: 'File deleted successfully!' })); // Dispatch setDeleteAlert action to set the delete alert
        // dispatch(fetchCourses(currentCourseId));
      } else {
        dispatch(setDeleteAlert({ variant: 'danger', message: `Failed to delete file: ${response.statusText}` })); // Dispatch setDeleteAlert action to set the delete alert
        // setDeleteAlert({ variant: 'danger', message: `Failed to delete file: ${response.statusText}` });
      }
    } catch (error) {
      dispatch(setDeleteAlert({ variant: 'danger', message: `Error deleting file: ${error.message}` })); // Dispatch setDeleteAlert action to set the delete alert
      // setDeleteAlert({ variant: 'danger', message: `Error deleting file: ${error.message}` });
    }
  };

  return (
    <>
      {uploadAlert && (
        <Alert variant={uploadAlert.variant} onClose={() => dispatch(setUploadAlert(null))} dismissible>
          {uploadAlert.message}
        </Alert>
      )}
      {deleteAlert && (
        <Alert variant={deleteAlert.variant} onClose={() => dispatch(setDeleteAlert(null))} dismissible>
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
    </>
  );
};

export default Files;