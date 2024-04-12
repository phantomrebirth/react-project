import { useDispatch } from "react-redux";
import { closeLogOutModal } from "../slices/logOutModalSlice";
import { clearToken } from "../slices/authSlice";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const LogOutModal = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <aside className="logOutModal-container">
            <div className="logOutModal">
                <div className="logOut-headerContainer">
                    <IoLogOut className="logOutModal-icon"/>
                    <h4 className="logOut-header">
                        You are leaving...
                    </h4>
                    <h4 className="logOut-header">
                        Are you Sure ?
                    </h4>
                </div>
                <div className="logOutModalBtn-container">
                    <div>
                        <div>
                            <button type='button' className='logOut-confirmBtn'
                                    onClick={() => {
                                        dispatch(clearToken());
                                        dispatch(closeLogOutModal());
                                        navigate('/login');
                                    }}
                            >
                                Log out
                            </button>
                        </div>
                        <div>
                            <button type='button' className='logOut-closeBtn'
                                    onClick={() => {
                                        dispatch(closeLogOutModal());
                                    }}
                            >
                                cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default LogOutModal;