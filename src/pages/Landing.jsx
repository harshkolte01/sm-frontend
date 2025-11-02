import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { postsApi } from '../api/postsApi.js';

const Landing = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [samplePosts, setSamplePosts] = useState([]);

  // Allow both authenticated and unauthenticated users to access the landing page
  // No redirect needed - users can access home page regardless of auth status

  // Optional: Load sample posts for demo preview
  useEffect(() => {
    const loadSamplePosts = async () => {
      try {
        const posts = await postsApi.getPosts({ limit: 3 });
        setSamplePosts(posts.slice(0, 3)); // Ensure max 3 posts
      } catch (err) {
        // Fallback gracefully if API unavailable
        console.log('Sample posts unavailable');
      }
    };

    if (!authLoading) {
      loadSamplePosts();
    }
  }, [isAuthenticated, authLoading]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render for both authenticated and unauthenticated users

  const appName = import.meta.env.VITE_APP_NAME || 'SocialApp';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="text-blue-600 dark:text-blue-400">{appName}</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your professional social network. Connect, share, and grow your career.
            </p>

            <div className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto">
              <p className="mb-4">
                Join thousands of professionals who use {appName} to share insights, 
                build their network, and advance their careers. Create posts, engage with content, 
                customize your profile, and connect with like-minded professionals.
              </p>
            </div>

            {/* Primary CTAs - Show different buttons based on auth status */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isAuthenticated ? (
                // Authenticated user CTAs
                <>
                  <Link
                    to="/feed"
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Go to your feed"
                  >
                    Go to Feed
                  </Link>
                  <Link
                    to="/profile"
                    className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="View your profile"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                // Unauthenticated user CTAs
                <>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Get started by creating an account"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Sign in to your existing account"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20"></div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to build your professional network
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed for modern professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Create Posts */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Posts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your thoughts, insights, and professional updates with your network.
              </p>
            </div>

            {/* Feature 2: Public Feed */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Public Feed</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover and engage with content from professionals in your industry.
              </p>
            </div>

            {/* Feature 3: Comments & Likes */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Engage & React</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Like posts and leave thoughtful comments to build meaningful connections.
              </p>
            </div>

            {/* Feature 4: Edit Content */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Edit & Manage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Full control over your content with easy editing and management tools.
              </p>
            </div>

            {/* Feature 5: Profile Customization */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Custom Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Showcase your professional brand with a personalized profile.
              </p>
            </div>

            {/* Feature 6: Dark/Light Mode */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Theme Options</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose between light and dark themes for comfortable viewing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Posts Preview (Optional) */}
      {samplePosts.length > 0 && (
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                See what professionals are sharing
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get a preview of the conversations happening on {appName}
              </p>
            </div>

            <div className="space-y-6">
              {samplePosts.map((post, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {post.user?.name || 'Professional User'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.text}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.likes?.length || 0} likes</span>
                    <span>{post.commentsCount || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              {isAuthenticated ? (
                <Link
                  to="/feed"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Go to your feed to join the conversation"
                >
                  Join the conversation
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Join the conversation by signing up"
                >
                  Join the conversation
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      <div className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to advance your career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join {appName} today and start building meaningful professional connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              // Authenticated user final CTAs
              <>
                <Link
                  to="/feed"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  aria-label="Go to your feed"
                >
                  Go to Feed
                </Link>
                <Link
                  to="/profile"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  aria-label="View your profile"
                >
                  My Profile
                </Link>
              </>
            ) : (
              // Unauthenticated user final CTAs
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  aria-label="Create your account now"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  aria-label="Sign in if you already have an account"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;