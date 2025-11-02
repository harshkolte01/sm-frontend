/**
 * Base API client wrapper
 * Handles authentication, error handling, and request/response standardization
 */

class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authentication token from AuthContext or localStorage
   */
  getToken() {
    // Try to get token from AuthContext first (if available)
    try {
      // This will be available when AuthContext is implemented
      const authContext = window.__AUTH_CONTEXT__;
      if (authContext?.token) {
        return authContext.token;
      }
    } catch (error) {
      // AuthContext not available, fallback to localStorage
    }

    // Fallback to localStorage
    return localStorage.getItem('token');
  }

  /**
   * Get headers with authentication if token exists
   */
  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Create error object with axios-like structure
      const error = new Error(data.msg || data.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      
      // Add axios-like response structure for compatibility
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data
      };
      
      // Include validation errors if present
      if (data.errors) {
        error.errors = data.errors;
        error.message = `${error.message}: ${data.errors.join(', ')}`;
      }
      
      // Handle 401 Unauthorized - token expired/invalid
      if (response.status === 401) {
        console.log('API returned 401 - token may be expired');
        // Clear token from localStorage on 401
        localStorage.removeItem('token');
        
        // Optionally trigger a global auth state update
        // This could be enhanced with a global event or context method
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
          console.log('Redirecting to login due to 401');
          window.location.href = '/login';
        }
      }
      
      throw error;
    }

    // Return data in the format expected by the frontend (axios-like)
    return { data };
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const { 
      method = 'GET', 
      body, 
      headers = {}, 
      isFormData = false,
      ...otherOptions 
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = this.getHeaders(headers, isFormData);

    let requestBody = body;
    
    // Handle JSON serialization (except for FormData)
    if (body && !isFormData && typeof body === 'object') {
      requestBody = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
        ...otherOptions,
      });

      return await this.handleResponse(response);
    } catch (error) {
      // Network errors or other fetch errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: formData, 
      isFormData: true 
    });
  }

  /**
   * PUT request with FormData (for file uploads)
   */
  async putFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: formData, 
      isFormData: true 
    });
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual methods for convenience
export const { get, post, put, delete: del, postFormData, putFormData } = apiClient;