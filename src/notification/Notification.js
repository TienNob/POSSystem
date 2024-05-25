// Notification.js
import { useEffect } from "react";
import { Alert } from "@mui/material";

function Notification({ open, severity, message, onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);
  const handleCloseAlert = () => {
    onClose();
  };

  return (
    <div>
      <Alert
        onClose={handleCloseAlert}
        className="alert-custom"
        severity={severity}
        variant="filled"
        sx={{ display: open ? "flex" : "none" }}
      >
        {message}
      </Alert>
    </div>
  );
}

export default Notification;
