import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TableBarIcon from "@mui/icons-material/TableBar";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { ResponsiveContainer } from "recharts";
import ChartProduct from "./chart/ChartProduct";
import ChartRevenue from "./chart/ChartRevenue";
import { LinkAPI } from "../../LinkAPI";
import "./admin.css";

function AdminHome() {
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfTables, setNumberOfTables] = useState(0);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [numberOfCustomers, setNumberOfCustomers] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [revenueData, setRevenueData] = useState([]);
  const [productData, setProductData] = useState([]);

  const token = localStorage.getItem("authToken");

  // Lấy dữ liệu tổng quan
  useEffect(() => {
    fetch(`${LinkAPI}orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNumberOfOrders(data.content.length);
      })
      .catch((error) => console.error("Error fetching orders:", error));

    fetch(`${LinkAPI}table`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNumberOfTables(data.length);
      })
      .catch((error) => console.error("Error fetching tables:", error));

    fetch(`${LinkAPI}products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNumberOfProducts(data.length);
      })
      .catch((error) => console.error("Error fetching products:", error));

    fetch(`${LinkAPI}customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNumberOfCustomers(data.length);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, [token]);

  // Lấy dữ liệu doanh thu và sản phẩm yêu thích khi phạm vi ngày thay đổi
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchRevenueData(dateRange[0], dateRange[1]);
    }
  }, [dateRange]);

  // Hàm lấy dữ liệu doanh thu và sản phẩm yêu thích
  const fetchRevenueData = async (startDate, endDate) => {
    try {
      const response = await axios.post(
        `${LinkAPI}orders/thongke`,
        {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      // Cập nhật dữ liệu cho các biểu đồ
      setRevenueData(data.revenue);
      setProductData(data.product);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>TỔNG QUAN</h3>
      </div>

      <div className="main-cards">
        <Link to="/customerManagement" className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">KHÁCH HÀNG</h5>
            <PeopleAltIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfCustomers}</h2>
        </Link>
        <Link to="/productManagement" className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">SẢN PHẨM</h5>
            <LocalCafeIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfProducts}</h2>
        </Link>
        <Link to="/tableManagement" className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">BÀN</h5>
            <TableBarIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfTables}</h2>
        </Link>
        <Link to="/History" className="admin-card">
          <div className="card-inner">
            <h5 className="mt-3 mb-3">HOÁ ĐƠN</h5>
            <ReceiptIcon className="card_icon" />
          </div>
          <h2 className="mt-3 mb-3">{numberOfOrders}</h2>
        </Link>
      </div>

      <div className="admin-LocalizationProvider">
        <h3 className="chart-title mb-3">
          <EditCalendarIcon className="me-2" />
          Phạm vi thống kê
        </h3>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoItem component="DateRangePicker">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              className="admin-datePicker"
              localeText={{
                start: "",
                end: "",
              }}
            />
          </DemoItem>
        </LocalizationProvider>
      </div>

      <div className="charts mt-4">
        <div className="chart-container" style={{ marginBottom: "70px" }}>
          <h3 className="chart-title">
            <BarChartIcon className="me-2" />
            Doanh thu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ChartRevenue data={revenueData} />
          </ResponsiveContainer>
        </div>

        <div className="chart-container" style={{ marginBottom: "70px" }}>
          <h3 className="chart-title">
            <PieChartIcon className="me-2" />
            Thức uống yêu thích
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ChartProduct data={productData} />
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default AdminHome;
