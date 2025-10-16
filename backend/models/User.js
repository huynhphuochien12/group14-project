

// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// // Định nghĩa schema người dùng
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true, // bỏ khoảng trắng dư
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6, // mật khẩu ít nhất 6 ký tự
//   },
// });

// // 🔒 Mã hóa mật khẩu trước khi lưu vào database
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Hàm so sánh mật khẩu khi login
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Định nghĩa schema người dùng
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// 🔒 Hash mật khẩu tự động trước khi lưu vào DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Hàm so sánh mật khẩu khi login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

