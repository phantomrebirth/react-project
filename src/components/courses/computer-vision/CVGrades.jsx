import React from 'react'

const CVGrades = () => {
  return (
    <div className='fQ-container'>
        <div className='quiz-header'>
            <ul className='q-head'>
                <li>Quiez 1</li>
            </ul>
        </div>
        <div className='finished-quiz'>
            <div className='fQName-container'>
                <h5 className='fQ-name'>CV Quiz</h5>
                <h6 className='fQ-zeros'>00.00.0000</h6>
            </div>
            <div>
                <p className='grade'>
                    19/20
                </p>
            </div>
            <button className='fQ-btn'>
                Finished
            </button>
        </div>
    </div>
  );
};

export default CVGrades;