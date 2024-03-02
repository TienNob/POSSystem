import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";
import { LinkAPI } from "../../LinkAPI";
import "./history.css";

function History() {
  const [history, setHistory] = useState([]);
  const isoString = "2024-02-27T01:36:56.767+00:00";
  const date = new Date(isoString);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " "); // Lấy ngày giờ rút gọn
  console.log("Ngày giờ rút gọn:", formattedDate);
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
            <th className="setHistoryColor">Order ID</th>
            <th className="setHistoryColor">Order Date</th>
            <th className="setHistoryColor">Total Amount</th>
            {/* Add more table headers if needed */}
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={item.id}>
              <td className="setHistoryColor">{index + 1}</td>
              <td className="setHistoryColor">{item.id}</td>
              <td className="setHistoryColor">
                {new Date(item.orderDate)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")
                  .replace(" ", ", ")}
              </td>
              <td className="setHistoryColor">{item.totalAmount}</td>
              {/* Render more table cells if needed */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default History;
