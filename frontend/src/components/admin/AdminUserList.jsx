import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const AdminUserList = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>👑 Trang quản trị</h2>
      <p>Xin chào, {user?.name || "Admin"}!</p>
      <p>Đây là khu vực quản trị dành riêng cho admin.</p>
    </div>
  );
};

export default AdminUserList;
