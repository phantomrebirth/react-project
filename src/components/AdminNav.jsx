import React, { useEffect, useRef, useState } from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa6';
import '../../src/Admin.css'
import { profile } from '../redux/actions/profile';
import { login, logout } from '../redux/actions/auth';
import { connect, useSelector } from 'react-redux';
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal';

const AdminNavbar = ({ logout, image, error, isLoading, children, token , profile, activeLink }) => {
  const [modalShow, setModalShow] = useState(false);
  const userIconRef = useRef(null);
  const currentPath = window.location.pathname; // Get current URL path

  useEffect(() => {
    if (!image) {
      profile(token);
    }
  }, [token]);

  const handleLogout = () => {
    setModalShow(false);
    logout();
  };

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        logout={handleLogout}
      />
      <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect fixed="top" style={{fontFamily: "'Times New Roman', Times, serif"}}>
        <Container>
          <Navbar.Brand href="/admin" className='admin-logo justify-content-start align-items-center'>EZlearn</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link href="/admin/users" className={`nav-links ${currentPath === '/admin/users' ? 'active' : ''}`}>Users</Nav.Link>
              <Nav.Link href="/admin/courses" className={`nav-links ${currentPath === '/admin/courses' ? 'active' : ''}`}>Courses</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end align-items-center" style={{ alignItems: "center" }}>
            <Nav
              className="my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <div className="userIconContainer" style={{ position: "unset", width: "2.4rem", justifyContent: "center", cursor: "unset", margin: "auto" }} ref={userIconRef}>
                {isLoading ? (
                  <div>
                    <FaUser className="userIcon" />
                  </div>
                ) : error ? (
                  <div>
                    Error: {error}
                    <FaUser className="userIcon" />
                  </div>
                ) : (
                  <img src={image} alt="" className="nav-pfPicture" />
                )}
              </div>
              <NavDropdown title="" id="collapsible-nav-dropdown" className='admin-dropdown' style={{ fontSize: "1.25rem" }}>
                <NavDropdown.Item href="/admin/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setModalShow(true)}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        {children}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  image: state.profile.image,
  isLoading: state.profile.isLoading,
  error: state.profile.error,
})

export default connect(mapStateToProps, { login, logout, profile })(AdminNavbar);