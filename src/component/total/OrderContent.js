import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import Total from "./Total";
import { RiDeleteBinLine } from "react-icons/ri";

function OrderContent({ tableID }) {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State để lưu tổng giá tiền

  useEffect(() => {
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    const productsForTable = storedProductsByTable[tableID] || [];
    setProducts(productsForTable);
    // Tính toán tổng giá tiền khi danh sách sản phẩm thay đổi
  }, [tableID]);
  useEffect(() => {
    let newTotalPrice = 0;
    products.forEach((product) => {
      newTotalPrice += product.price * product.quantity;
    });
    setTotalPrice(newTotalPrice);

    // Lưu danh sách sản phẩm vào Local Storage khi nó thay đổi
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    storedProductsByTable[tableID] = products;
    localStorage.setItem(
      "selectedProductsByTable",
      JSON.stringify(storedProductsByTable)
    );
  }, [products, tableID]);

  const handleInputChange = (e, index) => {
    let { value } = e.target;
    const updatedProducts = [...products];
    console.log(value);
    if (value === "") {
      value = 1;
    }
    if (value >= 100) {
      value = 100;
      alert("Chỉ nhập được tối đã số lượng 100 cho 1 sản phẩm");
    }
    updatedProducts[index].quantity = parseInt(value);
    setProducts(updatedProducts);
  };

  const handleIncreaseQuantity = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity =
      (updatedProducts[index].quantity || 0) + 1;
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].quantity > 1) {
      updatedProducts[index].quantity -= 1;

      setProducts(updatedProducts);
      updateLocalStorage(updatedProducts);
    }
  };
  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);
  };
  const updateLocalStorage = (updatedProducts) => {
    const storedProductsByTable =
      JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};
    storedProductsByTable[tableID] = updatedProducts;
    localStorage.setItem(
      "selectedProductsByTable",
      JSON.stringify(storedProductsByTable)
    );
  };

  return (
    <Container className="orderContent">
      <ListGroup className="mb-3">
        {products.map((product, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex totalNav justify-content-between align-items-center flex-row-reverse"
          >
            <div>
              <span className="me-3">{product.price * product.quantity} K</span>
            </div>
            <div>
              <span>{product.productName}</span>
              <div className="fw-bold mt-2">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => handleDecreaseQuantity(index)}
                >
                  -
                </Button>
                <input
                  type="number"
                  className="orderContent-inputChange"
                  value={product.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ width: `${product.quantity.toString().length}ch` }}
                />
                <Button
                  variant="outline-secondary"
                  className="ms-2"
                  onClick={() => handleIncreaseQuantity(index)}
                >
                  +
                </Button>
                <RiDeleteBinLine
                  className=" deleteListProduct"
                  onClick={() => handleDeleteProduct(index)}
                />
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Total totalPrice={totalPrice} products={products} tableID={tableID} />
    </Container>
  );
}

export default OrderContent;
