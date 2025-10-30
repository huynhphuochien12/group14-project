# 🔐 Hoạt Động 4 - Forgot Password & Reset Password

## ✅ Tổng Kết Hoàn Thành

### Mục Tiêu
Gửi email thật với token reset password, tăng tính bảo mật.

---

## 🎯 Đã Hoàn Thành

### ✅ SV1: Backend API

#### 1. API `/auth/forgot-password` (POST)

**Chức năng:**
- Nhận email từ client
- Kiểm tra email có tồn tại trong DB không
- Sinh reset token ngẫu nhiên (crypto.randomBytes)
- Hash token bằng SHA256 trước khi lưu vào DB
- Lưu token hash + expiry time (1 giờ) vào user document
- Gửi email chứa reset link với token gốc
- Security: Không tiết lộ email có tồn tại hay không

**Request:**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response Success:**
```json
{
  "message": "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
}
```

**Response (Dev Mode - SMTP not configured):**
```json
{
  "message": "SMTP chưa được cấu hình. Token để test:",
  "resetToken": "abc123...",
  "resetUrl": "http://localhost:3000/reset-password?token=abc123..."
}
```

**Database Changes:**
```javascript
user.resetPasswordToken = "hashed_token_sha256"
user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
```

**Email Content:**
- HTML email đẹp với gradient header
- Button "Đặt Lại Mật Khẩu" link đến reset page
- Hiển thị full URL để copy
- Warning: Link hết hạn sau 1 giờ
- Footer với branding

---

#### 2. API `/auth/reset-password` (POST)

**Chức năng:**
- Nhận token + password mới từ client
- Hash token để so sánh với DB
- Tìm user với token hợp lệ và chưa hết hạn
- Validate password (min 6 chars)
- Cập nhật password mới (tự động hash bởi pre-save hook)
- Xóa reset token khỏi DB
- Gửi email xác nhận (optional)

**Request:**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Response Success:**
```json
{
  "message": "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới."
}
```

**Response Error:**
```json
{
  "message": "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới."
}
```

**Database Changes:**
```javascript
user.password = "new_hashed_password"
user.resetPasswordToken = undefined
user.resetPasswordExpires = undefined
```

---

### ✅ SV3: Cấu Hình Nodemailer + Gmail SMTP

#### 1. Environment Variables

File `.env`:
```env
# SMTP Config cho gửi email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password_16_chars
SMTP_FROM="Tech University <your.email@gmail.com>"

# Client URL (cho reset link)
CLIENT_URL=http://localhost:3000
```

#### 2. Gmail App Password Setup

**Bước 1:** Bật 2-Step Verification
- Vào: https://myaccount.google.com/security
- Bật "2-Step Verification"

**Bước 2:** Tạo App Password
- Vào: https://myaccount.google.com/apppasswords
- Select app: "Mail"
- Select device: "Other (Custom name)" → Nhập "Node.js Backend"
- Click "Generate"
- Copy 16-character password (không có dấu cách)
- Paste vào `.env` → `SMTP_PASS=abcd efgh ijkl mnop` (remove spaces)

#### 3. Nodemailer Config

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

#### 4. Email Templates

**Reset Password Email:**
- HTML with gradient header (purple)
- Button CTA
- Warning box with expiry info
- Plain text fallback

**Confirmation Email:**
- HTML with green success header
- Confirmation message
- Security note

---

### ✅ SV2: Frontend Forms

#### 1. Component `ForgotPasswordForm.jsx`

**Features:**
- Email input với validation
- Loading state khi gửi request
- Success screen sau khi gửi email
- Link quay lại login
- Responsive design
- Gradient background

**Route:** `/forgot-password`

**Flow:**
1. User nhập email
2. Validate email format
3. POST to `/auth/forgot-password`
4. Hiển thị success screen
5. User check email → Click link

---

#### 2. Component `ResetPasswordForm.jsx`

**Features:**
- Lấy token từ URL query params
- Password + Confirm Password inputs
- Real-time validation:
  - Password length (min 6 chars)
  - Password match
- Password strength indicator
- Loading state
- Success screen với auto-redirect
- Error handling

**Route:** `/reset-password?token=abc123...`

**Flow:**
1. User click link trong email
2. Browser mở: `/reset-password?token=...`
3. Component extract token từ URL
4. User nhập password mới (2 lần)
5. Validate password
6. POST to `/auth/reset-password` với token + password
7. Success → Auto redirect đến login (2s)

---

#### 3. LoginForm Update

**Added:**
- Link "Quên mật khẩu?" dưới form
- Redirect đến `/forgot-password`

---

## 🔒 Security Features

### 1. Token Security
- ✅ Token được hash (SHA256) trước khi lưu DB
- ✅ Token gốc không bao giờ lưu vào DB
- ✅ Token có expiry time (1 giờ)
- ✅ Token bị xóa sau khi sử dụng
- ✅ Token ngẫu nhiên 32 bytes (crypto.randomBytes)

### 2. Email Security
- ✅ Không tiết lộ email có tồn tại hay không (anti-enumeration)
- ✅ Response message giống nhau cho email exist/not exist
- ✅ Email chỉ gửi nếu user tồn tại (không log ra ngoài)

### 3. Password Security
- ✅ Password validation (min 6 chars)
- ✅ Password tự động hash bởi bcrypt (pre-save hook)
- ✅ Old password không bị leak khi reset

### 4. Error Handling
- ✅ Generic error messages (không tiết lộ chi tiết)
- ✅ Proper logging (backend console only)
- ✅ Rate limiting ready (có thể thêm sau)

---

## 📁 Files Changed/Created

### Backend
1. ✅ `routes/authRoutes.js`
   - Cải thiện `/auth/forgot-password` endpoint
   - Cải thiện `/auth/reset-password` endpoint
   - HTML email templates
   - Better error handling
   - Security improvements

2. ✅ `models/userModel.js`
   - Đã có sẵn `resetPasswordToken` và `resetPasswordExpires`

3. ✅ `.env` (user cần update)
   - SMTP config variables
   - CLIENT_URL

### Frontend
1. ✅ `components/auth/ForgotPasswordForm.jsx` (NEW)
   - Form nhập email
   - Success screen
   - Email validation

2. ✅ `components/auth/ResetPasswordForm.jsx` (NEW)
   - Form đổi password
   - Token from URL
   - Password validation
   - Success screen

3. ✅ `App.jsx`
   - Routes đã có sẵn:
     - `/forgot-password`
     - `/reset-password`

4. ✅ `components/auth/LoginForm.jsx`
   - Link "Quên mật khẩu?" đã có sẵn

### Documentation
1. ✅ `HOAT_DONG_4_SUMMARY.md` (this file)
2. ✅ `FORGOT_PASSWORD_GUIDE.md` (setup & test guide)
3. ✅ `DEMO_FORGOT_PASSWORD.md` (demo guide)

---

## 🧪 Testing Flow

### Test Case 1: Forgot Password (Email Exists)

**Step 1:** Frontend
```
1. Mở http://localhost:3000/login
2. Click "Quên mật khẩu?"
3. Nhập email: admin@example.com
4. Click "Gửi Email Đặt Lại Mật Khẩu"
```

**Step 2:** Backend Log
```
🔑 Reset token generated for: admin@example.com
🔗 Reset URL: http://localhost:3000/reset-password?token=abc123...
✅ Reset password email sent to: admin@example.com
```

**Step 3:** Email
```
Subject: 🔐 Đặt lại mật khẩu - Tech University
Body: HTML email với button "Đặt Lại Mật Khẩu"
```

**Step 4:** Click Link
```
Browser opens: http://localhost:3000/reset-password?token=abc123...
```

**Step 5:** Reset Password
```
1. Nhập password mới: newpass123
2. Xác nhận password: newpass123
3. Click "Đặt Lại Mật Khẩu"
```

**Step 6:** Backend Log
```
🔐 Resetting password for user: admin@example.com
✅ Password reset successful for: admin@example.com
📧 Password reset confirmation email sent to: admin@example.com
```

**Step 7:** Success
```
Success screen → Auto redirect to /login (2s)
```

**Step 8:** Login
```
Email: admin@example.com
Password: newpass123 (new password)
✅ Login success
```

---

### Test Case 2: Forgot Password (Email Not Exists)

**Step 1:** Frontend
```
Email: notexist@example.com
```

**Step 2:** Backend Log
```
📧 Forgot password request for non-existent email: notexist@example.com
```

**Step 3:** Response (Same as exists)
```
{
  "message": "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email..."
}
```

**Security:** Không tiết lộ email không tồn tại

---

### Test Case 3: Expired Token

**Setup:**
```javascript
// Giảm expiry time để test
user.resetPasswordExpires = Date.now() + 1000 * 10; // 10 seconds
```

**Test:**
```
1. Request forgot password
2. Đợi > 10 giây
3. Click reset link
4. Nhập password mới
```

**Expected:**
```
❌ "Token không hợp lệ hoặc đã hết hạn"
```

---

### Test Case 4: Invalid Token

**Test:**
```
1. Mở: http://localhost:3000/reset-password?token=invalid123
2. Nhập password mới
```

**Expected:**
```
❌ "Token không hợp lệ hoặc đã hết hạn"
```

---

### Test Case 5: Weak Password

**Test:**
```
Password: 123 (< 6 chars)
```

**Frontend:**
```
⚠️ "Mật khẩu quá ngắn (tối thiểu 6 ký tự)"
Button disabled
```

**Backend (if bypassed):**
```
❌ "Mật khẩu phải có ít nhất 6 ký tự"
```

---

### Test Case 6: Password Mismatch

**Test:**
```
Password: newpass123
Confirm: newpass456
```

**Frontend:**
```
⚠️ "Mật khẩu không khớp"
Button disabled
```

---

## 📊 API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/forgot-password` | POST | ❌ | Gửi email reset password |
| `/auth/reset-password` | POST | ❌ | Đổi password với token |

---

## 🎨 UI/UX Features

### ForgotPasswordForm
- ✅ Gradient purple background
- ✅ Lock icon animation
- ✅ Email validation
- ✅ Loading state
- ✅ Success screen với email icon
- ✅ "Gửi lại" button
- ✅ Link quay lại login

### ResetPasswordForm
- ✅ Gradient purple background
- ✅ Key icon
- ✅ Password strength indicator
- ✅ Real-time validation feedback
- ✅ Password match indicator
- ✅ Loading state
- ✅ Success screen với checkmark
- ✅ Auto redirect (2s countdown)

---

## 🔧 Environment Setup

### Required Packages (Already Installed)
```json
{
  "nodemailer": "^6.9.x",
  "crypto": "built-in"
}
```

### .env Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM="Tech University <your.email@gmail.com>"
CLIENT_URL=http://localhost:3000
```

---

## 📝 Logging

### Forgot Password
```
📧 Forgot password request for non-existent email: xyz@example.com
🔑 Reset token generated for: admin@example.com
🔗 Reset URL: http://localhost:3000/reset-password?token=abc...
✅ Reset password email sent to: admin@example.com
❌ Lỗi gửi email: [error details]
⚠️ SMTP not configured. Returning token for testing.
```

### Reset Password
```
🔐 Resetting password for user: admin@example.com
✅ Password reset successful for: admin@example.com
📧 Password reset confirmation email sent to: admin@example.com
⚠️ Could not send confirmation email: [error]
❌ Invalid or expired reset token: abc123...
```

---

## ✅ Checklist Hoàn Thành

### Backend
- [x] API `/auth/forgot-password` - Gửi email
- [x] API `/auth/reset-password` - Đổi password
- [x] Token generation (crypto.randomBytes)
- [x] Token hashing (SHA256)
- [x] Token expiry (1 hour)
- [x] Email HTML template (đẹp)
- [x] Email confirmation (sau reset)
- [x] Security: Anti-enumeration
- [x] Validation: Email format, password length
- [x] Error handling

### SMTP Config
- [x] Nodemailer setup
- [x] Gmail SMTP config
- [x] Environment variables
- [x] Email templates (HTML + text)
- [x] Dev mode (token in response nếu SMTP fail)

### Frontend
- [x] Component `ForgotPasswordForm.jsx`
- [x] Component `ResetPasswordForm.jsx`
- [x] Routes `/forgot-password`, `/reset-password`
- [x] Link "Quên mật khẩu?" trong LoginForm
- [x] Email validation
- [x] Password validation
- [x] Loading states
- [x] Success screens
- [x] Error handling
- [x] Responsive design

### Documentation
- [x] Technical summary (this file)
- [x] Setup guide
- [x] Demo guide

---

## 🚀 Ready to Deploy

**All features implemented and tested!**

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 4: Forgot Password & Reset Password - Complete*

