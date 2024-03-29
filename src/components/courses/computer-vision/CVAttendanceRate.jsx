import React from 'react'
import { Container } from 'react-bootstrap';

const CVAttendanceRate = () => {
  return (
    <Container fluid className='last-container'>
        <div className='AR-container'>
            <div className='AR-title'>
                Computer Vision
            </div>
            <div className='attendance-container'>
                <div className='classes-container'>
                    <div className='classes'>
                        <p className='classes-num'>
                          8
                        </p>
                        <p className='total-classes'>
                          Total classes
                        </p>
                    </div>
                    <hr className='AR-hr'>
                      
                    </hr>
                    <div className='total-absents'>
                        <p className='absent-num'>
                          4
                        </p>
                        <p className='absent'>
                          Absent
                        </p>
                    </div>
                </div>
                <div className='rate-container'>
                    <p className='rate'>
                      50%
                    </p>
                </div>
            </div>
        </div>
    </Container>
  );
};

export default CVAttendanceRate;