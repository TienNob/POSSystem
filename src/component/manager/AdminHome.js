import React, { useState, useEffect } from "react";

import ArchiveIcon from "@mui/icons-material/Archive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TableBarIcon from "@mui/icons-material/TableBar";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import { ResponsiveContainer } from "recharts";

import ChartProduct from "./chart/ChartProduct";
import ChartRevenue from "./chart/ChartRevenue";

function AdminHome() {
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfTables, setNumberOfTables] = useState(0);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [numberOfCustomers, setNumberOfCustomers] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setNumberOfOrders(data.totalElements);
      })
      .catch((error) => console.error("Error fetching orders:", error));

    fetch("http://localhost:8080/api/table")
      .then((response) => response.json())
      .then((data) => {
        setNumberOfTables(data.length);
      })
      .catch((error) => console.error("Error fetching tables:", error));
    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => {
        setNumberOfProducts(data.length);
      })
      .catch((error) => console.error("Error fetching customers:", error));
    fetch("http://localhost:8080/api/customers")
      .then((response) => response.json())
      .then((data) => {
        setNumberOfCustomers(data.length);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>TỔNG QUAN</h3>
      </div>

      <div className="main-cards">
        <div className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">KHÁCH HÀNG</h5>
            <PeopleAltIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfCustomers}</h2>
        </div>
        <div className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">SẢN PHẨM</h5>
            <ArchiveIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfProducts}</h2>
        </div>
        <div className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">BÀN</h5>
            <TableBarIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfTables}</h2>
        </div>
        <div className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">HOÁ ĐƠN</h5>
            <ReceiptIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfOrders}</h2>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container" style={{ marginBottom: "70px" }}>
          <h3 className="chart-title">
            <BarChartIcon className="me-2" />
            Doanh thu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ChartRevenue />
          </ResponsiveContainer>
        </div>

        <div className="chart-container" style={{ marginBottom: "70px" }}>
          <h3 className="chart-title">
            <PieChartIcon className="me-2" />
            Thức uống yêu thích
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ChartProduct />
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default AdminHome;
