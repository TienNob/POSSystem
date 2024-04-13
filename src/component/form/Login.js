import React, { useState, useEffect } from "react";
import axios from "axios";

import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8080/auth";

  const handleSubmit = (event) => {
    event.preventDefault();

    // Sau khi tạo người dùng thành công, gửi yêu cầu đăng nhập
    const loginData = {
      username: username,
      password: password,
    };
    console.log(loginData);
    axios
      .post(`${API_BASE_URL}/Token`, loginData)
      .then((loginResponse) => {
        console.log("Đăng nhập thành công:", loginResponse.data);

        // Lưu token vào localStorage
        const token = loginResponse.data;
        localStorage.setItem("authToken", token);
        console.log("Token đã được lưu trong localStorage:", token);

        // Điều hướng đến trang danh sách sản phẩm
        navigate("/productlist");
      })
      .catch((loginError) => {
        console.error("Lỗi khi đăng nhập:", loginError);
      });

    // Thêm interceptor để thêm token vào tiêu đề Authorization
  };
  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("authToken");

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      // Điều hướng người dùng đến trang đăng nhập hoặc xử lý lỗi khác
      navigate("/login");
    }

    // Thêm token vào axios
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
  }, [navigate]);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Tên đăng nhập</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Đăng nhập
      </Button>
    </Form>
  );
}

export default Login;
