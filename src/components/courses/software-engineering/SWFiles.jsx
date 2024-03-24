import React from 'react'
import { FaFolderClosed } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";

const SWFiles = () => {
  return (
    <div className='files-container'>
        <h6 className='file-header'>Week 1</h6>
        <div className='file-container'>
            <FaFolderClosed className='folder-icon'/>
            <h5 className='file-name'>Sec 1</h5>
            <a href='/path/to/week1-file.pdf' download>
                <HiOutlineDownload className='downloadFile-icon'/>
            </a>
        </div>
        <hr className='files-hr'/>
        <h6 className='file-header'>Week 2</h6>
        <div className='file-container'>
            <FaFolderClosed className='folder-icon'/>
            <h5 className='file-name'>Sec 2</h5>
            <a href='/path/to/week2-file.pdf' download>
                <HiOutlineDownload className='downloadFile-icon'/>
            </a>
        </div>
        <hr className='files-hr'/>
        <h6 className='file-header'>Week 3</h6>
        <div className='file-container'>
            <FaFolderClosed className='folder-icon'/>
            <h5 className='file-name'>Sec 3</h5>
            <a href='/path/to/week3-file.pdf' download>
                <HiOutlineDownload className='downloadFile-icon'/>
            </a>
        </div>
    </div>
  );
};

export default SWFiles;