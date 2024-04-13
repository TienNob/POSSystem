// Trong AdminController.js
import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import PeopleIcon from "@mui/icons-material/People"; // Icon cho trang quản lý nhân viên
import { Link } from "react-router-dom";

function AdminController() {
  const actions = [
    {
      icon: (
          <Link to="productManagement">
            <LocalCafeIcon />
          </Link>
      ),
      name: "Quản lý sản phẩm",
    },
    {
      icon: (
          <Link to="tableManagement">
            <TableRestaurantIcon />
          </Link>
      ),
      name: "Quản lý bàn",
    },
    {
      icon: (
          <Link to="employeeManagement">
            <PeopleIcon />
          </Link>
      ),
      name: "Quản lý nhân viên",
    },
  ];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
      <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          sx={{ position: "absolute", bottom: 16, left: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
      >
        {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={handleClose}
            />
        ))}
      </SpeedDial>
  );
}
export default AdminController;
