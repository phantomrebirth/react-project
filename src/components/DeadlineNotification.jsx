import React from 'react'

const DeadlineNotification = () => {
  return (
    <div className='announcements-container'>
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

export default DeadlineNotification;