import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap";
import Invoice from "./Invoice";
import '../Oder.css'

function Total({ totalPrice, products, tableID }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 

  const handlePayment = () => {
    // Remove the products associated with the selected table from local storage
    const storedProductsByTable = JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID];
    
    if (productsForTable) {
      console.log(productsForTable);
      // Cắt mảng sản phẩm
      const updatedProducts = [];
      // Cập nhật mảng trong local storage
      storedProductsByTable[tableID] = updatedProducts;
      localStorage.setItem("selectedProductsByTable", JSON.stringify(storedProductsByTable));
         setShowModal(false);

    // Chuyển hướng đến trang chủ
    navigate("/");
    }
  }
  const handleShowModal = ()=>{

    setShowModal(true);
  }
  const handleCloseModal = () => {
    // Đóng Modal
    setShowModal(false);
  };

  return (
    <Container className="total pt-3 pb-3">
      <p>Tổng cộng: {totalPrice} K</p>
      <Button variant="primary" style={{ width: "100%" }} onClick={handleShowModal} >
        Thanh Toán
      </Button>

      {/* Modal hiển thị hoá đơn */}
      <Modal className="modalInvoice" centered 
 show={showModal} onHide={handleCloseModal} backdrop="static"
 keyboard={false}>
        <Modal.Header className="justify-content-center" >
          <Modal.Title className="blackColor">Hoá Đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Invoice totalPrice={totalPrice} products={products} tableID={tableID} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Huỷ
          </Button>
          <Button onClick={handlePayment} variant="primary">Thanh Toán</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Total;
