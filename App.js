import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView,
  Image
} from 'react-native';
import authService from './services/authService';
import firestoreService from './services/firestoreService';
import CommentsSection from './components/CommentsSection';
import CreatePost from './components/CreatePost';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Error states for better UX
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  // Create post mode
  const [createPostMode, setCreatePostMode] = useState(false);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadPosts();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadPosts = async () => {
    try {
      const result = await firestoreService.getAllPosts(20);
      if (result.success) {
        setPosts(result.data);
      } else {
        // Fallback to demo post if no real posts
        setPosts([{
          id: 'demo-post-1',
          title: 'Welcome to our platform!',
          content: 'This is a demo post to showcase the comments functionality.',
          authorName: 'Demo Creator',
          createdAt: new Date(),
          likesCount: 0,
          commentsCount: 0
        }]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback to demo post
      setPosts([{
        id: 'demo-post-1',
        title: 'Welcome to our platform!',
        content: 'This is a demo post to showcase the comments functionality.',
        authorName: 'Demo Creator',
        createdAt: new Date(),
        likesCount: 0,
        commentsCount: 0
      }]);
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const validateDisplayName = (name) => {
    if (!name) {
      return 'Display name is required';
    }
    if (name.length < 2) {
      return 'Display name must be at least 2 characters long';
    }
    return '';
  };

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setDisplayNameError('');
    setGeneralError('');
  };

  const handleAuth = async () => {
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const displayNameErr = isSignUp ? validateDisplayName(displayName) : '';

    // Set error states
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setDisplayNameError(displayNameErr);

    // If there are validation errors, don't proceed
    if (emailErr || passwordErr || displayNameErr) {
      setGeneralError('Please fix the errors above');
      return;
    }

    setLoading(true);
    let result;

    try {
      if (isSignUp) {
        result = await authService.signUp(email, password, { 
          displayName, 
          role: 'user' 
        });
      } else {
        result = await authService.signIn(email, password);
      }

      if (result.success) {
        // Clear form on success
        setEmail('');
        setPassword('');
        setDisplayName('');
        clearErrors();
        Alert.alert('Success', isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
      } else {
        setGeneralError(result.error);
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    const result = await authService.signOut();
    if (result.success) {
      setPosts([]);
      setSelectedPost(null);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to create posts');
      return;
    }
    setCreatePostMode(true);
  };

  const handlePostCreated = () => {
    setCreatePostMode(false);
    loadPosts(); // Reload posts to show the new one
  };

  // Show create post mode if enabled
  if (createPostMode) {
    return (
      <CreatePost 
        onPostCreated={handlePostCreated}
        onCancel={() => setCreatePostMode(false)}
      />
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.title}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
          
          
          {isSignUp && (
            <View>
              <TextInput
                style={[styles.input, displayNameError ? styles.inputError : null]}
                placeholder="Display Name"
                value={displayName}
                onChangeText={(text) => {
                  setDisplayName(text);
                  if (displayNameError) {
                    setDisplayNameError('');
                  }
                }}
                autoCapitalize="words"
              />
              {displayNameError ? <Text style={styles.errorText}>{displayNameError}</Text> : null}
            </View>
          )}
          
          <View>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) {
                  setEmailError('');
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>
          
          <View>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) {
                  setPasswordError('');
                }
              }}
              secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
          
          {generalError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.generalErrorText}>{generalError}</Text>
              <TouchableOpacity 
                style={styles.clearErrorButton}
                onPress={clearErrors}
              >
                <Text style={styles.clearErrorText}>Clear Errors</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          
          <TouchableOpacity 
            style={[styles.authButton, loading ? styles.authButtonDisabled : null]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Text>
          </TouchableOpacity>
          
          {!isSignUp && (
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => {
                if (email) {
                  authService.resetPassword(email).then(result => {
                    if (result.success) {
                      Alert.alert('Success', 'Password reset email sent!');
                    } else {
                      Alert.alert('Error', result.error);
                    }
                  });
                } else {
                  Alert.alert('Error', 'Please enter your email address first');
                }
              }}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              clearErrors();
            }}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (selectedPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedPost(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.postTitle}>{selectedPost.title}</Text>
        </View>
        <CommentsSection postId={selectedPost.id} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.displayName || user.email}!</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
          <Text style={styles.createPostText}>+ Create New Post</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Posts</Text>
        
        {posts.map((post) => (
          <TouchableOpacity 
            key={post.id} 
            style={styles.postCard}
            onPress={() => setSelectedPost(post)}
          >
            <Text style={styles.postTitle}>{post.title}</Text>
            {post.imageUrl && (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            )}
            <Text style={styles.postContent} numberOfLines={2}>
              {post.content}
            </Text>
            <View style={styles.postFooter}>
              <Text style={styles.postAuthor}>By {post.authorName || post.author}</Text>
              <Text style={styles.postStats}>
                👍 {post.likesCount || 0} • 💬 {post.commentsCount || 0}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  generalErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 8,
  },
  clearErrorButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  clearErrorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  authButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  authButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  authButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    padding: 8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: '#FF9500',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  switchButton: {
    padding: 10,
  },
  switchButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createPostButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  createPostText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  postCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: 12,
    color: '#999',
  },
  postStats: {
    fontSize: 12,
    color: '#999',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
