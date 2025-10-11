const express = require("express");
const mongoose = require("mongoose");
const User = require("./User"); // nhớ import model

const app = express();
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://phat220393:12345@cluster0.itkfnni.mongodb.net/groupBD?retryWrites=true&w=majority")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));


// ✅ Thêm user vào MongoDB
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body); // tạo user theo model
    await newUser.save(); // LƯU thật vào database
    res.status(201).json(newUser); // trả lại user đã lưu (có _id)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Xem toàn bộ users (để kiểm tra lại)
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(5000, () => console.log("🚀 Server chạy tại http://localhost:5000"));
