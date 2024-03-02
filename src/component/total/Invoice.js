import React from "react";
import "../Oder.css";
import axios from "axios";
import { LinkAPI } from "../../LinkAPI";

function Invoice({ totalPrice, products, tableID }) {
  const sendInvoiceDataToServer = () => {
    const invoiceData = {
      ban: { id: tableID },
      orderDate: new Date(),
      totalAmount: totalPrice,
    };
    console.log(invoiceData);
    axios
      .post(`${LinkAPI}orders`, invoiceData)
      .then((response) => {
        console.log("Invoice data sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending invoice data:", error);
      });
  };
  const sendOderItemTosSever = () => {
    products.forEach((product) => {
      const orderItem = {
        order: { id: tableID },
        product: product,
        quantity: product.quantity, // Số lượng của mặt hàng
      };
      console.log(orderItem);
      // axios
      //   .post("http://192.168.1.7:8080/api/orderItems", orderItem)
      //   .then(response => {
      //     console.log("Order item sent successfully:", response.data);
      //   })
      //   .catch(error => {
      //     console.error("Error sending order item:", error);
      //   });
    });
  };
  return (
    <div className="invoice blackColor">
      <p className="blackColor text-center">{new Date().toLocaleString()}</p>
      <p className="blackColor">Số bàn: {tableID}</p>
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
      <button onClick={sendInvoiceDataToServer}>Xác nhận đặt hàng</button>
    </div>
  );
}

export default Invoice;
