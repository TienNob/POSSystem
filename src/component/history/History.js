import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { LinkAPI } from "../../LinkAPI";
import usePagination from "@mui/material/usePagination";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./history.css";

function History() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleClick = (id) => {
    if (id !== null && id !== undefined) {
      localStorage.setItem("selectedOrderID", JSON.stringify(id));
    } else {
      console.error("Invalid id:", id);
    }
  };

  useEffect(() => {
    axios
      .get(`${LinkAPI}orders?page=${currentPage}&size=${pageSize}`)
      .then((res) => {
        const sortedHistory = res.data.content.sort((a, b) => {
          return new Date(b.orderDate) - new Date(a.orderDate);
        });
        setHistory(sortedHistory);
        setTotalPages(res.data.totalPages);

        console.log(sortedHistory);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [currentPage, pageSize]);
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
                {new Date(item.orderDate)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")
                  .replace(" ", ", ")}
              </td>
              <td className="setHistoryColor">{item.totalAmount} K</td>
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
            showFirstButton
            showLastButton
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
