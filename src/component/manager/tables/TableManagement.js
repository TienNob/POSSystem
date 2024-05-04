import React, { useState, useEffect } from "react";
import axios from "axios";
import "../admin.css";

import { Container, Card, Row, Button, Col, Modal } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { LinkAPI } from "../../../LinkAPI";

function TableManagement() {
  const [showAddTable, setShowAddTable] = useState(false);
  const [tables, setTables] = useState([]);
  const token = localStorage.getItem("authToken");

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

    try {
      const filterTable = tables.filter((table) => table.id === newTable.id);

      console.log(filterTable);
      if (filterTable.length >= 1) {
        return alert("Bàn đã tồn tại");
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
      console.log(response);

      setTables([...tables, newTable]);
      setNewTable({ id: "", status: true });
      setShowAddTable(false);
    } catch (error) {
      console.error("Error adding table:", error);
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
    } catch (error) {
      console.error("Error deleting table:", error);
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
