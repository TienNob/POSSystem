import React, { useState, useEffect } from "react";

import ArchiveIcon from "@mui/icons-material/Archive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TableBarIcon from "@mui/icons-material/TableBar";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import { DatePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";

import { ResponsiveContainer } from "recharts";
import { LinkAPI } from "../../LinkAPI";

import ChartProduct from "./chart/ChartProduct";
import ChartRevenue from "./chart/ChartRevenue";

function AdminHome() {
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfTables, setNumberOfTables] = useState(0);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [numberOfCustomers, setNumberOfCustomers] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);

  useEffect(() => {
    fetch(`${LinkAPI}orders`)
      .then((response) => response.json())
      .then((data) => {
        setNumberOfOrders(data.totalElements);
      })
      .catch((error) => console.error("Error fetching orders:", error));

    fetch(`${LinkAPI}table`)
      .then((response) => response.json())
      .then((data) => {
        setNumberOfTables(data.length);
      })
      .catch((error) => console.error("Error fetching tables:", error));
    fetch(`${LinkAPI}products`)
      .then((response) => response.json())
      .then((data) => {
        setNumberOfProducts(data.length);
      })
      .catch((error) => console.error("Error fetching customers:", error));
    fetch(`${LinkAPI}customers`)
      .then((response) => response.json())
      .then((data) => {
        setNumberOfCustomers(data.length);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    // Kiểm tra xem đã chọn cả hai ngày bắt đầu và kết thúc chưa
    if (startDate && endDate) {
      // Tạo URL với tham số truy vấn
      const url = `http://localhost:8080/api/orders/thongke?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Xử lý dữ liệu nhận được ở đây
          setTotalRevenue(data.totalRevenue);
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    }
  }, [startDate, endDate]);

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
      <div>
        <DatePicker
          label="Chọn ngày bắt đầu"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="Chọn ngày kết thúc"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
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
