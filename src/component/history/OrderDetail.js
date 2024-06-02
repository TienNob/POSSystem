import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { LinkAPI } from "../../LinkAPI";
import "./history.css";
function OrderDetail() {
  const [productFilter, setProductFilter] = useState([]);
  const navigate = useNavigate();
  const storedOrderID = JSON.parse(localStorage.getItem("selectedOrderID"));
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }
    axios
      .get(`${LinkAPI}orders/chitiethoadon`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const filterProductByID = res.data.filter(
          (item) => item.id === storedOrderID
        );
        setProductFilter(filterProductByID);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [storedOrderID]);
  return (
    <Container>
      <Table className="history">
        <thead>
          <tr>
            <th className="setHistoryColor">Số bàn</th>
            <th className="setHistoryColor">Tên sản phẩm</th>
            <th className="setHistoryColor">Đơn giá</th>
            <th className="setHistoryColor">Số lượng</th>
            <th className="setHistoryColor">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {productFilter.map((product) => (
            <tr key={product.banId}>
              <td className="setHistoryColor">{product.banId}</td>

              <td className="setHistoryColor">{product.productName}</td>
              <td className="setHistoryColor">{product.price} K</td>
              <td className="setHistoryColor">{product.quantity}</td>

              <td className="setHistoryColor">
                {product.quantity * product.price} K
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
export default OrderDetail;
