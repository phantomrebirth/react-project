import React from 'react'
import { FaFolderClosed } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";

const ProgrammingFiles = () => {

    const handleFileNameClick = (filePath) => {
        window.open(filePath, '_blank');
      };

  return (
    <div className='files-container'>
        <h6 className='file-header'>Week 1</h6>
        <div className='file-container'>
            <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick()}>
                <FaFolderClosed className='folder-icon'/>
                <h5 className='file-name'>Sec 1</h5>
            </div>
            <a href='/path/to/section1.pdf' download>
                <HiOutlineDownload className='downloadFile-icon' title='Download'/>
            </a>
        </div>
        <hr className='files-hr'/>
        <h6 className='file-header'>Week 2</h6>
        <div className='file-container'>
            <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick()}>
                <FaFolderClosed className='folder-icon'/>
                <h5 className='file-name'>Sec 2</h5>
            </div>
            <a href='/path/to/section2.pdf' download>
                <HiOutlineDownload className='downloadFile-icon' title='Download'/>
            </a>
        </div>
        <hr className='files-hr'/>
        <h6 className='file-header'>Week 3</h6>
        <div className='file-container'>
            <div className='fileName-container' title='Open file' onClick={() => handleFileNameClick()}>
                <FaFolderClosed className='folder-icon'/>
                <h5 className='file-name'>Sec 3</h5>
            </div>
            <a href='/path/to/section3.pdf' download>
                <HiOutlineDownload className='downloadFile-icon' title='Download'/>
            </a>
        </div>
    </div>
  );
};

export default ProgrammingFiles;