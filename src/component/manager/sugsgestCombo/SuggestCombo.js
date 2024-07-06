import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Modal,
  Card,
  Row,
  Button,
  Col,
  Form,
} from "react-bootstrap";
import "../admin.css";
import axios from "axios";

function SuggestCombo() {
  const [combos, setCombos] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState({
    drink: { productName: "", linkImage: "" },
    food: { productName: "", linkImage: "" },
    totalPrice: 0,
  });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }
    axios
      .get("http://localhost:8080/api/combos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCombos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching combo data:", error);
      });
  }, [token, navigate]);

  const handleAddCombo = () => {
    axios
      .post("http://localhost:8080/api/combos", selectedCombo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCombos([...combos, response.data]);
        setShowModal(false);
        setSelectedCombo({
          drink: { productName: "", linkImage: "" },
          food: { productName: "", linkImage: "" },
          totalPrice: 0,
        });
      })
      .catch((error) => {
        console.error("Error creating combo:", error);
      });
  };

  const handleShowModal = (combo) => {
    setSelectedCombo(combo);
    setShowModal(true);
  };

  const handlePriceChange = (e) => {
    setSelectedCombo({
      ...selectedCombo,
      totalPrice: e.target.value,
    });
  };

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <Container>
        <Row>
          {combos.map((product, i) => (
            <Col className="mt-4" xs="6" md="4" lg="4" key={i}>
              <Card className="card-fix">
                <div className="image-container mb-2">
                  <img
                    className="admin-card_product"
                    src={product.drink.linkImage}
                    alt={product.drink.productName}
                    style={{ width: "50%", height: "auto" }}
                  />
                  <img
                    className="admin-card_product"
                    src={product.food.linkImage}
                    alt={product.food.productName}
                    style={{ width: "50%", height: "auto" }}
                  />
                </div>
                <Card.Body className="card-body_fix">
                  <Card.Title>
                    {product.drink.productName} và {product.food.productName}
                  </Card.Title>
                  <Card.Text className="blackColor">
                    Giá: {product.totalPrice}k
                  </Card.Text>
                  <Button className="me-2 mt-1 ">Xoá</Button>
                  <Button
                    className="mt-1"
                    onClick={() => handleShowModal(product)}
                  >
                    Thêm vào
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin Combo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên đồ uống</Form.Label>
              <Form.Control
                type="text"
                value={selectedCombo.drink.productName}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link ảnh đồ uống</Form.Label>
              <Form.Control
                type="text"
                value={selectedCombo.drink.linkImage}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên món ăn</Form.Label>
              <Form.Control
                type="text"
                value={selectedCombo.food.productName}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link ảnh món ăn</Form.Label>
              <Form.Control
                type="text"
                value={selectedCombo.food.linkImage}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                value={selectedCombo.totalPrice}
                onChange={handlePriceChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddCombo}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SuggestCombo;
