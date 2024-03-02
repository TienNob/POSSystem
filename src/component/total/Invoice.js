import React from "react";
import "../Oder.css";

function Invoice({ totalPrice, products, tableID }) {
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
    </div>
  );
}

export default Invoice;
