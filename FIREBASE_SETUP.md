# Firebase Setup Troubleshooting Guide

## Current Error: 400 Bad Request on Sign Up

The 400 Bad Request error typically occurs due to one of these issues:

### 1. Email/Password Authentication Not Enabled

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `android-app-85d15`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

### 2. Firebase Configuration Issues

**Current Configuration:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB2zOUc7N2up5WXSDlz2ylkoSyczfwYKQ4",
  authDomain: "android-app-85d15.firebaseapp.com",
  projectId: "android-app-85d15",
  storageBucket: "android-app-85d15.appspot.com",
  messagingSenderId: "580589539996",
  appId: "1:580589539996:web:android-app-85d15"
};
```

**To get the correct App ID:**
1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps" section
3. If no web app exists, click "Add app" → Web
4. Copy the complete `appId` from the config

### 3. Alternative Configuration Method

If the above doesn't work, try this approach:

```javascript
// Alternative Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2zOUc7N2up5WXSDlz2ylkoSyczfwYKQ4",
  authDomain: "android-app-85d15.firebaseapp.com",
  projectId: "android-app-85d15",
  storageBucket: "android-app-85d15.appspot.com",
  messagingSenderId: "580589539996",
  appId: "1:580589539996:web:android-app-85d15",
  measurementId: "G-XXXXXXXXXX" // Optional: Add if available
};
```

### 4. Testing Steps

1. **Test Firebase Connection:**
   ```bash
   node test-firebase.js
   ```

2. **Check Browser Console:**
   - Open Developer Tools
   - Look for Firebase initialization errors
   - Check network tab for failed requests

3. **Verify Project Status:**
   - Ensure project is not suspended
   - Check billing status if applicable
   - Verify API quotas

### 5. Common Solutions

**Solution A: Enable Authentication**
- Most common cause is disabled Email/Password auth
- Enable it in Firebase Console

**Solution B: Update App ID**
- Get the correct app ID from Firebase Console
- Replace the placeholder app ID

**Solution C: Check Project Permissions**
- Ensure you have proper access to the Firebase project
- Verify the project ID is correct

### 6. Debug Information

To debug further, add this to your app:

```javascript
// Add to firebase.js for debugging
console.log('Firebase Config:', firebaseConfig);
console.log('Firebase App:', app);
console.log('Auth Instance:', auth);
```

### 7. Next Steps

1. **Enable Email/Password Authentication** in Firebase Console
2. **Get the correct App ID** from Project Settings
3. **Test the connection** with the provided test file
4. **Check browser console** for detailed error messages

If issues persist, the problem might be:
- Project permissions
- API key restrictions
- Network/firewall issues
- Firebase service status

## Quick Fix Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Correct App ID from Project Settings
- [ ] Valid API key
- [ ] Project is active and accessible
- [ ] No network/firewall restrictions
