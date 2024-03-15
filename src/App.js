import { Routes, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./App.css";
import ProductManagement from "./component/manager/ProductManagement.js";
import TableManagement from "./component/manager/TableManagement.js";
import Nab from "./component/navbar/Nav.js";
import TableList from "./component/TableAPI.js";
import ProductList from "./component/ProductAPI.js";
import OrderDetail from "./component/history/OrderDetail.js";
import History from "./component/history/History.js";

function App() {
  return (
    <div className="app">
      <Nab></Nab>
      <Row className="margin-space">
        <Col>
          <Routes>
            <Route path="/" element={<TableList />} />
            <Route path="/productlist" element={<ProductList />} />
          </Routes>
        </Col>

        <Col xs lg="3"></Col>
      </Row>

      <Routes>
        <Route path="/productManagement" element={<ProductManagement />} />
        <Route path="/tableManagement" element={<TableManagement />} />

        <Route path="/history" element={<History />} />
        <Route path="/orderdetail" element={<OrderDetail />} />
      </Routes>
    </div>
  );
}

export default App;
