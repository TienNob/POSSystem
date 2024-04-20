import React from "react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { pink } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Logout from "@mui/icons-material/Logout";
import { Drawer } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Nav.css";
import { LinkAPI } from "../../LinkAPI";
import TotalOder from "../TotalOder";
function Nav() {
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  const currentPath = window.location.pathname;
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullName, setFullName] = useState("");
  const [htmlData, setHtmlData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      navigate("/");
      return;
    }
    axios
      .get(`${LinkAPI}employees/account?account=${userName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFullName(res.data.fullName);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [navigate]);

  const handleGetHTML = () => {
    fetch(`${LinkAPI}orders/xuatHTML`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Network response was not ok.");
      })
      .then((htmlData) => {
        setHtmlData(htmlData);
        setModalIsOpen(true);
      })
      .catch((error) => {
        console.error("Error exporting Excel:", error);
      });
  };
  const handleExportExcel = () => {
    fetch(`${LinkAPI}orders/xuatExcel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
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
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);
        const hours = ("0" + currentDate.getHours()).slice(-2);
        const minutes = ("0" + currentDate.getMinutes()).slice(-2);
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
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");

    navigate("/");
  };
  const handleBack = () => {
    if (currentPath === "/tableList") {
      return;
    } else {
      navigate(-1);
    }
  };
  const open = Boolean(anchorEl);
  const handleClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenModal = useCallback(() => {
    handleGetHTML();
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  return (
    <div className="navBar">
      <Navbar className="bg-body-tertiary Nav">
        <Container fluid>
          <Navbar.Brand onClick={handleBack}>
            <ArrowBackIcon sx={{ fontSize: 30 }} className="NavBack" />
          </Navbar.Brand>
          <ShoppingBasketIcon
            className="nav-drawer_icon me-2"
            onClick={toggleDrawer(true)}
          />
          <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
            <TotalOder openDrawer={openDrawer} />
          </Drawer>

          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="d-flex">
              <Link className="nav-order" to="/history">
                <Button className="me-2" variant="primary">
                  Hoá đơn
                </Button>
              </Link>
              <Button onClick={handleOpenModal}>Xuất báo cáo ngày</Button>
              <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                <DialogContent>
                  {/* Render the HTML content inside a div */}
                  <div dangerouslySetInnerHTML={{ __html: htmlData }} />
                </DialogContent>
                <DialogActions>
                  <Button
                    className="buttonDisible"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Huỷ
                  </Button>
                  <Button onClick={handleExportExcel}>Xuất Excel</Button>
                </DialogActions>
              </Dialog>
              <Avatar
                className="ms-4 nav-avatar"
                onClick={handleClick}
                sx={{ width: 36, height: 36, bgcolor: pink[500] }}
              >
                {fullName[0]}
              </Avatar>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem className="blackColor" onClick={handleClose}>
          <Avatar /> {fullName}
        </MenuItem>

        <MenuItem onClick={handleLogout} className="blackColor">
          <Logout className="blackColor me-2" fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Nav;
