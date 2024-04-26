import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { LinkAPI } from "../LinkAPI";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import TotalOder from "./TotalOder";
import "../App.css";
import "./Oder.css";

function TableList() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false); // State để kiểm soát việc hiển thị modal
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tableID, setTableID] = useState(""); // Thêm state cho tableID
  const [customerInfo, setCustomerInfo] = useState(null);

  const token = localStorage.getItem("authToken");
  const history = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      history("/");
      return;
    }
    axios
      .get(`${LinkAPI}table`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const customInfoStore =
          JSON.parse(localStorage.getItem("customerInfoArray")) || {};
        const updatedTables = res.data.map((table) => ({
          ...table,
          status:
            customInfoStore[table.id] && customInfoStore[table.id].length > 0,
        }));
        setTables(updatedTables);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [history, LinkAPI]);

  const handlePhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    setPhoneNumber(phoneNumber);
    if (phoneNumber) {
      axios
        .get(`${LinkAPI}customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const filteredCustomers = res.data.filter(
            (customer) => customer.phoneNumber === phoneNumber
          );
          if (filteredCustomers.length > 0) {
            setCustomerInfo(filteredCustomers[0]); // Lưu thông tin khách hàng vào state
          } else {
            setCustomerInfo(null); // Reset state nếu không tìm thấy thông tin khách hàng
          }
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        });
    } else {
      setCustomerInfo(null); // Reset state khi số điện thoại rỗng
    }
  };

  const handleTableClick = (tableID, status) => {
    if (status === true) {
      history("/productlist");
      localStorage.setItem("selectedTableID", tableID);
    } else {
      setShowModal(true); // Hiển thị form khi click vào bàn
      setTableID(tableID); // Lưu tableID khi click vào bàn
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Ẩn modal khi đóng
  };
  console.log(customerInfo);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const customerInfoLocal = {
      phoneNumber: phoneNumber || "",
      customerName:
        customerInfo !== null ? customerInfo.name : customerName || "Khách lẻ",
    };
    console.log(customerInfoLocal);
    localStorage.setItem("selectedTableID", tableID);
    const selectedTableID = localStorage.getItem("selectedTableID"); // Lấy ID của bàn từ local storage
    let customerInfoArray =
      JSON.parse(localStorage.getItem("customerInfoArray")) || {};

    if (!customerInfoArray[selectedTableID]) {
      customerInfoArray[selectedTableID] = [];
    }

    customerInfoArray[selectedTableID].push(customerInfoLocal);

    localStorage.setItem(
      "customerInfoArray",
      JSON.stringify(customerInfoArray)
    );
    setShowModal(false); // Ẩn modal sau khi submit
    history("/productlist");
  };

  return (
    <Container className="mb-5">
      <Row>
        {tables.map((table, i) => (
          <Col key={table.id} lg="3" md="4" xs="6" className="mt-3 ps-2 pe-2">
            <div
              className="tableOder"
              style={{
                opacity: table.status ? "0.7" : "1",
              }}
              onClick={() => handleTableClick(table.id, table.status)}
            >
              <Card
                className="cardList"
                style={{ width: "100%", height: "12rem" }}
              >
                <Card.Body className=" d-flex flex-column justify-content-between">
                  <Card.Title className="cardList">Bàn {table.id}</Card.Title>
                  <Card.Text className="cardList">
                    Trạng thái
                    <ArrowRightAltIcon className="ms-1" size={"18px"} />{" "}
                    <span
                      style={{
                        color: table.status ? "#a72a56" : "#2d5f37",
                        fontWeight: "bold",
                      }}
                    >
                      {table.status === true ? "Có khách" : "Trống"}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
      <TotalOder />
      {showModal &&
        tables.find((table) => table.id === tableID) &&
        !tables.find((table) => table.id === tableID).status && (
          <Modal centered show={showModal} onHide={handleModalClose}>
            <Modal.Header className="justify-content-center">
              <Modal.Title className="blackColor">
                Nhập thông tin khách hàng
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleFormSubmit}>
                {!tables.find((table) => table.id === tableID).status && (
                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label className="blackColor">
                      Số điện thoại
                    </Form.Label>
                    <Form.Control
                      className="mb-4"
                      type="number"
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e)} // Thay đổi ở đây
                    />
                  </Form.Group>
                )}
                <Form.Group controlId="formCustomerName">
                  <Form.Label className="blackColor">Tên khách hàng</Form.Label>
                  <Form.Control
                    className="mb-4"
                    type="text"
                    placeholder="Nhập tên khách hàng"
                    value={customerInfo ? customerInfo.name : customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button
                    className="me-2 buttonDisible"
                    variant="secondary"
                    onClick={handleModalClose}
                  >
                    Huỷ
                  </Button>
                  <Button variant="primary" type="submit">
                    Tiếp tục
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        )}
    </Container>
  );
}

export default TableList;
