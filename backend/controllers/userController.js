// // // // controllers/userController.js

// // // const User = require("../models/User");

// // // // GET /api/users
// // // exports.getUsers = async (req, res) => {
// // //   try {
// // //     const users = await User.find(); // lấy tất cả user từ MongoDB
// // //     res.json(users);
// // //   } catch (err) {
// // //     console.error("❌ Lỗi khi lấy danh sách user:", err);
// // //     res.status(500).json({ message: "Lỗi server" });
// // //   }
// // // };

// // // // POST /api/users
// // // exports.createUser = async (req, res) => {
// // //   try {
// // //     const { name, email } = req.body;

// // //     // Validation cơ bản
// // //     if (!name || !email) {
// // //       return res.status(400).json({ message: "Tên và email là bắt buộc" });
// // //     }

// // //     const newUser = new User({ name, email });
// // //     await newUser.save();

// // //     res.status(201).json(newUser);
// // //   } catch (err) {
// // //     console.error("❌ Lỗi khi tạo user:", err);

// // //     // Nếu lỗi do trùng email, báo lỗi cụ thể
// // //     if (err.code === 11000) {
// // //       return res.status(400).json({ message: "Email đã tồn tại" });
// // //     }

// // //     res.status(500).json({ message: "Lỗi khi tạo user", error: err.message });
// // //   }
// // // };
// // // ``
// // // controllers/userController.js
// // const User = require("../models/User");

// // // GET /api/users
// // exports.getUsers = async (req, res) => {
// //   try {
// //     const users = await User.find();
// //     res.json(users);
// //   } catch (err) {
// //     console.error("❌ Lỗi khi lấy danh sách user:", err);
// //     res.status(500).json({ message: "Lỗi server" });
// //   }
// // };

// // // POST /api/users
// // exports.createUser = async (req, res) => {
// //   try {
// //     const { name, email } = req.body;
// //     if (!name || !email)
// //       return res.status(400).json({ message: "Tên và email là bắt buộc" });

// //     const newUser = new User({ name, email });
// //     await newUser.save();
// //     res.status(201).json(newUser);
// //   } catch (err) {
// //     console.error("❌ Lỗi khi tạo user:", err);
// //     if (err.code === 11000)
// //       return res.status(400).json({ message: "Email đã tồn tại" });

// //     res.status(500).json({ message: "Lỗi khi tạo user", error: err.message });
// //   }
// // };

// // // ✅ PUT /api/users/:id — cập nhật user
// // exports.updateUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
// //     if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy user" });
// //     res.json(updatedUser);
// //   } catch (err) {
// //     console.error("❌ Lỗi khi cập nhật user:", err);
// //     res.status(500).json({ message: "Lỗi server" });
// //   }
// // };

// // // ✅ DELETE /api/users/:id — xóa user
// // exports.deleteUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const deletedUser = await User.findByIdAndDelete(id);
// //     if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy user" });
// //     res.json({ message: "Đã xóa user thành công" });
// //   } catch (err) {
// //     console.error("❌ Lỗi khi xóa user:", err);
// //     res.status(500).json({ message: "Lỗi server" });
// //   }
// // };

// const User = require("../models/userModel");

// // [GET] /api/users
// const getUsers = async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// };

// // [POST] /api/users
// const createUser = async (req, res) => {
//   const { name, email } = req.body;
//   const user = await User.create({ name, email });
//   res.status(201).json(user);
// };

// module.exports = { getUsers, createUser };

const User = require("../models/userModel");

// PUT: update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE: delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};


