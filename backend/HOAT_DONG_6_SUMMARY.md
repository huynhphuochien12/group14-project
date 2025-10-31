# 🔄 Hoạt Động 6 - Backend Support cho Redux

## ✅ Tổng Kết Backend

### Backend APIs Đã Sẵn Sàng

**✅ Không cần thay đổi backend code!**

Frontend Redux sử dụng API endpoints đã có:

---

## 📡 API Endpoints Used by Redux

### 1. Authentication APIs

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "676290a1742a5afe85ba0e8c",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Used by:** `login` thunk in `authSlice.js`

---

#### POST `/api/auth/register`
**Request:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "_id": "...",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "user"
  }
}
```

**Used by:** `register` thunk

---

#### POST `/api/auth/logout`
**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Đăng xuất thành công"
}
```

**Used by:** `logout` thunk

---

### 2. Profile APIs

#### GET `/api/profile`
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "_id": "676290a1742a5afe85ba0e8c",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "avatar": "https://res.cloudinary.com/..."
}
```

**Used by:** `fetchProfile` thunk

---

#### PUT `/api/profile`
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "message": "Cập nhật thông tin thành công",
  "user": {
    "_id": "...",
    "name": "Updated Name",
    "email": "newemail@example.com",
    "role": "admin"
  }
}
```

**Used by:** `updateProfile` thunk

---

## 🔐 Middleware Already Implemented

### 1. JWT Authentication - `protect`
```javascript
// backend/middleware/authMiddleware.js
export const protect = async (req, res, next) => {
  // Verify JWT token from headers
  // Attach req.user
};
```

**Used for:**
- ✅ GET `/api/profile`
- ✅ PUT `/api/profile`
- ✅ GET `/api/users`
- ✅ GET `/api/logs`

---

### 2. Role-Based Authorization - `checkRole`
```javascript
// backend/middleware/authMiddleware.js
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không đủ quyền" });
    }
    next();
  };
};
```

**Used for:**
- ✅ Admin-only routes
- ✅ Moderator routes
- ✅ Multi-role routes

---

## 🧪 Backend Testing với Redux

### Test 1: Login API

**Postman:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected:**
- ✅ Status 200
- ✅ Return `accessToken`, `refreshToken`, `user`
- ✅ Activity logged: `LOGIN_SUCCESS`

---

### Test 2: Protected Route (With Token)

**Postman:**
```
GET http://localhost:5000/api/profile
Authorization: Bearer <accessToken>
```

**Expected:**
- ✅ Status 200
- ✅ Return user object
- ✅ Activity logged: `VIEW_PROFILE`

---

### Test 3: Protected Route (No Token)

**Postman:**
```
GET http://localhost:5000/api/profile
(No Authorization header)
```

**Expected:**
- ✅ Status 401
- ✅ `{ "message": "Không có token" }`

---

### Test 4: Role Check (Admin Only)

**Postman:**
```
GET http://localhost:5000/api/logs
Authorization: Bearer <userToken> (role=user)
```

**Expected:**
- ✅ Status 403
- ✅ `{ "message": "Chỉ admin mới được phép truy cập" }`

---

## 📝 Backend Logs với Redux Actions

### Login Success
```
📝 Logged: LOGIN_SUCCESS by admin@example.com (200)
```

### Login Failed
```
📝 Logged: LOGIN_FAILED by admin@example.com (401)
```

### Rate Limited
```
⚠️ Rate limit exceeded for IP: ::1, Email: admin@example.com
📝 Logged: LOGIN_RATE_LIMITED by admin@example.com (429)
```

### Profile View
```
📝 Logged: VIEW_PROFILE by Admin User (200)
```

---

## ✅ Backend Checklist

- [x] Login API working
- [x] Register API working
- [x] Logout API working
- [x] Profile GET working
- [x] Profile PUT working
- [x] JWT authentication (protect middleware)
- [x] Role-based authorization (checkRole)
- [x] Activity logging enabled
- [x] Rate limiting enabled
- [x] CORS configured

**Backend is ready for Redux!** ✅

---

## 🔄 No Backend Changes Needed

**Lý do:**
- ✅ Redux chỉ thay đổi cách frontend quản lý state
- ✅ API endpoints không thay đổi
- ✅ Request/Response format giữ nguyên
- ✅ JWT authentication vẫn dùng header `Authorization: Bearer <token>`
- ✅ Middleware logic không đổi

**Backend SV1 + SV3:** Chỉ cần test API hoạt động đúng với Redux frontend!

---

*Tạo bởi: Backend Team*  
*Hoạt Động 6: Backend Support - Complete*

