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
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      // Điều hướng người dùng đến trang đăng nhập hoặc xử lý lỗi khác
      history("/");
      return;
    }

    // Thực hiện yêu cầu dữ liệu sản phẩm với tiêu đề Authorization
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const customerInfo = {
      phoneNumber: phoneNumber || "",
      customerName: customerName || "Khách lẻ",
    };
    localStorage.setItem("selectedTableID", tableID);
    const selectedTableID = localStorage.getItem("selectedTableID"); // Lấy ID của bàn từ local storage
    let customerInfoArray =
      JSON.parse(localStorage.getItem("customerInfoArray")) || {};

    if (!customerInfoArray[selectedTableID]) {
      customerInfoArray[selectedTableID] = [];
    }

    customerInfoArray[selectedTableID].push(customerInfo);

    localStorage.setItem(
      "customerInfoArray",
      JSON.stringify(customerInfoArray)
    );
    setShowModal(false); // Ẩn modal sau khi submit
    history("/productlist");
  };

  return (
    <Container>
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
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                )}
                <Form.Group controlId="formCustomerName">
                  <Form.Label className="blackColor">Tên khách hàng</Form.Label>
                  <Form.Control
                    className="mb-4"
                    type="text"
                    placeholder="Nhập tên khách hàng"
                    value={customerName}
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
