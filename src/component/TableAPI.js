import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { LinkAPI } from "../LinkAPI";
import { Card, Container, Row, Col } from "react-bootstrap";
import TotalOder from "./TotalOder";
import "../App.css";

function TableList() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ API
    axios
      .get(`${LinkAPI}table`)
      .then((res) => {
        // Lấy dữ liệu từ localStorage
        const storedProductsByTable =
          JSON.parse(localStorage.getItem("selectedProductsByTable")) || {};

        // Cập nhật trạng thái của mỗi bàn dựa trên sản phẩm được lưu trong localStorage
        const updatedTables = res.data.map((table) => ({
          ...table,
          status:
            storedProductsByTable[table.id] &&
            storedProductsByTable[table.id].length > 0,
        }));

        setTables(updatedTables);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu bàn:", error);
      });
  }, []);

  const handleTableClick = (tableID) => {
    localStorage.setItem("selectedTableID", tableID); // Lưu ID của bàn vào local storage
  };
  return (
    <Container>
      <Row>
        {tables.map((table) => (
          <Col key={table.id} lg="4" className="mt-4">
            <Link
              to="/productlist"
              className="tableOder"
              onClick={() => handleTableClick(table.id)}
            >
              <Card
                className="cardList"
                style={{ width: "100%", height: "12rem" }}
              >
                <Card.Body className=" d-flex flex-column justify-content-between">
                  <Card.Title className="cardList">Bàn {table.id}</Card.Title>
                  <Card.Text className="cardList">
                    Trạng thái
                    <BsArrowRight className="ms-1" size={"18px"} />{" "}
                    <span
                      style={{
                        color: table.status ? "#a72a56" : "#2d5f37",
                        fontWeight: "bold",
                      }}
                    >
                      {table.status === true ? "Có khách" : "Trống"}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <TotalOder />
    </Container>
  );
}

export default TableList;
