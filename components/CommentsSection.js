import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import firestoreService from '../services/firestoreService';
import authService from '../services/authService';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Load comments
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const result = await firestoreService.getComments(postId);
    if (result.success) {
      setComments(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) {
      Alert.alert('Error', 'Please write a comment and make sure you are logged in');
      return;
    }

    setLoading(true);
    const commentData = {
      content: newComment.trim(),
      authorId: user.uid,
      authorName: user.displayName || user.email,
      authorEmail: user.email
    };

    const result = await firestoreService.createComment(postId, commentData);
    if (result.success) {
      setNewComment('');
      loadComments(); // Reload comments
    } else {
      Alert.alert('Error', result.error);
    }
    setLoading(false);
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      Alert.alert('Error', 'Please log in to like comments');
      return;
    }

    const result = await firestoreService.likeComment(postId, commentId, user.uid);
    if (result.success) {
      loadComments(); // Reload to update like count
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      Alert.alert('Error', 'Please log in to delete comments');
      return;
    }

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await firestoreService.deleteComment(postId, commentId);
            if (result.success) {
              loadComments(); // Reload comments
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.authorName}>{item.authorName}</Text>
        <Text style={styles.commentDate}>
          {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
        </Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikeComment(item.id)}
        >
          <Text style={styles.actionText}>👍 {item.likesCount || 0}</Text>
        </TouchableOpacity>
        {user && user.uid === item.authorId && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteComment(item.id)}
          >
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({comments.length})</Text>
      
      {user ? (
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddComment}
            disabled={loading || !newComment.trim()}
          >
            <Text style={styles.addButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loginPrompt}>Please log in to comment</Text>
      )}

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
        refreshing={loading}
        onRefresh={loadComments}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  addCommentContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginPrompt: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorName: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    color: '#666',
    fontSize: 12,
  },
  commentContent: {
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    color: '#007AFF',
    fontSize: 14,
  },
  deleteText: {
    color: '#FF3B30',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default CommentsSection;
