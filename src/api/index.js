// Export the base API client
export { default as apiClient } from './apiClient';

// Export all API modules
export { default as authAPI } from './authAPI';
export { default as usersAPI } from './usersApi';
export { default as postsAPI } from './postsApi';
export { default as commentsAPI } from './commentsApi';

// Re-export individual APIs for convenience
export { authAPI } from './authAPI';
export { usersAPI } from './usersApi';
export { postsAPI } from './postsApi';
export { commentsAPI } from './commentsApi';