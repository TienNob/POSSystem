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
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const currentDate = new Date(Date.now());
        const year = currentDate.getFullYear();
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        const day = ('0' + currentDate.getDate()).slice(-2);
        const hours = ('0' + currentDate.getHours()).slice(-2);
        const minutes = ('0' + currentDate.getMinutes()).slice(-2);
        const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}`;
        a.download = "DoanhThu_" + formattedDate + ".xlsx";
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
