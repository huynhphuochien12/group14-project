# 🚀 Hướng Dẫn Deployment Chi Tiết - Group 14 Project

## 📋 Mục Lục
1. [Chuẩn Bị](#chuẩn-bị)
2. [Deploy MongoDB Atlas](#1-deploy-mongodb-atlas)
3. [Deploy Backend trên Render](#2-deploy-backend-trên-render)
4. [Deploy Backend trên Railway (Tùy chọn)](#3-deploy-backend-trên-railway-tùy-chọn)
5. [Deploy Frontend trên Vercel](#4-deploy-frontend-trên-vercel)
6. [Kết Nối Frontend - Backend](#5-kết-nối-frontend---backend)
7. [Kiểm Tra & Testing](#6-kiểm-tra--testing)

---

## 🔧 Chuẩn Bị

### Bước 1: Đảm bảo code đã push lên GitHub
```bash
# Kiểm tra trạng thái
git status

# Add và commit nếu có thay đổi
git add .
git commit -m "Prepare for deployment"

# Push lên GitHub
git push origin main
```

### Bước 2: Chuẩn bị thông tin cần thiết
- ✅ GitHub account (bạn đã có repo: https://github.com/huynhphuochien12/group14-project)
- ✅ Email để đăng ký các dịch vụ
- ✅ Thông tin MongoDB Atlas (sẽ tạo ở bước sau)

---

## 1. Deploy MongoDB Atlas

### Bước 1.1: Tạo tài khoản và Cluster
1. Truy cập: https://cloud.mongodb.com
2. Đăng ký/Đăng nhập với email
3. Click **"Build a Database"** hoặc **"New Project"**
4. Chọn **FREE (M0) tier** → **Create Cluster**
5. Chọn cloud provider và region gần nhất (ví dụ: AWS, region Singapore)
6. Đặt tên cluster (ví dụ: `group14-cluster`)
7. Click **"Create Cluster"** (mất vài phút)

### Bước 1.2: Tạo Database User
1. Trong màn hình cluster, tìm **"Database Access"** (menu bên trái)
2. Click **"Add New Database User"**
3. Chọn **"Password"** authentication
4. Tạo username và password (LƯU LẠI!)
   - Username: `group14user` (hoặc tùy chọn)
   - Password: (tạo mật khẩu mạnh)
5. Database User Privileges: Chọn **"Read and write to any database"**
6. Click **"Add User"**

### Bước 1.3: Cấu hình Network Access
1. Vào **"Network Access"** (menu bên trái)
2. Click **"Add IP Address"**
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0) - để cho phép từ Render/Railway
4. Click **"Confirm"**

### Bước 1.4: Lấy Connection String
1. Vào **"Database"** → Click **"Connect"** trên cluster
2. Chọn **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string, có dạng:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **THAY THẾ `<username>` và `<password>`** bằng username và password vừa tạo
6. **THÊM tên database** vào cuối:
   ```
   mongodb+srv://group14user:yourpassword@cluster0.xxxxx.mongodb.net/group14DB?retryWrites=true&w=majority
   ```
7. **LƯU LẠI** connection string này để dùng cho Render/Railway!

---

## 2. Deploy Backend trên Render

### Bước 2.1: Đăng ký và tạo Web Service
1. Truy cập: https://render.com
2. Đăng nhập bằng GitHub (Sign in with GitHub)
3. Authorize Render để truy cập GitHub repos
4. Click **"New +"** → Chọn **"Web Service"**
5. Click **"Connect"** nếu chưa kết nối GitHub account

### Bước 2.2: Chọn Repository và Cấu hình
1. Chọn repository: `huynhphuochien12/group14-project`
2. Đặt tên service: `group14-backend` (hoặc tùy chọn)
3. **Cấu hình Build:**
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ QUAN TRỌNG!
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Chọn **Free** (có thể nâng cấp sau)

### Bước 2.3: Thêm Environment Variables
Trong phần **"Environment Variables"**, thêm các biến sau:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `MONGO_URI` | `mongodb+srv://group14user:password@cluster0.xxxxx.mongodb.net/group14DB?retryWrites=true&w=majority` | Connection string từ MongoDB Atlas (đã thay username/password) |
| `JWT_SECRET` | `your_super_secret_jwt_key_123456` | Tạo chuỗi ngẫu nhiên, dài, bảo mật |
| `JWT_EXPIRES_IN` | `1d` | Thời gian hết hạn token |
| `JWT_REFRESH_SECRET` | `your_refresh_secret_key_456789` | Secret cho refresh token |
| `PORT` | `10000` | Port mặc định của Render (hoặc để trống) |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Nếu dùng Cloudinary (có thể để trống nếu chưa có) |
| `CLOUDINARY_API_KEY` | `your_api_key` | Nếu dùng Cloudinary |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Nếu dùng Cloudinary |
| `SMTP_HOST` | `smtp.gmail.com` | Nếu dùng email (có thể để trống) |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `your_email@gmail.com` | |
| `SMTP_PASS` | `your_app_password` | Gmail App Password |
| `CLIENT_URL` | `https://your-frontend.vercel.app` | URL frontend (sẽ cập nhật sau khi deploy frontend) |

**Lưu ý**: 
- Chỉ thêm các biến mà backend của bạn thực sự sử dụng
- Các biến không bắt buộc có thể để trống nếu không cần

### Bước 2.4: Deploy
1. Scroll xuống, click **"Create Web Service"**
2. Render sẽ tự động:
   - Clone code từ GitHub
   - Chạy `npm install` trong thư mục `backend`
   - Chạy `npm start`
3. Chờ build và deploy (5-10 phút)
4. Khi thành công, bạn sẽ thấy: **"Live"** với URL: `https://group14-backend.onrender.com`

### Bước 2.5: Kiểm tra Backend
1. Mở URL backend: `https://group14-backend.onrender.com`
2. Nếu thấy message: `🚀 Backend is running` → **Thành công!**
3. Test API: `https://group14-backend.onrender.com/api/auth/login` (POST)

**Lưu ý**: 
- Render free tier có **spin down** sau 15 phút không dùng → lần đầu truy cập sẽ mất 30-60 giây để wake up
- Nếu cần production, nên nâng cấp lên paid plan

---

## 3. Deploy Backend trên Railway (Tùy chọn)

Nếu muốn dùng Railway thay vì Render:

### Bước 3.1: Đăng ký Railway
1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**

### Bước 3.2: Cấu hình
1. Chọn repo: `group14-project`
2. Railway tự động detect Node.js
3. **Settings** → **Root Directory**: Đặt là `backend`
4. **Settings** → **Start Command**: `npm start`

### Bước 3.3: Environment Variables
Vào **Variables** tab, thêm các biến giống như Render:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `PORT` (Railway tự set, có thể để trống)
- Và các biến khác...

### Bước 3.4: Deploy
Railway tự động deploy. URL sẽ có dạng: `https://group14-backend.up.railway.app`

---

## 4. Deploy Frontend trên Vercel

### Bước 4.1: Đăng ký Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Authorize Vercel

### Bước 4.2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import từ GitHub: Chọn repo `group14-project`
3. Click **"Import"**

### Bước 4.3: Cấu hình Build
1. **Framework Preset**: `Create React App`
2. **Root Directory**: `frontend` ⚠️ QUAN TRỌNG!
3. **Build Command**: `npm run build` (hoặc để tự động)
4. **Output Directory**: `build` (Vercel tự detect)
5. **Install Command**: `npm install`

### Bước 4.4: Environment Variables
Trong **Environment Variables**, thêm:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://group14-backend.onrender.com/api` ⚠️ Lưu ý: có `/api` ở cuối! |

Hoặc nếu dùng Railway:
- `REACT_APP_API_URL` = `https://group14-backend.up.railway.app/api`

**Lưu ý**: 
- Không có `/api` nếu backend của bạn không dùng prefix `/api`
- Kiểm tra lại trong `backend/server.js` để xác nhận

### Bước 4.5: Deploy
1. Click **"Deploy"**
2. Chờ build (2-5 phút)
3. Khi thành công, bạn sẽ thấy URL: `https://group14-project.vercel.app`

### Bước 4.6: Kiểm tra Frontend
1. Mở URL frontend
2. Test đăng nhập/đăng ký
3. Kiểm tra console browser xem có lỗi API không

---

## 5. Kết Nối Frontend - Backend

### Bước 5.1: Cập nhật CORS trên Backend (nếu cần)
Mở `backend/server.js`, đảm bảo CORS cho phép frontend:
```javascript
const cors = require("cors");

app.use(cors({
  origin: [
    "https://group14-project.vercel.app",
    "http://localhost:3000" // cho development
  ],
  credentials: true
}));
```

Hoặc cho phép tất cả:
```javascript
app.use(cors());
```

Sau đó commit và push lại để Render tự động deploy lại.

### Bước 5.2: Cập nhật CLIENT_URL trong Backend
Vào Render → Environment Variables → Cập nhật:
- `CLIENT_URL` = `https://group14-project.vercel.app`

### Bước 5.3: Cập nhật REACT_APP_API_URL (nếu cần)
Nếu thay đổi backend URL, vào Vercel → Settings → Environment Variables → Cập nhật `REACT_APP_API_URL`

### Bước 5.4: Redeploy
- **Backend (Render)**: Auto-redeploy khi push code mới, hoặc Manual Redeploy
- **Frontend (Vercel)**: Auto-redeploy khi push code mới, hoặc Manual Redeploy

---

## 6. Kiểm Tra & Testing

### Checklist Testing:

✅ **Backend:**
- [ ] Truy cập: `https://your-backend.onrender.com` → Thấy "Backend is running"
- [ ] Test API: POST `/api/auth/register` với email/password
- [ ] Test API: POST `/api/auth/login` với credentials hợp lệ
- [ ] Kiểm tra logs trên Render xem có lỗi không

✅ **Frontend:**
- [ ] Truy cập: `https://your-frontend.vercel.app`
- [ ] Test đăng ký user mới
- [ ] Test đăng nhập
- [ ] Test xem profile
- [ ] Kiểm tra console browser (F12) xem có lỗi không

✅ **Database:**
- [ ] Vào MongoDB Atlas → Browse Collections
- [ ] Kiểm tra có data được tạo không (users collection)

✅ **CORS & API:**
- [ ] Frontend gọi được API từ backend
- [ ] Không có CORS error trong console

---

## 🔧 Troubleshooting

### Backend không start:
- Kiểm tra logs trên Render/Railway
- Đảm bảo `MONGO_URI` đúng format
- Kiểm tra `PORT` environment variable
- Đảm bảo `Root Directory` = `backend`

### Frontend không kết nối được API:
- Kiểm tra `REACT_APP_API_URL` trong Vercel
- Đảm bảo có `/api` ở cuối (hoặc không, tùy backend)
- Kiểm tra CORS trên backend
- Mở Network tab (F12) xem request có gửi đi không

### MongoDB connection failed:
- Kiểm tra Network Access trên MongoDB Atlas (phải allow 0.0.0.0/0)
- Kiểm tra username/password trong connection string
- Kiểm tra database name trong connection string

### Render/Railway báo lỗi build:
- Kiểm tra `package.json` có đúng không
- Kiểm tra `Root Directory` có đúng không
- Kiểm tra logs để xem lỗi cụ thể

---

## 📝 Ghi Chú Quan Trọng

1. **Render Free Tier**: 
   - Spin down sau 15 phút không dùng
   - Wake up lần đầu mất 30-60 giây
   - Có giới hạn bandwidth

2. **Vercel Free Tier**:
   - Không giới hạn deployments
   - Tự động deploy khi push code
   - Có giới hạn build time

3. **MongoDB Atlas Free Tier**:
   - 512MB storage
   - Shared cluster (có thể chậm vào giờ cao điểm)
   - Không giới hạn connections

4. **Environment Variables**:
   - KHÔNG commit `.env` lên GitHub
   - Luôn thêm vào platform deployment settings
   - Kiểm tra lại giá trị sau khi deploy

5. **URLs cuối cùng:**
   - Frontend: `https://group14-project.vercel.app`
   - Backend: `https://group14-backend.onrender.com`
   - API Base: `https://group14-backend.onrender.com/api`

---

## ✅ Kết Quả Cuối Cùng

Sau khi hoàn thành, bạn sẽ có:

- ✅ Frontend chạy trên Vercel (link public)
- ✅ Backend chạy trên Render/Railway (link public)
- ✅ Database trên MongoDB Atlas (cloud)
- ✅ Hệ thống hoạt động online, có thể demo đầy đủ
- ✅ Tự động deploy khi push code mới lên GitHub

**Chúc bạn deploy thành công! 🎉**

