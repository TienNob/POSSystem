import React, { useState, useEffect } from "react";
import axios from "axios";
import "../admin.css";
import Notification from "../../../notification/Notification";
import { Container, Card, Row, Button, Col, Modal } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import Loadding from "../../../loadding/Loadding";
import { LinkAPI } from "../../../LinkAPI";

function TableManagement() {
  const [showAddTable, setShowAddTable] = useState(false);
  const [tables, setTables] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);

  const [newTable, setNewTable] = useState({
    id: "",
    status: true,
  });

  console.log(tables);
  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await axios.get(`${LinkAPI}table`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    }
    fetchTables();
  }, [token]);
  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewTable({ ...newTable, id: parseInt(value) || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filterTable = tables.filter((table) => table.id === newTable.id);

      console.log(filterTable);
      if (filterTable.length >= 1) {
        setShowAlert(true);
        setAlertSeverity("warning");
        setAlertMessage("Bàn đã tồn tại!");
        return;
      }
      console.log(newTable.id);
      const response = await axios.post(
        `${LinkAPI}table/${newTable.id}`,
        newTable,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeout(() => {
        setLoading(false);

        setTables([...tables, newTable]);
        setNewTable({ id: "", status: true });
        setShowAddTable(false);
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Thêm bàn thành công!");
      });
    } catch (error) {
      console.error("Error adding table:", error);
      setShowAlert(true);

      setAlertSeverity("error");
      setAlertMessage("xảy ra lỗi khi thêm bàn!");
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await axios.delete(`${LinkAPI}table/${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTables(tables.filter((table) => table.id !== tableId));
      setShowAlert(true);
      setAlertSeverity("success");
      setAlertMessage("Xoá bàn thành công!");
    } catch (error) {
      console.error("Error deleting table:", error);
      setShowAlert(true);
      setAlertSeverity("error");
      setAlertMessage("xảy ra lỗi khi xoá bàn!");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ color: "white", width: "100%" }}
      >
        <h3 style={{ color: "white" }}>Quản lý Bàn</h3>

        <Button onClick={() => setShowAddTable(true)}>
          <AddIcon className="me-1" />
          Thêm bàn
        </Button>
      </div>

      <Container>
        <Row>
          {tables.map((table, i) => (
            <Col className="mt-4" xs="4" md="3" lg="3" key={table.id}>
              <Card className="card-fix">
                <Card.Body className="card-body_fix">
                  <Card.Title>Số bàn: {table.id}</Card.Title>

                  <Button
                    className="me-2 mt-4"
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    Xoá
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {loading && <Loadding />}
      </Container>
      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
      <Modal show={showAddTable} onHide={() => setShowAddTable(false)} centered>
        <Modal.Body>
          <div className="form-container">
            <h2>Thêm số bàn</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="phone"
                value={newTable.id}
                placeholder="Số bàn"
                onChange={handleInputChange}
              />

              <div className="btn-form">
                <button className="me-2" type="submit">
                  Thêm số bàn
                </button>
                <button type="button" onClick={() => setShowAddTable(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TableManagement;
