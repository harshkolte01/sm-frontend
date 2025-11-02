import apiClient from './apiClient';

/**
 * Users API endpoints
 */
export const usersApi = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} { id, name, avatar, bio, createdAt }
   */
  getUser: (userId) => {
    return apiClient.get(`/api/users/${userId}`);
  },

  /**
   * Update user profile (protected - owner only)
   * @param {string} userId - User ID
   * @param {Object} payload - { name?, avatar?, bio? }
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: (userId, payload) => {
    return apiClient.put(`/api/users/${userId}`, payload);
  },

  /**
   * Get user's posts (protected - owner only)
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of user's posts
   */
  getUserPosts: async (userId) => {
    const response = await apiClient.get(`/api/users/${userId}/posts`);
    // Handle different possible response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.posts)) {
      return response.data.posts;
    } else {
      return []; // Return empty array as fallback
    }
  },
};

export default usersApi;