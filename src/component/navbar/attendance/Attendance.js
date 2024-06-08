import React, { useCallback, useRef, useState } from "react";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import Button from "react-bootstrap/Button";

import Webcam from "react-webcam";
import axios from "axios";
import { LinkAPI } from "../../../LinkAPI";
import Notification from "../../../notification/Notification";
const Attendance = ({ token, open, onClose }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // Send the captured image to the backend
    const formData = new FormData();
    formData.append("file", imageSrc);
    // axios
    //   .post(`${LinkAPI}attendance/submit`, formData, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((response) => {
    //     setAlertSeverity("success");
    //     setAlertMessage("Điểm danh thành công!");
    //   })
    //   .catch((error) => {
    //     setAlertSeverity("error");
    //     setAlertMessage("Điểm danh không thành công!");
    //   })
    //   .finally(() => {
    //     setShowAlert(true);
    //     onClose();
    //   });
  }, [webcamRef, token, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
        {imgSrc && (
          <div>
            <img src={imgSrc} alt="Captured" />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={capture}>Xác nhận</Button>
      </DialogActions>
      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </Dialog>
  );
};

export default Attendance;
