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
} from "@mui/material";
import Notification from "../../../../notification/Notification";

const API_BASE_URL = "http://localhost:8080/auth/";

const PermissionModal = ({ open, onClose, setPermissionUserData }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    roles: "ROLE_USER", // Default role
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

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
      axios.post(`${API_BASE_URL}addNewUser`, userData);
      setUserData({
        username: "",
        password: "",
        roles: "ROLE_USER",
      });
      setPermissionUserData(userData);
      setShowAlert(true);
      setAlertSeverity("success");
      setAlertMessage("Cấp tài khoản thành công!");
      onClose();
    } catch (error) {
      console.error("Error adding new user:", error);
      setShowAlert(true);
      setAlertSeverity("error");
      setAlertMessage("Xảy ra lỗi khi cấp tài khoản!");
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
            required
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
            required
          />

          <DialogActions>
            <Button
              className="buttonDisible"
              onClick={onClose}
              sx={{ color: "white" }}
            >
              Trở lại
            </Button>
            <Button type="submit" sx={{ color: "white" }}>
              Xác nhận
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </Dialog>
  );
};

PermissionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PermissionModal;
