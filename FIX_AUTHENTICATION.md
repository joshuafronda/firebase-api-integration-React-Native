# 🔧 Fix Authentication Error: auth/operation-not-allowed

## ❌ Current Error
```
FirebaseError: Firebase: Error (auth/operation-not-allowed)
```

## ✅ Solution: Enable Email/Password Authentication

The error `auth/operation-not-allowed` means that **Email/Password authentication is not enabled** in your Firebase project.

### Step-by-Step Fix:

#### 1. Go to Firebase Console
- Open: https://console.firebase.google.com/
- Select your project: **android-app-85d15**

#### 2. Navigate to Authentication
- Click **"Authentication"** in the left sidebar
- Click **"Sign-in method"** tab

#### 3. Enable Email/Password Provider
- Find **"Email/Password"** in the providers list
- Click on **"Email/Password"**
- Toggle **"Enable"** to ON
- Click **"Save"**

#### 4. Verify Settings
Make sure these are enabled:
- ✅ **Email/Password** - Enabled
- ✅ **Email link (passwordless sign-in)** - Optional (can be disabled)

### Alternative: Enable via Firebase CLI

If you prefer using CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Enable authentication
firebase auth:enable
```

### Test the Fix

After enabling Email/Password authentication:

1. **Restart your app**:
   ```bash
   npm start
   ```

2. **Try signing up** with a test email and password

3. **Check browser console** - the error should be gone

### Expected Result

✅ **Before**: `auth/operation-not-allowed` error
✅ **After**: Successful user registration

### Additional Firebase Configuration

Your Firebase config is now correct:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB2zOUc7N2up5WXSDlz2ylkoSyczfwYKQ4",
  authDomain: "android-app-85d15.firebaseapp.com",
  projectId: "android-app-85d15",
  storageBucket: "android-app-85d15.firebasestorage.app",
  messagingSenderId: "580589539996",
  appId: "1:580589539996:web:e28988795cfbc8a596d359",
  measurementId: "G-1HZSVT53L8"
};
```

### Troubleshooting

If you still get errors after enabling Email/Password:

1. **Check Project Permissions**: Ensure you have admin access to the Firebase project
2. **Verify Project Status**: Make sure the project is active and not suspended
3. **Clear Browser Cache**: Clear cache and restart the app
4. **Check Network**: Ensure you have internet connection

### Quick Checklist

- [ ] Firebase Console → Authentication → Sign-in method
- [ ] Email/Password provider enabled
- [ ] App restarted after enabling
- [ ] Test with valid email/password
- [ ] Check browser console for errors

## 🎯 This Should Fix Your Issue!

The `auth/operation-not-allowed` error will be resolved once you enable Email/Password authentication in your Firebase Console.
