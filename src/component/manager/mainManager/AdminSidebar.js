import React from "react";
import { NavLink, Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
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
        <NavLink
          className="sidebar-link"
          to="/adminHome"
          activeClassName="active-link"
        >
          <li className="sidebar-list-item">
            <DashboardIcon className="icon" /> Tổng quan
          </li>
        </NavLink>
        <NavLink
          className="sidebar-link"
          to="/productManagement"
          activeClassName="active-link"
        >
          <li className="sidebar-list-item">
            <LocalCafeIcon className="icon" /> Sản Phẩm
          </li>
        </NavLink>
        <NavLink
          className="sidebar-link"
          to="/tableManagement"
          activeClassName="active-link"
        >
          <li className="sidebar-list-item">
            <TableBarIcon className="icon" /> Bàn
          </li>
        </NavLink>
        <NavLink
          className="sidebar-link"
          to="/employeeManagement"
          activeClassName="active-link"
        >
          <li className="sidebar-list-item">
            <SupervisorAccountIcon className="icon" /> Nhân Viên
          </li>
        </NavLink>
        <NavLink
          className="sidebar-link"
          to="/customerManagement"
          activeClassName="active-link"
        >
          <li className="sidebar-list-item">
            <MoodIcon className="icon" /> Khách hàng
          </li>
        </NavLink>
        <NavLink
          className="sidebar-link"
          to="/suggestCombo"
          activeClassName="active-link"
        >
          <li className="sidebar-list-item">
            <LocalOfferIcon className="icon" /> Gợi ý
          </li>
        </NavLink>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
