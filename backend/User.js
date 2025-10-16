// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //   name: String,
// //   email: String
// // });

// // const User = mongoose.model('User', userSchema);

// // module.exports = User;

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// });

// const User = mongoose.model('User', userSchema);

// export default User;

import mongoose from 'mongoose';

// ✅ Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], // chỉ cho phép 2 giá trị này
    default: 'user' // mặc định là user nếu không nhập
  }
}, { 
  timestamps: true // tự động thêm createdAt và updatedAt
});

// ✅ Xuất model ra để dùng ở file server.js
export default mongoose.model('User', userSchema);

