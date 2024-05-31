import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Oder.css";
import { useNavigate } from "react-router-dom";
import { LinkAPI } from "../../LinkAPI";

function Invoice({
  totalPrice,
  products,
  tableID,
  phoneNumber,
  paymentMethods,
}) {
  const userName = localStorage.getItem("userName");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }
    axios
      .get(`${LinkAPI}employees/account?account=${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFullName(res.data.fullName);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate, userName]);
  return (
    <div className="invoice blackColor">
      <p className="blackColor text-center">{new Date().toLocaleString()}</p>
      <p className="blackColor">Số bàn: {tableID}</p>
      <p className="blackColor">SĐT: {phoneNumber} </p>
      <p className="blackColor">Nhân viên: {fullName} </p>
      <p className="blackColor">Phương thức thanh toán: {paymentMethods} </p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.productName}</td>
              <td>{product.quantity}</td>
              <td>{product.price} K</td>
              <td>{product.quantity * product.price} K</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="mt-4"></hr>
      <div className="d-flex justify-content-between blackColor sumTotal">
        <h4>Tổng cộng: </h4>
        <h4>{totalPrice} K</h4>
      </div>
    </div>
  );
}

export default Invoice;
