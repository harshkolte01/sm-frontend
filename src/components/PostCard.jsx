import React, { useState } from 'react';
import { ConfirmModal } from './ui';

const PostCard = ({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onToggleLike,
  onOpenComments
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const isOwner = currentUserId === post.user._id || currentUserId === post.user.id;
  const isLiked = post.likes.includes(currentUserId);
  const likesCount = post.likes.length;

  const formatFullDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEditClick = () => {
    onEdit(post._id, post.text);
  };

  const handleLikeClick = () => {
    onToggleLike(post._id);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(post._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative w-10 h-10">
            {post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={`${post.user.name}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium ${post.user.avatar ? 'hidden' : ''}`}>
              {post.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {/* Name and Timestamp */}
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.user.name}
            </h3>
            <div className="flex flex-col space-y-1 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Created on:</span>
                <time dateTime={post.createdAt}>
                  {formatFullDateTime(post.createdAt)}
                </time>
              </div>
              {post.edited && post.updatedAt && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Updated on:</span>
                  <time dateTime={post.updatedAt}>
                    {formatFullDateTime(post.updatedAt)}
                  </time>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Edited
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditClick}
              className="text-gray-500 hover:text-blue-600 hover:text-blue-600 p-1 rounded transition-colors"
              aria-label="Edit post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-gray-500 hover:text-red-600   p-1 rounded transition-colors"
              aria-label="Delete post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mb-4">
        {/* Text Content */}
        <p className="text-gray-900 whitespace-pre-wrap">
          {post.text}
        </p>
        
        {/* Image */}
        {post.image && (
          <div className="mt-3">
            <img
              src={post.image}
              alt="Post image"
              className="w-full max-w-full max-h-96 h-auto rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity object-cover"
              onClick={() => {
                setSelectedImage(post.image);
                setShowImageModal(true);
              }}
              onError={(e) => {
                console.error('Image failed to load:', post.image);
                e.target.style.display = 'none';
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Click to enlarge</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 ">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                isLiked
                  ? 'text-red-600  bg-red-50 '
                  : 'text-gray-600  hover:text-red-600  hover:bg-red-50 '
              }`}
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onOpenComments(post._id)}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-600  hover:text-blue-600  hover:bg-blue-50  transition-colors"
              aria-label="View comments"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </button>

            {/* Share Button (Optional) */}
            <button
              className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-600  hover:text-green-600  hover:bg-green-50  transition-colors"
              aria-label="Share post"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Post by ${post.user.name}`,
                    text: post.text,
                    url: window.location.href
                  });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Image Enlarge Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="Enlarged post image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity"
              aria-label="Close enlarged image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;