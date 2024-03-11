import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {Button, Container, Table} from "react-bootstrap";
import { LinkAPI } from "../../LinkAPI";
import "./history.css";

function History() {
  const [history, setHistory] = useState([]);

  const handleClick = (id) => {
    if (id !== null && id !== undefined) {
      localStorage.setItem("selectedOrderID", JSON.stringify(id));
    } else {
      console.error("Invalid id:", id);
    }
  };

  useEffect(() => {
    axios
      .get(`${LinkAPI}orders`)
      .then((res) => {
        setHistory(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

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
            {/* Add more table headers if needed */}
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={item.id}>
              <td className="setHistoryColor">{index + 1}</td>
              <td className="setHistoryColor">
                {item.phoneNumber !== null ? item.phoneNumber : "Khách lẻ"}
              </td>

              <td className="setHistoryColor">
                {new Date(item.orderDate)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")
                  .replace(" ", ", ")}
              </td>
              <td className="setHistoryColor">{item.totalAmount}</td>
              <td className="setHistoryColor">
                <Link onClick={() => handleClick(item.id)} to="/orderdetail">
                  Xem thêm
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </Container>


  );
}

export default History;
