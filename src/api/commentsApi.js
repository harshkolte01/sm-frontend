import apiClient from './apiClient.js';

export const commentsApi = {
  // Get all comments for a post
  getComments: async (postId) => {
    const response = await apiClient.get(`/api/posts/${postId}/comments`);
    return response.data;
  },

  // Create a comment on a post
  createComment: async (postId, { text }) => {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, { text });
    return response.data;
  },

  // Edit a comment
  editComment: async (commentId, { text }) => {
    const response = await apiClient.put(`/api/comments/${commentId}`, { text });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/api/comments/${commentId}`);
    return response.data;
  }
};