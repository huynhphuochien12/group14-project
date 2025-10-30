# 📸 Hướng Dẫn Demo Upload Avatar - Hoạt Động 3

## ✅ Sản Phẩm Nộp

1. ✅ **Demo upload avatar thành công**
2. ✅ **Ảnh avatar hiển thị trên frontend**
3. ✅ **Link PR GitHub**

---

## 🚀 Bước 1: Chạy Backend + Frontend

### Terminal 1 - Backend

```bash
cd backend

# Cài Sharp (nếu chưa cài)
npm install sharp

# Khởi động backend
npm start
```

**Kiểm tra log:**
```
[cloudinary] env CLOUDINARY_CLOUD_NAME= du4zrhwzq
✅ Server running on port 5000
✅ MongoDB connected successfully
```

### Terminal 2 - Frontend

```bash
cd frontend

# Cài packages (nếu chưa cài)
npm install

# Khởi động frontend
npm start
```

**Browser tự mở:** `http://localhost:3000`

---

## 🎬 Bước 2: Demo Upload Avatar

### 2.1. Đăng Nhập

1. Vào `http://localhost:3000/login`
2. Login với tài khoản:
   - **Admin:** `admin@example.com` / `admin123`
   - **Moderator:** `moderator@example.com` / `mod123`
   - **User:** `user1@example.com` / `user123`

### 2.2. Vào Trang Profile

Sau khi login thành công → Tự động chuyển đến `/profile`

### 2.3. Upload Avatar

1. Tìm section **"Ảnh đại diện"** (có icon 👤)
2. Click nút **"📁 Chọn ảnh"**
3. Chọn 1 ảnh (JPEG, PNG, WebP - max 5MB)
4. Thấy preview ảnh và text "✓ Đã chọn: ten_file.jpg"
5. Click nút **"📤 Upload"**
6. Đợi upload (nút hiển thị "⏳ Đang upload...")
7. Thấy thông báo **"✅ Upload avatar thành công!"**
8. Avatar mới xuất hiện ngay lập tức!

### 2.4. Kiểm Tra Avatar

**Trang Profile:**
- Avatar hiển thị trong section upload
- Avatar tròn 100x100 px

**Reload trang:**
- Nhấn F5
- Avatar vẫn hiển thị (đã lưu vào DB)

**Logout & Login lại:**
- Avatar vẫn hiển thị

---

## 📊 Bước 3: Kiểm Tra Chi Tiết

### 3.1. Terminal Backend

Khi upload, backend log:
```
📸 Processing avatar for user: user@example.com
   Original size: 1250.45 KB
   Resized size: 45.32 KB
   ✅ Uploaded to: https://res.cloudinary.com/du4zrhwzq/image/upload/v.../avatars/abc.jpg
```

### 3.2. Browser DevTools

Mở Console (F12) → Network tab:

**Request:**
```
POST /api/profile/avatar
Status: 200 OK
```

**Response:**
```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/du4zrhwzq/...",
  "user": {
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://..."
  }
}
```

### 3.3. Cloudinary Dashboard

1. Vào https://cloudinary.com/console
2. Click **Media Library**
3. Mở folder **avatars/**
4. Thấy ảnh vừa upload (300x300 px)

### 3.4. MongoDB

**MongoDB Compass:**
1. Kết nối database
2. Collection `users`
3. Tìm user vừa upload
4. Field `avatar`:
   ```
   "avatar": "https://res.cloudinary.com/du4zrhwzq/image/upload/v.../avatars/abc.jpg"
   ```

---

## 📹 Bước 4: Demo Video/Screenshots

### Screenshots Cần Chụp

#### 1. Trước Upload
- Trang profile với avatar mặc định (👤)

#### 2. Chọn Ảnh
- Sau khi click "Chọn ảnh" → preview hiển thị
- Text "✓ Đã chọn: avatar.jpg"

#### 3. Đang Upload
- Nút hiển thị "⏳ Đang upload..."

#### 4. Upload Thành Công
- Thông báo toast "✅ Upload avatar thành công!"
- Avatar mới hiển thị

#### 5. Terminal Backend
- Log processing với original size → resized size

#### 6. Cloudinary Dashboard
- Ảnh trong folder avatars/ (300x300)

#### 7. MongoDB
- Document user với field avatar có URL

---

## 🔧 Troubleshooting

### Lỗi: "Cannot find module 'sharp'"

```bash
cd backend
npm install sharp
npm start
```

### Lỗi: "Upload failed"

**Kiểm tra:**
1. Backend có chạy không? (`npm start`)
2. File `.env` có đầy đủ Cloudinary config?
3. Đã login chưa? (có token?)

### Lỗi: "Chỉ chấp nhận file ảnh"

- Chỉ upload file JPEG, PNG, WebP
- Không upload file khác (.pdf, .doc, v.v.)

### Lỗi: "Ảnh quá lớn"

- File > 5MB
- Nén ảnh trước khi upload

### Avatar không hiển thị

1. **Kiểm tra console:**
   - Có lỗi CORS?
   - URL có đúng không?

2. **Kiểm tra Cloudinary:**
   - Ảnh có upload lên không?
   - URL có accessible không?

3. **Hard refresh:**
   - Ctrl + Shift + R

---

## 🎯 Tính Năng Đã Implement

### Backend (SV1)
- ✅ API `/api/profile/avatar`
- ✅ Multer nhận file upload
- ✅ Sharp resize 300x300, quality 80%
- ✅ Upload lên Cloudinary folder `avatars/`
- ✅ Lưu URL vào MongoDB
- ✅ JWT authentication
- ✅ Validate file type (JPEG, PNG, WebP)
- ✅ Validate file size (max 5MB)
- ✅ Logging chi tiết

### Frontend (SV2)
- ✅ Component `AvatarUpload.jsx`
- ✅ Chọn file ảnh
- ✅ Preview ảnh trước khi upload
- ✅ Validation file type & size
- ✅ Loading state khi upload
- ✅ Toast notification
- ✅ Hiển thị avatar sau upload
- ✅ Auto reload user data
- ✅ UI đẹp với styled components

### Cloudinary (SV3)
- ✅ Account đã setup
- ✅ Config trong `.env`
- ✅ Upload vào folder `avatars/`
- ✅ Lưu URL vào MongoDB

---

## 📦 Files Đã Tạo/Sửa

### Backend
1. ✅ `routes/profileRoutes.js` - API upload với Sharp
2. ✅ `config/cloudinary.js` - Config Cloudinary
3. ✅ `middleware/authMiddleware.js` - JWT auth
4. ✅ `.env` - Cloudinary credentials
5. ✅ `AVATAR_UPLOAD_GUIDE.md` - Hướng dẫn
6. ✅ `HOAT_DONG_3_SUMMARY.md` - Tổng kết

### Frontend
1. ✅ `components/profile/AvatarUpload.jsx` - Upload component
2. ✅ `components/profile/ProfilePage.jsx` - Integrate upload
3. ✅ `services/api.js` - API client (đã có sẵn)

### Documentation
1. ✅ `DEMO_UPLOAD_AVATAR.md` - File này

---

## 📝 Checklist Demo

- [ ] Backend chạy (`npm start`)
- [ ] Frontend chạy (`npm start`)
- [ ] Login thành công
- [ ] Vào trang `/profile`
- [ ] Click "Chọn ảnh" → Chọn ảnh
- [ ] Thấy preview ảnh
- [ ] Click "Upload"
- [ ] Thấy toast "Upload thành công"
- [ ] Avatar hiển thị ngay lập tức
- [ ] Reload trang (F5) → Avatar vẫn hiển thị
- [ ] Logout → Login lại → Avatar vẫn hiển thị
- [ ] Kiểm tra Cloudinary dashboard → Ảnh đã upload
- [ ] Kiểm tra MongoDB → Field avatar có URL

---

## 🎉 Kết Luận

**Hoàn thành Hoạt Động 3:**
✅ Upload avatar thành công  
✅ Resize ảnh với Sharp (300x300)  
✅ Upload lên Cloudinary  
✅ Lưu URL vào MongoDB  
✅ Hiển thị avatar trên frontend  
✅ UI đẹp, validation đầy đủ  
✅ Error handling tốt  

**Sẵn sàng demo và nộp!** 🚀

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 3: Upload Avatar - Complete*

