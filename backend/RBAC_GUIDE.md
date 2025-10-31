# 🔐 Hướng Dẫn Advanced RBAC - Role-Based Access Control

## 📋 Tổng Quan

Hệ thống RBAC hỗ trợ 3 vai trò (roles):
- **User** (người dùng thường): Quyền cơ bản
- **Moderator** (quản trị viên): Quyền quản lý user (chỉ xem)
- **Admin** (quản trị viên cao cấp): Quyền toàn quyền

---

## 🚀 Cài Đặt & Chạy

### 1. Seed Dữ Liệu Mẫu

Chạy lệnh sau để thêm dữ liệu mẫu vào database:

```bash
cd backend
npm run seed
```

### 2. Tài Khoản Test

Sau khi seed, bạn có các tài khoản sau:

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@example.com | admin123 |
| 🛡️ Moderator | moderator@example.com | mod123 |
| 👤 User | user1@example.com | user123 |
| 👤 User | user2@example.com | user123 |

---

## 🔧 Cấu Trúc Code

### 1. User Schema (`models/userModel.js`)

```javascript
role: {
  type: String,
  enum: ["user", "admin", "moderator"],
  default: "user",
}
```

### 2. Middleware checkRole (`middleware/authMiddleware.js`)

**Sử dụng:**
```javascript
const { protect, checkRole } = require("./middleware/authMiddleware");

// Chỉ cho phép admin
router.post("/users", protect, checkRole("admin"), controller);

// Cho phép admin hoặc moderator
router.get("/users", protect, checkRole("admin", "moderator"), controller);
```

**Ví dụ:**
```javascript
// ✅ Cho phép nhiều roles
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Chỉ ${allowedRoles.join(", ")} mới được phép truy cập`,
        yourRole: req.user.role 
      });
    }

    next();
  };
};
```

---

## 📡 API Endpoints

### User Management APIs

| Method | Endpoint | Roles | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/users` | Admin, Moderator | Lấy danh sách tất cả users |
| GET | `/api/users/:id` | Admin, Moderator | Lấy thông tin user theo ID |
| POST | `/api/users` | Admin | Tạo user mới |
| PUT | `/api/users/:id` | Admin | Cập nhật thông tin user |
| PATCH | `/api/users/:id/role` | Admin | Cập nhật role của user |
| DELETE | `/api/users/:id` | Admin | Xóa user |

### Profile APIs

| Method | Endpoint | Roles | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/users/profile` | All | Xem thông tin profile của chính mình |
| PUT | `/api/users/profile` | All | Cập nhật profile của chính mình |

---

## 🧪 Test API với Postman/Thunder Client

### 1. Đăng Nhập

**Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 2. Lấy Danh Sách Users (Admin/Moderator)

**Request:**
```http
GET http://localhost:5000/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Cập Nhật Role (Admin Only)

**Request:**
```http
PATCH http://localhost:5000/api/users/USER_ID/role
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "role": "moderator"
}
```

### 4. Tạo User Mới (Admin Only)

**Request:**
```http
POST http://localhost:5000/api/users
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

---

## 🎯 Phân Quyền Chi Tiết

### User (Người dùng thường)
- ✅ Xem/sửa profile của chính mình
- ❌ Không xem được danh sách users
- ❌ Không tạo/sửa/xóa user khác

### Moderator (Quản trị viên)
- ✅ Xem danh sách tất cả users
- ✅ Xem thông tin chi tiết của user
- ❌ Không tạo/sửa/xóa user
- ❌ Không thay đổi role

### Admin (Quản trị viên cao cấp)
- ✅ Toàn quyền: CRUD users
- ✅ Thay đổi role của users
- ✅ Xóa users

---

## 📝 Code Controllers

### Lấy danh sách users
```javascript
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
```

### Cập nhật role
```javascript
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "moderator"].includes(role)) {
      return res.status(400).json({ 
        message: "Role không hợp lệ" 
      });
    }

    const user = await User.findById(id);
    user.role = role;
    await user.save();

    res.json({ message: "Cập nhật role thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
```

---

## 🔍 Kiểm Tra Lỗi Phân Quyền

### Test Case 1: User cố truy cập danh sách users
**Kết quả mong đợi:** `403 Forbidden`
```json
{
  "message": "Chỉ admin, moderator mới được phép truy cập",
  "yourRole": "user"
}
```

### Test Case 2: Moderator cố tạo user mới
**Kết quả mong đợi:** `403 Forbidden`
```json
{
  "message": "Chỉ admin mới được phép truy cập",
  "yourRole": "moderator"
}
```

### Test Case 3: Admin tạo user thành công
**Kết quả mong đợi:** `201 Created`

---

## 📦 Files Đã Tạo/Sửa

### Đã Sửa:
- ✅ `models/userModel.js` - Thêm role "moderator"
- ✅ `middleware/authMiddleware.js` - Thêm middleware `checkRole()`
- ✅ `controllers/userController.js` - Thêm API quản lý user
- ✅ `routes/userRoutes.js` - Áp dụng RBAC cho routes

### Đã Tạo:
- ✅ `seedUsers.js` - Script seed dữ liệu mẫu
- ✅ `RBAC_GUIDE.md` - File hướng dẫn này

---

## 🎓 Tổng Kết

Hệ thống RBAC đã được triển khai đầy đủ với:
1. ✅ Schema User hỗ trợ 3 roles
2. ✅ Middleware checkRole linh hoạt
3. ✅ API quản lý user đầy đủ (CRUD + role management)
4. ✅ Dữ liệu mẫu để test
5. ✅ Phân quyền rõ ràng cho từng role

**Chúc bạn code vui vẻ! 🚀**


