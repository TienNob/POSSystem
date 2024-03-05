import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap";
import Invoice from "./Invoice";
import "../Oder.css";
import axios from "axios";
import { LinkAPI } from "../../LinkAPI";

function Total({ totalPrice, products, tableID }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID];
    // sned API to backend
      // Gửi API tới backend
      const invoiceData = {
          ban: { id: tableID },
          orderDate: new Date(),
          totalAmount: totalPrice,
      };

      console.log(invoiceData);

      axios.post(`${LinkAPI}orders`, invoiceData)
          .then((response) => {
              console.log("Invoice data sent successfully:", response.data);

              axios.get(`${LinkAPI}orders/max`)
                  .then((response) => {
                      const maxOrderId = response.data;
                        console.log(maxOrderId.value);
                      for (let i = 0; i < products.length; i++) {
                          const orderItem = {
                              order: {id: maxOrderId},
                              product: {id: products[i].id},
                              quantity:  products[i].quantity,
                          };

                          console.log(orderItem);

                          // Gửi dữ liệu order item
                          axios.post(`${LinkAPI}order-items`, orderItem)
                              .then((response) => {
                                  console.log("Order item data sent successfully:", response.data);
                              })
                              .catch((error) => {
                                  console.error("Error sending order item data:", error);
                              });
                      }
                  })
                  .catch((error) => {
                      console.error("Error fetching max order id:", error);
                  });
          }
          )


      if (productsForTable) {
      const updatedProducts = [];
      // Cập nhật mảng trong local storage
      storedProductsByTable[tableID] = updatedProducts;
      localStorage.setItem(
        "selectedProductsByTable",
        JSON.stringify(storedProductsByTable)
      );
      setShowModal(false);

      navigate("/");
    }
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="total pt-3 pb-3">
      <p>Tổng cộng: {totalPrice} K</p>
      <Button
        variant="primary"
        style={{ width: "100%" }}
        onClick={handleShowModal}
      >
        Thanh Toán
      </Button>

      {/* Modal hiển thị hoá đơn */}
      <Modal
        className="modalInvoice"
        centered
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="justify-content-center">
          <Modal.Title className="blackColor">Hoá Đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Invoice
            totalPrice={totalPrice}
            products={products}
            tableID={tableID}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Huỷ
          </Button>
          <Button onClick={handlePayment} variant="primary">
            Thanh Toán
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Total;
