import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./App.css";
import AdminHome from "./component/manager/AdminHome.js";
import AdminSidebar from "./component/manager/AdminSidebar.js";
import AdminHeader from "./component/manager/AdminHeader.js";
import ProductManagement from "./component/manager/ProductManagement.js";
import TableManagement from "./component/manager/TableManagement.js";
import Nab from "./component/navbar/Nav.js";
import TableList from "./component/TableAPI.js";
import ProductList from "./component/ProductAPI.js";
import OrderDetail from "./component/history/OrderDetail.js";
import History from "./component/history/History.js";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const currentPath = window.location.pathname;

  return (
    <div className="app">
      <div>
        {currentPath !== "/productManagement" &&
          currentPath !== "/tableManagement" &&
          currentPath !== "/adminHome" && <Nab />}

        {currentPath !== "/productManagement" &&
          currentPath !== "/tableManagement" &&
          currentPath !== "/adminHome" && (
            <Row className="margin-space">
              <Col lg="9" md="9" xs="12">
                <Routes>
                  <Route path="/" element={<TableList />} />
                  <Route path="/productlist" element={<ProductList />} />
                </Routes>
              </Col>

              <Col md="3" lg="3" xs="0"></Col>
            </Row>
          )}

        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="/orderdetail" element={<OrderDetail />} />
        </Routes>
      </div>
      <div
        className="grid-container"
        style={{
          display:
            currentPath === "/productManagement" ||
            currentPath === "/tableManagement" ||
            currentPath === "/adminHome"
              ? "gird"
              : "none",
        }}
      >
        {currentPath === "/productManagement" ||
          currentPath === "/tableManagement" ||
          (currentPath === "/adminHome" && (
            <AdminSidebar
              openSidebarToggle={openSidebarToggle}
              OpenSidebar={OpenSidebar}
            />
          ))}
        {currentPath === "/productManagement" ||
          currentPath === "/tableManagement" ||
          (currentPath === "/adminHome" && <AdminHeader />)}

        <Routes>
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/productManagement" element={<ProductManagement />} />
          <Route path="/tableManagement" element={<TableManagement />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
