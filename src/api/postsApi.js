import apiClient from './apiClient.js';

export const postsApi = {
  // Get all posts with pagination - returns posts array from response
  getPosts: async ({ page, limit, userId } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (userId) params.userId = userId;
    
    const response = await apiClient.get('/api/posts', { params });
    return response.data.posts; // Return just the posts array
  },

  // Create a new post
  createPost: async ({ text, image }) => {
    const requestData = { text };
    if (image) requestData.image = image;
    
    const response = await apiClient.post('/api/posts', requestData);
    return response.data;
  },

  // Edit a post
  editPost: async (postId, { text }) => {
    const response = await apiClient.put(`/api/posts/${postId}`, { text });
    return response.data;
  },

  // Delete a post
  deletePost: async (postId) => {
    const response = await apiClient.delete(`/api/posts/${postId}`);
    return response.data;
  },

  // Toggle like on a post
  toggleLike: async (postId) => {
    const response = await apiClient.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  // Upload image to MinIO
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Use postFormData method for proper FormData handling
    const response = await apiClient.postFormData('/api/posts/upload-image', formData);
    return response.data;
  },

  // Delete image from MinIO
  deleteImage: async (fileName) => {
    const response = await apiClient.delete(`/api/posts/delete-image/${fileName}`);
    return response.data;
  }
};