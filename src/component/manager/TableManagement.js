import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css"; // Import CSS file
import { Container, Modal, Card, Row, Button, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa"; // Import FaPlus icon
import { LinkAPI } from "../../LinkAPI";

function TableManagement() {
  const [showAddTable, setShowAddTable] = useState(false);
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({
    tableNumber: "",
    status: "",
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
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${LinkAPI}table`, newTable);
      setTables([...tables, response.data]);
      setNewTable({ tableNumber: "", status: "" });
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
    <div className="d-flex flex-column align-items-center">
      <h1 style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Quản lý số bàn
      </h1>
      <div
        className="product-card-1 product-card mt-3 mb-1"
        onClick={() => setShowAddTable(true)}
      >
        <div className="card-btn-add me-2">
          <FaPlus className="btn-add" />
        </div>
        <h5 className="mb-0"> Thêm số bàn</h5>
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
                type="text"
                name="tableNumber"
                value={newTable.tableNumber}
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
