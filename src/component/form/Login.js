import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "./login.css";
import Notification from "../../notification/Notification";
import Loadding from "../../loadding/Loadding";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8080/auth/";

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Sau khi tạo người dùng thành công, gửi yêu cầu đăng nhập
    const loginData = {
      username: username,
      password: password,
    };
    axios
      .post(`${API_BASE_URL}Token`, loginData)
      .then((loginResponse) => {
        // Lưu token vào localStorage
        const token = loginResponse.data;
        localStorage.removeItem("authToken");
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", loginData.username);
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Đăng nhập thành công!");
        setTimeout(() => {
          setLoading(false);
          if (loginData.username === "admin") {
            navigate("/adminHome");
          } else {
            navigate("/tableList");
          }
        }, 500);
      })
      .catch((loginError) => {
        setShowAlert(true);
        setAlertSeverity("warning");
        setAlertMessage(
          "Tên đăng nhập hoặc mật khẩu chưa đúng, vui lòng nhập lại!"
        );
        console.error("Lỗi khi đăng nhập:", loginError);
        setLoading(false);
      });
    const token = localStorage.getItem("authToken");
    // Lấy token từ localStorage

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      // Điều hướng người dùng đến trang đăng nhập hoặc xử lý lỗi khác
      navigate("/");
    }
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log(
            "Tiêu đề Authorization được thêm:",
            config.headers.Authorization
          );
        }
        return config;
      },
      (error) => {
        // Xử lý lỗi, nếu có
        return Promise.reject(error);
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        className="login-form"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            className="login-name"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Tên đăng nhập"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            className="login-name"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Ghi nhớ tài khoản"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
          {loading && <Loadding />}
        </Box>
      </Box>
      <Notification
        open={showAlert}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
}

export default Login;
