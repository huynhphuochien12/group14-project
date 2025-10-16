import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  // 🧩 Lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ➕ Thêm user mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    try {
      await axios.post("http://localhost:5000/api/users", form);
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  // ❌ Xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("Lỗi khi xóa user:", err);
      }
    }
  };

  // ✏️ Sửa user
  const handleEdit = async (user) => {
    const newName = prompt("Nhập tên mới:", user.name);
    const newEmail = prompt("Nhập email mới:", user.email);

    if (!newName || !newEmail) return alert("Không được để trống!");

    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        name: newName,
        email: newEmail,
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi sửa user:", err);
    }
  };

  return (
    <div className="app-container">
      <h2 className="main-title">📋 Quản lý người dùng (MongoDB + React)</h2>

      {/* Form thêm người dùng */}
      <div className="form-card">
        <h3>Thêm người dùng mới</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-add">
            + Thêm
          </button>
        </form>
      </div>

      {/* Danh sách người dùng */}
      <div className="list-card">
        <h3>Danh sách người dùng</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(u)}>
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty">
                  Chưa có người dùng nào 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
