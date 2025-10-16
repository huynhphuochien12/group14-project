import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/register", form);
    alert("Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div>
      <h2>📝 Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default RegisterForm;
