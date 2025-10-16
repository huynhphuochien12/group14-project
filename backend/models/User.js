// User.js
import mongoose from 'mongoose';

// Bước 1: Định nghĩa cấu trúc dữ liệu người dùng
const userSchema = new mongoose.Schema({
  name: { 
    type: String,           // Kiểu dữ liệu là chuỗi
    required: true,         // Bắt buộc phải có
    trim: true              // Tự động bỏ khoảng trắng đầu/cuối
  },
  email: { 
    type: String,
    required: true,
    unique: true,           // Không cho phép email trùng nhau
    match: /.+\@.+\..+/     // Regex kiểm tra định dạng email
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6            // Yêu cầu mật khẩu ít nhất 6 ký tự
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], // Giới hạn chỉ được “user” hoặc “admin”
    default: 'user'          // Mặc định là user khi đăng ký
  },
}, { 
  timestamps: true           // Tự động thêm createdAt, updatedAt
});

// Bước 2: Tạo model từ schema
const User = mongoose.model('User', userSchema);

// Bước 3: Xuất model để file khác có thể import
export default User;
