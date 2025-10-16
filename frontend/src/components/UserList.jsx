import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Quản lý người dùng</h1>

      <div style={styles.card}>
        <h2 style={styles.subtitle}>Danh sách người dùng</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "80px" }}>ID</th>
              <th style={{ ...styles.th, width: "200px" }}>Tên</th>
              <th style={{ ...styles.th, width: "300px" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={styles.empty}>
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

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    padding: "40px",
  },
  title: {
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    padding: "24px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  subtitle: {
    color: "#374151",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate", // tách ô ra để tạo khoảng trắng
    borderSpacing: "10px 10px", // 👉 10px giữa cột và hàng
    tableLayout: "fixed",
  },
  th: {
    backgroundColor: "#677288ff",
    color: "white",
    padding: "12px 18px",
    textAlign: "left",
    borderRadius: "6px",
  },
  tr: {
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
  },
  td: {
    padding: "12px 18px",
    backgroundColor: "white", // giúp tách ô nổi bật hơn
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#6b7280",
    fontStyle: "italic",
  },
};

export default UserList;