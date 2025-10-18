const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { protect } = require("../midlleware/authMiddleware");

// 🟢 Lấy thông tin cá nhân (GET /api/profile) - yêu cầu token
router.get("/", protect, async (req, res) => {
  try {
    // protect middleware đã gán req.user (không có password)
    if (!req.user) return res.status(404).json({ message: "User not found" });
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟣 Cập nhật thông tin cá nhân (PUT /api/profile) - yêu cầu token
router.put("/", protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user._id;

    const updateData = { name, email };
    if (password) {
      // Hash password here because findByIdAndUpdate bypasses schema pre('save') middleware
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt); // nếu có đổi mật khẩu
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🛑 Xóa tài khoản của chính user (DELETE /api/profile) - yêu cầu token
router.delete("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Tài khoản đã được xóa" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
