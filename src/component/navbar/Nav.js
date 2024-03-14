import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import "./Nav.css";
import { LinkAPI } from "../../LinkAPI";

function Nav() {
  const handleExportExcel = () => {
    fetch(`${LinkAPI}orders/xuatExcel`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Network response was not ok.");
      })
      .then((blob) => {
        // Create object URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const a = document.createElement("a");
        a.href = url;

        a.download = "DoanhThu" + Date.now().toString() + ".xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error exporting Excel:", error);
      });
  };

  return (
    <div className="navBar">
      <Navbar className="bg-body-tertiary Nav">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <BsArrowLeftShort size={"40px"} />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Link to="/history">
                <Button className="me-2" variant="primary">
                  Hoá đơn
                </Button>
              </Link>
              <Button onClick={handleExportExcel}>Xuất báo cáo ngày</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Nav;
