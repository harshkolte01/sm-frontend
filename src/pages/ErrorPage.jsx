import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';

const ErrorPage = ({ error, resetError }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    }
    window.location.reload();
  };

  const handleGoHome = () => {
    if (resetError) {
      resetError();
    }
    if (isAuthenticated) {
      navigate('/feed');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>

          {/* Explanation */}
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            An unexpected error occurred. This might be a temporary issue with our servers.
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Try refreshing the page, or come back later.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Error Details (Development)
              </h3>
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                {error.toString()}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRefresh}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Refresh Page
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {isAuthenticated ? 'Go to Feed' : 'Go to Home'}
            </button>
          </div>

          {/* Support Information */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Still having trouble?
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If this problem persists, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="mailto:support@socialapp.com"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Contact Support
                </a>
                <span className="hidden sm:inline text-gray-400">•</span>
                <a
                  href="https://status.socialapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Service Status
                </a>
              </div>
            </div>
          </div>

          {/* Error ID for Support */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;