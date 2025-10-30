# 🔐 Hướng Dẫn Setup & Test Forgot Password

## 📋 Mục Lục
1. [Setup Gmail SMTP](#setup-gmail-smtp)
2. [Cấu Hình Backend](#cấu-hình-backend)
3. [Test Forgot Password](#test-forgot-password)
4. [Troubleshooting](#troubleshooting)

---

## 🔧 Setup Gmail SMTP

### Bước 1: Bật 2-Step Verification

1. **Mở trình duyệt**, vào:
   ```
   https://myaccount.google.com/security
   ```

2. **Tìm section "Signing in to Google"**

3. **Click "2-Step Verification"**

4. **Làm theo hướng dẫn để bật:**
   - Nhập số điện thoại
   - Nhận mã xác thực
   - Hoàn tất setup

5. **Verify:** Thấy "2-Step Verification is ON" ✅

---

### Bước 2: Tạo App Password

1. **Vào:**
   ```
   https://myaccount.google.com/apppasswords
   ```

2. **Nếu không thấy option "App passwords":**
   - Đảm bảo đã bật 2-Step Verification (Bước 1)
   - Hoặc search "App passwords" trong Google Account settings

3. **Select app:** 
   - Dropdown → Chọn **"Mail"**

4. **Select device:**
   - Dropdown → Chọn **"Other (Custom name)"**
   - Nhập: `Node.js Backend` hoặc `Group14 Project`

5. **Click "Generate"**

6. **Copy App Password:**
   - Google hiển thị password 16 ký tự: `abcd efgh ijkl mnop`
   - **Copy toàn bộ** (bao gồm cả dấu cách)
   - Lưu vào Notepad tạm thời

⚠️ **Lưu ý:** App password chỉ hiển thị **1 lần**! Sau khi đóng popup, bạn không thể xem lại. Nếu mất, phải tạo password mới.

---

## ⚙️ Cấu Hình Backend

### Bước 1: Cập Nhật File `.env`

**Mở file:** `backend/.env`

**Thêm/Cập nhật các dòng sau:**

```env
# SMTP Config cho gửi email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="Tech University <your.email@gmail.com>"

# Client URL (cho reset link)
CLIENT_URL=http://localhost:3000
```

**Thay thế:**
- `your.email@gmail.com` → Email Gmail của bạn (ví dụ: `phamtruongan.711@gmail.com`)
- `abcdefghijklmnop` → App password 16 ký tự vừa copy (bỏ hết dấu cách!)

**Ví dụ:**
```env
SMTP_USER=phamtruongan.711@gmail.com
SMTP_PASS=sbwtpqixekpmpsgi
SMTP_FROM="Tech University <phamtruongan.711@gmail.com>"
```

⚠️ **Quan trọng:** 
- App password **KHÔNG có dấu cách**! 
- Google hiển thị: `sbwt pqix ekpm psgi`
- Bạn paste vào .env: `sbwtpqixekpmpsgi`

---

### Bước 2: Verify Config

**Terminal:**
```bash
cd backend
cat .env | grep SMTP
```

**Expected output:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=phamtruongan.711@gmail.com
SMTP_PASS=sbwtpqixekpmpsgi
SMTP_FROM="Tech University <phamtruongan.711@gmail.com>"
```

✅ Kiểm tra:
- `SMTP_PASS` có đúng 16 ký tự không?
- Không có dấu cách trong password?
- Email đúng không?

---

### Bước 3: Restart Backend

```bash
# Ctrl + C để stop backend (nếu đang chạy)
# Rồi start lại:
cd backend
npm start
```

**Expected log:**
```
✅ Server running on port 5000
✅ MongoDB connected successfully
```

---

## 🧪 Test Forgot Password

### Test 1: Forgot Password - Send Email

#### Frontend Test

**Step 1:** Mở browser
```
http://localhost:3000/login
```

**Step 2:** Click link **"Quên mật khẩu?"** (dưới form)

**Step 3:** Nhập email test
```
Email: admin@example.com
```
(Hoặc email user đã tạo trong DB)

**Step 4:** Click **"Gửi Email Đặt Lại Mật Khẩu"**

**Step 5:** Thấy success screen:
```
📧 Email Đã Được Gửi!
Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
```

---

#### Backend Terminal Log

**Expected:**
```
🔑 Reset token generated for: admin@example.com
🔗 Reset URL: http://localhost:3000/reset-password?token=abc123xyz...
✅ Reset password email sent to: admin@example.com
```

✅ **Success!** Nếu thấy log này, email đã được gửi!

---

#### Check Email

**Step 1:** Mở Gmail (email của user `admin@example.com`)

⚠️ **Lưu ý:** Email sẽ gửi đến **email thật** của user trong DB, KHÔNG phải `SMTP_USER`!

**Ví dụ:**
- `SMTP_USER=phamtruongan.711@gmail.com` (email gửi đi)
- User trong DB: `admin@example.com` → `your.real.email@gmail.com`
- Email sẽ gửi đến: `your.real.email@gmail.com`

**Step 2:** Tìm email:
- **Subject:** `🔐 Đặt lại mật khẩu - Tech University`
- **From:** `Tech University <phamtruongan.711@gmail.com>`

**Step 3:** Mở email → Thấy:
- Header gradient màu tím
- "Xin chào Admin User"
- Button **"Đặt Lại Mật Khẩu"**
- Reset URL đầy đủ
- Warning: Link hết hạn sau 1 giờ

**Step 4:** Click button **"Đặt Lại Mật Khẩu"**

Browser mở:
```
http://localhost:3000/reset-password?token=abc123xyz...
```

---

### Test 2: Reset Password

**Step 1:** Browser tự mở form reset password

**Step 2:** Nhập mật khẩu mới:
```
Mật khẩu mới: newpassword123
Xác nhận mật khẩu: newpassword123
```

**Validation real-time:**
- ✅ "Độ dài hợp lệ" (nếu ≥ 6 chars)
- ✅ "Mật khẩu khớp"

**Step 3:** Click **"Đặt Lại Mật Khẩu"**

**Step 4:** Thấy success screen:
```
✅ Thành Công!
Mật khẩu của bạn đã được đặt lại thành công.
Đang chuyển đến trang đăng nhập...
```

**Step 5:** Auto redirect đến `/login` (2 giây)

---

#### Backend Terminal Log

**Expected:**
```
🔐 Resetting password for user: admin@example.com
✅ Password reset successful for: admin@example.com
📧 Password reset confirmation email sent to: admin@example.com
```

---

#### Check Confirmation Email (Optional)

**Subject:** `✅ Mật khẩu đã được đặt lại - Tech University`

**Content:**
- Header xanh lá
- "Mật khẩu của bạn đã được đặt lại thành công"
- Security note

---

### Test 3: Login với Password Mới

**Step 1:** Trang login
```
Email: admin@example.com
Password: newpassword123 (mật khẩu MỚI)
```

**Step 2:** Click **"Đăng nhập"**

**Step 3:** ✅ Login thành công!

---

## 📮 Test với Postman (Alternative)

### Request 1: Forgot Password

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "admin@example.com"
}
```

**Send** → Response:
```json
{
  "message": "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
}
```

**Backend log:**
```
🔑 Reset token generated for: admin@example.com
🔗 Reset URL: http://localhost:3000/reset-password?token=abc123...
✅ Reset password email sent to: admin@example.com
```

**Copy reset URL từ log**, paste vào browser hoặc dùng cho request tiếp.

---

### Request 2: Reset Password

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "token": "abc123xyz...",
  "password": "newpassword123"
}
```

**Send** → Response:
```json
{
  "message": "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới."
}
```

---

## ❌ Troubleshooting

### Lỗi 1: "Lỗi gửi email"

**Backend log:**
```
❌ Lỗi gửi email: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Nguyên nhân:**
- App password sai
- Hoặc chưa bật 2-Step Verification

**Fix:**
1. Kiểm tra `.env` → `SMTP_PASS` đúng 16 ký tự không?
2. Bỏ hết dấu cách trong password
3. Verify 2-Step Verification đã bật
4. Tạo lại App Password mới
5. Restart backend

---

### Lỗi 2: "SMTP not configured"

**Backend response:**
```json
{
  "message": "SMTP chưa được cấu hình. Token để test:",
  "resetToken": "abc123...",
  "resetUrl": "http://localhost:3000/reset-password?token=abc123..."
}
```

**Nguyên nhân:**
- File `.env` thiếu SMTP config
- Hoặc backend chưa load `.env`

**Fix:**
1. Kiểm tra file `.env` có đầy đủ:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=...
   SMTP_PASS=...
   ```
2. Restart backend: `npm start`

**Workaround để test:**
- Copy `resetUrl` từ response
- Paste vào browser để test reset password
- Email sẽ không được gửi, nhưng flow vẫn hoạt động

---

### Lỗi 3: Email không nhận được

**Checklist:**
1. ✅ Backend log có "Email sent"?
   - Không → Check SMTP config
   - Có → Tiếp tục

2. ✅ Email user trong DB đúng chưa?
   - Vào MongoDB → Collection `users`
   - Check field `email` của user test
   - Email phải là email THẬT (Gmail, Outlook, v.v.)

3. ✅ Check thư mục **Spam** trong Gmail

4. ✅ Đợi vài phút (email có thể delay)

5. ✅ Check Gmail quota:
   - Gmail free: Max 500 emails/day
   - Nếu quá nhiều test → Đợi 24h

---

### Lỗi 4: "Token không hợp lệ hoặc đã hết hạn"

**Nguyên nhân:**
- Token đã hết hạn (> 1 giờ)
- Token sai
- Đã sử dụng token rồi

**Fix:**
1. Request forgot password lại để lấy token mới
2. Click link reset trong vòng 1 giờ
3. Mỗi token chỉ dùng **1 lần**

---

### Lỗi 5: Password reset thành công nhưng vẫn login sai

**Nguyên nhân:**
- Password chưa được hash đúng
- Cache browser

**Fix:**
1. Kiểm tra `userModel.js` có pre-save hook hash password:
   ```javascript
   userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
     next();
   });
   ```

2. Hard refresh browser: Ctrl + Shift + R

3. Clear localStorage:
   ```javascript
   // Console browser
   localStorage.clear();
   ```

4. Try login lại

---

## 📊 Test Cases Summary

| Test Case | Input | Expected | Status |
|-----------|-------|----------|--------|
| Forgot - Email exists | `admin@example.com` | Email sent | ✅ |
| Forgot - Email not exists | `notexist@example.com` | Same message (security) | ✅ |
| Reset - Valid token | Token + password | Success | ✅ |
| Reset - Expired token | Old token | Error | ✅ |
| Reset - Invalid token | Random string | Error | ✅ |
| Reset - Short password | `123` | Error | ✅ |
| Reset - Password mismatch | Different passwords | Error (frontend) | ✅ |
| Login - New password | New credentials | Success | ✅ |

---

## ✅ Checklist Setup Complete

- [ ] Đã bật 2-Step Verification trên Gmail
- [ ] Đã tạo App Password (16 ký tự)
- [ ] Đã cập nhật `.env` với SMTP config
- [ ] `SMTP_PASS` không có dấu cách
- [ ] Đã restart backend
- [ ] Backend log "Server running on port 5000"
- [ ] Test forgot password → Email sent log
- [ ] Nhận được email trong Gmail
- [ ] Click link → Mở reset password form
- [ ] Reset password thành công
- [ ] Login với password mới thành công

---

## 🎉 Success!

**Nếu tất cả test pass:**

✅ SMTP setup thành công  
✅ Forgot password hoạt động  
✅ Email gửi thật  
✅ Reset password hoạt động  
✅ **Sẵn sàng demo và nộp bài!**  

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 4: Setup Guide*

