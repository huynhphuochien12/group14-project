import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ✅ Middleware xác thực token
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    console.log(`✅ Xác thực thành công: ${req.user.email} (role=${req.user.role})`);
    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Middleware chỉ cho phép admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ admin mới được phép truy cập" });
  }
};

// ✅ Middleware kiểm tra role linh hoạt - Advanced RBAC
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực người dùng" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Chỉ ${allowedRoles.join(", ")} mới được phép truy cập`,
        yourRole: req.user.role 
      });
    }

    console.log(`✅ Phân quyền thành công: ${req.user.email} (role=${req.user.role})`);
    next();
  };
};