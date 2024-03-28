import React from 'react'
import { Button, Container } from 'react-bootstrap';

const Quiz = () => {
  return (
    <Container className='quiz-container' fluid>
        <div >
            <div className='questions-container'>
                <div className='question-container'>
                    <div className='photo/audio'>
                        <p>
                            Photo/Audio
                        </p>
                    </div>
                    <div className='Q&AContainer'>
                        <div className='Q&A-question'>
                            <p className='question'>
                            ......... the fuck i'm doing here?
                            </p>
                        </div>
                        <div className='Q&A-Answers'>
                            <div className='answer1-container'>
                                <p className='answer'>
                                    A. Who
                                </p>
                            </div>
                            <div className='answer2-container'>
                                <p className='answer'>
                                    A. Who
                                </p>
                            </div>
                            <div className='answer3-container'>
                                <p className='answer'>
                                    A. Who
                                </p>
                            </div>
                            <div className='answer4-container'>
                                <p className='answer'>
                                    A. Who
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='nextBtn-container'>
                    <Button className='nextBtn'>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    </Container>
  );
};

export default Quiz;