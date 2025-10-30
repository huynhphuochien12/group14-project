# 📸 Hướng Dẫn Upload Avatar - Hoạt Động 3

## ✅ Đã Hoàn Thành

### SV1: API Upload Avatar với Multer + Sharp + Cloudinary ✅
- ✅ Middleware xác thực JWT (`protect`)
- ✅ Multer để nhận file upload
- ✅ **Sharp** để resize ảnh (300x300, quality 80)
- ✅ Upload lên Cloudinary
- ✅ Lưu URL vào MongoDB

### SV3: Cloudinary Account & MongoDB Storage ✅
- ✅ Config Cloudinary
- ✅ Lưu avatar URL vào User model
- ✅ Test upload và lấy URL

---

## 🌥️ Bước 1: Tạo Cloudinary Account (SV3)

### 1.1. Đăng ký Cloudinary

1. Truy cập: https://cloudinary.com/users/register_free
2. Đăng ký account miễn phí (có 25GB storage)
3. Xác nhận email

### 1.2. Lấy API Credentials

Sau khi đăng nhập:

1. Vào **Dashboard**
2. Tìm section **Account Details**:
   ```
   Cloud Name: your_cloud_name
   API Key: 123456789012345
   API Secret: abcd1234efgh5678ijkl
   ```

### 1.3. Cập Nhật File `.env`

Thêm vào file `backend/.env`:

```env
# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcd1234efgh5678ijkl
```

**⚠️ QUAN TRỌNG:** KHÔNG commit file `.env` lên Git!

---

## 🔧 Bước 2: Cài Đặt Dependencies

```bash
cd backend

# Cài đặt Sharp (để resize ảnh)
npm install sharp

# Kiểm tra đã có các package khác
npm list multer cloudinary streamifier
```

Nếu thiếu:
```bash
npm install multer cloudinary streamifier
```

---

## 🚀 Bước 3: Khởi Động Backend

```bash
npm start
```

Kiểm tra log:
```
[cloudinary] env CLOUDINARY_CLOUD_NAME= your_cloud_name
[cloudinary] env CLOUDINARY_API_KEY= 12...45
[cloudinary] env CLOUDINARY_API_SECRET= ab...kl
✅ Server running on port 5000
✅ MongoDB connected successfully
```

Nếu thấy `<empty>` → Chưa config đúng `.env`!

---

## 🧪 Bước 4: Test API Upload Avatar (SV1)

### 4.1. Postman Setup

**Request:**
```
POST http://localhost:5000/api/profile/avatar
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Body:**
- Chọn `form-data`
- Key: `avatar`
- Type: `File`
- Value: Chọn ảnh (JPEG, PNG, WebP)

### 4.2. Cách Lấy Token

1. Login trước:
   ```http
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

2. Copy `accessToken` từ response
3. Paste vào `Authorization: Bearer <token>`

### 4.3. Upload Avatar

Click **Send** trong Postman.

**Response thành công:**
```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/avatars/abc123.jpg",
  "user": {
    "_id": "abc123",
    "name": "Admin User",
    "email": "admin@example.com",
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

**Terminal backend sẽ hiển thị:**
```
📸 Processing avatar for user: admin@example.com
   Original size: 1250.45 KB
   Resized size: 45.32 KB
   ✅ Uploaded to: https://res.cloudinary.com/...
```

### 4.4. Kiểm Tra Cloudinary

1. Vào https://cloudinary.com/console
2. Click **Media Library**
3. Mở folder **avatars**
4. Sẽ thấy ảnh vừa upload (300x300 px)

---

## 📊 Bước 5: Kiểm Tra Database (SV3)

### 5.1. MongoDB Compass

1. Kết nối MongoDB
2. Vào database của bạn
3. Collection `users`
4. Tìm user vừa upload
5. Kiểm tra field `avatar`:
   ```json
   {
     "_id": "...",
     "name": "Admin User",
     "email": "admin@example.com",
     "avatar": "https://res.cloudinary.com/your_cloud/image/upload/v.../avatars/abc.jpg"
   }
   ```

### 5.2. Test GET Profile

```http
GET http://localhost:5000/api/profile
Authorization: Bearer YOUR_TOKEN
```

Response sẽ có `avatar` URL:
```json
{
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

---

## 🎯 Tính Năng API

### API Endpoint

```
POST /api/profile/avatar
```

### Features

1. ✅ **Xác thực JWT** - Chỉ user đã login mới upload được
2. ✅ **Validate file** - Chỉ chấp nhận JPEG, PNG, WebP
3. ✅ **Giới hạn size** - Max 5MB
4. ✅ **Resize ảnh** - 300x300 px, fit cover, quality 80%
5. ✅ **Upload Cloudinary** - Lưu vào folder `avatars`
6. ✅ **Lưu DB** - Cập nhật `user.avatar` với URL
7. ✅ **Logging** - Track original size → resized size → URL

### Request Details

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
avatar: <file>
```

### Response Success (200)

```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/...",
  "user": {
    "_id": "abc123",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://..."
  }
}
```

### Response Errors

**400 - No File:**
```json
{
  "message": "Không có file được upload"
}
```

**400 - Invalid File Type:**
```json
{
  "message": "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)"
}
```

**401 - No Token:**
```json
{
  "message": "Không có token xác thực"
}
```

**500 - Upload Failed:**
```json
{
  "message": "Upload thất bại",
  "error": "..."
}
```

---

## 🔍 Troubleshooting

### Lỗi: "Upload failed"

**Nguyên nhân:**
- Cloudinary credentials sai
- API key/secret không đúng

**Giải pháp:**
1. Kiểm tra `.env`
2. Restart backend
3. Xem log terminal có hiện credentials không

### Lỗi: "Cannot find module 'sharp'"

**Giải pháp:**
```bash
cd backend
npm install sharp
npm start
```

### Lỗi: File quá lớn

**Nguyên nhân:** File > 5MB

**Giải pháp:**
- Nén ảnh trước khi upload
- Hoặc tăng limit trong code:
  ```javascript
  const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  });
  ```

### Avatar không hiển thị trên frontend

**Kiểm tra:**
1. URL có đúng format không?
2. Cloudinary có public access không?
3. Browser console có lỗi CORS không?

---

## 📝 Code Flow

```
1. Client gửi POST /api/profile/avatar + file
   ↓
2. Middleware `protect` → Xác thực JWT
   ↓
3. Middleware `upload.single('avatar')` → Multer nhận file
   ↓
4. Validate file type (JPEG, PNG, WebP)
   ↓
5. Sharp resize → 300x300, quality 80%
   ↓
6. Upload buffer lên Cloudinary
   ↓
7. Lấy secure_url từ Cloudinary response
   ↓
8. Cập nhật user.avatar trong MongoDB
   ↓
9. Return avatar URL + user info
```

---

## 🎓 Kiến Thức Áp Dụng

1. ✅ **Multer** - Handle file upload
2. ✅ **Sharp** - Image processing (resize, optimize)
3. ✅ **Cloudinary SDK** - Cloud storage upload
4. ✅ **Stream processing** - Upload từ buffer
5. ✅ **JWT authentication** - Protect route
6. ✅ **MongoDB update** - Lưu URL vào DB
7. ✅ **Error handling** - Validate + try/catch
8. ✅ **Logging** - Track upload progress

---

## 🎉 Kết Luận

✅ **Hoàn thành Hoạt Động 3:**
- SV1: API upload avatar với Multer + Sharp + Cloudinary ✅
- SV3: Setup Cloudinary + test upload + lưu MongoDB ✅

**Next Steps (SV2 - Frontend):**
- Form upload avatar
- Preview ảnh trước khi upload
- Hiển thị avatar sau upload
- Progress bar (optional)

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 3: Upload Avatar*

