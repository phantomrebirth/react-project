// import React, { useEffect, useState } from 'react';
// import { FaFolderClosed } from "react-icons/fa6";
// import { HiOutlineDownload } from "react-icons/hi";
// import { selectRole, selectToken } from '../../../redux/slices/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../../redux/slices/coursesSlice';
// import { PDFDocument } from 'pdf-lib';
// import LoadingSpinner from '../../../redux/actions/LoadingSpinner';

// const NetworkFiles = () => {
//     const role = useSelector(selectRole);
//     const token = useSelector(selectToken);
//     const [student, setStudent] = useState(false);
//     const [course, setCourse] = useState(null);
//     const courses = useSelector(state => state.courses.data);
//     const [fileData, setFileData] = useState(null);
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(true);
//     const { fileIdArray, error, courseIdArray } = useSelector(selectCourses);
//     const fileId = fileIdArray[1];
//     const courseId = courseIdArray[1];

//     useEffect(() => {
//         dispatch(fetchCourses());
//     }, [dispatch]);

//     useEffect(() => {
//         if (role === 'student') {
//             setStudent(true);
//         }
//     }, [role]);

//     useEffect(() => {
//         if (courses.length > 1) {
//             setCourse(courses[1]);
//             setLoading(false);
//         }
//     }, [courses]);

//     const filePath = `https://ezlearn.onrender.com/course/getFiles/${courseId}/${fileId}`;

//     const handleFileNameClick = () => {
//         window.open(filePath, '_blank');
//     };
    
//     const handleFileDownload = async (filename) => {
//         try {
//             const response = await fetch(filePath);
//             const fileData = await response.arrayBuffer();
    
//             const pdfDoc = await PDFDocument.load(fileData);
//             const newPdfDoc = await PDFDocument.create();
    
//             const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    
//             pages.forEach((page) => {
//                 newPdfDoc.addPage(page);
//             });
    
//             const pdfBytes = await newPdfDoc.save();
//             const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//             const url = URL.createObjectURL(pdfBlob);
    
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `${filename}.pdf`;
    
//             document.body.appendChild(a);
//             a.click();
    
//             URL.revokeObjectURL(url);
//             document.body.removeChild(a);
//         } catch (error) {
//             console.error('Error downloading file:', error);
//         }
//     };    

//     return (
//         <>
//             {loading ? (
//                 <LoadingSpinner/>
//             ) : course ? (
//                 <div className='files-container' key={course._id}>
//                     {course.files.map((file, index) => (
//                         <div key={index}>
//                             <h6 className='file-header'>Week {index + 1}</h6>
//                             <div key={file._id} className='file-container'>
//                                 <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick(file.data, file.filename)}>
//                                     <FaFolderClosed className='folder-icon'/>
//                                     <h5 className='file-name'>{file.filename}</h5>
//                                 </div>
//                                 <a onClick={() => handleFileDownload(file.filename)}>
//                                     <HiOutlineDownload className='downloadFile-icon' title='Download' style={{cursor: "pointer"}}/>
//                                 </a>
//                             </div>
//                             <hr className='files-hr'/>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div>No files available</div>
//             )}
//         </>
//     );
// };

// export default NetworkFiles;