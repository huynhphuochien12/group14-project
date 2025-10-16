import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";

function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // 🆕 Lưu khi login

  // 🟢 Lấy thông tin người dùng hiện tại
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setLoading(false);
    } catch (err) {
      console.error("❌ Lỗi khi tải thông tin cá nhân:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🟣 Cập nhật thông tin cá nhân
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/profile",
        { id: userId, name: user.name, email: user.email, password: newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ Cập nhật thông tin thành công!");
      setNewPassword("");
      fetchProfile();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      setMessage("❌ Cập nhật thất bại!");
    }
  };

  if (loading) return <p className="loading">⏳ Đang tải thông tin...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">👤 Thông tin cá nhân</h2>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label>Họ và tên:</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới (tùy chọn):</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới nếu muốn đổi"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-update">
            💾 Lưu thay đổi
          </button>
        </form>

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;
