import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useSelector, useDispatch } from 'react-redux'
import { selectImageUrl, selectIsLoading, selectError, fetchProfilePicture } from "../redux/slices/profilePictureSlice";
import { selectToken } from '../redux/slices/authSlice';
import LogOutModal from "../redux/actions/LogOutModal";
import { openLogOutModal } from "../redux/slices/logOutModalSlice";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";

const Navbar = ({ toggleSidebar }) => {
  const imageUrl = useSelector(selectImageUrl);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.logOutModal.isOpen);
  const [bellClicked, setBellClicked] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProfilePicture(token));
  }, [dispatch, token]);

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
        setBellClicked(false);
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

  const handleLogout = () => {
    dispatch(openLogOutModal());
  };

  const handleBellClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setBellClicked(prevState => !prevState);
  };

  return (
    <div className='navbar'>
      <div className='bars' onClick={toggleSidebar}>
        <HiBars3 className="barsIcon"/>
      </div>
      <NavLink to='/' className="navLogo-container">
        <img src="src/assets/images/logo0.png" alt="" className="nav-logo"/>
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
          {/* <div className="notifications">
            <div className="notifications-num">2+</div>
          </div> */}
          {bellClicked ? (
            <FaBell className="bell clicked" style={{color: "white"}} />
          ) : (
            <FaRegBell className="bell" />
          )}
          {notificationDropdownOpen && (
            <div className="notification-dropdown">
              {/* Your notification items here */}
            </div>
          )}
        </div>
      </div>
      <div className="userIconContainer" ref={userIconRef} onClick={handleClickUserIcon}>
        {isLoading ? (
          <div>
            <FaUser className="userIcon"/>
          </div>
        ) : error ? (
          <div>
            {/* Error: {error} */}
            <FaUser className="userIcon"/>
          </div>
        ) : (
          <img src={imageUrl} alt="" className="nav-pfPicture"/>
        )}
        {/* <FaChevronDown className="userChevron"/> */}
      </div>
      {dropdownOpen && (
        <div className="dropdownMenu" ref={dropdownRef}>
          <NavLink to='/profile' className="pfMenu">
            Profile
          </NavLink>
          <hr className="hrPfMenu"/>
          <button onClick={handleLogout} className="pfMenu" id="pfMenu">
            <TbLogout2 className="logout-dropdown"/> Log out
          </button>
        </div>
      )}
      {isOpen && <LogOutModal />}
    </div>
  );
};

export default Navbar;