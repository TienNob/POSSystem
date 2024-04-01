import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css"; // Import CSS file

import { Container, Card, Row, Button, Col, Modal } from "react-bootstrap";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { LinkAPI } from "../../LinkAPI";

function TableManagement() {
  const [showAddTable, setShowAddTable] = useState(false);
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({
    id: "",
    status: true,
  });
  console.log(tables);
  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await axios.get(`${LinkAPI}table`);
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    }
    fetchTables();
  }, []);
  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewTable({ ...newTable, id: parseInt(value) || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const filterTable = tables.filter((table) => table.id === newTable.id);

      console.log(filterTable);
      if (filterTable.length >= 1) {
        return alert("Bàn đã tồn tại");
      }
      const response = await axios.post(`${LinkAPI}table`, newTable);
      setTables([...tables, response.data]);
      setNewTable({ id: "", status: true });
      setShowAddTable(false);
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await axios.delete(`${LinkAPI}table/${tableId}`);
      setTables(tables.filter((table) => table.id !== tableId));
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center main-container">
      <h1 style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Quản lý bàn
      </h1>
      <div
        className="product-card-1 product-card mt-3 mb-1"
        onClick={() => setShowAddTable(true)}
      >
        <div className="card-btn-add me-2">
          <ControlPointIcon className="btn-add" />
        </div>
        <h5 className="mb-0"> Thêm bàn</h5>
      </div>

      <Container>
        <Row>
          {tables.map((table, i) => (
            <Col className="mt-4" xs="6" md="4" lg="3" key={table.id}>
              <Card className="card-fix">
                <Card.Body className="card-body_fix">
                  <Card.Title>Số bàn: {table.id}</Card.Title>

                  <Card.Text className="blackColor">
                    Trạng thái: {table.status}
                  </Card.Text>
                  <Button
                    className="me-2"
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    Xoá
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showAddTable} onHide={() => setShowAddTable(false)} centered>
        <Modal.Body>
          <div className="form-container">
            <h2>Thêm số bàn</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
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
