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
      <div className="sidebar-title d-flex justify-content-between ">
        <div className="sidebar-brand">COFFEE POS</div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <Link className="sidebar-link" to="/adminHome">
          <li className="sidebar-list-item">
            <DashboardIcon className="icon" /> Dashboard
          </li>
        </Link>
        <Link className="sidebar-link" to="/productManagement">
          <li className="sidebar-list-item">
            <LocalCafeIcon className="icon" /> Sản Phẩm
          </li>
        </Link>
        <Link className="sidebar-link" to="/tableManagement">
          <li className="sidebar-list-item">
            <TableBarIcon className="icon" /> Bàn
          </li>
        </Link>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
