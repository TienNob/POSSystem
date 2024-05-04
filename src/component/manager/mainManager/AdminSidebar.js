import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableBarIcon from "@mui/icons-material/TableBar";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MoodIcon from "@mui/icons-material/Mood";
import Logo from "../../../logo.png";

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title d-flex justify-content-between ">
        <Link to="/adminHome">
          <img width="100px" src={Logo} alt="" />
        </Link>
        <div className="sidebar-brand"></div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <Link className="sidebar-link" to="/adminHome">
          <li className="sidebar-list-item">
            <DashboardIcon className="icon" /> Tổng quan
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
        <Link className="sidebar-link" to="/employeeManagement">
          <li className="sidebar-list-item">
            <SupervisorAccountIcon className="icon" /> Nhân Viên
          </li>
        </Link>
        <Link className="sidebar-link" to="/customerManagement">
          <li className="sidebar-list-item">
            <MoodIcon className="icon" /> Khách hàng
          </li>
        </Link>
      </ul>
    </aside>
  );
}

export default AdminSidebar;