import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export default function AdminUserList() {
  const { user: me, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });
  const [query, setQuery] = useState("");
  const { addToast } = useToast();

  // ✅ Lọc & sắp xếp (admin lên đầu)
  const filtered = users
    .filter((u) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      // Admin lên trước, moderator thứ 2, user cuối
      const roleOrder = { admin: 0, moderator: 1, user: 2 };
      return (roleOrder[a.role] || 3) - (roleOrder[b.role] || 3);
    });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      addToast(err.response?.data?.message || "Không thể tải danh sách users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((s) => s.filter((u) => u._id !== id));
      addToast("Đã xóa user", "success");
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Xóa thất bại", "error");
    }
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setEditData({ name: u.name, email: u.email, role: u.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", email: "", role: "" });
  };

  const saveEdit = async (id) => {
    try {
      // Moderator không được gửi field role
      const payload = { name: editData.name, email: editData.email };
      if (me?.role === "admin") {
        payload.role = editData.role;
      }
      
      const res = await api.put(`/users/${id}`, payload);
      setUsers((s) => s.map((u) => (u._id === id ? res.data.user : u)));
      cancelEdit();
      addToast("Cập nhật thành công", "success");
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Cập nhật thất bại", "error");
    }
  };

  const handleLogout = () => {
    logout();
    addToast("Đã đăng xuất", "success");
    window.location.href = "/login";
  };

  // 🎨 Badge role
  const getRoleBadge = (role) => {
    const badges = {
      admin: { emoji: "👑", color: "#dc2626" },
      moderator: { emoji: "🛡️", color: "#f59e0b" },
      user: { emoji: "👤", color: "#6b7280" },
    };
    const badge = badges[role] || badges.user;
    return (
      <span
        style={{
          marginLeft: 6,
          color: badge.color,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {badge.emoji}
      </span>
    );
  };

  return (
    <div className="app-container">
      {/* --- Header --- */}
      <div className="site-header">
        <h1 className="site-title">
          {me?.role === "admin" ? "👑 Trang quản trị" : "🛡️ Trang quản lý"}
        </h1>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {me?.name || "User"}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{me?.email}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", textTransform: "capitalize" }}>
            {me?.role}
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {/* Chỉ admin mới thấy nút thêm user */}
            {me?.role === "admin" && (
              <a
                href="/admin/add"
                className="btn secondary"
                style={{ textDecoration: "none", padding: "6px 10px" }}
              >
                ➕ Thêm user
              </a>
            )}

            {/* Nút đăng xuất */}
            <button
              className="btn danger"
              onClick={handleLogout}
              style={{
                padding: "6px 10px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* --- Nội dung bảng --- */}
      <div className="card">
        <div className="admin-toolbar">
          <h3>Danh sách người dùng ({users.length})</h3>
          <div className="admin-actions">
            <input
              className="search-input"
              placeholder="Tìm theo tên, email, hoặc role"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="muted">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="muted">Không tìm thấy user nào</p>
        ) : (
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th style={{ width: 220 }}>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ width: 220 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td style={{ wordBreak: "break-all", fontSize: 12 }}>
                      {u._id}
                    </td>

                    {/* --- Cột tên --- */}
                    <td>
                      {editingId === u._id ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="avatar">
                            {(u.name || "U")
                              .split(" ")
                              .map((s) => s[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>
                              {u.name}
                              {getRoleBadge(u.role)}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* --- Cột email --- */}
                    <td>
                      {editingId === u._id ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          style={{ width: "100%" }}
                        />
                      ) : (
                        u.email
                      )}
                    </td>

                    {/* --- Cột role --- */}
                    <td>
                      {editingId === u._id && me?.role === "admin" ? (
                        <select
                          value={editData.role}
                          onChange={(e) =>
                            setEditData({ ...editData, role: e.target.value })
                          }
                          style={{ width: "100%", padding: "4px" }}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          style={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                            color:
                              u.role === "admin"
                                ? "#dc2626"
                                : u.role === "moderator"
                                ? "#f59e0b"
                                : "#6b7280",
                          }}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* --- Cột hành động --- */}
                    <td>
                      {editingId === u._id ? (
                        <>
                          <button
                            className="action-btn edit small"
                            onClick={() => saveEdit(u._id)}
                            style={{ marginRight: 8 }}
                          >
                            Lưu
                          </button>
                          <button
                            className="action-btn small"
                            onClick={cancelEdit}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-btn edit small"
                            onClick={() => startEdit(u)}
                            style={{ marginRight: 8 }}
                          >
                            Sửa
                          </button>
                          {/* Chỉ admin mới thấy nút xóa */}
                          {me?.role === "admin" && (
                            <button
                              className="action-btn delete small"
                              onClick={() => handleDelete(u._id)}
                            >
                              Xóa
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
