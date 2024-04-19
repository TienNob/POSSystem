import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { LinkAPI } from "../../../LinkAPI";
import PermissionModal from "./PermissionModal";
const token = localStorage.getItem("authToken");
const Modal = ({ open, onClose }) => {
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    cccd: "",
    phoneNumber: "",
    position: "",
    account: "",
    dob: null,
  });
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionUserData, setPermissionUserData] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (permissionUserData) {
      setEmployeeData((prevData) => ({
        ...prevData,
        account: permissionUserData.username,
      }));
    }
  }, [permissionUserData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submit successfully", employeeData);
      await axios.post(`${LinkAPI}employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployeeData({
        fullName: "",
        cccd: "",
        phoneNumber: "",
        position: "",
        account: "",
        dob: null,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding new employee:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Thêm nhân viên</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  variant="outlined"
                  name="fullName"
                  value={employeeData.fullName}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="CCCD"
                  variant="outlined"
                  name="cccd"
                  value={employeeData.cccd}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  variant="outlined"
                  name="phoneNumber"
                  value={employeeData.phoneNumber}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Vị trí</InputLabel>
                  <Select
                    value={employeeData.position}
                    onChange={handleChange}
                    label="Position"
                    name="position"
                    sx={{ color: "black" }}
                  >
                    <MenuItem value="Manager" sx={{ color: "black" }}>
                      Quản lý
                    </MenuItem>
                    <MenuItem value="Supervisor" sx={{ color: "black" }}>
                      Cửa hàng trưởng
                    </MenuItem>
                    <MenuItem value="Staff" sx={{ color: "black" }}>
                      Nhân viên
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  onClick={() => setPermissionModalOpen(true)}
                  fullWidth
                  label="Tên tài khoản"
                  variant="outlined"
                  name="account"
                  value={permissionUserData ? permissionUserData.username : ""}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  name="dob"
                  value={
                    employeeData.dob
                      ? new Date(employeeData.dob).toISOString().substr(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <DialogActions>
                  <Button type="submit" variant="contained" color="primary">
                    Thêm nhân viên
                  </Button>
                  <Button variant="contained" onClick={onClose}>
                    Trở lại
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <PermissionModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        setPermissionUserData={setPermissionUserData}
      />
    </>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
