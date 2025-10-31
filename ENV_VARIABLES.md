# 🔐 Environment Variables Cần Thiết

## Backend (Render/Railway)

### Bắt buộc:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/group14DB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_at_least_32_characters
PORT=10000
```

### Tùy chọn (nếu dùng tính năng):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Tech University <your_email@gmail.com>"

CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

## Frontend (Vercel)

### Bắt buộc:
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Lưu ý**: 
- Thay `your-backend.onrender.com` bằng URL backend thực tế của bạn
- Có `/api` ở cuối vì backend sử dụng prefix `/api` cho routes

## 📝 Hướng Dẫn Tạo JWT_SECRET

JWT_SECRET nên là chuỗi ngẫu nhiên, dài, khó đoán:

**Cách tạo (trên Windows PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Hoặc dùng online:**
- https://www.random.org/strings/
- Tạo 1 string, length 64, characters: All letters and numbers

**Ví dụ JWT_SECRET:**
```
aB3dEf9gHi2jKl4mNo6pQr8sTu1vWx5yZ7aB3dEf9gHi2jKl4mNo6pQr8sTu1vWx5yZ7
```

## 🔒 Security Notes

1. **KHÔNG bao giờ commit file `.env` lên GitHub**
2. **KHÔNG share JWT_SECRET và MongoDB password công khai**
3. Luôn thêm environment variables trong platform settings (Vercel/Render)
4. Sử dụng các giá trị khác nhau cho development và production

