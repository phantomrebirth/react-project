import { connect, useDispatch } from "react-redux";
// import { closeLogOutModal } from "../slices/logOutModalSlice";
// import { clearToken } from "../slices/authSlice";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { login, logout } from "./auth";
import { closeLogOutModal } from "./logOutModalAction";

const LogOutModal = ({ logout, closeLogOutModal }) => {

    const handleConfirmLogout = () => {
        logout();
        closeLogOutModal();
    }

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
                                        handleConfirmLogout();
                                        // dispatch(clearToken());
                                        // dispatch(closeLogOutModal());
                                        // navigate('/login');
                                    }}
                            >
                                Log out
                            </button>
                        </div>
                        <div>
                            <button type='button' className='logOut-closeBtn'
                                    onClick={() => {
                                        // dispatch(closeLogOutModal());
                                        closeLogOutModal();
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

const mapStateToProps = state => ({
    role: state.auth.role,
  })

export default connect(mapStateToProps, { login, logout, closeLogOutModal })(LogOutModal);