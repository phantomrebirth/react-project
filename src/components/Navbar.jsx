import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
// import { useSelector, useDispatch } from 'react-redux'
// import { selectImageUrl, selectIsLoading, selectError, fetchProfilePicture } from "../redux/slices/profilePictureSlice";
// import { selectRole, selectToken } from '../redux/slices/authSlice';
// import LogOutModal from "../redux/actions/LogOutModal";
// import { openLogOutModal } from "../redux/slices/logOutModalSlice";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { connect, useSelector } from "react-redux";
import { login, logout } from "../redux/actions/auth";
import { openLogOutModal } from "../redux/actions/logOutModalAction";
import LogOutModal from "../redux/actions/LogOutModal";
// import CVAnnouncements from "./courses/computer-vision/CVAnnouncements";
// import ProgrammingAnnouncements from "./courses/programming/ProgrammingAnnouncements";
// import AIAnnouncements from "./courses/artificial-intelligence/AIAnnouncements";
// import NetworkAnnouncements from "./courses/network/NetworkAnnouncements";
// import SWAnnouncements from "./courses/software-engineering/SWAnnouncements";
// import DeadlineNotification from "./DeadlineNotification";

const Navbar = ({ toggleSidebar, role, openLogOutModal }) => {

//   const imageUrl = useSelector(selectImageUrl);
//   const isLoading = useSelector(selectIsLoading);
//   const error = useSelector(selectError);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);
//   const token = useSelector(selectToken);
//   const dispatch = useDispatch();
//   const isOpen = useSelector(state => state.logOutModal.isOpen);
  const [bellClicked, setBellClicked] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const logOut = useSelector((state) => state.logOutModalReducer.isLogOutOpen);
//   const role = useSelector(selectRole);
//   const [teacher, setTeacher] = useState(false);
//   const [student, setStudent] = useState(false);
//   useEffect(() => {
//     dispatch(fetchProfilePicture(token));
//   }, [dispatch, token]);
//   useEffect(() => {
//     if (role === 'student') {
//       setStudent(true);
//     } else if (role === 'teacher') {
//       setTeacher(true);
//     }
//   }, [role]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          userIconRef.current && !userIconRef.current.contains(event.target)) {

        setDropdownOpen(false);
        setNotificationDropdownOpen(false);
      }
    };

    const handleNotificationClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        notificationRef.current.querySelector('.notification-dropdown') &&
        !notificationRef.current.querySelector('.notification-dropdown').contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
        // setBellClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleNotificationClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.addEventListener("mousedown", handleNotificationClickOutside);
    };
  }, []);

  const handleClickUserIcon = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const handleOpenModal = () => {
    openLogOutModal();
  };

  const handleBellClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setBellClicked(true);
  };

  return (
    <div className='navbar'>
      <div className='bars' onClick={toggleSidebar}>
        <HiBars3 className="barsIcon"/>
      </div>
      <NavLink to='/' className="navLogo-container">
        <img src="src/assets/images/logo00.png" alt="" className="nav-logo"/>
      </NavLink>
      <div className="searchBar-container">
        <div className="searchIcon-container">
          <CiSearch className="search-icon"/>
        </div>
        {/* <div className="searchBar-hr">|</div> */}
        <div className="search-container">
          <input className="search" type="text" placeholder="Search"/>
        </div>
      </div>
      <div className="notifications-container" ref={notificationRef}>
        <div className="bell-container" onClick={handleBellClick}>
          <div className="notifications">
            {!bellClicked && (<div className="notifications-num">6+</div>)}
          </div>
          {notificationDropdownOpen && (
            <FaBell className="bell" style={{color: "#fff"}} />
          )}
          {!notificationDropdownOpen && (
            <FaRegBell className="bell" />
          )}
          {notificationDropdownOpen && (
            <div className="notification-dropdown">
              <div className="notifications-headerContainer">
                <p className="notifications-header">Notifications</p>
              </div>
              <div className="notification-items">
                {/* {student && ( */}
                  <>
                    {/* <div className='notification-dropdown-item' title="Open">
                      <DeadlineNotification/>
                    </div>
                    <div className='notification-dropdown-item' title="Open">
                      <NavLink to='/courses/software-engineering' style={{textDecoration: "none"}}>
                        <SWAnnouncements/>
                      </NavLink>
                    </div>
                    <div className='notification-dropdown-item' title="Open">
                      <NavLink to='/courses/network' style={{textDecoration: "none"}}>
                        <NetworkAnnouncements/>
                      </NavLink>
                    </div>
                    <div className='notification-dropdown-item' title="Open">
                      <NavLink to='/courses/artificial-intelligence' style={{textDecoration: "none"}}>
                        <AIAnnouncements/>
                      </NavLink>
                    </div>
                    <div className='notification-dropdown-item' title="Open">
                      <NavLink to='/courses/programming' style={{textDecoration: "none"}}>
                        <ProgrammingAnnouncements/>
                      </NavLink>
                    </div>
                    <div className='notification-dropdown-item' title="Open">
                      <NavLink to='/courses/computer-vision' style={{textDecoration: "none"}}>
                        <CVAnnouncements/>
                      </NavLink>
                    </div> */}
                  </>
                {/* )} */}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="userIconContainer" ref={userIconRef} onClick={handleClickUserIcon}>
        {/* {isLoading ? ( */}
          <div>
            <FaUser className="userIcon"/>
          </div>
        {/* ) : error ? ( */}
          {/* <div> */}
            {/* Error: {error} */}
            {/* <FaUser className="userIcon"/>
          </div> */}
        {/* ) : ( */}
          {/* <img src={imageUrl} alt="" className="nav-pfPicture"/> */}
        {/* )} */}
        {/* <FaChevronDown className="userChevron"/> */}
      </div>
      {dropdownOpen && (
        <div className="dropdownMenu" ref={dropdownRef}>
          <NavLink to='/profile' className="pfMenu">
            Profile
          </NavLink>
          <hr className="hrPfMenu"/>
          <button onClick={handleOpenModal} className="pfMenu" id="pfMenu">
            <TbLogout2 className="logout-dropdown"/> Log out
          </button>
        </div>
      )}
      {logOut && <LogOutModal />}
    </div>
  );
};

const mapStateToProps = state => ({
  role: state.auth.role,
  isLogOutOpen: state.logOutModalReducer.isLogOutOpen
})

export default connect(mapStateToProps, { login, logout, openLogOutModal })(Navbar);