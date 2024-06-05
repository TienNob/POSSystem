import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Modal, Card, Row, Button, Col } from "react-bootstrap";
import "../admin.css";

import axios from "axios";

function SuggestCombo() {
  const [combos, setCombos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  console.log(combos);
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
  }, []);

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <Container>
        <Row>
          {combos.map((product, i) => (
            <Col className="mt-4" xs="6" md="4" lg="4">
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
                  <Button className="mt-1">Thêm vào</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default SuggestCombo;
