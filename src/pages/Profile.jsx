import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx';
import PostEditModal from '../components/PostEditModal.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { usersApi } from '../api/usersApi.js';
import { postsApi } from '../api/postsApi.js';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  // State management
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    avatar: '',
    bio: ''
  });

  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === currentUser?.id;
  const targetUserId = userId || currentUser?.id;

  // Redirect if not authenticated (but wait for auth loading to complete)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Load profile data
  useEffect(() => {
    if (isAuthenticated && targetUserId) {
      loadProfile();
    }
  }, [isAuthenticated, targetUserId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      // Load user profile and posts in parallel
      console.log('Loading posts for userId:', targetUserId);
      const [userResponse, postsData] = await Promise.all([
        usersApi.getUser(targetUserId),
        usersApi.getUserPosts(targetUserId)
      ]);
      console.log('Loaded posts:', postsData);

      setProfileUser(userResponse.data);
      setPosts(Array.isArray(postsData) ? postsData : []);

      // Initialize edit form with current data
      setEditForm({
        name: userResponse.data.name || '',
        avatar: userResponse.data.avatar || '',
        bio: userResponse.data.bio || ''
      });

    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile edit
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    setEditForm({
      name: profileUser.name || '',
      avatar: profileUser.avatar || '',
      bio: profileUser.bio || ''
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      const updatedUser = await usersApi.updateUser(targetUserId, editForm);
      setProfileUser(updatedUser.data);
      setIsEditing(false);
      
      // If updating own profile, refresh the user data in AuthContext
      // so navbar and other components get the updated avatar/name
      if (isOwnProfile) {
        try {
          await refreshUser();
        } catch (refreshErr) {
          console.warn('Failed to refresh user data in AuthContext:', refreshErr);
          // Don't show error to user since profile update was successful
        }
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Post management functions (reused from Feed)
  const handleEditPost = async (postId, newText) => {
    try {
      const updatedPost = await postsApi.editPost(postId, { text: newText });
      setPosts(prev => 
        prev.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
      setEditingPost(null);
    } catch (err) {
      console.error('Error editing post:', err);
      throw err;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postsApi.deletePost(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const result = await postsApi.toggleLike(postId);
      
      setPosts(prev => 
        prev.map(post => {
          if (post._id === postId) {
            const isLiked = result.liked;
            const newLikes = isLiked 
              ? [...post.likes, currentUser.id]
              : post.likes.filter(id => id !== currentUser.id);
            
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

  const handleOpenComments = (postId) => {
    // For simplicity, navigate to feed with comment focus
    // In a full app, you might implement a comment modal here too
    navigate(`/feed#post-${postId}`);
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-8 px-4">
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
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Profile not found</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar at top */}
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {isEditing ? (
            /* Edit Profile Form */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-start space-x-6">
                <div className="shrink-0">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {editForm.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      id="avatar"
                      name="avatar"
                      value={editForm.avatar}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                      placeholder="Tell us about yourself..."
                      maxLength="500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* Profile Display */
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-start space-x-4 sm:space-x-6 flex-1 min-w-0">
                <div className="shrink-0">
                  {profileUser.avatar ? (
                    <img
                      src={profileUser.avatar}
                      alt={`${profileUser.name}'s avatar`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold ${profileUser.avatar ? 'hidden' : ''}`}>
                    {profileUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
                    {profileUser.name}
                  </h1>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base truncate">
                    {profileUser.email}
                  </p>
                  {profileUser.bio && (
                    <p className="text-gray-700 mb-3 text-sm sm:text-base line-clamp-2">
                      {profileUser.bio}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-500">
                    <span>{posts.length} posts</span>
                    <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <div className="flex justify-end sm:justify-start">
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Posts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isOwnProfile ? 'Your Posts' : `${profileUser.name}'s Posts`}
          </h2>
          
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isOwnProfile ? "You haven't shared anything yet." : "This user hasn't shared anything yet."}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUser?.id}
                  onEdit={(postId, newText) => setEditingPost(post)}
                  onDelete={handleDeletePost}
                  onToggleLike={handleToggleLike}
                  onOpenComments={handleOpenComments}
                />
              ))
            )}
          </div>
        </div>
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
    </div>
  );
};

export default Profile;