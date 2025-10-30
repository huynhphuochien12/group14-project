import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/slices/authSlice";

/**
 * Protected Route Component using Redux
 * Chặn truy cập nếu chưa đăng nhập hoặc không đủ quyền
 */
export default function ProtectedRouteRedux({ 
  children, 
  requiredRole,
  requiredRoles 
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Chưa đăng nhập → Redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền (single role)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>⛔ Không có quyền truy cập</h2>
        <p>Bạn cần quyền <strong>{requiredRole}</strong> để xem trang này.</p>
        <a href="/profile" style={{ color: "#4f46e5" }}>Quay lại trang cá nhân</a>
      </div>
    );
  }

  // Kiểm tra quyền (multiple roles)
  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>⛔ Không có quyền truy cập</h2>
        <p>Bạn cần một trong các quyền sau: <strong>{requiredRoles.join(", ")}</strong></p>
        <a href="/profile" style={{ color: "#4f46e5" }}>Quay lại trang cá nhân</a>
      </div>
    );
  }

  return children;
}

