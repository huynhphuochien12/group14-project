# 🔐 Hoạt Động 5 - User Activity Logging & Rate Limiting

## ✅ Tổng Kết Hoàn Thành

### Mục Tiêu
Ghi lại hoạt động người dùng, chống brute force login.

---

## 🎯 Đã Hoàn Thành

### ✅ SV1: Backend Middleware

#### 1. Middleware `logActivity(action, metadata)`

**File:** `backend/middleware/logMiddleware.js`

**Chức năng:**
- Log mọi activity của user vào database
- Capture: userId, action, method, endpoint, IP, user agent, timestamp
- Auto-detect success/failure từ response status code
- Non-blocking (async logging không làm chậm response)

**Usage:**
```javascript
router.post("/login", logActivity("LOGIN"), async (req, res) => {
  // Logic
});
```

**createLog Function:**
```javascript
await createLog({
  userId: user._id,
  userName: user.name,
  userEmail: user.email,
  action: "LOGIN_SUCCESS",
  method: "POST",
  endpoint: "/api/auth/login",
  statusCode: 200,
  ipAddress: req.ip,
  userAgent: req.get("user-agent"),
  metadata: { role: user.role },
  success: true,
});
```

---

#### 2. Rate Limiting Middleware

**File:** `backend/middleware/rateLimitMiddleware.js`

**Package:** `express-rate-limit`

**Rate Limiters:**

##### A. Login Rate Limiter (Chống Brute Force)
```javascript
loginLimiter
- Max: 5 attempts per 15 minutes (per IP)
- Auto log rate limit events
- Status: 429 Too Many Requests
```

**Applied to:** `POST /api/auth/login`

##### B. Forgot Password Rate Limiter
```javascript
forgotPasswordLimiter
- Max: 3 requests per 1 hour (per IP)
- Prevent abuse
- Status: 429
```

**Applied to:** `POST /api/auth/forgot-password`

##### C. General API Rate Limiter (Optional)
```javascript
apiLimiter
- Max: 100 requests per 15 minutes
- General protection
```

**Features:**
- ✅ IP-based tracking
- ✅ Auto reset after time window
- ✅ Custom error messages (Vietnamese)
- ✅ Skip successful requests from counting (login only)
- ✅ Log all rate limit events

---

### ✅ SV3: Database - Logs Collection

#### Log Model Schema

**File:** `backend/models/logModel.js`

```javascript
{
  userId: ObjectId,              // Ref to User (null if anonymous)
  userName: String,              // User name
  userEmail: String,             // User email
  action: String,                // Action type (required)
  method: String,                // HTTP method (GET, POST, etc.)
  endpoint: String,              // API endpoint
  statusCode: Number,            // HTTP status code
  ipAddress: String,             // Client IP
  userAgent: String,             // Browser info
  metadata: Mixed,               // Additional info (JSON object)
  success: Boolean,              // Success/failure
  errorMessage: String,          // Error message if failed
  timestamp: Date,               // When it happened (default: now)
}
```

**Indexes:**
- `{ userId: 1, timestamp: -1 }` - Query by user
- `{ action: 1, timestamp: -1 }` - Query by action
- `{ timestamp: -1 }` - Sort by time
- `{ ipAddress: 1, action: 1, timestamp: -1 }` - Rate limiting

**Action Types:**
```
AUTH:
- LOGIN_SUCCESS
- LOGIN_FAILED
- REGISTER_SUCCESS
- REGISTER_FAILED
- LOGOUT
- FORGOT_PASSWORD
- RESET_PASSWORD

USER:
- VIEW_PROFILE
- UPDATE_PROFILE
- UPLOAD_AVATAR

ADMIN:
- VIEW_USERS
- CREATE_USER
- UPDATE_USER
- DELETE_USER
- VIEW_LOGS

SECURITY:
- LOGIN_RATE_LIMITED
- FORGOT_PASSWORD_RATE_LIMITED
- API_RATE_LIMITED
```

---

### ✅ Backend API Endpoints

**File:** `backend/routes/logRoutes.js`

#### 1. GET `/api/logs`

**Access:** Admin only

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `userId` - Filter by user ID
- `action` - Filter by action type
- `success` - Filter by success/failure (true/false)
- `startDate` - Filter from date
- `endDate` - Filter to date

**Response:**
```json
{
  "logs": [
    {
      "_id": "...",
      "userId": {...},
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "action": "LOGIN_SUCCESS",
      "method": "POST",
      "endpoint": "/api/auth/login",
      "statusCode": 200,
      "ipAddress": "192.168.1.1",
      "success": true,
      "timestamp": "2025-10-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

---

#### 2. GET `/api/logs/stats`

**Access:** Admin only

**Query Params:**
- `startDate` - Filter from date
- `endDate` - Filter to date

**Response:**
```json
{
  "totalLogs": 1500,
  "successfulLogs": 1200,
  "failedLogs": 300,
  "successRate": "80.00",
  "actionStats": [
    { "_id": "LOGIN_SUCCESS", "count": 500 },
    { "_id": "LOGIN_FAILED", "count": 150 },
    ...
  ],
  "rateLimitEvents": 25,
  "recentLogs": [...]
}
```

---

#### 3. GET `/api/logs/user/:userId`

**Access:** Admin only

**Description:** Get logs for specific user

**Response:**
```json
{
  "logs": [...],
  "pagination": {...}
}
```

---

#### 4. DELETE `/api/logs`

**Access:** Admin only

**Query Params:**
- `days` - Delete logs older than X days (default: 30)

**Response:**
```json
{
  "message": "Đã xóa 500 logs cũ hơn 30 ngày",
  "deletedCount": 500
}
```

---

### ✅ SV2: Frontend - Admin Logs Page

**File:** `frontend/src/components/admin/AdminLogs.jsx`

**Route:** `/admin/logs` (Admin only)

**Features:**

#### 1. Stats Dashboard
- Total logs count
- Successful logs count
- Failed logs count
- Success rate percentage
- Rate limit events count

#### 2. Filters
- Filter by action type
- Filter by success/failure
- Filter by date range (from/to)
- Clear filters button

#### 3. Logs Table
- Timestamp (formatted Vietnamese)
- User (name + email)
- Action (color-coded badges)
- IP Address
- Status (success/failed badge)
- Details (error message, metadata)

**Action Badges:**
- ✅ LOGIN_SUCCESS - Green
- ❌ LOGIN_FAILED - Red
- 📝 REGISTER_SUCCESS - Blue
- ⚠️ REGISTER_FAILED - Orange
- 🚪 LOGOUT - Gray
- 🔐 FORGOT_PASSWORD - Purple
- 🚫 RATE_LIMITED - Dark Red
- 👁️ VIEW_LOGS - Cyan
- ✏️ UPDATE_PROFILE - Teal
- 📸 UPLOAD_AVATAR - Orange

#### 4. Pagination
- Previous/Next buttons
- Page X of Y indicator
- Configurable limit (20 per page)

#### 5. Admin Actions
- Clear old logs (>30 days) button
- Confirmation dialog before delete

**UI Design:**
- Modern card-based layout
- Responsive grid for stats
- Color-coded status indicators
- Collapsible metadata details
- Professional table styling

---

## 🔒 Security Features

### 1. Rate Limiting
- ✅ Login: 5 attempts / 15 min
- ✅ Forgot Password: 3 attempts / 1 hour
- ✅ IP-based tracking
- ✅ Auto-reset after window
- ✅ All events logged

### 2. Activity Logging
- ✅ All auth events logged
- ✅ Failed attempts tracked
- ✅ IP addresses captured
- ✅ User agent tracking
- ✅ Timestamp precision

### 3. Admin Monitoring
- ✅ Real-time stats
- ✅ Filter & search logs
- ✅ Identify suspicious activity
- ✅ Track rate limit events
- ✅ User activity history

---

## 📁 Files Created/Modified

### Backend
1. ✅ `models/logModel.js` (NEW) - Log schema
2. ✅ `middleware/logMiddleware.js` (NEW) - Logging middleware
3. ✅ `middleware/rateLimitMiddleware.js` (NEW) - Rate limiting
4. ✅ `routes/logRoutes.js` (NEW) - Log API endpoints
5. ✅ `routes/authRoutes.js` (MODIFIED) - Added logging & rate limiting
6. ✅ `server.js` (MODIFIED) - Register log routes
7. ✅ `package.json` (MODIFIED) - Added express-rate-limit

### Frontend
1. ✅ `components/admin/AdminLogs.jsx` (NEW) - Admin logs page
2. ✅ `App.jsx` (MODIFIED) - Added /admin/logs route

### Documentation
1. ✅ `backend/HOAT_DONG_5_SUMMARY.md` (this file)

---

## 🧪 Testing Flow

### Test Case 1: Login Success Logging

**Step 1:** Login successfully
```
POST /api/auth/login
Email: admin@example.com
Password: admin123
```

**Expected Log:**
```javascript
{
  action: "LOGIN_SUCCESS",
  userName: "Admin User",
  userEmail: "admin@example.com",
  statusCode: 200,
  success: true,
  ipAddress: "::1",
}
```

---

### Test Case 2: Login Failed Logging

**Step 1:** Login with wrong password
```
POST /api/auth/login
Email: admin@example.com
Password: wrong_password
```

**Expected Log:**
```javascript
{
  action: "LOGIN_FAILED",
  userName: "Admin User",
  userEmail: "admin@example.com",
  statusCode: 400,
  success: false,
  errorMessage: "Sai mật khẩu",
  metadata: { reason: "Wrong password" }
}
```

---

### Test Case 3: Login Rate Limiting

**Step 1-5:** Try login with wrong password 5 times

**Step 6:** Try login again (6th time)

**Expected:**
```
Status: 429 Too Many Requests
Message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút."
```

**Expected Log:**
```javascript
{
  action: "LOGIN_RATE_LIMITED",
  statusCode: 429,
  success: false,
  errorMessage: "Rate limit exceeded",
  metadata: { email: "admin@example.com", reason: "Too many login attempts" }
}
```

**Step 7:** Wait 15 minutes → Try again → Success

---

### Test Case 4: View Logs (Admin)

**Step 1:** Login as Admin

**Step 2:** Navigate to `/admin/logs`

**Expected:**
- Stats dashboard hiển thị
- Logs table hiển thị
- Filters hoạt động
- Pagination hoạt động

---

### Test Case 5: Filter Logs

**Step 1:** Select filter "Login Failed"

**Expected:**
- Only LOGIN_FAILED logs hiển thị
- Pagination reset về page 1

**Step 2:** Add date range filter

**Expected:**
- Logs filtered by date range

**Step 3:** Click "Clear" button

**Expected:**
- All filters reset
- All logs hiển thị

---

### Test Case 6: Clear Old Logs

**Step 1:** Click "Xóa logs cũ (>30 ngày)"

**Step 2:** Confirm dialog

**Expected:**
```
DELETE /api/logs?days=30
Response: "Đã xóa X logs cũ hơn 30 ngày"
```

---

## 📊 Performance Optimization

### 1. Database Indexes
```javascript
// Fast queries
logSchema.index({ userId: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ ipAddress: 1, action: 1, timestamp: -1 });
```

### 2. Pagination
- Limit results to 20-50 per page
- Skip/limit for efficient queries
- Total count for pagination

### 3. Async Logging
- Non-blocking log writes
- Doesn't slow down API responses
- Error handling for failed logs

### 4. Log Rotation
- Admin can delete old logs
- Default: >30 days
- Prevent database bloat

---

## 🎨 UI/UX Features

### Stats Cards
- Color-coded borders
- Large numbers for impact
- Success rate percentage
- Rate limit alert (red)

### Filters
- Grid layout (responsive)
- Dropdown selects
- Date pickers
- Clear button

### Logs Table
- Sortable by timestamp (default: newest first)
- Color-coded action badges
- Success/Failed status badges
- Expandable metadata details
- Professional styling

### Pagination
- Simple Previous/Next
- Page indicator
- Disabled states

---

## 🚀 Future Enhancements

### Potential Additions:
1. **Real-time Logs** - WebSocket for live updates
2. **Export Logs** - CSV/JSON download
3. **Advanced Filters** - Multiple actions, IP search
4. **Charts** - Activity graphs over time
5. **Alerts** - Email when rate limit exceeded
6. **User Dashboard** - Users see their own activity
7. **Audit Trail** - Track admin actions
8. **Geo-location** - IP to location mapping

---

## ✅ Checklist Hoàn Thành

### Backend
- [x] Log Model with indexes
- [x] logActivity middleware
- [x] createLog helper function
- [x] Rate limiting middleware (login, forgot-password)
- [x] Log API endpoints (GET, stats, delete)
- [x] Applied logging to auth routes
- [x] Applied rate limiting to auth routes
- [x] Server.js registered log routes
- [x] express-rate-limit package added

### Frontend
- [x] AdminLogs component
- [x] Stats dashboard
- [x] Filters (action, status, date)
- [x] Logs table with pagination
- [x] Color-coded badges
- [x] Clear old logs action
- [x] Admin-only route protection
- [x] Responsive design

### Documentation
- [x] Technical summary (this file)
- [x] Setup instructions
- [x] Test cases
- [x] API documentation

---

## 📝 Environment Variables

**No new variables needed!**

Existing variables sufficient:
```env
MONGO_URI=...
JWT_SECRET=...
PORT=5000
```

---

## 🎉 Ready to Deploy

**All features implemented and tested!**

**Hoạt Động 5 Complete:** ✅

---

*Tạo bởi: AI Assistant*  
*Ngày: 2025-10-30*  
*Hoạt Động 5: User Activity Logging & Rate Limiting - Complete*

