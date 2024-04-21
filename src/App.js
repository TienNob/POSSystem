import { Routes, Route, useLocation } from "react-router-dom";
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
import CustomerManagement from "./component/manager/CustomerManagement";
function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);
  const isLogin = currentPath === "/";
  const isAdmin =
    currentPath === "/adminHome" ||
    currentPath === "/productManagement" ||
    currentPath === "/customerManagement" ||
    currentPath === "/tableManagement" ||
    currentPath === "/employeeManagement";
  const isStaf =
    currentPath === "/tableList" ||
    currentPath === "/productlist" ||
    currentPath === "/history" ||
    currentPath === "/orderdetail";
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  return (
    <div className="app">
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>

      <div>
        <div>
          {(!isAdmin || !isLogin) && isStaf && <Nab />}

          {!isAdmin && (
            <Row className="margin-space">
              <Col lg="9" md="9" xs="12">
                <Routes>
                  <Route path="/tableList" element={<TableList />} />
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
            display: !isStaf ? "grid" : "none",
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
            <Route
              path="/customerManagement"
              element={<CustomerManagement />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
