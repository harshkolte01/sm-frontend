import React, { useState, useEffect, useRef } from 'react';

const PostEditModal = ({ post, isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const modalRef = useRef(null);
  const textareaRef = useRef(null);
  const closeButtonRef = useRef(null);

  const MAX_CHARS = 500;

  // Initialize text when modal opens or post changes
  useEffect(() => {
    if (isOpen && post) {
      setText(post.text || '');
      setError('');
    }
  }, [isOpen, post]);

  // Focus management and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Tab key focus trapping
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements?.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus textarea when modal opens
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const validateText = () => {
    if (!text.trim()) {
      setError('Post text cannot be empty');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateText()) {
      return;
    }

    // Don't save if text hasn't changed
    if (text.trim() === post.text) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(post._id, text.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setText(post?.text || '');
    setError('');
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const remainingChars = MAX_CHARS - text.length;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-post-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="edit-post-title" className="text-lg font-semibold text-gray-900">
            Edit Post
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600  p-1 rounded transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Textarea */}
            <div>
              <label htmlFor="edit-text" className="block text-sm font-medium text-gray-700 mb-2">
                Post Content
              </label>
              <textarea
                ref={textareaRef}
                id="edit-text"
                value={text}
                onChange={handleTextChange}
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500  ${
                  error 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                rows="6"
                maxLength={MAX_CHARS}
                disabled={isSubmitting}
                aria-describedby={error ? 'edit-error' : 'edit-char-count'}
              />
              
              {/* Character Counter */}
              <div className="flex justify-between items-center mt-2">
                <div id="edit-char-count" className={`text-sm ${
                  remainingChars < 50 
                    ? 'text-red-500' 
                    : 'text-gray-500'
                }`}>
                  {remainingChars} characters remaining
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div id="edit-error" className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100  hover:bg-gray-200  rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting || !text.trim() || text.length > MAX_CHARS}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditModal;