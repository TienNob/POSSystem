import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./App.css";
import AdminHome from "./component/manager/mainManager/AdminHome.js";
import AdminSidebar from "./component/manager/mainManager/AdminSidebar.js";
import AdminHeader from "./component/manager/mainManager/AdminHeader.js";
import ProductManagement from "./component/manager/products/ProductManagement.js";
import TableManagement from "./component/manager/tables/TableManagement.js";
import AuthorFooter from "./component/AuthorFooter.js";
import Nab from "./component/navbar/Nav.js";
import TableList from "./component/tables/TableAPI.js";
import ProductList from "./component/products/ProductAPI.js";
import OrderDetail from "./component/history/OrderDetail.js";
import History from "./component/history/History.js";
import Login from "./component/form/Login.js";
import EmployeeManagement from "./component/manager/emloyee/EmployeeManagement";
import CustomerManagement from "./component/manager/customer/CustomerManagement";
import SuggestCombo from "./component/manager/sugsgestCombo/SuggestCombo.js";
import BinProduct from "./component/manager/products/BinProduct.js";
import Shifts from "./component/shifts/Shifts.js";
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
    currentPath === "/employeeManagement" ||
    currentPath === "/suggestCombo" ||
    currentPath === "/productManagement/binProduct";
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
        <Routes>
          <Route path="/shifts" element={<Shifts />} />
        </Routes>
      </div>

      <div>
        <div>
          {(!isAdmin || !isLogin) && isStaf && <Nab />}

          {!isAdmin && (
            <Row className="ms-0 me-0 margin-space">
              <Col lg="9" md="9" xs="12">
                <Routes>
                  <Route path="/tableList" element={<TableList />} />
                  <Route path="/productlist" element={<ProductList />} />
                </Routes>
                <AuthorFooter />
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
            display: !isStaf && !isLogin ? "grid" : "none",
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
            <Route
              path="/productManagement/binProduct"
              element={<BinProduct />}
            />
            <Route path="/suggestCombo" element={<SuggestCombo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
