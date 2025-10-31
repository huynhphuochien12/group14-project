# 🚀 Group 14 - User Management System

Hệ thống quản lý người dùng với đầy đủ tính năng: Authentication, Authorization, Profile Management, Activity Logging, và Rate Limiting.

---

## 📋 **Mục Lục**

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt](#cài-đặt)
3. [Cấu Hình](#cấu-hình)
4. [Chạy Ứng Dụng](#chạy-ứng-dụng)
5. [Tài Khoản Mặc Định](#tài-khoản-mặc-định)
6. [API Endpoints](#api-endpoints)
7. [Tính Năng](#tính-năng)

---

## 💻 **Yêu Cầu Hệ Thống**

- **Node.js:** >= 16.x
- **npm:** >= 8.x
- **MongoDB:** MongoDB Atlas hoặc local MongoDB
- **Git:** Để clone repository

---

## 🔧 **Cài Đặt**

### **Bước 1: Clone Repository**

```bash
git clone <repository-url>
cd group14-project
```

### **Bước 2: Cài Đặt Backend Dependencies**

```bash
cd backend
npm install
```

### **Bước 3: Cài Đặt Frontend Dependencies**

```bash
cd ../frontend
npm install
```

---

## ⚙️ **Cấu Hình**

### **1. Tạo File `.env` trong Thư Mục `backend/`**

Tạo file `.env` với nội dung sau:

```env
# Cấu hình MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/group14DB

# Cổng chạy server
PORT=5000

# Khóa bí mật JWT
JWT_SECRET=my_super_secret_key_123
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=my_refresh_secret_key_456

# Cấu hình Cloudinary (cho upload avatar)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP config cho gửi email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Tech University <your_email@gmail.com>"

# URL frontend (dùng cho reset password link)
CLIENT_URL=http://localhost:3000
```

### **2. Lưu Ý:**

- **MongoDB URI:** Thay bằng connection string thực tế của bạn
- **JWT_SECRET:** Dùng chuỗi ngẫu nhiên mạnh (ít nhất 32 ký tự)
- **Cloudinary:** Đăng ký tài khoản tại [cloudinary.com](https://cloudinary.com) để lấy credentials
- **Gmail SMTP:** 
  - Bật "2-Step Verification" trong Google Account
  - Tạo "App Password" tại [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
  - Dùng App Password (16 ký tự) cho `SMTP_PASS`

---

## 🚀 **Chạy Ứng Dụng**

### **Cách 1: Chạy Riêng Lẻ (Development)**

#### **Terminal 1: Chạy Backend**

```bash
cd backend
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

#### **Terminal 2: Chạy Frontend**

```bash
cd frontend
npm start
```

Frontend sẽ tự động mở tại: `http://localhost:3000`

---

### **Cách 2: Chạy Development Mode với Auto-reload**

#### **Backend (với nodemon):**

```bash
cd backend
npm run dev
```

#### **Frontend:**

```bash
cd frontend
npm start
```

---

## 👤 **Tài Khoản Mặc Định**

### **Tạo Tài Khoản Mẫu:**

Chạy script seed để tạo users mặc định:

```bash
cd backend
npm run seed
```

### **Tài Khoản Được Tạo:**

| Email | Password | Role |
|-------|----------|------|
| `admin@gmail.com` | `123456` | Admin |
| `moderator@example.com` | `123456` | Moderator |
| `user@example.com` | `123456` | User |

**⚠️ Lưu Ý:** Đổi mật khẩu ngay sau khi test!

---

## 📡 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/signup` - Alias cho register

### **User Management**
- `GET /api/users` - Lấy danh sách users (Admin/Moderator)
- `GET /api/users/:id` - Lấy user theo ID (Admin/Moderator)
- `POST /api/users` - Tạo user mới (Admin only)
- `PUT /api/users/:id` - Cập nhật user (Admin/Moderator)
- `PATCH /api/users/:id/role` - Đổi role (Admin only)
- `DELETE /api/users/:id` - Xóa user (Admin only)

### **Profile**
- `GET /api/profile` - Lấy thông tin profile
- `PUT /api/profile` - Cập nhật profile
- `DELETE /api/profile` - Xóa tài khoản
- `POST /api/profile/avatar` - Upload avatar

### **Logs (Admin only)**
- `GET /api/logs` - Lấy danh sách logs
- `GET /api/logs/stats` - Thống kê logs
- `GET /api/logs/user/:userId` - Logs của user cụ thể
- `DELETE /api/logs` - Xóa logs cũ

---

## ✨ **Tính Năng**

### **✅ Hoạt Động 2: Advanced RBAC**
- 3 roles: `admin`, `moderator`, `user`
- Middleware `checkRole()` linh hoạt
- Admin: Full access
- Moderator: Xem và sửa users
- User: Chỉ truy cập profile của mình

### **✅ Hoạt Động 3: Upload Avatar**
- Upload ảnh lên Cloudinary
- Tự động resize 300x300
- Validate file type và size
- Hiển thị avatar trên frontend

### **✅ Hoạt Động 4: Forgot & Reset Password**
- Gửi email reset password qua Gmail SMTP
- Token hết hạn sau 1 giờ
- Form reset password trên frontend

### **✅ Hoạt Động 5: Activity Logging & Rate Limiting**
- Log mọi hoạt động user vào database
- Rate limiting cho login (5 attempts/1 min)
- Rate limiting cho forgot password (3 requests/1 min)
- Admin xem logs tại `/admin/logs`

### **✅ Hoạt Động 6: Redux & Protected Routes**
- Redux Toolkit cho state management
- Protected routes: `/profile`, `/admin`
- Token và user info lưu trong Redux store

---

## 🔐 **Bảo Mật**

- JWT Authentication với Access Token (15 phút) và Refresh Token (7 ngày)
- Password hashing với bcrypt
- Rate limiting chống brute force
- Input validation
- CORS enabled
- Protected routes với role-based access

---

## 📁 **Cấu Trúc Project**

```
group14-project/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/     # Controllers
│   ├── middleware/      # Auth, logging, rate limiting
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── .env             # Environment variables (tạo file này)
│   ├── package.json
│   ├── server.js        # Entry point
│   └── seedUsers.js     # Seed script
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Context API
│   │   ├── pages/       # Pages
│   │   ├── services/   # API service
│   │   ├── store/       # Redux store
│   │   └── AppRedux.jsx # Main app với Redux
│   └── package.json
│
└── README.md
```

---

## 🛠️ **Troubleshooting**

### **Lỗi: Cannot find module**
```bash
# Xóa node_modules và cài lại
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### **Lỗi: MongoDB connection failed**
- Kiểm tra `MONGO_URI` trong `.env`
- Đảm bảo MongoDB Atlas IP whitelist đã thêm `0.0.0.0/0`

### **Lỗi: JWT_SECRET not set**
- Tạo file `.env` trong `backend/`
- Thêm `JWT_SECRET=your_secret_key`

### **Lỗi: Email không gửi được**
- Kiểm tra Gmail App Password
- Bật "Less secure app access" hoặc dùng App Password
- Kiểm tra `SMTP_PASS` trong `.env`

### **Port đã được sử dụng**
```bash
# Đổi port trong .env
PORT=5001  # Backend
# Hoặc đổi trong package.json frontend
```

---

## 📝 **Scripts Có Sẵn**

### **Backend:**
- `npm start` - Chạy server (production)
- `npm run dev` - Chạy với nodemon (auto-reload)
- `npm run seed` - Tạo users mẫu

### **Frontend:**
- `npm start` - Chạy dev server
- `npm run build` - Build cho production
- `npm test` - Chạy tests

---

## 🌐 **URLs**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/

---

## 👥 **Nhóm Phát Triển**

- **Backend:** [Tên thành viên]
- **Frontend:** [Tên thành viên]
- **Database:** [Tên thành viên]

---

## 📄 **License**

ISC

---

## 🙏 **Tài Liệu Tham Khảo**

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**🎉 Chúc bạn phát triển thành công!**

