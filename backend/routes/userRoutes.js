const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// 📍 Lấy danh sách tất cả người dùng
router.get("/", getUsers);

// ➕ Tạo người dùng mới
router.post("/", createUser);

// ✏️ Cập nhật thông tin người dùng theo ID
router.put("/:id", updateUser);

// ❌ Xóa người dùng theo ID
router.delete("/:id", deleteUser);

module.exports = router;
