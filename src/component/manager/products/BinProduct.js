import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Row, Button, Col } from "react-bootstrap";
import axios from "axios";
import { LinkAPI } from "../../../LinkAPI";
import Loadding from "../../../loadding/Loadding";
import Notification from "../../../notification/Notification";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Tooltip from "@mui/material/Tooltip";
import "../admin.css";

function BinProduct() {
  const [products, setProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const getLocalImageUrl = (localPath) => {
    try {
      return require(`../../../images${localPath.split("images")[1]}`);
    } catch (error) {
      console.error("Error loading local image:", error);
    }
  };

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

  const handleRevert = (id) => {
    setLoading(true);
    axios
      .get(`${LinkAPI}products/revert/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setProducts(products.filter((product) => product.id !== id));
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Khôi phục thành công!");
      })
      .catch((error) => {
        console.error("Error revert product data:", error);
        setShowAlert(true);
        setAlertSeverity("error");
        setAlertMessage("Xảy ra lỗi khi khôi phục sản phẩm!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ color: "white", width: "100%" }}
      >
        <h3 style={{ color: "white" }}>Thùng rác</h3>
        <Link to="/productManagement">
          <Tooltip title="Trở lại trang sản phẩm" arrow>
            <Button>
              <ChevronLeftIcon />
            </Button>
          </Tooltip>
        </Link>
      </div>
      <Container>
        <Row>
          {products.map((product) => (
            <Col className="mt-4" xs="6" md="4" lg="3">
              <Card className="card-fix">
                <Card.Img
                  className="admin-card_product"
                  height=""
                  variant="top"
                  src={getLocalImageUrl(product.linkLocal)}
                />
                <Card.Body className="card-body_fix">
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text className="blackColor">
                    Giá: {product.price}k
                  </Card.Text>
                  <Button
                    onClick={() => handleRevert(product.id)}
                    className="mt-1"
                  >
                    Khôi phục
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
    </div>
  );
}
export default BinProduct;
