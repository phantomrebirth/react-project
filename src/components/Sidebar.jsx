import React from "react";
import { NavLink } from 'react-router-dom';
import { CgNotes } from "react-icons/cg";
import { AiOutlineBars } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { LuCalendarMinus } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { BiSolidContact } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { BsGrid } from "react-icons/bs";
import { Col, Row } from "react-bootstrap";
import { IoHomeOutline } from "react-icons/io5";
import LogOutModal from "../redux/actions/LogOutModal";
import { useSelector, useDispatch } from 'react-redux'
import { openLogOutModal } from "../redux/slices/logOutModalSlice";

const Sidebar = ({ isOpen, toggleSidebar }) => {

  const dispatch = useDispatch();
  const logOut = useSelector(state => state.logOutModal.isOpen);

  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: <IoHomeOutline />
    },
    {
      path: "/courses",
      name: "Courses",
      icon: <BsGrid />
    },
    {
      path: "/assignments",
      name: "Assignments",
      icon: <AiOutlineBars />
    },
    {
      path: "/reminder",
      name: "Reminder",
      icon: <LuCalendarMinus />
    },
    {
      path: "/attendance",
      name: "Attendance Rate",
      icon: <BiSolidContact />
    },
    // {
    //   path: "/messages",
    //   name: "Messages",
    //   icon: <BiMessageRounded />
    // },
    {
      path: "/settings",
      name: "Settings",
      icon: <LuSettings />
    },
    {
      name: "Log out",
      icon: <TbLogout2 />
    },
  ];

  const handleLogoutClick = () => {
    dispatch(openLogOutModal());
  };

  const handleLinkClick = () => {
    toggleSidebar();
  };

  return (
    <Row className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <Col className='sidebarContainer' style={{padding: "0"}}>
          { isOpen && (
            // <div className='sidebarContent'>
            //   {
            //     menuItem.map((item, index) => (
            //       <NavLink 
            //       to={item.path}
            //       key={index}
            //       className='sideLinks'
            //       activeclassname='active'
            //       onClick={handleLinkClick}>
            //         <div className='sideIcon' id='active'>{item.icon}</div>
            //         <div className='sideLink' id='active'>{item.name}</div>
            //       </NavLink>
            //   ))}
            // </div>
            <div className='sidebarContent'>
            {
              menuItem.map((item, index) => (
                <div key={index}>
                  {item.path ? (
                    <NavLink 
                      to={item.path}
                      className='sideLinks'
                      activeClassName='active'
                      onClick={handleLinkClick}>
                      <div className='sideIcon' id='active'>{item.icon}</div>
                      <div className='sideLink' id='active'>{item.name}</div>
                    </NavLink>
                  ) : (
                    <>
                    <hr className="sideLogout-hr"/>
                    <div className='sideLinks' onClick={handleLogoutClick} style={{cursor: "pointer"}}>
                      <div className='sideIcon-logout' id='active'>{item.icon}</div>
                      <div className='sideLink-logout' id='active'>{item.name}</div>
                    </div>
                    </>
                  )}
                </div>
            ))}
          </div>
          )}
      </Col>
      {logOut && <LogOutModal />}
      {/* <Col xs={isOpen ? 6 : 12} sm={isOpen ? 7 : 12} md={isOpen ? 8 : 12} lg={isOpen ? 9 : 12} xl={isOpen ? 10 : 12}>

      </Col> */}
    </Row>
  );
};

export default Sidebar;
