import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaBars, FaChevronDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);

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
        <FaBars className="barsIcon"/>
      </div>
      <div className="userIconContainer" ref={userIconRef} onClick={handleClickUserIcon}>
        <FaUser className="userIcon"/>
        <FaChevronDown className="userChevron"/>
      </div>
      {dropdownOpen && (
        <div className="dropdownMenu" ref={dropdownRef}>
          <NavLink to='/profile' className="pfMenu">
            Profile
          </NavLink>
          <hr className="hrPfMenu"/>
          <NavLink to='/logout' className="pfMenu">
            Log out
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;