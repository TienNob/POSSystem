import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css"; // Import CSS file
import { Container, Modal, Card, Row, Button, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa"; // Import FaPlus icon
import { LinkAPI } from "../../LinkAPI";

function Admin() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    linkImage: "",
  });

  const [editingProduct, setEditingProduct] = useState({
    productName: "",
    price: "",
    linkImage: "",
    linkLocal: "",
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${LinkAPI}products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showEditProduct) {
      await handleSaveEdit();
    } else {
      try {
        const newProductWithImage = {
          ...newProduct,

          linkImage: newProduct.linkImage || "default_image_url.jpg",
        };

        console.log(newProductWithImage);
        const response = await axios.post(
          `${LinkAPI}products`,
          newProductWithImage
        );
        setProducts([...products, response.data]);
        setNewProduct({
          productName: "",
          price: "",
          linkImage: "",
        });
        setShowAddProduct(false);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
    setShowEditProduct(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `${LinkAPI}products/${editingProduct.id}`,
        editingProduct
      );
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct({
        productName: "",
        price: "",
        // linkImage: "",
        linkLocal: "",
      });
      setShowEditProduct(false);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${LinkAPI}products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const importAll = (r) => {
    let images = [];
    r.keys().map((item) => {
      images.push(r(item));
    });
    return images;
  };

  const imageFiles = require.context(
    "../../../APIPOS/images",
    false,
    /\.(png|jpe?g|svg)$/
  );
  const imageArray = importAll(imageFiles);

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Quản lý sản phẩm
      </h1>
      <div
        className="product-card-1 product-card mt-3 mb-1"
        onClick={() => setShowAddProduct(true)}
      >
        <div className="card-btn-add me-2">
          <FaPlus className="btn-add" />
        </div>
        <h5 className="mb-0"> Thêm sản phẩm</h5>
      </div>

      <Container>
        <Row>
          {products.map((product, i) => (
            <Col className="mt-4" xs="6" md="4" lg="3">
              <Card className="card-fix">
                <Card.Img
                  className="admin-card_body "
                  height=""
                  variant="top"
                  src={imageArray[i]}
                />
                <Card.Body className="card-body_fix">
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text className="blackColor">
                    Giá: {product.price}k
                  </Card.Text>
                  <Button
                    className="me-2"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Xoá
                  </Button>
                  <Button onClick={() => handleEditProduct(product.id)}>
                    Sửa
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal
        show={showAddProduct}
        onHide={() => setShowAddProduct(false)}
        centered
      >
        <Modal.Body>
          <div className="form-container">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="productName"
                value={newProduct.productName}
                placeholder="Product Name"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                placeholder="Price"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="linkImage"
                value={newProduct.linkImage}
                placeholder="Image URL"
                onChange={handleInputChange}
              />
              <div className="btn-form">
                <button className="me-2" type="submit">
                  Add Product
                </button>
                <button type="button" onClick={() => setShowAddProduct(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditProduct}
        onHide={() => setShowEditProduct(false)}
        centered
      >
        <Modal.Body>
          <div className="form-container">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="productName"
                value={editingProduct.productName}
                placeholder="Product Name"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                placeholder="Price"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="linkImage"
                value={editingProduct.linkImage}
                placeholder="Image URL"
                onChange={handleInputChange}
              />
              <div className="btn-form">
                <button className="me-2" type="submit">
                  Save
                </button>
                <button type="button" onClick={() => setShowEditProduct(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Admin;
