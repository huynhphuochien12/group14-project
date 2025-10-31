# ⚡ Quick Deployment Checklist

## 🎯 Thứ Tự Thực Hiện

### 1️⃣ MongoDB Atlas (5 phút)
- [ ] Đăng ký: https://cloud.mongodb.com
- [ ] Tạo cluster FREE
- [ ] Tạo database user
- [ ] Allow IP: 0.0.0.0/0
- [ ] Copy connection string (thay username/password, thêm database name)

### 2️⃣ Backend trên Render (10 phút)
- [ ] Đăng nhập: https://render.com (bằng GitHub)
- [ ] New Web Service → Chọn repo `group14-project`
- [ ] Cấu hình:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Thêm Environment Variables:
  ```
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=your_secret_key
  JWT_EXPIRES_IN=1d
  JWT_REFRESH_SECRET=your_refresh_secret
  PORT=10000
  CLIENT_URL=https://your-frontend.vercel.app (cập nhật sau)
  ```
- [ ] Deploy → Lấy URL backend: `https://xxx.onrender.com`

### 3️⃣ Frontend trên Vercel (5 phút)
- [ ] Đăng nhập: https://vercel.com (bằng GitHub)
- [ ] New Project → Import repo `group14-project`
- [ ] Cấu hình:
  - Root Directory: `frontend`
  - Framework: Create React App
- [ ] Thêm Environment Variable:
  ```
  REACT_APP_API_URL=https://xxx.onrender.com/api
  ```
- [ ] Deploy → Lấy URL frontend: `https://xxx.vercel.app`

### 4️⃣ Kết Nối (2 phút)
- [ ] Cập nhật `CLIENT_URL` trong Render = URL frontend Vercel
- [ ] Test frontend → đăng nhập/đăng ký
- [ ] Kiểm tra MongoDB Atlas → xem có data không

## 📝 URLs Cần Lưu

Sau khi deploy, lưu lại:
- Frontend: `https://________________.vercel.app`
- Backend: `https://________________.onrender.com`
- MongoDB Atlas: Cluster name: `________________`

## ✅ Test Checklist

- [ ] Frontend mở được, không lỗi
- [ ] Backend `/` → "🚀 Backend is running"
- [ ] Đăng ký user mới thành công
- [ ] Đăng nhập thành công
- [ ] MongoDB có data trong collection `users`

## 🆘 Nếu Lỗi

1. **Backend không start**: Kiểm tra logs Render → thường do `MONGO_URI` sai
2. **Frontend không kết nối API**: Kiểm tra `REACT_APP_API_URL` trong Vercel
3. **CORS error**: Backend đã config CORS tự động, nếu vẫn lỗi → check lại

---

📖 Xem hướng dẫn chi tiết trong `DEPLOYMENT_GUIDE.md`

