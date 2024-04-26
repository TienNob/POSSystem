import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

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
import dayjs from "dayjs";
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
  const [dataByDate, setDataByDate] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const token = localStorage.getItem("authToken");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  console.log(dateRange);
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
    if (dateRange[0] || dateRange[1]) {
      fetchRevenueData(dateRange[0], dateRange[1]);
    }
  }, [dateRange]);

  // Hàm lấy dữ liệu doanh thu và sản phẩm yêu thích
  const fetchRevenueData = async (startDate, endDate) => {
    let formattedStartDate;
    let formattedEndDate;

    if (startDate) {
      const dayStart = dayjs(startDate.$d);
      formattedStartDate = dayStart.format("YYYY-MM-DD");
    }

    if (endDate) {
      const dayEnd = dayjs(endDate.$d);
      formattedEndDate = dayEnd.format("YYYY-MM-DD");
    }
    let apiLink;
    console.log(apiLink);
    if (formattedStartDate && formattedEndDate) {
      // Use the provided start and end dates for a date range query
      apiLink = `${LinkAPI}orders/thongke?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    } else {
      // Handle cases where either start or end date is missing
      if (formattedStartDate) {
        // Use start date for a "from date" query (assuming supported by API)
        apiLink = `${LinkAPI}orders/thongke?startDate=${formattedStartDate}`;
      } else if (formattedEndDate) {
        // Use end date for a "to date" query (assuming supported by API)
        apiLink = `${LinkAPI}orders/thongke?endDate=${formattedEndDate}`;
      }
    }
    try {
      const response = await axios.get(apiLink, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataByDate(response.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

      <div className="admin-LocalizationProvider mb-3">
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

      {dataByDate.length < 1 ? (
        <i>Không có hoá đơn trong thời gian thống kê</i>
      ) : (
        <div className="table mt-4">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày thanh toán</TableCell>
                  <TableCell>Thành Tiền</TableCell>
                  <TableCell>Nhân viên</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataByDate
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        {item.phoneNumber ? item.phoneNumber : "Khách lẻ"}
                      </TableCell>
                      <TableCell>{item.orderDate}</TableCell>
                      <TableCell>{item.totalAmount}k</TableCell>
                      <TableCell>{item.employeeFullName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className="adminHome_pagination"
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={dataByDate.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </main>
  );
}

export default AdminHome;
