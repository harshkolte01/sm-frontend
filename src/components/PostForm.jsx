import React, { useState } from 'react';
import { postsApi } from '../api/postsApi.js';

const PostForm = ({ onCreate }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const MAX_CHARS = 500;

  const validateText = () => {
    if (!text.trim()) {
      setError('Post text is required');
      return false;
    }
    if (text.length > MAX_CHARS) {
      setError(`Post text must be ${MAX_CHARS} characters or less`);
      return false;
    }
    setError('');
    return true;
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.value);
    if (e.target.value) {
      setImagePreview(e.target.value);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to server
      const result = await postsApi.uploadImage(file);
      setImage(result.imageUrl);
      setUploadedFileName(result.fileName);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to upload image');
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    // If image was uploaded to our server, delete it
    if (uploadedFileName) {
      try {
        await postsApi.deleteImage(uploadedFileName);
      } catch (err) {
        console.error('Failed to delete uploaded image:', err);
      }
    }
    
    setImage('');
    setImagePreview('');
    setUploadedFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateText()) {
      return;
    }

    setLoading(true);
    
    try {
      const postData = {
        text: text.trim(),
        ...(image.trim() && { image: image.trim() })
      };
      
      await onCreate(postData);
      
      // Clear form on success
      setText('');
      setImage('');
      setImagePreview('');
      setUploadedFileName('');
      setError('');
    } catch (err) {
      // Keep input on error, show error message
      setError(err.response?.data?.msg || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isTextEmpty = !text.trim();
  const remainingChars = MAX_CHARS - text.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            U
          </div>
          <div className="flex-1">
            <div>
              <label htmlFor="post-text" className="sr-only">
                What's on your mind?
              </label>
              <textarea
                id="post-text"
                value={text}
                onChange={handleTextChange}
                placeholder="What's on your mind?"
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
                  error 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                rows="3"
                maxLength={MAX_CHARS}
                disabled={loading}
                aria-describedby={error ? 'post-error' : 'char-count'}
              />
              
              {/* Character Counter */}
              <div className="flex justify-between items-center mt-2">
                <div id="char-count" className={`text-sm ${
                  remainingChars < 50 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {remainingChars} characters remaining
                </div>
              </div>
            </div>

            {/* Image Options */}
            <div className="mt-3 space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Image (optional)
              </label>
              
              {/* Upload File Option */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={loading || uploading}
                    className="hidden"
                  />
                </label>
                {uploading && (
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Image URL Input */}
              <div>
                <input
                  type="url"
                  id="post-image"
                  value={image}
                  onChange={handleImageChange}
                  placeholder="Paste image URL here..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  disabled={loading || uploading}
                />
              </div>

              {/* Image Preview */}
              {(imagePreview || image) && (
                <div className="relative">
                  <img
                    src={imagePreview || image}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setImagePreview('');
                      if (!uploadedFileName) {
                        setImage('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    disabled={loading || uploading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div id="post-error" className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isTextEmpty || loading || uploading || text.length > MAX_CHARS}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={loading ? 'Creating post...' : uploading ? 'Uploading image...' : 'Create post'}
              >
                {loading || uploading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploading ? 'Uploading...' : 'Posting...'}
                  </div>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;