import React, { useState } from 'react'

const CVQuizzes = () => {

    const [showFinishedQuiz, setShowFinishedQuiz] = useState(true);

    const handleAttemptQuizClick = () => {
        setShowFinishedQuiz(false);
      };

  return (
    <div>
        <div className='quizzes-container'>
            {showFinishedQuiz &&
              <>
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
                        <button className='fQ-btn'>
                            Finished
                        </button>
                    </div>
                </div>
                <div className='aQ-container'>
                    <div className='quiz-header'>
                        <ul className='q-head'>
                            <li>Quiez 2</li>
                        </ul>
                    </div>
                    <div className='attempt-quiz'>
                        <div className='aQName-container'>
                            <h5 className='aQ-name'>Quiz 2</h5>
                            <h6 className='aQ-zeros'>00.00.0000</h6>
                        </div>
                        <button className='aQ-btn' onClick={handleAttemptQuizClick}>
                            Attempt Quiz
                        </button>
                    </div>
                </div>
              </>
            }
        </div>
        <div>
            {!showFinishedQuiz &&
                <>
                    <div className='attempt-container'>
                        <div className='aQ-container' style={{marginLeft: "0px"}}>
                            <div className='quiz-header'>
                                <ul className='q-head'>
                                    <li>Quiez 2</li>
                                </ul>
                            </div>
                            <div className='attempt-quiz'>
                                <div className='aQName-container'>
                                    <h5 className='aQ-name'>Quiz 2</h5>
                                    <h6 className='aQ-zeros'>00.00.0000</h6>
                                </div>
                                <button className='aQ-btn' style={{cursor: "unset"}}>
                                    Attempt Quiz
                                </button>
                            </div>
                        </div>
                        <div className='startQ-container'>
                            <button className='startQ-btn'>
                                Start Quiz
                            </button>
                        </div>
                    </div>
                    <div className='qd-container'>
                        <div className='qdHeader-container'>
                            <h4 className='qd-header'>Quiz Details</h4>
                        </div>
                        <div className='quiz-details'>
                            <p>
                                13/2/2024
                            </p>
                            <p>
                                Open:     18:00
                            </p>
                            <p>
                                Close:    18:30
                            </p>
                            <p>
                                No. of questions: 15
                            </p>
                        </div>
                    </div>
                </>
            }
        </div>
    </div>
  );
};

export default CVQuizzes;