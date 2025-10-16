
const User = require("../models/User");

// Lấy tất cả user
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
  }
};

// Tạo user mới
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo người dùng", error });
  }
};

// Cập nhật user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật người dùng", error });
  }
};

// Xóa user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa người dùng", error });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };



