import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Vui lòng điền đủ thông tin', 'warning');
      return;
    }
    if (password.length < 6) {
      addToast('Mật khẩu phải có ít nhất 6 ký tự', 'warning');
      return;
    }

    api.post("/users", { name, email, password, role })
      .then((res) => {
        const roleText = role === "admin" ? "Admin" : role === "moderator" ? "Moderator" : "User";
        addToast(`✅ Tạo user "${name}" (${roleText}) thành công!`, 'success');
        // Đợi một chút để user thấy thông báo trước khi redirect
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        addToast(err.response?.data?.message || '❌ Lỗi khi tạo user', 'error');
      });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Thêm người dùng mới</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Quyền</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="center">
            <button className="btn" type="submit">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
