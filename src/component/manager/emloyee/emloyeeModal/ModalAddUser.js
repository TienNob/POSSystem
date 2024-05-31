import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import { styled } from "@mui/material/styles";

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
import { LinkAPI } from "../../../../LinkAPI";
import PermissionModal from "./PermissionModal";
import Loadding from "../../../../loadding/Loadding";
import Notification from "../../../../notification/Notification";
const Modal = ({ open, onClose }) => {
  const token = localStorage.getItem("authToken");
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    cccd: "",
    phoneNumber: "",
    position: "",
    account: "",
    dob: null,
    address: "",
    gender: "",
  });
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionUserData, setPermissionUserData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [dataSelectScan, setDataSelectScan] = useState([]);
  const [loading, setLoading] = useState(false);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (dataSelectScan) {
      setEmployeeData((prevData) => ({
        ...prevData,
        cccd: dataSelectScan.id || prevData.cccd,
        fullName: dataSelectScan.name || prevData.fullName,
        gender: dataSelectScan.sex || prevData.gender,
        address: dataSelectScan.address || prevData.address,
        dob: dataSelectScan.dob || prevData.dob,
      }));
    }
  }, [dataSelectScan]);
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
    setLoading(true);

    try {
      console.log("Submit successfully", employeeData);
      await axios.post(`${LinkAPI}employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(() => {
        setLoading(false);

        setEmployeeData({
          fullName: "",
          cccd: "",
          phoneNumber: "",
          position: "",
          account: "",
          dob: null,
          address: "",
          gender: "",
        });
        onClose();
        window.location.reload();
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Thêm nhân viên thành công!");
      });
    } catch (error) {
      console.error("Error adding new employee:", error);
      setShowAlert(true);
      setAlertSeverity("error");
      setAlertMessage("Xảy ra lỗi khi thêm nhân viên!");
    }
  };

  const handleScanCCCD = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.fpt.ai/vision/idr/vnm`,
        formData,
        {
          headers: {
            "api-key": "0Y9OVgh0KAYI2K40coGev4JPiQG0ZAn6",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTimeout(() => {
        setLoading(false);
        const scannedData = response.data.data[0];
        if (scannedData.dob) {
          const [day, month, year] = scannedData.dob.split("/");
          scannedData.dob = `${year}-${month}-${day}`;
        }
        setDataSelectScan(scannedData);
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Quét CCCD thành công!");
      });
    } catch (error) {
      console.error("Error uploading image to FPT API:", error);
      setShowAlert(true);
      setAlertSeverity("error");
      setAlertMessage("Xảy ra lỗi khi tải lên hình ảnh!");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Thêm nhân viên
          <Button
            className="button-scan"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
          >
            <DocumentScannerIcon className="me-2" />
            Quét CCCD
            <VisuallyHiddenInput
              onChange={(e) => handleScanCCCD(e)}
              type="file"
            />
          </Button>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  InputLabelProps={dataSelectScan.name ? { shrink: true } : {}}
                  fullWidth
                  label="Họ và tên"
                  variant="outlined"
                  name="fullName"
                  value={employeeData.fullName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  InputLabelProps={dataSelectScan.sex ? { shrink: true } : {}}
                  fullWidth
                  label="Giới tính"
                  variant="outlined"
                  name="gender"
                  value={employeeData.gender}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={8}>
                <TextField
                  InputLabelProps={dataSelectScan.id ? { shrink: true } : {}}
                  fullWidth
                  label="CCCD"
                  variant="outlined"
                  name="cccd"
                  value={employeeData.cccd}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  name="dob"
                  value={employeeData.dob}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={
                    dataSelectScan.address ? { shrink: true } : {}
                  }
                  fullWidth
                  label="Địa chỉ"
                  variant="outlined"
                  name="address"
                  value={employeeData.address}
                  onChange={handleChange}
                  margin="normal"
                  required
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
                  required
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
                    required
                  >
                    <MenuItem value="Nhân viên" sx={{ color: "black" }}>
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
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <DialogActions>
                  <Button
                    className="buttonDisible"
                    variant="contained"
                    onClick={onClose}
                  >
                    Trở lại
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Thêm nhân viên
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        {loading && <Loadding />}
      </Dialog>
      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
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
