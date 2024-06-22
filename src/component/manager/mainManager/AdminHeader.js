import React from "react";
import { useState } from "react";
import { pink } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";

function AdminHome({ OpenSidebar }) {
  const userName = localStorage.getItem("userName");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");

    navigate("/");
  };
  const handleSell = () => {
    navigate("/tableList");
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <FormatAlignJustifyIcon className="icon" onClick={OpenSidebar} />
      </div>

      <div className="header-right d-flex">
        <Avatar
          className="ms-4 nav-avatar"
          onClick={handleClick}
          sx={{ width: 36, height: 36, bgcolor: pink[500] }}
        >
          {userName[0]}
        </Avatar>{" "}
      </div>
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
        <MenuItem className="blackColor" sx={{ pr: 8 }} onClick={handleClose}>
          <Avatar /> {userName}
        </MenuItem>
        <MenuItem className="blackColor" sx={{ pr: 8 }} onClick={handleSell}>
          <StorefrontIcon className="blackColor me-2" fontSize="small" />
          Bán hàng
        </MenuItem>
        <MenuItem onClick={handleLogout} className="logout-btn" sx={{ pr: 8 }}>
          <Logout className=" logout-btn me-2" fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </header>
  );
}

export default AdminHome;
