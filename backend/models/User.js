const mongoose = require("mongoose");

// 🧱 Định nghĩa cấu trúc (schema) cho bảng "users"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true, // Không cho phép trùng email
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
  },
  { timestamps: true } // ✅ tự động thêm createdAt, updatedAt
);

// ✅ Xuất model để dùng ở controller
module.exports = mongoose.model("User", userSchema);
