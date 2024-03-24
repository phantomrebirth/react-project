import React, { useState } from 'react';

const CVAssignments = () => {
  const [showAssignment2, setShowAssignment2] = useState(true);
  const [hideAssignment1, setHideAssignment1] = useState(false);
  const [marginLeftZero, setMarginLeftZero] = useState(false);

  const handleInProgressClick = () => {
    setHideAssignment1(true);
    setMarginLeftZero(true); // Set marginLeftZero to true when the button is clicked
  };

  return (
    <div className='assignments-container'>
        {!hideAssignment1 && (
          <div className='assignment-container'>
              <div className='assignment-header'>
                  <ul className='ass-h'>
                      <li>
                          Assignment 1
                      </li>
                  </ul>
              </div>
              <div className='assignment'>
                  <div className='assName-container'>
                      <h5 className='ass-name'>CV Assignment</h5>
                      <h6 className='ass-zeros'>00.00.0000</h6>
                  </div>
                  <button className='ass-btn'>Done</button>
              </div>
          </div>
        )}
        {showAssignment2 && (
            <div className={`assignment-container2 ${marginLeftZero ? 'marginLeftZero' : ''}`}>
                <div className='assignment-header'>
                    <ul className='ass-h'>
                        <li>
                            Assignment 2
                        </li>
                    </ul>
                </div>
                <div className='assignment'>
                    <div className='assName-container'>
                        <h5 className='ass-name'>Assignment 2</h5>
                        <h6 className='ass-zeros'>00.00.0000</h6>
                    </div>
                    <button className='ass-btn2' onClick={handleInProgressClick}>In progress</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default CVAssignments;