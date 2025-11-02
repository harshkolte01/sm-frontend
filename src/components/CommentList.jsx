import React, { useState, useEffect } from 'react';
import { commentsApi } from '../api/commentsApi.js';
import CommentItem from './CommentItem.jsx';

const CommentList = ({ 
  postId, 
  currentUserId, 
  onCommentAdded, 
  onCommentEdited, 
  onCommentDeleted 
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_CHARS = 300;

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const commentsData = await commentsApi.getComments(postId);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newCommentText.trim()) {
      return;
    }

    if (newCommentText.length > MAX_CHARS) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newComment = await commentsApi.createComment(postId, { 
        text: newCommentText.trim() 
      });
      
      // Add new comment to the list
      setComments(prev => [...prev, newComment]);
      setNewCommentText('');
      
      // Bubble up the change
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const updatedComment = await commentsApi.editComment(commentId, { text: newText });
      
      // Update comment in the list
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId ? updatedComment : comment
        )
      );
      
      // Bubble up the change
      if (onCommentEdited) {
        onCommentEdited(updatedComment);
      }
    } catch (err) {
      console.error('Error editing comment:', err);
      throw err; // Re-throw to let CommentItem handle the error
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.deleteComment(commentId);
      
      // Remove comment from the list
      const deletedComment = comments.find(c => c._id === commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      
      // Bubble up the change
      if (onCommentDeleted) {
        onCommentDeleted(deletedComment);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  const handleNewCommentChange = (e) => {
    setNewCommentText(e.target.value);
  };

  const remainingChars = MAX_CHARS - newCommentText.length;
  const isCommentEmpty = !newCommentText.trim();

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
            <div className="flex-1">
              <textarea
                value={newCommentText}
                onChange={handleNewCommentChange}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                rows="2"
                maxLength={MAX_CHARS}
                disabled={isSubmitting}
              />
              
              {/* Character Counter and Submit */}
              <div className="flex justify-between items-center mt-2">
                <div className={`text-sm ${
                  remainingChars < 50 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {remainingChars} characters remaining
                </div>
                <button
                  type="submit"
                  disabled={isCommentEmpty || isSubmitting || newCommentText.length > MAX_CHARS}
                  className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {comments.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="mt-2 text-gray-500 dark:text-gray-400">No comments yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>

      {/* Future: Load More Button for Pagination */}
      {/* This would be implemented when backend supports pagination */}
      {/*
      {hasMore && (
        <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={loadMoreComments}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load more comments'}
          </button>
        </div>
      )}
      */}
    </div>
  );
};

export default CommentList;