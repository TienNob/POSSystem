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
import Loadding from "../../../../loadding/Loadding";
import { LinkAPI } from "../../../../LinkAPI";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../chat/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

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
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "password" && value.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const checkUserExists = async (username) => {
    try {
      const response = await axios.get(`${LinkAPI}employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const employees = response.data;
      return employees.some((employee) => employee.account === username);
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userExists = await checkUserExists(userData.username);
      if (userExists) {
        setLoading(false);
        setShowAlert(true);
        setAlertSeverity("error");
        setAlertMessage("Tài khoản đã tồn tại!");
        return;
      }

      const res = await createUserWithEmailAndPassword(
        auth,
        `${userData.username}@gmail.com`,
        userData.password
      );
      console.log(res);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username: userData.username,
      });

      // create empty user chats on firestore
      await setDoc(doc(db, "userChats", res.user.uid), {});
      axios.post(`${API_BASE_URL}addNewUser`, userData);
      setUserData({
        username: "",
        password: "",
        roles: "ROLE_USER",
      });
      setTimeout(() => {
        setLoading(false);

        setPermissionUserData(userData);
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Cấp tài khoản thành công!");
        onClose();
      });
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
            error={passwordError}
            helperText={
              passwordError ? "Vui lòng nhập mật khẩu có ít nhất 6 ký tự!" : ""
            }
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
      {loading && <Loadding />}

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
