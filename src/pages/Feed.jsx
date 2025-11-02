import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import PostForm from '../components/PostForm.jsx';
import PostCard from '../components/PostCard.jsx';
import PostEditModal from '../components/PostEditModal.jsx';
import CommentList from '../components/CommentList.jsx';
import { Pagination } from '../components/ui';
import { useAuth } from '../hooks/useAuth.js';
import { postsApi } from '../api/postsApi.js';

const Feed = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  
  // Pagination metadata state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  // Modal states
  const [editingPost, setEditingPost] = useState(null);
  const [showComments, setShowComments] = useState(null);
  
  // Filter states (for server-side filtering)
  const [filterBy, setFilterBy] = useState('all'); // all, myPosts
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Post creation form visibility state
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Redirect if not authenticated (but wait for auth loading to complete)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // A. Load feed (page mount)
  const loadPosts = useCallback(async (pageNum = 1, isFilterChange = false) => {
    try {
      if (isFilterChange) {
        setFilterLoading(true);
      } else {
        setLoading(true);
      }
      setError('');

      // Build request parameters
      const requestParams = {
        page: pageNum,
        limit: 20
      };

      // Add userId filter if "myPosts" is selected
      if (filterBy === 'myPosts' && user?.id) {
        requestParams.userId = user.id;
      }

      const response = await postsApi.getPosts(requestParams);

      // Extract posts and pagination from response
      const { posts: postsData, pagination: paginationData } = response;

      setPosts(postsData);

      // Update pagination state with backend data
      setPagination(paginationData);
      
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [filterBy, user?.id]);

  // Load initial posts
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated, loadPosts]);

  // Filter change effect
  useEffect(() => {
    if (!isAuthenticated) return;

    setPage(1); // Reset to page 1 when filter changes
    loadPosts(1, true); // Pass true to indicate this is a filter change
  }, [filterBy, isAuthenticated, loadPosts]);

  // Navigate to specific page
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= pagination.pages && pageNum !== page) {
      setPage(pageNum);
      loadPosts(pageNum);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (page < pagination.pages) {
      goToPage(page + 1);
    }
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (page > 1) {
      goToPage(page - 1);
    }
  };

  // B. Create a post
  const handleCreatePost = async (postData) => {
    try {
      await postsApi.createPost(postData);
      // Hide the form after successful creation
      setShowCreateForm(false);
      // Reload current page to get fresh data from backend
      loadPosts(page);
    } catch (err) {
      console.error('Error creating post:', err);
      throw err; // Let PostForm handle the error
    }
  };

  // Toggle create post form visibility
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterBy('all');
  };

  // C. Edit a post
  const handleEditPost = async (postId, newText) => {
    try {
      await postsApi.editPost(postId, { text: newText });
      setEditingPost(null);
      // Reload current page to get fresh data from backend
      loadPosts(page);
    } catch (err) {
      console.error('Error editing post:', err);
      throw err; // Let modal handle the error
    }
  };

  // D. Delete a post
  const handleDeletePost = async (postId) => {
    try {
      await postsApi.deletePost(postId);
      // Reload current page to get fresh data from backend
      loadPosts(page);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  // E. Like a post
  const handleToggleLike = async (postId) => {
    try {
      const result = await postsApi.toggleLike(postId);
      
      // Update post likes in local state
      setPosts(prev => 
        prev.map(post => {
          if (post._id === postId) {
            const isLiked = result.liked;
            const newLikes = isLiked 
              ? [...post.likes, user.id]
              : post.likes.filter(id => id !== user.id);
            
            return {
              ...post,
              likes: newLikes
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like');
    }
  };

  // F. View comments for a post
  const handleOpenComments = (postId) => {
    setShowComments(postId);
  };

  const handleCloseComments = () => {
    setShowComments(null);
  };

  // Comment event handlers to update post comment counts
  const handleCommentAdded = (comment) => {
    setPosts(prev => 
      prev.map(post => 
        post._id === comment.post 
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      )
    );
  };

  const handleCommentDeleted = (comment) => {
    setPosts(prev => 
      prev.map(post => 
        post._id === comment.post 
          ? { ...post, commentsCount: Math.max(0, post.commentsCount - 1) }
          : post
      )
    );
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600">Initializing...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600">Loading your feed...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar at top */}
      <Navbar />
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden px-4 pt-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <span className="text-gray-700 font-medium">Filters</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="lg:hidden px-4 pb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
            {/* Filter By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Posts
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Posts</option>
                <option value="myPosts">My Posts Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            {filterBy !== 'all' && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto pt-8 px-4 pb-8 gap-6">
        {/* Sidebar - 20% width */}
        <div className="w-1/5 space-y-6">
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Filter By */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Posts
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Posts</option>
                <option value="myPosts">My Posts Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            {filterBy !== 'all' && (
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts:</span>
                <span className="font-medium text-gray-900">{pagination.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Page:</span>
                <span className="font-medium text-gray-900">{posts.length} posts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Page:</span>
                <span className="font-medium text-gray-900">{pagination.page} of {pagination.pages}</span>
              </div>
              
              {/* Active Filters */}
              {filterBy !== 'all' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Filter:</span>
                  <span className="font-medium text-blue-600">
                    {filterBy === 'myPosts' ? 'My Posts' : filterBy}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - 80% width */}
        <div className="flex-1">
          {/* Welcome Header with Create Post Button */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  What's on your mind today?
                </p>
              </div>
              <button
                onClick={toggleCreateForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Post Creation Form - Toggleable */}
          {showCreateForm && (
            <div className="mb-6">
              <PostForm onCreate={handleCreatePost} />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Filter Loading Indicator */}
          {filterLoading && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center">
                <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-blue-600">Applying filters...</span>
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <div className={`space-y-4 ${filterLoading ? 'opacity-50' : ''}`}>
            {posts.length === 0 && !filterLoading ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {filterBy !== 'all' ? 'No posts match your filter' : 'No posts yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterBy !== 'all'
                    ? 'Try changing your filter to see more posts.'
                    : 'Be the first to share something with your friends!'
                  }
                </p>
                {filterBy !== 'all' && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={user?.id}
                  onEdit={(postId, newText) => setEditingPost(post)}
                  onDelete={handleDeletePost}
                  onToggleLike={handleToggleLike}
                  onOpenComments={handleOpenComments}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={goToPage}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden max-w-2xl mx-auto px-4 pb-8">
        {/* Welcome Header with Create Post Button */}
        <div className="mb-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                What's on your mind today?
              </p>
            </div>
            <button
              onClick={toggleCreateForm}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Post Creation Form - Toggleable */}
        {showCreateForm && (
          <div className="mb-6">
            <PostForm onCreate={handleCreatePost} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Filter Loading Indicator */}
        {filterLoading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center">
              <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-blue-600">Applying filters...</span>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className={`space-y-4 ${filterLoading ? 'opacity-50' : ''}`}>
          {posts.length === 0 && !filterLoading ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {filterBy !== 'all' ? 'No posts match your filter' : 'No posts yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterBy !== 'all'
                  ? 'Try changing your filter to see more posts.'
                  : 'Be the first to share something with your friends!'
                }
              </p>
              {filterBy !== 'all' && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?.id}
                onEdit={(postId, newText) => setEditingPost(post)}
                onDelete={handleDeletePost}
                onToggleLike={handleToggleLike}
                onOpenComments={handleOpenComments}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={goToPage}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
            />
          </div>
        )}
      </div>

      {/* Post Edit Modal */}
      {editingPost && (
        <PostEditModal
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleEditPost}
        />
      )}

      {/* Comments Modal/Panel */}
      {showComments && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Comments
              </h2>
              <button
                onClick={handleCloseComments}
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                aria-label="Close comments"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
              <CommentList
                postId={showComments}
                currentUserId={user?.id}
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Feed;