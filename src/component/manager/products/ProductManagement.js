import React, { useState, useEffect } from "react";
import axios from "axios";
import "../admin.css";
import { Container, Modal, Card, Row, Button, Col } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { LinkAPI } from "../../../LinkAPI";
import { Link } from "react-router-dom";
import Loadding from "../../../loadding/Loadding";
import Notification from "../../../notification/Notification";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";

function Admin() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("authToken");
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("nuoc");

  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    linkImage: "",
    codeDM: "",
  });

  const [editingProduct, setEditingProduct] = useState({
    productName: "",
    price: "",
    linkImage: "",
    linkLocal: "",
    codeDM: "",
  });

  console.log(products);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const endpoint =
          category === "nuoc"
            ? `${LinkAPI}products/nuoc`
            : `${LinkAPI}products/do-an`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    if (category) {
      fetchProducts();
    }
  }, [category, token]);

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
        setLoading(true);

        const newProductWithImage = {
          ...newProduct,
          linkImage: newProduct.linkImage || "default_image_url.jpg",
          codeDM: category === "nuoc" ? "NUOC_UONG" : "DO_AN",
        };

        const response = await axios.post(
          `${LinkAPI}products`,
          newProductWithImage,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTimeout(() => {
          setLoading(false);

          setProducts([...products, response.data]);
          setNewProduct({
            productName: "",
            price: "",
            linkImage: "",
            codeDM: "",
          });

          setShowAddProduct(false);
          setShowAlert(true);
          setAlertSeverity("success");
          setAlertMessage("Thêm sản phẩm thành công!");
        });
      } catch (error) {
        console.error("Error adding product:", error);
        setAlertSeverity("error");
        setAlertMessage("Xảy ra lỗi khi thêm sản phẩm!");
      }
    }
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
    setShowEditProduct(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true);

    try {
      await axios.put(
        `${LinkAPI}products/${editingProduct.id}`,
        editingProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setTimeout(() => {
        setLoading(false);

        setProducts(updatedProducts);
        setEditingProduct({
          productName: "",
          price: "",
          linkLocal: "",
          codeDM: "",
        });
        setShowEditProduct(false);
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Chỉnh sửa sản phẩm thành công!");
      });
    } catch (error) {
      console.error("Error editing product:", error);
      setAlertSeverity("error");
      setAlertMessage("Xảy ra lỗi khi sửa sản phẩm!");
    }
  };
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${LinkAPI}products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== productId));
      setShowAlert(true);
      setAlertSeverity("success");
      setAlertMessage("Xoá sản phẩm thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      setShowAlert(true);
      setAlertSeverity("error");
      setAlertMessage("Xảy ra lỗi khi xoá sản phẩm!");
    }
  };

  const importAll = (r) => {
    let images = [];
    r.keys().map((item) => {
      images.push(r(item));
    });
    return images;
  };

  const foodImages = importAll(
    require.context(
      "../../../../APIPOS/images/food",
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  const drinkImages = importAll(
    require.context(
      "../../../../APIPOS/images/drink",
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  const getImageArray = (category) => {
    return category === "nuoc" ? drinkImages : foodImages;
  };
  const handleChange = (event) => {
    setCategory(event.target.value);
    console.log(category);
  };

  const handleShowAdd = () => {
    if (!category) {
      setAlertSeverity("error");
      setAlertMessage("Vui lòng chọn danh mục trước khi thêm sản phẩm!");
      setShowAlert(true);
      return;
    } else setShowAddProduct(true);
  };

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ color: "white", width: "100%" }}
      >
        <h3 style={{ color: "white" }}>Quản lý sản phẩm</h3>

        <Button onClick={handleShowAdd}>
          <AddIcon className="me-1" />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="w-100 mt-2 d-flex justify-content-between align-items-center">
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
        <Link to="binProduct">
          <Button className="buttonDisible ">
            <AutoDeleteIcon />
          </Button>
        </Link>
      </div>

      <Container>
        <Row>
          {products.map((product, i) => (
            <Col className="mt-4" xs="6" md="4" lg="3">
              <Card className="card-fix">
                <Card.Img
                  className="admin-card_product"
                  height=""
                  variant="top"
                  src={getImageArray(category)[i]}
                />
                <Card.Body className="card-body_fix">
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text className="blackColor">
                    Giá: {product.price}k
                  </Card.Text>
                  <Button
                    className="me-2 mt-1 "
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Xoá
                  </Button>
                  <Button
                    className="mt-1"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    Sửa
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {loading && <Loadding />}

      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        show={showAddProduct}
        onHide={() => setShowAddProduct(false)}
        centered
      >
        <Modal.Body>
          <div className="form-container">
            <h2>Thêm sản phẩm</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="productName"
                value={newProduct.productName}
                placeholder="Tên sản phẩm"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                placeholder="Giá"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="linkImage"
                value={newProduct.linkImage}
                placeholder="Đường dẫn hình ảnh"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="codeDM"
                value={category === "nuoc" ? "Thức uống" : "Thức ăn"}
                placeholder=""
                onChange={handleInputChange}
              />

              <div className="btn-form">
                <button
                  type="button"
                  className="buttonDisible"
                  onClick={() => setShowAddProduct(false)}
                >
                  Huỷ
                </button>
                <button className="ms-2" type="submit">
                  Thêm
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
            <h2>Sửa Sản Phẩm</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="productName"
                value={editingProduct.productName}
                placeholder="Tên sản phẩm"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                placeholder="Giá"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="linkImage"
                value={editingProduct.linkImage}
                placeholder="Đường dẫn hình ảnh"
                onChange={handleInputChange}
              />

              <div className="btn-form">
                <button
                  type="button"
                  className="buttonDisible"
                  onClick={() => setShowEditProduct(false)}
                >
                  Huỷ
                </button>
                <button className="ms-2" type="submit">
                  Thay đổi
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
