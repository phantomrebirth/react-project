import React from "react";
import { NavLink } from 'react-router-dom';
import { CgNotes } from "react-icons/cg";
import { AiOutlineBars } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { LuCalendarMinus } from "react-icons/lu";
import { VscSettingsGear } from "react-icons/vsc";
import { BiSolidContact } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { BsGrid } from "react-icons/bs";
import { Col, Row } from "react-bootstrap";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: <BsGrid />
    },
    {
      path: "/courses",
      name: "Courses",
      icon: <CgNotes />
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
    {
      path: "/messages",
      name: "Messages",
      icon: <BiMessageRounded />
    },
    {
      path: "/settings",
      name: "Account Settings",
      icon: <VscSettingsGear />
    },
    // {
    //   path: "/logout",
    //   name: "Log out",
    //   icon: <TbLogout2 />
    // },
  ];

  const handleLinkClick = () => {
    toggleSidebar();
  };

  return (
    <Row className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <Col className='sidebarContainer' style={{padding: "0"}}>
          { isOpen && (
            <div className='sidebarContent'>
              {
                menuItem.map((item, index) => (
                  <NavLink 
                  to={item.path}
                  key={index}
                  className='sideLinks'
                  activeclassname='active'
                  onClick={handleLinkClick}>
                    <div className='sideIcon' id='active'>{item.icon}</div>
                    <div className='sideLink' id='active'>{item.name}</div>
                  </NavLink>
              ))}
            </div>
          )}
      </Col>
      {/* <Col xs={isOpen ? 6 : 12} sm={isOpen ? 7 : 12} md={isOpen ? 8 : 12} lg={isOpen ? 9 : 12} xl={isOpen ? 10 : 12}>

      </Col> */}
    </Row>
  );
};

export default Sidebar;
