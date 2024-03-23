import React from 'react'

const AIAnnouncements = () => {
  return (
    <div className='announcements-container'>
        <div className='announcement-container'>
            <div className='annIcon-container'>
                <h4 className='announcement-icon'> ! </h4>
            </div>
            <div className='annP-container'>
                <div className='announcement-p'>Course started in 2021</div>
            </div>
        </div>
        <hr className='announcements-hr'/>
        <div className='announcement-container'>
            <div className='annIcon-container'>
                <h4 className='announcement-icon'> ! </h4>
            </div>
            <div className='annP-container'>
                <div className='announcement-p'>Deadline of assignment will be 4/8</div>
            </div>
        </div>
    </div>
  );
};

export default AIAnnouncements;