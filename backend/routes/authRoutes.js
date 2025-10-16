const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const router = express.Router();

// Đăng ký tài khoản
router.post("/signup", signup);

// Đăng nhập
router.post("/login", login);

// Đăng xuất
router.post("/logout", logout);

const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/authController");

router.get("/profile", protect, getProfile);  // Xem thông tin
router.put("/profile", protect, updateProfile);  // Cập nhật thông tin


module.exports = router;
