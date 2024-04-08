import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { connect } from "react-redux";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container fluid>
      <Row style={{ padding: "0" }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: "0" }}>
          <Navbar toggleSidebar={toggleSidebar} />
        </Col>
        <Col xs={isSidebarOpen ? 5 : 12}
             sm={isSidebarOpen ? 4 : 12}
             md={isSidebarOpen ? 3 : 12}
             lg={isSidebarOpen ? 3 : 12}
             xl={isSidebarOpen ? 2 : 12}
             style={{ padding: "0", margin: "0", maxWidth: isSidebarOpen ? "200px" : "none" }}>
          {isSidebarOpen && 
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          }
        </Col>
        <Col xs={isSidebarOpen ? 7 : 12}
             sm={isSidebarOpen ? 8 : 12}
             md={isSidebarOpen ? 9 : 12}
             lg={isSidebarOpen ? 9 : 12}
             xl={isSidebarOpen ? 10 : 12}
             style={{margin: "0", overflowY: "scroll", height: "90vh" }}
             className="content-container" >
          <div className="content">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

// export default connect(null)(Layout);
export default Layout;