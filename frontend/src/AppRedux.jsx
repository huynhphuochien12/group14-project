// src/AppRedux.jsx - Redux Version
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restoreSession } from "./store/slices/authSlice";
import { ToastProvider } from "./contexts/ToastContext";
import LoginFormRedux from "./components/auth/LoginFormRedux";
import RegisterFormRedux from "./components/auth/RegisterFormRedux";
import ProfilePage from "./components/profile/ProfilePage";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import ProtectedRouteRedux from "./components/shared/ProtectedRouteRedux";
import AdminUserList from "./components/admin/AdminUserList";
import AdminLogs from "./components/admin/AdminLogs";
import HomePage from "./pages/HomePage";
import AddUser from "./components/AddUser";

function AppRedux() {
  const dispatch = useDispatch();

  // Restore session from localStorage on app load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* 🏠 Trang chính */}
          <Route path="/" element={<HomePage />} />

          {/* 🔐 Đăng nhập */}
          <Route path="/login" element={<LoginFormRedux />} />

          {/* 🔑 Quên mật khẩu */}
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />

          {/* 📝 Đăng ký */}
          <Route path="/signup" element={<RegisterFormRedux />} />

          {/* 👤 Hồ sơ cá nhân - Protected */}
          <Route
            path="/profile"
            element={
              <ProtectedRouteRedux>
                <ProfilePage />
              </ProtectedRouteRedux>
            }
          />

          {/* ⚙️ Quản trị (Admin & Moderator) - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRouteRedux requiredRoles={["admin", "moderator"]}>
                <AdminUserList />
              </ProtectedRouteRedux>
            }
          />

          {/* ➕ Thêm user (chỉ Admin) - Protected */}
          <Route
            path="/admin/add"
            element={
              <ProtectedRouteRedux requiredRole="admin">
                <AddUser />
              </ProtectedRouteRedux>
            }
          />

          {/* 📊 User Activity Logs (chỉ Admin) - Protected */}
          <Route
            path="/admin/logs"
            element={
              <ProtectedRouteRedux requiredRole="admin">
                <AdminLogs />
              </ProtectedRouteRedux>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default AppRedux;

