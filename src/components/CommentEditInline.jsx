import React, { useState, useRef, useEffect } from 'react';

const CommentEditInline = ({ comment, onSave, onCancel }) => {
  const [text, setText] = useState(comment.text);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const MAX_CHARS = 300;

  useEffect(() => {
    // Focus textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end of text
      textareaRef.current.setSelectionRange(text.length, text.length);
    }
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      setError('Comment cannot be empty');
      return;
    }

    if (trimmedText.length > MAX_CHARS) {
      setError(`Comment must be ${MAX_CHARS} characters or less`);
      return;
    }

    // Don't save if text hasn't changed
    if (trimmedText === comment.text) {
      onCancel();
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await onSave(comment._id, trimmedText);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update comment');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setText(comment.text);
    setError('');
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const remainingChars = MAX_CHARS - text.length;

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className={`w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
            error 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          rows="2"
          maxLength={MAX_CHARS}
          disabled={isSubmitting}
          placeholder="Edit your comment..."
        />
        
        {/* Character Counter */}
        <div className="flex justify-between items-center mt-1">
          <div className={`text-xs ${
            remainingChars < 50 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {remainingChars} characters remaining
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            disabled={isSubmitting || !text.trim() || text.length > MAX_CHARS}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Press Ctrl+Enter to save, Escape to cancel
      </div>
    </div>
  );
};

export default CommentEditInline;