import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
// import { Link, } from 'react-router-dom';

const Login = () => {

    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const email_error = document.getElementById('email_error');
    const password_error = document.getElementById('password_error');

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisibility, setPasswordVisibility] = useState("password")
    const openEye = "/src/assets/images/eye.png";
    const closedEye = "/src/assets/images/eye-closed.png";
    const [isEyeClosed, setIsEyeClosed] = useState(true);

    // const validated = useCallback( () => {
    //     if (email && email.length < 8 && email.length !== 0) {
    //         emailInput.style.border = "1px solid #f00";
    //         email_error.style.display = "block";
    //         return false;
    //     } else {
    //         emailInput.style.border = "1px solid silver";
    //         email_error.style.display = "none";
    //     }

    //     if (password && password.length < 8) {
    //         passwordInput.style.border = "1px solid #f00";
    //         password_error.style.display = "block";
    //         return false;
    //     } else {
    //         passwordInput.style.border = "1px solid silver";
    //         password_error.style.display = "none";
    //     }
    //     return email && email.length >= 8 && password && password.length >= 8;
    // }, [email, password]);
        
    // useEffect(() => {
    //     // const identifier =
    //     setTimeout(() => {
    //         validated(
    //             // email.includes('@') && password.trim().length > 6
    //         );
    //     }, 500);
    //     // return () => {
    //     //     clearTimeout(identifier);
    //     // }; // clean up
    // }, [validated]);

    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // if (validated()) 
        {
            axios
                .post('https://ezlearn.onrender.com/admins/login', { email, password })
                .then((res) => {
                    navigate('/');
                })
                .catch((err) => {
                    console.error(err);
                    console.log('Error during login:', err.response.data.error);
                });
        }
    };

    const EyeIcon = () => {
        setIsEyeClosed(!isEyeClosed);
        if (passwordVisibility == "password"){
            setPasswordVisibility("text");
        }else {
            setPasswordVisibility("password");
        }
    }
  
    return (
        <>
            <p className='SHAlogo'>S<span style={{ color: "#7939ff" }}>H</span>A</p>
            <Row>
                <Col sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <div className="contForm" style={{ minHeight: "100vh" }}>
                        <h1 className="label" >L O G I N</h1>
                        <form onSubmit={e => handleSubmit(e)} id="loginForm" className="loginForm">
                            <div className="fontEmail"></div>
                            <div id="emailInput" style={{borderColor: "silver"}}>
                                <img id="emailIcon" src="src/assets/images/email.png" />
                                <input type="email" name="email" id="email" required placeholder="Email address" value={email}
                                       onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div id="e-error">
                                <div id="email_error">Please fill up your Email</div>
                            </div>
                            <div className="fontPassword"></div>
                            <div id="passwordInput">
                                <img id="passwordIcon" src="src/assets/images/password.png" />
                                <input type={passwordVisibility} required name="password" id="password" placeholder="Password" value={password}
                                       onChange={e => setPassword(e.target.value)} />
                                {isEyeClosed ? (
                                    <img src={closedEye} alt="" id='eyeIcon' onClick={EyeIcon}/>
                                ) : (
                                    <img src={openEye} alt="" id='eyeIcon' onClick={EyeIcon}/>
                                )}
                            </div>
                            <div id="pass-error">
                                <div id="password_error">Please fill up your password</div>
                            </div>
                            <input type="hidden" name="_csrf" value="your_csrf_token" />
                            <div id="sub-btn">
                                {/* <Link to="/"> */}
                                    <button className='submit' type='submit'>Login</button>
                                {/* </Link> */}
                            </div>
                        </form>
                    </div>
                </Col>
                <Col sm={0} md={0} lg={6} xl={6} xxl={6}>
                    <div id="backgroundMark"></div>
                </Col>
            </Row>
        </>
    );
};

export default Login;