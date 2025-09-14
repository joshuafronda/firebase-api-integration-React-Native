import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { storage } from '../firebase';

class StorageService {
  // Upload image to Firebase Storage
  async uploadImage(imageUri, userId, postId = null) {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = postId 
        ? `posts/${userId}/${postId}/${timestamp}.jpg`
        : `posts/${userId}/${timestamp}.jpg`;
      
      // Create storage reference
      const storageRef = ref(storage, filename);
      
      // Convert image to blob for upload
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Upload the image
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progress tracking (optional)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ 
                success: true, 
                url: downloadURL,
                path: filename 
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Upload image with progress callback
  async uploadImageWithProgress(imageUri, userId, postId, onProgress) {
    try {
      const timestamp = Date.now();
      const filename = postId 
        ? `posts/${userId}/${postId}/${timestamp}.jpg`
        : `posts/${userId}/${timestamp}.jpg`;
      
      const storageRef = ref(storage, filename);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ 
                success: true, 
                url: downloadURL,
                path: filename 
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete image from Firebase Storage
  async deleteImage(imagePath) {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get image metadata
  async getImageMetadata(imagePath) {
    try {
      const imageRef = ref(storage, imagePath);
      const metadata = await getMetadata(imageRef);
      return { success: true, metadata };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Upload multiple images
  async uploadMultipleImages(imageUris, userId, postId) {
    try {
      const uploadPromises = imageUris.map((uri, index) => 
        this.uploadImage(uri, userId, `${postId}_${index}`)
      );
      
      const results = await Promise.all(uploadPromises);
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);
      
      return {
        success: successful.length > 0,
        successful,
        failed,
        total: results.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new StorageService();
