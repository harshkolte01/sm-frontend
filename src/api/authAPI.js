import apiClient from './apiClient';

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * User signup
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<Object>} { token, user }
   */
  signup: ({ name, email, password }) => {
    return apiClient.post('/api/auth/signup', { name, email, password });
  },

  /**
   * User login
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { token, user }
   */
  login: ({ email, password }) => {
    return apiClient.post('/api/auth/login', { email, password });
  },

  /**
   * Get current user (optional endpoint to verify token)
   * @returns {Promise<Object>} user data
   */
  getCurrentUser: () => {
    return apiClient.get('/api/auth/me');
  },
};

export default authAPI;