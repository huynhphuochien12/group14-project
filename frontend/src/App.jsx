// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProfilePage from "./components/profile/ProfilePage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AdminUserList from "./components/admin/AdminUserList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🏠 Trang chính */}
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center", marginTop: "60px" }}>
                <h1>🧑‍💻 Ứng dụng Quản lý Người dùng</h1>
                <p>Hãy đăng nhập để xem hoặc cập nhật thông tin cá nhân</p>
                <a href="/login" style={{ marginRight: "15px" }}>
                  👉 Đăng nhập
                </a>
                <a href="/register">✍️ Đăng ký</a>
              </div>
            }
          />

          {/* 🔐 Đăng nhập */}
          <Route path="/login" element={<LoginForm />} />

          {/* 📝 Đăng ký */}
          <Route path="/register" element={<RegisterForm />} />

          {/* 👤 Hồ sơ cá nhân */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ⚙️ Quản trị (chỉ dành cho admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
