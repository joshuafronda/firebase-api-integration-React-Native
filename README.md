# Firebase Integration with Comments Feature

This React Native Expo app demonstrates Firebase integration with comprehensive Firestore rules and a comments system.

## Features

- **Authentication**: User sign up, sign in, and sign out
- **Firestore Integration**: Complete CRUD operations for posts and comments
- **Comments System**: Full-featured commenting with likes and replies
- **Security Rules**: Comprehensive Firestore security rules
- **Real-time Updates**: Live data synchronization

## Firebase Configuration

The app is configured to use your Firebase project:
- **Project ID**: android-app-85d15
- **API Key**: AIzaSyB2zOUc7N2up5WXSDlz2ylkoSyczfwYKQ4

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project: `android-app-85d15`
3. Go to Authentication and enable Email/Password authentication
4. Go to Firestore Database and create a database
5. Deploy the security rules from `firestore.rules`

### 3. Deploy Firestore Rules

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

### 4. Run the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Project Structure

```
├── App.js                          # Main app component
├── firebase.js                     # Firebase configuration
├── firestore.rules                 # Firestore security rules
├── services/
│   ├── authService.js             # Authentication service
│   └── firestoreService.js        # Firestore operations service
├── components/
│   └── CommentsSection.js         # Comments component
└── README.md                      # This file
```

## Firestore Rules

The security rules include:

- **User Profiles**: Users can read any profile but only write their own
- **Creator Posts**: Creators can manage their own posts, public read access
- **User Feeds**: Private to each user
- **Post Likes**: Users can like/unlike posts
- **Comments**: Full CRUD operations with proper authorization
- **Comment Likes**: Users can like/unlike comments
- **Replies**: Nested comment system
- **Admin Access**: Special rules for admin users

## Key Features

### Authentication
- Email/password authentication
- User profile management
- Role-based access control

### Comments System
- Create, read, update, delete comments
- Like/unlike comments
- Nested replies
- Real-time updates
- User authorization

### Security
- Comprehensive Firestore rules
- User-based access control
- Role-based permissions
- Data validation

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Use your credentials to access the app
3. **View Posts**: Browse available posts
4. **Add Comments**: Click on a post to view and add comments
5. **Like Comments**: Like or unlike comments
6. **Manage Comments**: Delete your own comments

## API Endpoints

The app uses Firebase services:
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Real-time**: Firestore real-time listeners

## Security Considerations

- All data access is controlled by Firestore rules
- User authentication is required for most operations
- Users can only modify their own data
- Public read access for posts and comments
- Admin-only access for administrative functions

## Troubleshooting

### Common Issues

1. **Firebase Connection**: Ensure your API key is correct
2. **Authentication**: Make sure Email/Password auth is enabled
3. **Rules**: Deploy the Firestore rules to your project
4. **Dependencies**: Run `npm install` to install all packages

### Error Messages

- "User not found": User needs to sign up first
- "Permission denied": Check Firestore rules
- "Network error": Check internet connection and Firebase configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you have proper Firebase project setup and security rules in place for production use.
