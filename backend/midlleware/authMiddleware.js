const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token, từ chối truy cập" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user tương ứng
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    next(); // tiếp tục qua controller
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ", error: err.message });
  }
};