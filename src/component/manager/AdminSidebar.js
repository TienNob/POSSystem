import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableBarIcon from "@mui/icons-material/TableBar";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">COFFEE POS</div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/adminHome">
            <DashboardIcon className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/productManagement">
            <LocalCafeIcon className="icon" /> Sản Phẩm
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/tableManagement">
            <TableBarIcon className="icon" /> Bàn
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
