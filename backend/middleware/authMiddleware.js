import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ✅ Middleware xác thực token
export const protect = async (req, res, next) => {
  try {
    // Lấy header với nhiều cách (để tương thích)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      console.error("❌ Không có Authorization header");
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    // Trim và kiểm tra format
    const trimmedHeader = authHeader.trim();
    
    if (!trimmedHeader.startsWith("Bearer ")) {
      console.error("❌ Header không bắt đầu bằng 'Bearer ':", trimmedHeader.substring(0, 30));
      return res.status(401).json({ 
        message: "Token phải có format: Bearer <token>",
        received: trimmedHeader.substring(0, 30) + "..."
      });
    }

    // Split và lấy token (xử lý nhiều dấu cách)
    const parts = trimmedHeader.split(/\s+/);
    if (parts.length < 2) {
      console.error("❌ Header không có token sau 'Bearer'");
      return res.status(401).json({ 
        message: "Token không được tìm thấy sau 'Bearer'",
        header: trimmedHeader.substring(0, 30)
      });
    }

    const token = parts.slice(1).join(" "); // Join lại nếu token có dấu cách (mặc dù không nên)
    
    // Trim token để loại bỏ khoảng trắng thừa
    const cleanToken = token.trim();
    
    if (!cleanToken) {
      console.error("❌ Token rỗng sau khi trim");
      return res.status(401).json({ message: "Token rỗng" });
    }
    
    // Kiểm tra token có đầy đủ không (JWT thường có 3 phần ngăn cách bởi dấu chấm)
    const tokenParts = cleanToken.split(".");
    if (tokenParts.length !== 3) {
      console.error("❌ Token format không đúng:", {
        endpoint: req.originalUrl || req.url,
        method: req.method,
        parts: tokenParts.length,
        firstPart: tokenParts[0]?.substring(0, 20),
        tokenLength: cleanToken.length,
        hasToken: !!cleanToken
      });
      return res.status(401).json({ 
        message: "Token không đúng format. JWT phải có 3 phần ngăn cách bởi dấu chấm",
        tokenLength: cleanToken.length,
        tokenParts: tokenParts.length,
        example: "eyJhbGci... . eyJ1c2VySWQ... . signature..."
      });
    }

    // Kiểm tra JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET không được set!");
      return res.status(500).json({ message: "Lỗi cấu hình server: JWT_SECRET không được set" });
    }

    // Verify token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // Kiểm tra decoded có userId không
    if (!decoded.userId) {
      console.error("❌ Token không có userId:", decoded);
      return res.status(401).json({ message: "Token không hợp lệ: thiếu userId" });
    }

    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    console.log(`✅ Xác thực thành công: ${req.user.email} (role=${req.user.role})`);
    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error.name, error.message);
    
    // Phân loại lỗi cụ thể hơn
    let errorMessage = "Token không hợp lệ hoặc đã hết hạn";
    
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token đã hết hạn. Vui lòng đăng nhập lại hoặc refresh token";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = `Token không hợp lệ: ${error.message}`;
    } else if (error.name === "NotBeforeError") {
      errorMessage = "Token chưa có hiệu lực";
    }
    
    res.status(401).json({ 
      message: errorMessage,
      error: error.name,
      hint: "Hãy đăng nhập lại để lấy token mới",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined
    });
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