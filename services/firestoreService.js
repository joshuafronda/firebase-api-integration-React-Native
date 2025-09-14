import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';

class FirestoreService {
  // Posts operations
  async createPost(authorId, postData) {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        authorId: authorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Creator posts (legacy support)
  async createCreatorPost(creatorId, postData) {
    try {
      const docRef = await addDoc(collection(db, 'creators', creatorId, 'posts'), {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get general post
  async getPost(postId) {
    try {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Post not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get creator post (legacy support)
  async getCreatorPost(creatorId, postId) {
    try {
      const docRef = doc(db, 'creators', creatorId, 'posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Post not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all posts (general)
  async getAllPosts(limitCount = 10, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get creator posts (legacy support)
  async getCreatorPosts(creatorId, limitCount = 10, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'creators', creatorId, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update general post
  async updatePost(postId, updateData) {
    try {
      const docRef = doc(db, 'posts', postId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete general post
  async deletePost(postId) {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update creator post (legacy support)
  async updateCreatorPost(creatorId, postId, updateData) {
    try {
      const docRef = doc(db, 'creators', creatorId, 'posts', postId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete creator post (legacy support)
  async deleteCreatorPost(creatorId, postId) {
    try {
      await deleteDoc(doc(db, 'creators', creatorId, 'posts', postId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Comments operations
  async createComment(postId, commentData) {
    try {
      const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        ...commentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likesCount: 0,
        repliesCount: 0
      });
      
      // Update post comments count
      await this.incrementPostCommentsCount(postId);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getComments(postId, limitCount = 20, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'posts', postId, 'comments'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: comments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateComment(postId, commentId, updateData) {
    try {
      const docRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteComment(postId, commentId) {
    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
      
      // Decrement post comments count
      await this.decrementPostCommentsCount(postId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reply operations
  async createReply(postId, commentId, replyData) {
    try {
      const docRef = await addDoc(collection(db, 'posts', postId, 'comments', commentId, 'replies'), {
        ...replyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likesCount: 0
      });
      
      // Update comment replies count
      await this.incrementCommentRepliesCount(postId, commentId);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getReplies(postId, commentId, limitCount = 10, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'posts', postId, 'comments', commentId, 'replies'),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const replies = [];
      querySnapshot.forEach((doc) => {
        replies.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: replies };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Like operations
  async likePost(postId, userId) {
    try {
      const likeRef = doc(db, 'posts', postId, 'likes', userId);
      await setDoc(likeRef, {
        userId,
        createdAt: serverTimestamp()
      });
      
      // Increment likes count
      await this.incrementPostLikesCount(postId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async unlikePost(postId, userId) {
    try {
      await deleteDoc(doc(db, 'posts', postId, 'likes', userId));
      
      // Decrement likes count
      await this.decrementPostLikesCount(postId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async likeComment(postId, commentId, userId) {
    try {
      const likeRef = doc(db, 'posts', postId, 'comments', commentId, 'likes', userId);
      await setDoc(likeRef, {
        userId,
        createdAt: serverTimestamp()
      });
      
      // Increment comment likes count
      await this.incrementCommentLikesCount(postId, commentId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async unlikeComment(postId, commentId, userId) {
    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId, 'likes', userId));
      
      // Decrement comment likes count
      await this.decrementCommentLikesCount(postId, commentId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Helper methods for count operations
  async incrementPostCommentsCount(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentsCount: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing comments count:', error);
    }
  }

  async decrementPostCommentsCount(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentsCount: increment(-1)
      });
    } catch (error) {
      console.error('Error decrementing comments count:', error);
    }
  }

  async incrementPostLikesCount(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likesCount: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing likes count:', error);
    }
  }

  async decrementPostLikesCount(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likesCount: increment(-1)
      });
    } catch (error) {
      console.error('Error decrementing likes count:', error);
    }
  }

  async incrementCommentRepliesCount(postId, commentId) {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        repliesCount: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing replies count:', error);
    }
  }

  async incrementCommentLikesCount(postId, commentId) {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        likesCount: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing comment likes count:', error);
    }
  }

  async decrementCommentLikesCount(postId, commentId) {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        likesCount: increment(-1)
      });
    } catch (error) {
      console.error('Error decrementing comment likes count:', error);
    }
  }
}

export default new FirestoreService();
