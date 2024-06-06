import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LinkAPI } from "../../LinkAPI";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Card, Container, Row, Col } from "react-bootstrap";
import TotalOder from "../total/TotalOder";

import "../../App.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [productDrink, setProductDrink] = useState([]);

  const navigate = useNavigate();
  const getLocalImageUrl = (localPath) => {
    try {
      return require(`../../images${localPath.split("images")[1]}`);
    } catch (error) {
      console.error("Error loading local image:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }

    axios
      .get(`${LinkAPI}products/do-an`, {
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }

    axios
      .get(`${LinkAPI}products/nuoc`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProductDrink(res.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate]);

  const addProductToTotal = (product) => {
    const selectedTableID = localStorage.getItem("selectedTableID"); // Lấy ID của bàn từ local storage
    let storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};

    if (!storedProductsByTable[selectedTableID]) {
      storedProductsByTable[selectedTableID] = [];
    }

    // Kiểm tra xem sản phẩm đã được thêm vào local storage chưa
    const existingProductIndex = storedProductsByTable[
      selectedTableID
    ].findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
      storedProductsByTable[selectedTableID][
        existingProductIndex
      ].quantity += 1;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới với số lượng mặc định là 1
      storedProductsByTable[selectedTableID].push({ ...product, quantity: 1 });
    }

    localStorage.setItem(
      "selectedProductsByTable",
      JSON.stringify(storedProductsByTable)
    );
    window.location.reload();
  };

  return (
    <Container className="mb-5">
      <TotalOder />
      <h3 className="mb-0 mt-4">Thức ăn</h3>

      <Row>
        {products.map((product, i) => (
          <Col key={product.id} lg="3" md="4" xs="6" className="mt-4">
            <Card
              onClick={() => addProductToTotal(product)}
              style={{
                width: "100%",
                height: "12rem",
                backgroundImage: `url('${getLocalImageUrl(
                  product.linkLocal
                )}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                color: "white",
              }}
            >
              <Card.Body className="fillter d-flex flex-column justify-content-between">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text className="d-flex justify-content-between ">
                  <AddCircleIcon className="ms-1" size={"18px"} />
                  <p className="mb-0">{product.price} K</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3 className="mb-0 mt-5">Thức uống</h3>
      <Row>
        {productDrink.map((product, i) => (
          <Col key={product.id} lg="3" md="4" xs="6" className="mt-4">
            <Card
              onClick={() => addProductToTotal(product)}
              style={{
                width: "100%",
                height: "12rem",
                backgroundImage: `url('${getLocalImageUrl(
                  product.linkLocal
                )}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                color: "white",
              }}
            >
              <Card.Body className="fillter d-flex flex-column justify-content-between">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text className="d-flex justify-content-between ">
                  <AddCircleIcon className="ms-1" size={"18px"} />
                  <p className="mb-0">{product.price} K</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList;
