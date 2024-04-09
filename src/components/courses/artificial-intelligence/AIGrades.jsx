import React from 'react'
import { Col, Row } from 'react-bootstrap';

const AIGrades = () => {
  return (
    <div>
        <Row className='grades-container' style={{ margin: "0", padding: "0"}}>
            <Col style={{ margin: "0", padding: "0"}}>
                <div className='fQ-container'>
                    <div className='quiz-header'>
                        <ul className='q-head'>
                            <li>Quiez 1</li>
                        </ul>
                    </div>
                    <div className='finished-quiz'>
                        <div className='fQName-container'>
                            <h5 className='fQ-name'>AI Quiz</h5>
                            <h6 className='fQ-zeros'>00.00.0000</h6>
                        </div>
                        <div>
                            <p className='grade'>
                                16/20
                            </p>
                        </div>
                        <button className='fQ-btn'>
                            Finished
                        </button>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
  );
};

export default AIGrades;