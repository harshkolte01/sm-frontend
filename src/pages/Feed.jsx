import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import PostForm from '../components/PostForm.jsx';
import PostCard from '../components/PostCard.jsx';
import PostEditModal from '../components/PostEditModal.jsx';
import CommentList from '../components/CommentList.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { postsApi } from '../api/postsApi.js';

const Feed = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Modal states
  const [editingPost, setEditingPost] = useState(null);
  const [showComments, setShowComments] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostLiked
  const [filterBy, setFilterBy] = useState('all'); // all, myPosts, following
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Post creation form visibility state
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Redirect if not authenticated (but wait for auth loading to complete)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load initial posts
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  // A. Load feed (page mount)
  const loadPosts = async (pageNum = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      const postsData = await postsApi.getPosts({ 
        page: pageNum, 
        limit: 20 
      });

      if (append) {
        setPosts(prev => [...prev, ...postsData]);
      } else {
        setPosts(postsData);
      }

      // Check if there are more posts (simple check - if we got less than limit)
      setHasMore(postsData.length === 20);
      
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more posts (pagination)
  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage, true);
    }
  };

  // B. Create a post
  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postsApi.createPost(postData);
      // Prepend new post to the list for instant UI update
      setPosts(prev => [newPost, ...prev]);
      // Hide the form after successful creation
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating post:', err);
      throw err; // Let PostForm handle the error
    }
  };

  // Toggle create post form visibility
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...posts];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(post =>
        post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply content filter
    if (filterBy === 'myPosts') {
      // Use the same logic as PostCard component for consistency
      filtered = filtered.filter(post => {
        const postUserId = post.user?._id || post.user?.id;
        const currentUserId = user?.id || user?._id;
        
        // Debug logging (remove in production)
        if (posts.length > 0 && posts.indexOf(post) === 0) {
          console.log('Filter Debug - Post User ID:', postUserId, 'Current User ID:', currentUserId);
          console.log('Post User Object:', post.user);
          console.log('Current User Object:', user);
        }
        
        return currentUserId === postUserId;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLiked':
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, sortBy, filterBy, user?.id]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setFilterBy('all');
  };

  // C. Edit a post
  const handleEditPost = async (postId, newText) => {
    try {
      const updatedPost = await postsApi.editPost(postId, { text: newText });
      // Update post in local state
      setPosts(prev => 
        prev.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
      setEditingPost(null);
    } catch (err) {
      console.error('Error editing post:', err);
      throw err; // Let modal handle the error
    }
  };

  // D. Delete a post
  const handleDeletePost = async (postId) => {
    try {
      await postsApi.deletePost(postId);
      // Remove post from local state
      setPosts(prev => prev.filter(post => post._id !== postId));
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
          <span className="text-gray-700 font-medium">Filters & Search</span>
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
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Posts
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by content or author..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>

            {/* Filter By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Posts
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              >
                <option value="all">All Posts</option>
                <option value="myPosts">My Posts Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200  rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto pt-8 px-4 pb-8 gap-6">
        {/* Sidebar - 20% width */}
        <div className="w-1/5 space-y-6">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
            />
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Sort By */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>

            {/* Filter By */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Posts
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
              >
                <option value="all">All Posts</option>
                <option value="myPosts">My Posts Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200  rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts:</span>
                <span className="font-medium text-gray-900">{posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Showing:</span>
                <span className="font-medium text-gray-900">{filteredPosts.length}</span>
              </div>
              {searchTerm && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Search:</span>
                  <span className="font-medium text-blue-600 truncate max-w-20" title={searchTerm}>
                    "{searchTerm}"
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

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {searchTerm || filterBy !== 'all' ? 'No posts match your filters' : 'No posts yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterBy !== 'all'
                    ? 'Try adjusting your search or filters to see more posts.'
                    : 'Be the first to share something with your friends!'
                  }
                </p>
                {(searchTerm || filterBy !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map((post) => (
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

          {/* Load More Button */}
          {hasMore && posts.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMorePosts}
                disabled={loadingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingMore ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  'Load More Posts'
                )}
              </button>
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

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || filterBy !== 'all' ? 'No posts match your filters' : 'No posts yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterBy !== 'all'
                  ? 'Try adjusting your search or filters to see more posts.'
                  : 'Be the first to share something with your friends!'
                }
              </p>
              {(searchTerm || filterBy !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
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

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'Load More Posts'
              )}
            </button>
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