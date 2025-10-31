# 📊 Tổng Kết Hoạt Động 2 - Advanced RBAC

## ✅ Đã Hoàn Thành

### SV1: Middleware checkRole(role) và API quản lý user

#### 1. Middleware checkRole (trong `middleware/authMiddleware.js` và `midlleware/authMiddleware.js`)
```javascript
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực người dùng" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Chỉ ${allowedRoles.join(", ")} mới được phép truy cập`,
        yourRole: req.user.role 
      });
    }

    console.log(`✅ Phân quyền thành công: ${req.user.email} (role=${req.user.role})`);
    next();
  };
};
```

**Đặc điểm:**
- ✅ Linh hoạt: Chấp nhận nhiều roles
- ✅ Sử dụng rest parameters (`...allowedRoles`)
- ✅ Trả về thông báo rõ ràng khi bị từ chối
- ✅ Log để debug

#### 2. API Quản Lý User (trong `controllers/userController.js`)

**Các API đã tạo:**
- ✅ `getUsers()` - Lấy danh sách tất cả users (Admin, Moderator)
- ✅ `getUserById()` - Lấy thông tin user theo ID (Admin, Moderator)
- ✅ `createUser()` - Tạo user mới (Admin only)
- ✅ `updateUser()` - Cập nhật thông tin user (Admin only)
- ✅ `updateUserRole()` - Cập nhật role của user (Admin only)
- ✅ `deleteUser()` - Xóa user (Admin only)

**Routes tương ứng (trong `routes/userRoutes.js`):**
```javascript
// Admin & Moderator: Xem danh sách và thông tin user
router.get("/", protect, checkRole("admin", "moderator"), userController.getUsers);
router.get("/:id", protect, checkRole("admin", "moderator"), userController.getUserById);

// Admin only: Quản lý user
router.post("/", protect, checkRole("admin"), userController.createUser);
router.put("/:id", protect, checkRole("admin"), userController.updateUser);
router.patch("/:id/role", protect, checkRole("admin"), userController.updateUserRole);
router.delete("/:id", protect, checkRole("admin"), userController.deleteUser);
```

---

### SV3: Cập nhật schema User và dữ liệu mẫu

#### 1. Cập nhật Schema (trong `models/userModel.js`)
```javascript
role: {
  type: String,
  enum: ["user", "admin", "moderator"],  // ✅ Thêm "moderator"
  default: "user",
}
```

#### 2. Dữ Liệu Mẫu (file `seedUsers.js`)

**Script seed tự động:**
```bash
npm run seed
```

**Tài khoản mẫu:**
- 👑 Admin: admin@example.com / admin123
- 🛡️ Moderator: moderator@example.com / mod123
- 👤 User 1: user1@example.com / user123
- 👤 User 2: user2@example.com / user123

---

## 🎯 Ma Trận Phân Quyền

| Chức Năng | User | Moderator | Admin |
|-----------|------|-----------|-------|
| Xem danh sách users | ❌ | ✅ | ✅ |
| Xem thông tin user | ❌ | ✅ | ✅ |
| Tạo user mới | ❌ | ❌ | ✅ |
| Cập nhật user | ❌ | ❌ | ✅ |
| Cập nhật role | ❌ | ❌ | ✅ |
| Xóa user | ❌ | ❌ | ✅ |
| Xem/sửa profile riêng | ✅ | ✅ | ✅ |

---

## 📂 Files Đã Tạo/Sửa

### Files Đã Sửa:
1. ✅ `backend/models/userModel.js`
   - Thêm role "moderator" vào enum

2. ✅ `backend/middleware/authMiddleware.js`
   - Thêm middleware `checkRole(...allowedRoles)`

3. ✅ `backend/midlleware/authMiddleware.js`
   - Thêm middleware `checkRole(...allowedRoles)` (file đang được sử dụng)

4. ✅ `backend/controllers/userController.js`
   - Thêm `getUserById()`
   - Cập nhật `getUsers()` - thêm `.select("-password")`
   - Cập nhật `updateUser()` - hỗ trợ cập nhật role
   - Thêm `updateUserRole()` - API riêng để cập nhật role

5. ✅ `backend/routes/userRoutes.js`
   - Import `checkRole` từ authMiddleware
   - Áp dụng `checkRole()` cho tất cả routes
   - Phân quyền rõ ràng: Admin, Moderator, hoặc cả hai

6. ✅ `backend/package.json`
   - Thêm script `"seed": "node seedUsers.js"`

### Files Đã Tạo:
1. ✅ `backend/seedUsers.js`
   - Script seed dữ liệu mẫu cho 3 roles
   - Tự động kiểm tra trùng lặp
   - Hiển thị thông tin tài khoản sau khi seed

2. ✅ `backend/RBAC_GUIDE.md`
   - Hướng dẫn chi tiết về RBAC
   - Ví dụ sử dụng API
   - Test cases

3. ✅ `backend/HOAT_DONG_2_SUMMARY.md`
   - File tổng kết này

---

## 🧪 Hướng Dẫn Test

### Bước 1: Seed dữ liệu
```bash
cd backend
npm run seed
```

### Bước 2: Chạy server
```bash
npm run dev
```

### Bước 3: Test với Postman/Thunder Client

#### Test 1: Đăng nhập với Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Test 2: Admin lấy danh sách users (Thành công ✅)
```http
GET http://localhost:5000/api/users
Authorization: Bearer {admin_token}
```

#### Test 3: Đăng nhập với User thường
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user1@example.com",
  "password": "user123"
}
```

#### Test 4: User thường lấy danh sách users (Thất bại ❌ 403 Forbidden)
```http
GET http://localhost:5000/api/users
Authorization: Bearer {user_token}
```

**Kết quả mong đợi:**
```json
{
  "message": "Chỉ admin, moderator mới được phép truy cập",
  "yourRole": "user"
}
```

#### Test 5: Đăng nhập với Moderator
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "moderator@example.com",
  "password": "mod123"
}
```

#### Test 6: Moderator xem danh sách users (Thành công ✅)
```http
GET http://localhost:5000/api/users
Authorization: Bearer {moderator_token}
```

#### Test 7: Moderator cố tạo user mới (Thất bại ❌ 403 Forbidden)
```http
POST http://localhost:5000/api/users
Authorization: Bearer {moderator_token}
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

#### Test 8: Admin cập nhật role của user (Thành công ✅)
```http
PATCH http://localhost:5000/api/users/{user_id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "moderator"
}
```

---

## 💡 Điểm Nổi Bật

### 1. Middleware Linh Hoạt
- Sử dụng rest parameters để chấp nhận nhiều roles
- Dễ dàng mở rộng trong tương lai
- Code clean và dễ đọc

### 2. API Đầy Đủ
- CRUD đầy đủ cho user management
- API riêng để cập nhật role (PATCH `/api/users/:id/role`)
- Validation đầy đủ

### 3. Phân Quyền Rõ Ràng
- 3 levels: User, Moderator, Admin
- Moderator có quyền xem, không có quyền sửa/xóa
- Admin có toàn quyền

### 4. Dữ Liệu Mẫu
- Script seed tự động
- Tài khoản test cho cả 3 roles
- Không tạo trùng lặp

---

## 📚 Kiến Thức Áp Dụng

1. ✅ **REST Parameters** (`...allowedRoles`)
2. ✅ **Middleware chaining** trong Express
3. ✅ **MongoDB enum validation**
4. ✅ **Mongoose pre-save hooks** (hash password)
5. ✅ **HTTP status codes** (401, 403, 404, 500)
6. ✅ **JWT authentication**
7. ✅ **Role-Based Access Control pattern**

---

## 🎉 Kết Luận

Hoạt động 2 đã hoàn thành đầy đủ với:
- ✅ Middleware checkRole linh hoạt
- ✅ API quản lý user đầy đủ
- ✅ Schema hỗ trợ 3 roles
- ✅ Dữ liệu mẫu để test
- ✅ Tài liệu hướng dẫn chi tiết

**Backend RBAC đã sẵn sàng! 🚀**

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*


