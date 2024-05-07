import React, { useEffect, useState } from 'react';
import { FaFolderClosed } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { PDFDocument } from 'pdf-lib';
import LoadingSpinner from '../../redux/actions/LoadingSpinner';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses, selectCourses } from '../../redux/slices/coursesSlice';
import { selectRole } from '../../redux/slices/authSlice';

const Files = () => {

    const dispatch = useDispatch();
    const role = useSelector(selectRole);
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);
    useEffect(() => {
        if (role === 'student') {
          setStudent(true);
        } else if (role === 'teacher') {
          setTeacher(true);
        }
        dispatch(fetchCourses());
    }, [role, dispatch]);
    
    const { loading, data: courses, currentCourseId } = useSelector(selectCourses);    
    const course = courses.find(course => course._id === currentCourseId);
    
    const filePath = course.files.map(file => `https://ezlearn.onrender.com/course/getFiles/${currentCourseId}/${file._id}`);
    const filesWithPaths = course.files.map(file => {
        const matchingPath = filePath.find(path => path.includes(file._id));
        // console.log(`File ID: ${file._id}, Matching Path: ${matchingPath}`);
        return {
            ...file,
            path: matchingPath || ''
        };
    });
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
    
    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <>
          {student && (
            <div className='files-container' key={course._id}>
                {filesWithPaths.map((file, index) => (
                    <div key={index}>
                        <h6 className='file-header'>Week {index + 1}</h6>
                        <div key={file._id} className='file-container'>
                            <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick(file)}>
                                <FaFolderClosed className='folder-icon'/>
                                <h5 className='file-name'>{file.filename}</h5>
                            </div>
                            <a onClick={() => handleFileDownload(file)}>
                                <HiOutlineDownload className='downloadFile-icon' title='Download' style={{cursor: "pointer"}}/>
                            </a>
                        </div>
                        <hr className='files-hr'/>
                    </div>
                ))}
            </div>
          )}
          {teacher && (
            <div>_</div>
          )}
        </>
    );
};

export default Files;