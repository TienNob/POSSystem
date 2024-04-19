import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
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
const API_BASE_URL = "http://localhost:8080/auth/";

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
      axios.post(`${API_BASE_URL}addNewUser`, userData);
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
              value={userData.roles}
              onChange={handleChange}
              label="Role"
              name="roles"
            >
              <MenuItem value="ROLE_USER" sx={{ color: "black" }}>
                ROLE_USER
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
