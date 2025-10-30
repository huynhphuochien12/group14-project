# 🔀 Hướng Dẫn Tạo Pull Request GitHub

## 📋 Checklist Trước Khi PR

- [ ] Code đã hoàn thành
- [ ] Đã test upload avatar thành công
- [ ] Không có lỗi linter
- [ ] Không commit file `.env`
- [ ] Backend và Frontend đều chạy tốt

---

## 🔧 Bước 1: Commit Code

### 1.1. Kiểm Tra Files Đã Thay Đổi

```bash
cd D:\TH-PTMNM_B4\group14-project
git status
```

### 1.2. Add Files

```bash
# Add tất cả files (trừ .env - đã có trong .gitignore)
git add .

# Hoặc add từng file cụ thể
git add backend/routes/profileRoutes.js
git add backend/AVATAR_UPLOAD_GUIDE.md
git add backend/HOAT_DONG_3_SUMMARY.md
git add frontend/src/components/profile/AvatarUpload.jsx
git add DEMO_UPLOAD_AVATAR.md
git add GITHUB_PR_GUIDE.md
```

### 1.3. Commit với Message Rõ Ràng

```bash
git commit -m "feat: Implement Avatar Upload with Sharp + Cloudinary

- Add Sharp image processing (resize 300x300, quality 80%)
- Upload to Cloudinary with streaming
- Save avatar URL to MongoDB
- Frontend: AvatarUpload component with preview & validation
- Add comprehensive documentation and demo guide

Features:
- File validation (type & size)
- Real-time preview
- Loading states
- Error handling
- Toast notifications

Backend (SV1):
- POST /api/profile/avatar API
- Multer + Sharp + Cloudinary integration
- JWT authentication
- Detailed logging

Frontend (SV2):
- Upload component with modern UI
- File preview before upload
- Validation feedback
- Auto reload after upload

Cloudinary (SV3):
- Config setup
- Upload to avatars/ folder
- MongoDB URL storage"
```

---

## 🚀 Bước 2: Push Lên Nhánh

### 2.1. Nếu Đang Ở Nhánh `feature/rbac`

```bash
# Kiểm tra nhánh hiện tại
git branch

# Push lên nhánh feature/rbac
git push origin feature/rbac
```

### 2.2. Hoặc Tạo Nhánh Mới `feature/avatar-upload`

```bash
# Tạo nhánh mới từ main
git checkout main
git pull origin main

# Tạo nhánh feature mới
git checkout -b feature/avatar-upload

# Add & commit code
git add .
git commit -m "feat: Implement Avatar Upload..."

# Push lên remote
git push -u origin feature/avatar-upload
```

---

## 🌐 Bước 3: Tạo Pull Request Trên GitHub

### 3.1. Mở GitHub Repository

1. Vào: https://github.com/YOUR_USERNAME/group14-project
2. Sẽ thấy banner: **"feature/avatar-upload had recent pushes"**
3. Click nút **"Compare & pull request"**

### 3.2. Điền Thông Tin PR

**Title:**
```
feat: Implement Advanced Avatar Upload (Hoạt Động 3)
```

**Description:**

```markdown
## 📸 Hoạt Động 3 - Upload Ảnh Nâng Cao (Avatar)

### ✅ Mục Tiêu
Cho phép upload ảnh đại diện, resize trước khi lưu, lưu lên Cloudinary.

### 🎯 Đã Hoàn Thành

#### SV1: Backend API
- ✅ API `/api/profile/avatar` với Multer + Sharp + Cloudinary
- ✅ Middleware xác thực JWT (`protect`)
- ✅ Resize ảnh 300x300, quality 80%
- ✅ Upload lên Cloudinary folder `avatars/`
- ✅ Validation file type & size
- ✅ Detailed logging

#### SV3: Cloudinary & MongoDB
- ✅ Tạo Cloudinary account
- ✅ Config credentials trong `.env`
- ✅ Test upload và lấy URL
- ✅ Lưu avatar URL vào MongoDB

#### SV2: Frontend
- ✅ Component `AvatarUpload.jsx`
- ✅ File picker với validation
- ✅ Preview ảnh trước khi upload
- ✅ Loading states & error handling
- ✅ Toast notifications
- ✅ Hiển thị avatar sau upload
- ✅ Auto reload user data

### 📦 Files Changed

**Backend:**
- `routes/profileRoutes.js` - Upload API với Sharp
- `package.json` - Added `sharp` dependency
- `AVATAR_UPLOAD_GUIDE.md` - Setup & test guide
- `HOAT_DONG_3_SUMMARY.md` - Complete summary

**Frontend:**
- `components/profile/AvatarUpload.jsx` - Upload component
- `components/profile/ProfilePage.jsx` - Integration

**Documentation:**
- `DEMO_UPLOAD_AVATAR.md` - Demo guide
- `GITHUB_PR_GUIDE.md` - PR instructions

### 🧪 Testing

#### Manual Test
1. ✅ Backend: `npm start`
2. ✅ Frontend: `npm start`
3. ✅ Login → Profile page
4. ✅ Upload avatar (JPEG, PNG, WebP)
5. ✅ Avatar displays immediately
6. ✅ Reload page → Avatar persists
7. ✅ Cloudinary: Image uploaded (300x300)
8. ✅ MongoDB: URL saved in user document

#### API Test (Postman)
```http
POST http://localhost:5000/api/profile/avatar
Authorization: Bearer <token>
Body: form-data { avatar: <file> }

Response: 200 OK
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/...",
  "user": { ... }
}
```

### 📸 Screenshots
(Đính kèm screenshots nếu có)

### 🔗 Related Issues
- Closes #3 (Hoạt Động 3 - Upload Avatar)

### 📚 Documentation
- Setup guide: `backend/AVATAR_UPLOAD_GUIDE.md`
- Demo guide: `DEMO_UPLOAD_AVATAR.md`
- Summary: `backend/HOAT_DONG_3_SUMMARY.md`

### ⚠️ Notes
- File `.env` không được commit (đã có trong `.gitignore`)
- Cần cài `sharp`: `npm install sharp` trong backend
- Cần setup Cloudinary account với credentials trong `.env`

### ✅ Checklist
- [x] Code compiles without errors
- [x] Manual testing completed
- [x] API testing completed
- [x] Documentation updated
- [x] No `.env` file committed
- [x] All features working as expected
```

### 3.3. Assign Reviewers (Nếu Có)

Chọn teammates để review code.

### 3.4. Add Labels

- `feature`
- `enhancement`
- `hoạt động 3`

### 3.5. Create Pull Request

Click **"Create pull request"**

---

## 📝 Bước 4: Copy Link PR

Sau khi tạo PR, copy link:

```
https://github.com/YOUR_USERNAME/group14-project/pull/3
```

**Link này dùng để nộp bài!**

---

## 🎬 Bước 5: Demo Screenshots

### Chụp Screenshots Sau:

#### 1. Trang Profile với Avatar Upload Component
- Before upload (default avatar)

#### 2. Chọn Ảnh
- Preview hiển thị
- Text "✓ Đã chọn: ..."

#### 3. Upload Thành Công
- Toast notification
- Avatar mới hiển thị

#### 4. Terminal Backend Log
```
📸 Processing avatar for user: user@example.com
   Original size: 1250.45 KB
   Resized size: 45.32 KB
   ✅ Uploaded to: https://...
```

#### 5. Cloudinary Dashboard
- Folder `avatars/` với ảnh 300x300

#### 6. MongoDB Document
```json
{
  "_id": "...",
  "name": "User Name",
  "email": "user@example.com",
  "avatar": "https://res.cloudinary.com/..."
}
```

#### 7. GitHub PR Page
- PR title, description, files changed

---

## 📦 Bước 6: Chuẩn Bị Nộp Bài

### Sản Phẩm Nộp Bao Gồm:

1. **Link GitHub PR:**
   ```
   https://github.com/YOUR_USERNAME/group14-project/pull/3
   ```

2. **Demo Video/Screenshots:**
   - Upload avatar thành công
   - Avatar hiển thị trên frontend
   - Terminal backend log
   - Cloudinary dashboard
   - MongoDB data

3. **Tài Liệu:**
   - `DEMO_UPLOAD_AVATAR.md` - Hướng dẫn demo
   - `backend/AVATAR_UPLOAD_GUIDE.md` - Setup guide
   - `backend/HOAT_DONG_3_SUMMARY.md` - Technical summary

---

## 🔍 Review Checklist

Trước khi nộp, đảm bảo:

- [x] PR đã tạo thành công trên GitHub
- [x] Link PR hoạt động
- [x] Code không có lỗi
- [x] Đã test upload avatar thành công
- [x] Screenshots đầy đủ
- [x] Documentation đầy đủ
- [x] Không commit file `.env`
- [x] `package.json` có `sharp` trong dependencies

---

## 🎉 Hoàn Thành!

**Bạn đã sẵn sàng nộp bài Hoạt Động 3!**

### Tóm Tắt Nộp:
1. ✅ Link PR GitHub
2. ✅ Demo screenshots
3. ✅ Backend + Frontend hoạt động
4. ✅ Avatar upload thành công
5. ✅ Cloudinary + MongoDB integration

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 3: GitHub PR Guide*

