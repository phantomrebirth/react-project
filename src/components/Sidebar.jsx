import React, { useEffect, useState } from "react";
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
import { LiaHomeSolid } from "react-icons/lia";
// import LogOutModal from "../redux/actions/LogOutModal";
// import { useSelector, useDispatch } from 'react-redux'
// import { openLogOutModal } from "../redux/slices/logOutModalSlice";
import { TbCameraCheck } from "react-icons/tb";
// import { selectRole } from "../redux/slices/authSlice";
import { login, logout } from "../redux/actions/auth";
import { connect, useDispatch, useSelector } from "react-redux";
import LogOutModal from "../redux/actions/LogOutModal";
import { openLogOutModal } from "../redux/actions/logOutModalAction";

const Sidebar = ({ isOpen, toggleSidebar, role, openLogOutModal }) => {

  // const dispatch = useDispatch();
//   const role = useSelector(selectRole);
  const [teacher, setTeacher] = useState(false);
  const [student, setStudent] = useState(false);
  useEffect(() => {
    if (role === 'student') {
      setStudent(true);
    } else if (role === 'teacher') {
      setTeacher(true);
    }
  }, [role]);
  // const [logOut, setLogOut] = useState(false);
  const logOut = useSelector((state) => state.logOutModalReducer.isLogOutOpen);
//   const logOut = useSelector(state => state.logOutModal.isOpen);

  // const commonItems = [
  //   {
  //     path: "/",
  //     name: "Home",
  //     icon: <LiaHomeSolid />
  //   },
  //   {
  //     path: "/courses",
  //     name: "Courses",
  //     icon: <BsGrid />
  //   },
  //   {
  //     path: teacher ? "/attendance" : (student ? "/assignments" : "/"),
  //     name: teacher ? "Attendance" : (student ? "Assignments" : "/"),
  //     icon: teacher ? <TbCameraCheck /> : (student ? <AiOutlineBars /> : <LiaHomeSolid />)
  //   },
  // ];
  
  // const teacherItems = [
  //   {
  //     path: teacher ? "/grades" : (student ? "/attendance-rate" : "/"),
  //     name: teacher ? "Grades" : (student ? "Attendance Rate" : "/"),
  //     icon: <BiSolidContact />
  //   },
  //   {
  //     path: "/reminder",
  //     name: "Reminder",
  //     icon: <LuCalendarMinus />
  //   },
  // ];
  
  // const studentItems = [
  //   {
  //     path: teacher ? "/grades" : (student ? "/attendance-rate" : "/"),
  //     name: teacher ? "Grades" : (student ? "Attendance Rate" : "/"),
  //     icon: <BiSolidContact />
  //   },
  // ];
  
  // const menuItem = [
  //   ...commonItems,
  //   ...(teacher ? teacherItems : studentItems),
  //   // {
  //   //   path: "/messages",
  //   //   name: "Messages",
  //   //   icon: <BiMessageRounded />
  //   // },
  //   {
  //     path: "/settings",
  //     name: "Settings",
  //     icon: <LuSettings />
  //   },
  //   {
  //     name: "Log out",
  //     icon: <TbLogout2 />
  //   },
  // ];

  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: <LiaHomeSolid />
    },
    {
      path: "/courses",
      name: "Courses",
      icon: <BsGrid />
    },
    {
      path: teacher ? "/attendance" : (student ? "/assignments" : "/"),
      name: teacher ? "Attendance" : (student ? "Assignments" : "/"),
      icon: teacher ? <TbCameraCheck /> : (student ? <AiOutlineBars /> : <LiaHomeSolid />)
    },
    {
      path: "/reminder",
      name: "Reminder",
      icon: <LuCalendarMinus />
    },
    {
      path: teacher ? "/grades" : (student ? "/attendance-rate" : "/"),
      name: teacher ? "Grades" : (student ? "Attendance Rate" : "/"),
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

  const handleOpenModal = () => {
    openLogOutModal();
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
                      // activeClassName='active'
                      onClick={handleLinkClick}>
                      <div className='sideIcon' id='active'>{item.icon}</div>
                      <div className='sideLink' id='active'>{item.name}</div>
                    </NavLink>
                  ) : (
                    <>
                    <hr className="sideLogout-hr"/>
                    <div className='sideLinks' 
                    onClick={handleOpenModal}
                    style={{cursor: "pointer"}}>
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

const mapStateToProps = state => ({
  role: state.auth.role,
  isLogOutOpen: state.logOutModalReducer.isLogOutOpen
});

export default connect(mapStateToProps, { login, logout, openLogOutModal })(Sidebar);
