// // const express = require("express");
// // const mongoose = require("mongoose");
// // const User = require("./User");

// // const app = express();
// // app.use(express.json());

// // // ✅ Kết nối MongoDB Atlas
// // mongoose.connect("mongodb+srv://phat220393:12345@cluster0.itkfnni.mongodb.net/group14DB?retryWrites=true&w=majority&appName=Cluster0")
// //   .then(() => console.log("✅ Kết nối MongoDB thành công"))
// //   .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// // // ✅ POST: thêm user
// // app.post("/users", async (req, res) => {
// //   try {
// //     const newUser = new User(req.body);
// //     await newUser.save();
// //     res.status(201).json(newUser);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ✅ GET: xem toàn bộ user
// // app.get("/users", async (req, res) => {
// //   const users = await User.find();
// //   res.json(users);
// // });

// // app.listen(5000, () => console.log("🚀 Server chạy tại http://localhost:5000"));

// // ✅ Import thư viện cần thiết
// import express from 'express';
// import mongoose from 'mongoose';
// import User from './User.js'; // import model user nếu có

// const app = express();
// app.use(express.json());

// // ✅ Kết nối MongoDB
// mongoose.connect("mongodb+srv://phat220393:12345@cluster0.itkfnni.mongodb.net/group14DB?retryWrites=true&w=majority&appName=Cluster0")
//   .then(async () => {
//     console.log('✅ Kết nối MongoDB thành công');

//     // Test thêm user (chạy 1 lần)
//     try {
//       const newUser = new User({
//         name: 'Test User',
//         email: `test${Date.now()}@example.com`,
//         password: '123456'
//       });
//       await newUser.save();
//       console.log('👤 User đã được thêm vào database!');
//     } catch (err) {
//       console.error('⚠️ Lỗi khi thêm user:', err.message);
//     }
//   })
//   .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// // ✅ Chạy server
// app.listen(5000, () => console.log('🚀 Server chạy tại http://localhost:5000'));

// ✅ 1. Import thư viện
import express from 'express';
import mongoose from 'mongoose';
import User from './User.js'; // import file User.js (model user)

// ✅ 2. Khởi tạo Express app
const app = express();
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ body

// ✅ 3. Kết nối MongoDB (sửa đúng link của bạn)
mongoose.connect("mongodb+srv://phat220393:12345@cluster0.itkfnni.mongodb.net/group14DB?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    console.log('✅ Kết nối MongoDB thành công');

    // Thêm user test vào database (chạy 1 lần để kiểm tra)
    try {
      const newUser = new User({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: '123456'
      });
      await newUser.save();
      console.log('👤 User test đã được thêm vào database!');
    } catch (err) {
      console.error('⚠️ Lỗi khi thêm user test:', err.message);
    }
  })
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ✅ 4. API thêm user (đây là phần test trên Postman)
app.post('/add-user', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Tạo user mới
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({
      message: '✅ User đã được thêm thành công!',
      user: newUser
    });
  } catch (err) {
    res.status(400).json({
      message: '❌ Lỗi khi thêm user!',
      error: err.message
    });
  }
});

// ✅ 5. Khởi động server
app.listen(5000, () => console.log('🚀 Server chạy tại http://localhost:5000'));
