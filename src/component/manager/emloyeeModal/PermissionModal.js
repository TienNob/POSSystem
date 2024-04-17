import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const PermissionModal = ({ open, onClose }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    roles: "ROLE_USER", // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submit successfully", userData);
      setUserData({
        username: "",
        password: "",
        roles: "ROLE_USER",
      });

      onClose();
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cấp quyền</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Tên tài khoản"
            variant="outlined"
            name="username"
            value={userData.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            variant="outlined"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Quyền</InputLabel>
            <Select
              value={userData.role}
              onChange={handleChange}
              label="Role"
              name="role"
            >
              <MenuItem value="ROLE_USER" sx={{ color: "black" }}>
                ROLE_USER
              </MenuItem>
              <MenuItem value="ROLE_ADMIN" sx={{ color: "black" }}>
                ROLE_ADMIN
              </MenuItem>
              <MenuItem value="ROLE_STAFF" sx={{ color: "black" }}>
                ROLE_STAFF
              </MenuItem>
            </Select>
          </FormControl>
          <DialogActions>
            <Button type="submit" sx={{ color: "white" }}>
              Xác nhận
            </Button>
            <Button onClick={onClose} sx={{ color: "white" }}>
              Trở lại
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

PermissionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PermissionModal;
