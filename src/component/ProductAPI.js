import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinkAPI } from "../LinkAPI";
import { IoAddCircle } from "react-icons/io5";
import { Card, Container, Row, Col } from "react-bootstrap";
import TotalOder from "./TotalOder";

import "../App.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const importAll = (r) => {
    let images = [];
    r.keys().map((item) => {
      images.push(r(item));
    });
    return images;
  };

  const imageFiles = require.context(
    "../../APIPOS/images",
    false,
    /\.(png|jpe?g|svg)$/
  );
  const imageArray = importAll(imageFiles);

  useEffect(() => {
    axios
      .get(`${LinkAPI}products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

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
    <Container>
      <TotalOder />
      <Row>
        {products.map((product, i) => (
          <Col key={product.id} lg="4" className="mt-4">
            <Card
              onClick={() => addProductToTotal(product)}
              style={{
                width: "100%",
                height: "12rem",
                backgroundImage: `url('${imageArray[i]}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                color: "white",
              }}
            >
              <Card.Body className="fillter d-flex flex-column justify-content-between">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text className="d-flex justify-content-between ">
                  <IoAddCircle className="ms-1" size={"18px"} />
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
