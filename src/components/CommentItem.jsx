import React, { useState } from 'react';
import CommentEditInline from './CommentEditInline.jsx';

const CommentItem = ({ comment, currentUserId, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Use robust ID comparison similar to PostCard component
  const isOwner = currentUserId === comment.user._id || currentUserId === comment.user.id;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  const handleEditSave = async (commentId, newText) => {
    try {
      await onEdit(commentId, newText);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in CommentEditInline
      throw error;
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.user.name}
              </h4>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={comment.createdAt}>
                  {formatTimestamp(comment.createdAt)}
                </time>
                {comment.edited && (
                  <>
                    <span>•</span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
                      Edited
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && !isEditing && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-colors"
                  aria-label="Edit comment"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                  aria-label="Delete comment"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Comment Body */}
          <div className="mt-1">
            {isEditing ? (
              <CommentEditInline
                comment={comment}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            ) : (
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {comment.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;