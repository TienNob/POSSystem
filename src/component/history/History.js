import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { LinkAPI } from "../../LinkAPI";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./history.css";

function History() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const handleClick = (id) => {
    if (id !== null && id !== undefined) {
      localStorage.setItem("selectedOrderID", JSON.stringify(id));
    } else {
      console.error("Invalid id:", id);
    }
  };

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/login");
      return;
    }

    axios
      .get(`${LinkAPI}orders?page=${currentPage}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const sortedHistory = res.data.content.sort((a, b) => {
          console.log(new Date(b.orderDate) - new Date(a.orderDate));
          return new Date(b.orderDate) - new Date(a.orderDate);
        });
        setHistory(sortedHistory);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate, currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  return (
    <Container>
      <Table className="history">
        <thead>
          <tr>
            <th className="setHistoryColor">#</th>
            <th className="setHistoryColor">Số điện thoại</th>
            <th className="setHistoryColor">Ngày thanh toán</th>
            <th className="setHistoryColor">Tổng thành tiền</th>
            <th className="setHistoryColor">Thanh toán</th>
            <th className="setHistoryColor">Nhân viên</th>
            <th className="setHistoryColor">Chi tiết hoá đơn</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={item.id}>
              <td className="setHistoryColor">
                {currentPage * pageSize + index + 1}
              </td>
              <td className="setHistoryColor">
                {item.phoneNumber !== "" ? item.phoneNumber : "Khách lẻ"}
              </td>
              <td className="setHistoryColor">
                {new Date(item.orderDate).toLocaleString()}
              </td>
              <td className="setHistoryColor">{item.totalAmount} K</td>
              <td className="setHistoryColor">{item.typePayment}</td>
              <td className="setHistoryColor">
                {item.employee ? item.employee.fullName : ""}
              </td>
              <td className="setHistoryColor">
                <Link onClick={() => handleClick(item.id)} to="/orderdetail">
                  Xem thêm
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="button-container mt-4">
        <Stack spacing={2}>
          <Pagination
            className="history-pagination"
            count={totalPages}
            color="primary"
            onChange={handlePageChange} // Call handlePageChange function on page change
          />
        </Stack>
      </div>
    </Container>
  );
}

export default History;
