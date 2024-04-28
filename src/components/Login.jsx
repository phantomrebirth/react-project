// import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setRole } from '../redux/slices/authSlice';
import { loginUser } from '../redux/slices/authSlice';

const Login = () => {

    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const email_error = document.getElementById('email_error');
    const password_error = document.getElementById('password_error');
    const login_error = document.getElementById('login_error');

    const dispatch = useDispatch();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisibility, setPasswordVisibility] = useState("password")
    const openEye = "/src/assets/images/eye.png";
    const closedEye = "/src/assets/images/eye-closed.png";
    const [isEyeClosed, setIsEyeClosed] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const validated = useCallback(() => {
        if (email && email.length < 8 && email.length !== 0) {
            emailInput.style.border = "1px solid #f00";
            email_error.style.display = "block";
            return false;
        } else {
            emailInput.style.border = "1px solid silver";
            email_error.style.display = "none";
        }

        if (password && password.length < 6) {
            passwordInput.style.border = "1px solid #f00";
            password_error.style.display = "block";
            return false;
        } else {
            passwordInput.style.border = "1px solid silver";
            password_error.style.display = "none";
        }
        return email && email.length >= 8 && password && password.length >= 6;
    }, [email, password]);

    useEffect(() => {
        setTimeout(() => {
            validated();
        }, 500);
    }, [validated]);

    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (validated()) {
    //         try {
    //             const response = await axios.post('https://ezlearn.onrender.com/users/login', { email, password });
    //             const token = response.data.token;
    //             const role = response.data.role;
    //             dispatch(setToken(token), setRole(role));
    //             console.log("role: ", role);
    //             // localStorage.setItem('token', token);
    //             navigate('/');
    //             // console.log(token);
    //         } catch (error) {
    //             console.error(error);
    //             if (error.response && error.response.data && error.response.data.error) {
    //                 setErrorMessage(error.response.data.error);
    //             } else {
    //                 setErrorMessage("An error occurred during login.");
    //             }
    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validated()) {
          try {
            const actionResult = await dispatch(loginUser({ email, password }));
            const { token, role } = actionResult.payload;
            dispatch(setToken(token));
            dispatch(setRole(role));
            navigate('/');
          } catch (error) {
            if (error.payload && error.payload.error) {
              setErrorMessage(error.payload.error);
            } else {
              setErrorMessage("An error occurred during login.");
            }
          }
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
            <img src='src/assets/images/LOGOIII.png' alt='' className='logo'/>
            <Row>
                <Col sm={12} md={12} lg={6} xl={6} xxl={6}>
                    <div className="contForm" style={{ minHeight: "100vh" }}>
                        <h1 className="label" >
                            L O G I N
                        </h1>
                        <form onSubmit={handleSubmit} id="loginForm" className="loginForm">
                            <div className="fontEmail"></div>
                            <div id="emailInput" style={{ borderColor: "silver" }}>
                                <div style={{width: "8%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <img id="emailIcon" src="src/assets/images/email.png" alt="email" />
                                </div>
                                <input type="email"
                                       name="email" 
                                       id="email" 
                                       required placeholder="Email address" 
                                       value={email} 
                                       onChange={handleInputChange}/>
                            </div>
                            <div id="e-error">
                                <div id="email_error" style={{ display: "none" }}>
                                    Please fill up your Email
                                </div>
                            </div>
                            <div className="fontPassword"></div>
                            <div id="passwordInput">
                                <div style={{width: "8%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <img id="passwordIcon" src="src/assets/images/password.png" alt="password" />
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
                            <div id="pass-error">
                                <div id="password_error" style={{ display: "none" }}>
                                    Please fill up your password
                                </div>
                            </div>
                            <div id="login_error" style={{ color: "red" }}>
                                {errorMessage}
                            </div>
                            <input type="hidden" name="_csrf" value="your_csrf_token" />
                            <div id="sub-btn">
                                <button className='submit' type='submit'>Login</button>
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