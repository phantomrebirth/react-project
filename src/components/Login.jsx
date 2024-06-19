// import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { setToken, setRole, clearToken } from '../redux/slices/authSlice';
// import { loginUser } from '../redux/slices/authSlice';
// import LoadingSpinner from '../redux/actions/LoadingSpinner';
import { CircularProgress } from '@material-ui/core';
import { login } from '../redux/actions/auth';
import LOGO from '../assets/images/LOGOIII.png'
import emailIcon from '../assets/images/email.png'
import passwordIcon from '../assets/images/password.png'
import closedEye from '../assets/images/eye-closed.png'
import openEye from '../assets/images/eye.png'


const Login = ({login, token, role, error, isLoading}) => {
    // const emailInput = document.getElementById("emailInput");
    // const passwordInput = document.getElementById("passwordInput");
    // const email_error = document.getElementById('email_error');
    // const password_error = document.getElementById('password_error');
    // const login_error = document.getElementById('login_error');
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const emailError = useRef(null);
    const passwordError = useRef(null);
    const loginError = useRef(null);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisibility, setPasswordVisibility] = useState("password")
    const [isEyeClosed, setIsEyeClosed] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(isLoading);

    const validated = useCallback(() => {
        if (email && email.length < 8 && email.length !== 0) {
            emailInput.current.style.border = "1px solid #f00";
            emailError.current.style.display = "block";
            return false;
        } else {
            emailInput.current.style.border = "1px solid silver";
            emailError.current.style.display = "none";
        }

        if (password && password.length < 6) {
            passwordInput.current.style.border = "1px solid #f00";
            passwordError.current.style.display = "block";
            return false;
        } else {
            passwordInput.current.style.border = "1px solid silver";
            passwordError.current.style.display = "none";
        }
        return email && email.length >= 8 && password && password.length >= 6;
    }, [email, password]);

    useEffect(() => {
        setTimeout(() => {
            validated();
        }, 500);
    }, [validated]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validated()) {
            setLoading(true);
            try {
                console.log(email, password)
                await login(email, password);
                console.log('aha')
                if (token) {
                    navigate('/');
                } else {
                    setErrorMessage("Email or password is incorrect, try again.");
                    setLoading(false);
                }
            } catch (error) {
                if (error.payload && error.payload.error) {
                    setErrorMessage(error.payload.error);
                } else {
                    setErrorMessage("An error occurred during login, try again.");
                    // setErrorMessage("Email or password is incorrect, try again.");
                    setLoading(false);
                }
            }
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setErrorMessage("");
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    const EyeIcon = () => {
        setIsEyeClosed(!isEyeClosed);
        setPasswordVisibility(passwordVisibility === "password" ? "text" : "password");
    }
    
    return (
        <>
            {/* <p className='SHAlogo'>S<span style={{ color: "#7939ff" }}>H</span>A</p> */}
            <img src={LOGO} alt='' className='logo'/>
            <Row>
                <Col sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <div className="contForm" style={{ minHeight: "100vh" }}>
                        <h1 className="label" >
                            L O G I N
                        </h1>
                        <form onSubmit={handleSubmit} id="loginForm" className="loginForm">
                            <div className="fontEmail"></div>
                            <div ref={emailInput} id="emailInput" style={{ borderColor: "silver" }}>
                                <div style={{width: "8%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <img id="emailIcon" src={emailIcon} alt="email" />
                                </div>
                                <input type="email"
                                       name="email" 
                                       id="email" 
                                       required placeholder="Email address" 
                                       value={email} 
                                       onChange={handleInputChange}/>
                            </div>
                            <div id="e-error">
                                <div ref={emailError} id="email_error" style={{ display: "none" }}>
                                    Please fill up your Email
                                </div>
                            </div>
                            <div className="fontPassword"></div>
                            <div ref={passwordInput} id="passwordInput">
                                <div style={{width: "8%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <img id="passwordIcon" src={passwordIcon} alt="password" />
                                </div>
                                <input type={passwordVisibility} 
                                       required 
                                       name="password" 
                                       id="password" 
                                       placeholder="Password" 
                                       value={password} 
                                       onChange={handleInputChange}/>
                                <div className='eyeIcon-container'>
                                    {isEyeClosed ? (
                                        <img src={closedEye} alt="eye" id='eyeIcon' onClick={EyeIcon} />
                                    ) : (
                                        <img src={openEye} alt="eye" id='eyeIcon' onClick={EyeIcon} />
                                    )}
                               </div>
                            </div>
                            <div ref={passwordError} id="pass-error">
                                <div id="password_error" style={{ display: "none" }}>
                                    Please fill up your password
                                </div>
                            </div>
                            <div ref={loginError} id="login_error" style={{ color: "red" }}>
                                {errorMessage}
                            </div>
                            <input type="hidden" name="_csrf" value="your_csrf_token" />
                            <div id="sub-btn">
                                {loading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '13vh' }}
                                    >
                                    <CircularProgress color="inherit"
                                                        size={50}
                                                        thickness={4}
                                                        style={{color: "#7939ff"}}
                                                        />
                                    </div>
                                ) : (
                                    <button className='submit' type='submit'>Login</button>
                                )}
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


const mapStateToProps = state => ({
    token: state.auth.token,
    role: state.auth.role,
    isLoading:state.auth.isLoading,
    error: state.auth.error
})

export default connect(mapStateToProps, { login})(Login);