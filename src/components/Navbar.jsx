import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaBars, FaChevronDown } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useSelector, useDispatch } from 'react-redux'
import { selectImageUrl, selectIsLoading, selectError, fetchProfilePicture } from "../redux/slices/profilePictureSlice";
import { selectToken } from '../redux/slices/authSlice';

const Navbar = ({ toggleSidebar }) => {
  const imageUrl = useSelector(selectImageUrl);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfilePicture(token));
  }, [dispatch, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          userIconRef.current && !userIconRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickUserIcon = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='navbar'>
      <div className='bars' onClick={toggleSidebar}>
        <HiBars3 className="barsIcon"/>
      </div>
      <div className="userIconContainer" ref={userIconRef} onClick={handleClickUserIcon}>
      {isLoading ? (
        <div>
          <FaUser className="userIcon"/>
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <img src={imageUrl} alt="" className="nav-pfPicture"/>
      )}
        <FaChevronDown className="userChevron"/>
      </div>
      {dropdownOpen && (
        <div className="dropdownMenu" ref={dropdownRef}>
          <NavLink to='/profile' className="pfMenu">
            Profile
          </NavLink>
          <hr className="hrPfMenu"/>
          <NavLink to='/logout' className="pfMenu" id="pf-menu">
            <TbLogout2 className="logout-dropdown"/> Log out
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;