import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api"; // axios có baseURL: http://localhost:5000/api

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🟢 Gọi API đăng nhập
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // ✅ Lưu token và userId vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id || user.id);

      // Nếu dùng Context thì vẫn giữ lại
      login(token, user);

      setMessage("✅ Đăng nhập thành công!");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setMessage(err.response?.data?.message || "❌ Đăng nhập thất bại!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
