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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render for both authenticated and unauthenticated users

  const appName = import.meta.env.VITE_APP_NAME || 'SocialApp';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-blue-600">{appName}</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your professional social network. Connect, share, and grow your career.
            </p>

            <div className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
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
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 shadow-lg"
                    aria-label="Go to your feed"
                  >
                    Go to Feed
                  </Link>
                  <Link
                    to="/profile"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 shadow-lg"
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
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 shadow-lg"
                    aria-label="Get started by creating an account"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 shadow-lg"
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
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to build your professional network
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed for modern professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Create Posts */}
            <div className="group bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Create Posts</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Share your thoughts, insights, and professional updates with your network.
              </p>
            </div>

            {/* Feature 2: Public Feed */}
            <div className="group bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">Public Feed</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Discover and engage with content from professionals in your industry.
              </p>
            </div>

            {/* Feature 3: Comments & Likes */}
            <div className="group bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Engage & React</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Like posts and leave thoughtful comments to build meaningful connections.
              </p>
            </div>

            {/* Feature 4: Edit Content */}
            <div className="group bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-yellow-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">Edit & Manage</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Full control over your content with easy editing and management tools.
              </p>
            </div>

            {/* Feature 5: Profile Customization */}
            <div className="group bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">Custom Profile</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Showcase your professional brand with a personalized profile.
              </p>
            </div>

            {/* Feature 6: Security & Privacy */}
            <div className="group bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">Secure & Private</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Posts Preview (Optional) */}
      {samplePosts.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                See what professionals are sharing
              </h2>
              <p className="text-lg text-gray-600">
                Get a preview of the conversations happening on {appName}
              </p>
            </div>

            <div className="space-y-6">
              {samplePosts.map((post, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative w-10 h-10">
                      {post.user?.avatar ? (
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
                      <div className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium ${post.user?.avatar ? 'hidden' : ''}`}>
                        {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {post.user?.name || 'Professional User'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {post.text}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 shadow-lg"
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
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 shadow-lg"
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
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
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
                  className="px-8 py-3 border-2 border-white bg-transparent !text-white font-semibold rounded-lg hover:bg-white hover:!text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  aria-label="Go to your feed"
                >
                  Go to Feed
                </Link>
                <Link
                  to="/profile"
                  className="px-8 py-3 border-2 border-white bg-transparent !text-white font-semibold rounded-lg hover:bg-white hover:!text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
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
                  className="px-8 py-3 border-2 border-white bg-transparent !text-white font-semibold rounded-lg hover:bg-white hover:!text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  aria-label="Create your account now"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-white bg-transparent !text-white font-semibold rounded-lg hover:bg-white hover:!text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
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