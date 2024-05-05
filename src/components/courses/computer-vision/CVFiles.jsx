// import React, { useEffect, useState } from 'react'
// import { FaFolderClosed } from "react-icons/fa6";
// import { HiOutlineDownload } from "react-icons/hi";
// import { selectRole, selectToken } from '../../../redux/slices/authSlice';
// import { useSelector } from 'react-redux';

// const CVFiles = () => {

//     const role = useSelector(selectRole);
//     const token = useSelector(selectToken);
//     const [teacher, setTeacher] = useState(false);
//     const [student, setStudent] = useState(false);
//     console.log(role);
    
//     useEffect(() => {
//       if (role === 'student') {
//         setStudent(true);
//       } else if (role === 'teacher') {
//         setTeacher(true);
//       }
//     }, [role]);

//     useEffect(() => {
//         async function fetchCourseFile() {
//           try {
//             const response = await axios.get('https://ezlearn.onrender.com/getCourse/all', {
//               headers: {
//                 Authorization: `Bearer ${token}`
//               }
//             });
//             const courseData = response.data;
//             setCourses(courseData);
//             setLoading(false);
//           } catch (error) {
//             console.error('Error fetching courses:', error);
//             setLoading(false);
//           }
//         }
      
//         fetchCourseFile();
//       }, [token]);

//     const handleFileNameClick = (filePath) => {
//         window.open(filePath, '_blank'); // Open the file in a new tab
//       };

//   return (
//     <>
//         {student && (
//             <div className='files-container'>
//                 <h6 className='file-header'>Week 1</h6>
//                 <div className='file-container'>
//                     <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick()}>
//                         <FaFolderClosed className='folder-icon'/>
//                         <h5 className='file-name'>Sec 1</h5>
//                     </div>
//                     <a href='/path/to/section1.pdf' download>
//                         <HiOutlineDownload className='downloadFile-icon' title='Download'/>
//                     </a>
//                 </div>
//                 <hr className='files-hr'/>
//                 <h6 className='file-header'>Week 2</h6>
//                 <div className='file-container'>
//                     <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick()}>
//                         <FaFolderClosed className='folder-icon'/>
//                         <h5 className='file-name'>Sec 2</h5>
//                     </div>
//                     <a href='/path/to/section2.pdf' download>
//                         <HiOutlineDownload className='downloadFile-icon' title='Download'/>
//                     </a>
//                 </div>
//                 <hr className='files-hr'/>
//                 <h6 className='file-header'>Week 3</h6>
//                 <div className='file-container'>
//                     <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick()}>
//                         <FaFolderClosed className='folder-icon'/>
//                         <h5 className='file-name'>Sec 3</h5>
//                     </div>
//                     <a href='/path/to/section3.pdf' download>
//                         <HiOutlineDownload className='downloadFile-icon' title='Download'/>
//                     </a>
//                 </div>
//             </div>
//         )}
//         {teacher && (
//             <div>_</div>
//         )}
//     </>
//   );
// };

// export default CVFiles;

// import React, { useEffect, useState } from 'react';
// import { FaFolderClosed } from "react-icons/fa6";
// import { HiOutlineDownload } from "react-icons/hi";
// import { selectRole, selectToken } from '../../../redux/slices/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCourses, selectCourses } from '../../../redux/slices/coursesSlice';
// import { PDFDocument } from 'pdf-lib';
// import LoadingSpinner from '../../../redux/actions/LoadingSpinner';

// const CVFiles = () => {
//     const role = useSelector(selectRole);
//     const token = useSelector(selectToken);
//     const [student, setStudent] = useState(false);
//     const [course, setCourse] = useState(null);
//     const courses = useSelector(state => state.courses.data);
//     const [fileData, setFileData] = useState(null);
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(true);
//     const { fileIdArray, error, courseIdArray } = useSelector(selectCourses);
//     const fileId = fileIdArray[0];
//     const courseId = courseIdArray[0];

//     useEffect(() => {
//         dispatch(fetchCourses());
//     }, [dispatch]);

//     useEffect(() => {
//         if (role === 'student') {
//             setStudent(true);
//         }
//     }, [role]);

//     useEffect(() => {
//         if (courses.length > 0) {
//             setCourse(courses[0]);
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

// export default CVFiles;