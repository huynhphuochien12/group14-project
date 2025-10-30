# 📮 Hướng Dẫn Test Upload Avatar Trên Postman

## 🎯 Mục Đích

Test API upload avatar để verify:
- Backend API hoạt động
- Sharp resize ảnh
- Cloudinary upload thành công
- MongoDB lưu URL

---

## 📋 Checklist Trước Khi Test

- [ ] Backend đang chạy (`npm start` trong folder `backend`)
- [ ] Đã cài `sharp`: `npm install sharp`
- [ ] File `.env` có đầy đủ Cloudinary config
- [ ] Postman đã cài đặt

---

## 🔑 Bước 1: Login Để Lấy Token

### Request: Login

**Method:** `POST`  
**URL:** 
```
http://localhost:5000/api/auth/login
```

**Headers:**
| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

**Body** → Chọn **raw** → **JSON**:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Click Send** ✈️

### Response Expected:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNmYmQ5YzQ3ZTU5M2FjMGIzNTczNWYiLCJpYXQiOjE3MzAzMjQwMDB9.abc123xyz",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673fbd9c47e593ac0b35735f",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**📋 COPY `accessToken`** - Sẽ dùng cho bước sau!

### Test Accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `admin123` | Admin |
| `moderator@example.com` | `mod123` | Moderator |
| `user1@example.com` | `user123` | User |

---

## 📤 Bước 2: Upload Avatar

### Request: Upload Avatar

**Method:** `POST`  
**URL:**
```
http://localhost:5000/api/profile/avatar
```

### Headers:

| Key | Value |
|-----|-------|
| `Authorization` | `Bearer <paste_token_here>` |

**⚠️ CHÚ Ý:**
- Phải có chữ `Bearer` (viết hoa B)
- Có **1 dấu cách** giữa `Bearer` và token
- Không có dấu ngoặc kép `""`

**Ví dụ đúng:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNmYmQ5YzQ3ZTU5M2FjMGIzNTczNWYiLCJpYXQiOjE3MzAzMjQwMDB9.abc123
```

**Ví dụ sai:**
```
❌ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (thiếu "Bearer ")
❌ Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (thừa dấu :)
❌ "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  (thừa dấu ngoặc)
```

### Body:

1. **Click tab "Body"**
2. **Chọn "form-data"** (KHÔNG phải raw, x-www-form-urlencoded, binary)
3. **Thêm field:**

| Key | Type | Value |
|-----|------|-------|
| `avatar` | **File** ⬇️ | Click "Select Files" → Chọn ảnh |

**Cách đổi type sang File:**
- Khi nhập Key `avatar`, bên phải có dropdown hiển thị "Text"
- Click dropdown → Chọn **"File"**
- Sẽ xuất hiện nút "Select Files"
- Click "Select Files" → Chọn 1 file ảnh (JPEG, PNG, WebP)

**File Requirements:**
- ✅ Format: JPEG, JPG, PNG, WebP
- ✅ Size: Tối đa 5MB
- ❌ Không upload: PDF, DOC, TXT, GIF

### Click Send ✈️

---

## ✅ Bước 3: Kiểm Tra Response

### Response Thành Công (200 OK):

```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/du4zrhwzq/image/upload/v1730324000/avatars/user_673fbd9c47e593ac0b35735f_1730324000.jpg",
  "user": {
    "_id": "673fbd9c47e593ac0b35735f",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "https://res.cloudinary.com/du4zrhwzq/image/upload/v1730324000/avatars/user_673fbd9c47e593ac0b35735f_1730324000.jpg",
    "createdAt": "2024-10-30T10:00:00.000Z"
  }
}
```

**Verify:**
- ✅ Status Code: `200 OK`
- ✅ `message`: "Upload avatar thành công"
- ✅ `avatar`: URL Cloudinary (bắt đầu với `https://res.cloudinary.com/`)
- ✅ `user.avatar`: Cùng URL

### Backend Terminal Log:

Khi upload thành công, terminal backend sẽ log:

```
📸 Processing avatar for user: admin@example.com
   Original size: 1250.45 KB
   Resized size: 45.32 KB
   ✅ Uploaded to: https://res.cloudinary.com/du4zrhwzq/image/upload/v1730324000/avatars/abc.jpg
```

**Verify:**
- ✅ Original size: Kích thước file gốc
- ✅ Resized size: Nhỏ hơn nhiều (đã resize + compress)
- ✅ URL Cloudinary

---

## 🔍 Bước 4: Verify Upload Thành Công

### 4.1. Mở URL Avatar Trên Browser

1. **Copy URL** trong response:
   ```
   https://res.cloudinary.com/du4zrhwzq/image/upload/v.../avatars/abc.jpg
   ```

2. **Paste vào browser** → Enter

3. **Verify:**
   - ✅ Ảnh hiển thị
   - ✅ Kích thước: 300x300 pixels
   - ✅ Format: JPEG
   - ✅ Chất lượng tốt

### 4.2. Kiểm Tra Cloudinary Dashboard

1. Vào: https://cloudinary.com/console
2. Login với account của bạn
3. Click **"Media Library"** (bên trái)
4. Click folder **"avatars"**
5. **Verify:**
   - ✅ Thấy ảnh vừa upload
   - ✅ Tên file: `user_<userId>_<timestamp>.jpg`
   - ✅ Kích thước: 300x300
   - ✅ Format: JPEG

### 4.3. Kiểm Tra Profile API

**Request mới:**

**Method:** `GET`  
**URL:**
```
http://localhost:5000/api/profile
```

**Headers:**
| Key | Value |
|-----|-------|
| `Authorization` | `Bearer <token>` (dùng lại token từ bước 1) |

**Click Send**

**Response:**
```json
{
  "_id": "673fbd9c47e593ac0b35735f",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "avatar": "https://res.cloudinary.com/du4zrhwzq/image/upload/v.../avatars/abc.jpg",
  "createdAt": "2024-10-30T10:00:00.000Z"
}
```

**Verify:**
- ✅ Field `avatar` có URL (đã lưu vào MongoDB)

### 4.4. Upload Avatar Mới (Overwrite)

**Repeat Bước 2** với ảnh khác:
- Upload ảnh mới
- Response có URL mới
- GET `/api/profile` → `avatar` đã update
- Cloudinary có 2 ảnh (cũ + mới)

---

## ❌ Troubleshooting

### 🔴 Lỗi: 401 Unauthorized

**Response:**
```json
{
  "message": "Không có token"
}
```
hoặc
```json
{
  "message": "Token không hợp lệ"
}
```

**Nguyên nhân:**
- Không có header `Authorization`
- Token sai hoặc hết hạn
- Thiếu chữ `Bearer`

**Fix:**
1. Kiểm tra tab **Headers** có dòng `Authorization`
2. Value phải là: `Bearer <token>`
3. Kiểm tra có dấu cách giữa `Bearer` và token
4. Login lại để lấy token mới

---

### 🔴 Lỗi: 400 Bad Request - "Không có file được upload"

**Response:**
```json
{
  "message": "Không có file được upload"
}
```

**Nguyên nhân:**
- Body type không phải `form-data`
- Key không phải `avatar`
- Type không phải `File`
- Chưa chọn file

**Fix:**
1. Tab **Body** → Chọn **form-data**
2. Key: `avatar` (chính xác, lowercase)
3. Type: **File** (dropdown bên phải)
4. Click "Select Files" → Chọn ảnh

---

### 🔴 Lỗi: 400 Bad Request - "Chỉ chấp nhận file ảnh"

**Response:**
```json
{
  "message": "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)"
}
```

**Nguyên nhân:**
- File không phải ảnh (PDF, DOC, TXT, v.v.)

**Fix:**
- Chọn file JPEG, JPG, PNG, hoặc WebP
- Không upload file khác

---

### 🔴 Lỗi: 400 Bad Request - "File quá lớn"

**Response:**
```json
{
  "message": "File quá lớn. Tối đa 5MB"
}
```

**Nguyên nhân:**
- File > 5MB

**Fix:**
- Chọn ảnh nhỏ hơn
- Nén ảnh trước khi upload (online tools: tinypng.com, compressor.io)

---

### 🔴 Lỗi: 500 Internal Server Error

**Response:**
```json
{
  "message": "Lỗi server khi upload avatar",
  "error": "..."
}
```

**Nguyên nhân:**
1. Backend không chạy
2. Chưa cài `sharp`
3. Cloudinary config sai
4. Database lỗi

**Fix:**

**1. Kiểm tra Backend:**
```bash
# Terminal backend có log "Server running on port 5000"?
cd backend
npm start
```

**2. Kiểm tra Sharp:**
```bash
cd backend
npm install sharp
npm start
```

**3. Kiểm tra Cloudinary Config:**

File `.env`:
```env
CLOUDINARY_CLOUD_NAME=du4zrhwzq
CLOUDINARY_API_KEY=924134712367757
CLOUDINARY_API_SECRET=5A8gogppE9koiQS-GCrlugFaB6I
```

**4. Xem Terminal Backend Log:**
- Có error gì?
- Copy error message để debug

---

## 📊 Postman Collection (Optional)

### Tạo Collection Để Tái Sử Dụng

1. **Tạo Collection:**
   - Click "New" → "Collection"
   - Đặt tên: "Group14 - Avatar Upload"

2. **Add Requests:**
   - `POST /auth/login` - Login
   - `POST /profile/avatar` - Upload Avatar
   - `GET /profile` - Get Profile

3. **Setup Collection Variables:**
   - Click Collection → "Variables" tab
   - Add variable:
     - `baseUrl`: `http://localhost:5000/api`
     - `token`: (để trống, sẽ tự động set)

4. **Update Request URLs:**
   - Thay `http://localhost:5000/api` bằng `{{baseUrl}}`
   - VD: `{{baseUrl}}/auth/login`

5. **Auto-save Token:**
   - Request Login → Tab "Tests"
   - Thêm script:
     ```javascript
     const response = pm.response.json();
     pm.collectionVariables.set("token", response.accessToken);
     ```

6. **Use Token Auto:**
   - Request Upload → Headers:
     - `Authorization`: `Bearer {{token}}`

---

## 📸 Screenshots Checklist

### Demo Screenshots Cần Chụp:

1. ✅ **Postman - Login Request**
   - URL, Headers, Body, Response

2. ✅ **Postman - Upload Avatar Request**
   - URL, Headers (với token), Body (form-data với file)

3. ✅ **Postman - Upload Success Response**
   - Status 200, JSON với avatar URL

4. ✅ **Terminal Backend Log**
   - Processing log với original/resized size

5. ✅ **Browser - Avatar Image**
   - Mở URL Cloudinary → Ảnh 300x300

6. ✅ **Cloudinary Dashboard**
   - Media Library → folder avatars/ → ảnh

7. ✅ **Postman - Get Profile Response**
   - Field `avatar` có URL

---

## 🎯 Test Cases Summary

| Test Case | Method | Endpoint | Expected |
|-----------|--------|----------|----------|
| Login thành công | POST | `/auth/login` | 200, token |
| Upload JPEG | POST | `/profile/avatar` | 200, URL |
| Upload PNG | POST | `/profile/avatar` | 200, URL |
| Upload WebP | POST | `/profile/avatar` | 200, URL |
| Upload PDF (fail) | POST | `/profile/avatar` | 400, error |
| Upload file > 5MB (fail) | POST | `/profile/avatar` | 400, error |
| Upload without token (fail) | POST | `/profile/avatar` | 401, error |
| Get profile after upload | GET | `/profile` | 200, avatar URL |

---

## ✅ Checklist Hoàn Thành

- [ ] Login thành công, có token
- [ ] Upload avatar thành công (200 OK)
- [ ] Response có URL Cloudinary
- [ ] Terminal backend log processing
- [ ] Mở URL → Thấy ảnh 300x300
- [ ] Cloudinary dashboard có ảnh
- [ ] GET `/profile` → Field `avatar` có URL
- [ ] Screenshots đầy đủ

---

## 🎉 Kết Luận

**Nếu tất cả test pass:**
✅ Backend API hoạt động  
✅ Sharp resize ảnh thành công  
✅ Cloudinary upload thành công  
✅ MongoDB lưu URL thành công  
✅ **Sẵn sàng demo!**  

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 3: Postman Test Guide*

