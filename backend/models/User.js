<<<<<<< HEAD
=======
// const mongoose = require("mongoose");

// // Định nghĩa cấu trúc (schema) cho bảng "users"
// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Tên là bắt buộc"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email là bắt buộc"],
//       unique: true, // không trùng lặp email
//       trim: true,
//       lowercase: true,
//       match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
//     },
//   },
//   { timestamps: true } // tự động thêm createdAt, updatedAt
// );

// // Xuất model để có thể import ở nơi khác (vd: userRoutes.js)
// module.exports = mongoose.model("User", userSchema);
>>>>>>> afb139a6b57fc65949e733b4c16575b95c313fd0
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
