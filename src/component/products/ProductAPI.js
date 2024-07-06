import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LinkAPI } from "../../LinkAPI";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Card, Container, Row, Col } from "react-bootstrap";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TotalOder from "../total/TotalOder";

import "../../App.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("nuoc");
  const [combos, setCombos] = useState([]);

  const navigate = useNavigate();

  const getLocalImageUrl = (localPath) => {
    try {
      return require(`../../images${localPath.split("images")[1]}`);
    } catch (error) {
      console.error("Error loading local image:", error);
    }
  };
  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
  };
  console.log(category);
  console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token không tồn tại trong localStorage");
        navigate("/");
        return;
      }

      let endpoint = `${LinkAPI}products/nuoc`;

      switch (category) {
        case "nuoc":
          endpoint = `${LinkAPI}products/nuoc`;
          break;
        case "do-an":
          endpoint = `${LinkAPI}products/do-an`;
          break;
        default:
          break;
      }

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [category, navigate]);

  useEffect(() => {
    const fetchCombos = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token không tồn tại trong localStorage");
        navigate("/");
        return;
      }

      const endpoint = `${LinkAPI}combos`;

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCombos(response.data);
      } catch (error) {
        console.error("Error fetching combos data:", error);
      }
    };

    fetchCombos();
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
      let productName = product.productName;
      let price = product.price;
      let id = product.id;

      if (product.food) {
        id = Math.floor(Math.random() * 1000000);
        productName = `${product.drink.productName} và ${product.food.productName}`;
        price = product.totalPrice;
      } else {
        // Nếu không phải là combo, sử dụng dữ liệu ban đầu
        productName = product.productName;
        price = product.price;
      }

      storedProductsByTable[selectedTableID].push({
        id: id,
        productName: productName,
        price: price,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "selectedProductsByTable",
      JSON.stringify(storedProductsByTable)
    );
    window.location.reload();
  };

  return (
    <Container className="mb-5">
      <FormControl className="w-25 catelory-form">
        <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Danh mục"
          onChange={handleChange}
        >
          <MenuItem value="nuoc">Thức uống</MenuItem>
          <MenuItem value="do-an">Thức ăn</MenuItem>
        </Select>
      </FormControl>
      <TotalOder />

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
                <Card.Text className="d-flex justify-content-between">
                  <AddCircleIcon className="ms-1" size={"18px"} />
                  <p className="mb-0">{product.price}K</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="mt-4">Combo ưu đãi</h3>
      <Row>
        {combos.map((combo) => (
          <Col key={combo.id} lg="3" md="4" xs="6" className="mt-2">
            <Card
              className="card-fix card-combo"
              onClick={() => addProductToTotal(combo)}
            >
              <div className="image-container mb-2">
                <img
                  className="admin-card_product"
                  src={combo.drink.linkImage}
                  alt={combo.drink.productName}
                  style={{ width: "50%", height: "auto" }}
                />
                <img
                  className="admin-card_product"
                  src={combo.food.linkImage}
                  alt={combo.food.productName}
                  style={{ width: "50%", height: "auto" }}
                />
              </div>
              <Card.Body className="card-body_fix">
                <Card.Title>
                  {combo.drink.productName} và {combo.food.productName}
                </Card.Title>
                <Card.Text className="blackColor">
                  Giá: {combo.totalPrice}k
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
