const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// 🟢 Lấy thông tin cá nhân (GET /api/profile?id=...)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟣 Cập nhật thông tin cá nhân (PUT /api/profile)
router.put("/", async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    if (!id) return res.status(400).json({ message: "Missing user id" });

    const updateData = { name, email };
    if (password) updateData.password = password; // nếu có đổi mật khẩu

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
