import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Modal, Card, Row, Button, Col } from "react-bootstrap";
import axios from "axios";
import { LinkAPI } from "../../../LinkAPI";

import "../admin.css";

function BinProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  console.log(products);
  useEffect(() => {
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }

    axios
      .get(`${LinkAPI}products/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate]);

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <Container>
        <Row>
          {products.map((product, i) => (
            <Col className="mt-4" xs="6" md="4" lg="3">
              <Card className="card-fix">
                <Card.Img
                  className="admin-card_product"
                  height=""
                  variant="top"
                  //   src={getImageArray(category)[i]}
                />
                <Card.Body className="card-body_fix">
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text className="blackColor">
                    Giá: {product.price}k
                  </Card.Text>
                  <Button className="me-2 mt-1 ">Xoá</Button>
                  <Button className="mt-1">Khôi phục</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
export default BinProduct;
