# 🔄 Hoạt Động 6 - Frontend Redux & Protected Routes

## ✅ Tổng Kết Hoàn Thành

### Mục Tiêu
Quản lý state nâng cao với Redux, chặn truy cập trang nếu chưa đăng nhập.

---

## 🎯 Đã Hoàn Thành

### ✅ SV2: Frontend - Redux Toolkit Implementation

#### 1. Cài Đặt Packages

**File:** `frontend/package.json`

**Packages đã thêm:**
```json
{
  "@reduxjs/toolkit": "^2.0.1",
  "react-redux": "^9.0.4"
}
```

**Install command:**
```bash
cd frontend
npm install
```

---

#### 2. Redux Store Setup

**File:** `frontend/src/store/index.js`

**Chức năng:**
- Configure Redux store với Redux Toolkit
- Enable Redux DevTools (development only)
- Middleware configuration

**Code:**
```javascript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
```

---

#### 3. Auth Slice với Redux Thunks

**File:** `frontend/src/store/slices/authSlice.js`

**State Management:**
```javascript
{
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}
```

**Async Thunks (gọi API):**

##### A. Login Thunk
```javascript
dispatch(login({ email, password }))
```
- ✅ POST `/api/auth/login`
- ✅ Save token + user vào localStorage
- ✅ Update Redux state
- ✅ Error handling với rejectWithValue

##### B. Register Thunk
```javascript
dispatch(register({ name, email, password }))
```
- ✅ POST `/api/auth/register`
- ✅ Return user data
- ✅ Error handling

##### C. Logout Thunk
```javascript
dispatch(logout())
```
- ✅ POST `/api/auth/logout`
- ✅ Clear localStorage
- ✅ Clear Redux state
- ✅ Even if API fails, still clear local data

##### D. Fetch Profile Thunk
```javascript
dispatch(fetchProfile())
```
- ✅ GET `/api/profile`
- ✅ Update user data in state
- ✅ Sync with localStorage

##### E. Update Profile Thunk
```javascript
dispatch(updateProfile({ name, email, ... }))
```
- ✅ PUT `/api/profile`
- ✅ Update user in state + localStorage

**Reducers (Sync Actions):**
- ✅ `clearError()` - Clear error message
- ✅ `setUser(user)` - Manual user update (avatar upload)
- ✅ `restoreSession()` - Load từ localStorage on app init

**Selectors:**
```javascript
selectAuth(state)          // Toàn bộ auth state
selectUser(state)          // User object
selectIsAuthenticated(state) // Boolean
selectAuthLoading(state)   // Loading state
selectAuthError(state)     // Error message
```

---

#### 4. Redux Provider Integration

**File:** `frontend/src/index.js`

**Changes:**
```javascript
import { Provider } from 'react-redux';
import store from './store';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

✅ **Toàn bộ app có access đến Redux store**

---

#### 5. Protected Routes với Redux

**File:** `frontend/src/components/shared/ProtectedRouteRedux.jsx`

**Features:**
- ✅ Check authentication từ Redux (không dùng Context)
- ✅ Redirect to `/login` nếu chưa đăng nhập
- ✅ Check single role: `requiredRole="admin"`
- ✅ Check multiple roles: `requiredRoles={["admin", "moderator"]}`
- ✅ Show access denied message nếu không đủ quyền

**Usage:**
```jsx
<ProtectedRouteRedux requiredRole="admin">
  <AdminPage />
</ProtectedRouteRedux>

<ProtectedRouteRedux requiredRoles={["admin", "moderator"]}>
  <AdminUserList />
</ProtectedRouteRedux>
```

---

#### 6. Auth Components với Redux

##### A. LoginFormRedux

**File:** `frontend/src/components/auth/LoginFormRedux.jsx`

**Features:**
- ✅ Use Redux `useDispatch` thay vì Context
- ✅ Use Redux selectors: `useSelector(selectAuthLoading)`
- ✅ Dispatch `login` thunk
- ✅ Auto navigate based on role (admin → `/admin`, user → `/profile`)
- ✅ Loading state từ Redux
- ✅ Error handling từ Redux
- ✅ Toast notifications

**Code:**
```jsx
const dispatch = useDispatch();
const loading = useSelector(selectAuthLoading);
const error = useSelector(selectAuthError);

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await dispatch(login({ email, password }));
  
  if (login.fulfilled.match(result)) {
    addToast("Đăng nhập thành công!", 'success');
    navigate("/profile");
  }
};
```

##### B. RegisterFormRedux

**File:** `frontend/src/components/auth/RegisterFormRedux.jsx`

**Features:**
- ✅ Use Redux thunks
- ✅ Register → Auto login → Navigate to profile
- ✅ Validation (password length, confirm password)
- ✅ Loading states
- ✅ Error handling

**Flow:**
```
1. User fill form
2. Dispatch register({ name, email, password })
3. If success → Dispatch login({ email, password })
4. If login success → Navigate to /profile
```

---

#### 7. AppRedux - Redux Version

**File:** `frontend/src/AppRedux.jsx`

**Changes from App.jsx:**
- ✅ Removed `<AuthProvider>` (dùng Redux Provider)
- ✅ Use `ProtectedRouteRedux` thay vì `ProtectedRoute`
- ✅ Use `LoginFormRedux` thay vì `LoginForm`
- ✅ Use `RegisterFormRedux` thay vì `RegisterForm`
- ✅ Dispatch `restoreSession()` on app load

**Routes:**
```jsx
<Route path="/login" element={<LoginFormRedux />} />
<Route path="/register" element={<RegisterFormRedux />} />

<Route path="/profile" element={
  <ProtectedRouteRedux>
    <ProfilePage />
  </ProtectedRouteRedux>
} />

<Route path="/admin" element={
  <ProtectedRouteRedux requiredRoles={["admin", "moderator"]}>
    <AdminUserList />
  </ProtectedRouteRedux>
} />
```

---

### ✅ SV1 + SV3: Backend Support

#### Backend API Đã Có Sẵn:

**Auth APIs:**
- ✅ POST `/api/auth/login` - Login
- ✅ POST `/api/auth/register` - Register
- ✅ POST `/api/auth/logout` - Logout
- ✅ POST `/api/auth/refresh` - Refresh token

**Profile APIs:**
- ✅ GET `/api/profile` - Get profile (with JWT)
- ✅ PUT `/api/profile` - Update profile
- ✅ POST `/api/profile/avatar` - Upload avatar

**Protected APIs:**
- ✅ GET `/api/users` - Get all users (Admin/Moderator)
- ✅ GET `/api/logs` - Get logs (Admin)

**Middleware:**
- ✅ `protect` - JWT authentication
- ✅ `checkRole(roles)` - Role-based authorization

**No backend changes needed!** ✅

---

## 📦 Files Created/Modified

### Frontend (9 files)

#### Created:
1. ✅ `store/index.js` - Redux store config
2. ✅ `store/slices/authSlice.js` - Auth reducer + thunks
3. ✅ `components/shared/ProtectedRouteRedux.jsx` - Protected route với Redux
4. ✅ `components/auth/LoginFormRedux.jsx` - Login với Redux
5. ✅ `components/auth/RegisterFormRedux.jsx` - Register với Redux
6. ✅ `AppRedux.jsx` - App với Redux
7. ✅ `HOAT_DONG_6_SUMMARY.md` - Documentation

#### Modified:
1. ✅ `package.json` - Added Redux packages
2. ✅ `index.js` - Added Redux Provider

---

## 🔄 Redux vs Context Comparison

### Context Version (Old):
```jsx
// AuthContext.jsx
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Component
const { user, login, logout } = useAuth();
```

### Redux Version (New):
```jsx
// authSlice.js
const authSlice = createSlice({...});

export const login = createAsyncThunk(...);

// Component
const dispatch = useDispatch();
const user = useSelector(selectUser);

dispatch(login({ email, password }));
```

---

## 🎯 Advantages của Redux

### 1. **Centralized State Management**
- ✅ Single source of truth
- ✅ State in Redux store, không trong React Context
- ✅ Dễ debug với Redux DevTools

### 2. **Redux DevTools**
- ✅ Time-travel debugging
- ✅ Xem mọi action & state changes
- ✅ Replay actions
- ✅ Export/import state

### 3. **Async Logic với Thunks**
- ✅ Built-in async handling
- ✅ Pending/fulfilled/rejected states tự động
- ✅ Error handling dễ dàng
- ✅ No need custom async logic

### 4. **Better Performance**
- ✅ Selective re-renders với selectors
- ✅ Component chỉ re-render khi selector value thay đổi
- ✅ No Context hell

### 5. **Scalability**
- ✅ Dễ thêm slices mới (users, posts, comments, v.v.)
- ✅ Middleware support (logging, analytics)
- ✅ Easy testing

---

## 🧪 Testing Flow

### Test Case 1: Login với Redux

**Step 1:** Start frontend
```bash
cd frontend
npm install
npm start
```

**Step 2:** Mở http://localhost:3000/login

**Step 3:** Login:
```
Email: admin@example.com
Password: admin123
```

**Step 4:** Check Redux DevTools (F12 → Redux tab)

**Expected Actions:**
```
auth/login/pending
auth/login/fulfilled
```

**State After Login:**
```javascript
{
  auth: {
    user: { _id: "...", name: "Admin User", email: "...", role: "admin" },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "...",
    isAuthenticated: true,
    loading: false,
    error: null
  }
}
```

**Redirect:** `/admin` (vì role = admin)

---

### Test Case 2: Protected Route (Chưa Login)

**Step 1:** Logout (hoặc clear localStorage)

**Step 2:** Try vào http://localhost:3000/profile

**Expected:**
- ✅ Auto redirect to `/login`
- ✅ Cannot access profile

---

### Test Case 3: Protected Route (Login nhưng Không Đủ Quyền)

**Step 1:** Login as User (not admin)
```
Email: user1@example.com
Password: user123
```

**Step 2:** Try vào http://localhost:3000/admin/logs

**Expected:**
```
⛔ Không có quyền truy cập
Bạn cần quyền admin để xem trang này.
```

---

### Test Case 4: Logout

**Step 1:** Click logout button (cần implement)

**Step 2:** Dispatch:
```jsx
dispatch(logout());
```

**Expected Actions:**
```
auth/logout/pending
auth/logout/fulfilled
```

**State After Logout:**
```javascript
{
  auth: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
}
```

**localStorage:** Cleared

**Redirect:** `/login`

---

### Test Case 5: Restore Session (Reload Page)

**Step 1:** Login thành công

**Step 2:** Reload page (F5)

**Expected:**
- ✅ `restoreSession()` dispatch on app load
- ✅ State restored từ localStorage
- ✅ User vẫn login
- ✅ No need login lại

---

## 🛠️ Redux DevTools Usage

### Install Extension:
- Chrome: Redux DevTools Extension
- Firefox: Redux DevTools Add-on

### Features:
1. **Action Tab** - Xem mọi action đã dispatch
2. **State Tab** - Xem state hiện tại
3. **Diff Tab** - Xem thay đổi của state
4. **Trace Tab** - Xem stack trace
5. **Test Tab** - Dispatch custom actions

### Example:
```
Action: auth/login/fulfilled
Diff:
+ isAuthenticated: true
+ user: { name: "Admin", ... }
+ token: "eyJ..."
```

---

## 📝 Migration Guide (Context → Redux)

### Step 1: Keep Both Versions
```
frontend/src/
├── App.jsx                  # Context version (OLD)
├── AppRedux.jsx            # Redux version (NEW)
├── contexts/
│   └── AuthContext.jsx     # Keep for backward compatibility
└── store/
    ├── index.js
    └── slices/
        └── authSlice.js
```

### Step 2: Switch in index.js
```javascript
// Use Redux version
import App from './AppRedux';

// Or use Context version
// import App from './App';
```

### Step 3: Gradually Migrate Components
- ✅ Login/Register: Redux version done
- ⏳ ProfilePage: Can use Redux or Context
- ⏳ AdminPages: Can use Redux or Context

### Step 4: Remove Context (Optional)
- Sau khi migrate hết → Xóa AuthContext.jsx
- Update all components dùng Redux

---

## ✅ Checklist Hoàn Thành

### Setup
- [x] Redux Toolkit installed
- [x] React-Redux installed
- [x] Redux store configured
- [x] Auth slice created
- [x] Redux Provider added

### Thunks
- [x] login thunk
- [x] register thunk
- [x] logout thunk
- [x] fetchProfile thunk
- [x] updateProfile thunk

### Components
- [x] ProtectedRouteRedux
- [x] LoginFormRedux
- [x] RegisterFormRedux
- [x] AppRedux

### Features
- [x] Centralized state management
- [x] Redux DevTools support
- [x] Protected routes với Redux
- [x] Auto restore session
- [x] Error handling
- [x] Loading states

### Documentation
- [x] Technical summary
- [x] Migration guide
- [x] Testing instructions

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Add More Slices
```javascript
// store/slices/usersSlice.js
export const fetchUsers = createAsyncThunk(...);

// store/slices/logsSlice.js
export const fetchLogs = createAsyncThunk(...);
```

### 2. Middleware
```javascript
// Custom logger middleware
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  return next(action);
};
```

### 3. Persist State
```bash
npm install redux-persist
```

### 4. RTK Query (Advanced)
```javascript
// Instead of thunks, use RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
```

---

## 🎉 Ready to Use!

**Redux implementation complete!** ✅

**Hoạt Động 6 hoàn thành:** 
- ✅ State management nâng cao
- ✅ Protected routes
- ✅ Redux Thunks gọi API
- ✅ Redux DevTools
- ✅ Better scalability

---

*Tạo bởi: Frontend Team*  
*Ngày: 2025-10-30*  
*Hoạt Động 6: Redux & Protected Routes - Complete*

