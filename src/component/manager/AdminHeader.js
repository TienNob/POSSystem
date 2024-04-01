import React from "react";

import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";

function AdminHome({ OpenSidebar }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <FormatAlignJustifyIcon className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <SearchIcon className="icon" />
      </div>
      <div className="header-right">
        <NotificationsIcon className="icon" />
        <MailOutlineIcon className="icon" />
        <AccountCircleIcon className="icon" />
      </div>
    </header>
  );
}

export default AdminHome;
