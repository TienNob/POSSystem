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
import Login from "./component/form/Login.js";
import EmployeeManagement from "./component/manager/EmployeeManagement";
function App() {
  const currentPath = window.location.pathname;
  const isAdmin =
    currentPath === "/productManagement" ||
    currentPath === "/tableManagement" ||
    currentPath === "/employeeManagement" ||
    currentPath === "/adminHome";
  const isStaf = currentPath === "/" || currentPath === "/productlist";
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  // const isLogin = (currentPath = "/login");
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  return (
    <div className="app">
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      <div>
        <div>
          {!isAdmin && isStaf && <Nab />}

          {!isAdmin && (
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
            display: isAdmin ? "gird" : "none",
          }}
        >
          {isAdmin && (
            <AdminSidebar
              openSidebarToggle={openSidebarToggle}
              OpenSidebar={OpenSidebar}
            />
          )}
          {isAdmin && <AdminHeader OpenSidebar={OpenSidebar} />}

          <Routes>
            <Route path="/adminHome" element={<AdminHome />} />
            <Route path="/productManagement" element={<ProductManagement />} />
            <Route path="/tableManagement" element={<TableManagement />} />
            <Route
              path="/employeeManagement"
              element={<EmployeeManagement />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
