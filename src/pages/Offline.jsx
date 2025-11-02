import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import apiClient from '../api/apiClient.js';

const Offline = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get last sync time from localStorage if available
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnectivity = async () => {
    try {
      setIsRetrying(true);
      
      // Try to reach the health endpoint with a short timeout
      const response = await apiClient.get('/health', {
        timeout: 5000
      });
      
      if (response.status === 200) {
        // Connection restored
        const now = new Date();
        localStorage.setItem('lastSyncTime', now.toISOString());
        setLastSyncTime(now);
        
        // Navigate back to appropriate page
        if (isAuthenticated) {
          navigate('/feed');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      // Still offline or server unreachable
      console.log('Still offline or server unreachable');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    checkConnectivity();
  };

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/feed');
    } else {
      navigate('/');
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Offline Icon */}
          <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isOnline ? 'Browser is online' : 'Browser is offline'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isOnline ? 'Service unavailable' : "You're offline"}
          </h1>

          {/* Explanation */}
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {isOnline 
              ? "We couldn't reach our servers. This might be a temporary issue."
              : "Check your internet connection and try again."
            }
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Some features may not be available until connection is restored.
          </p>

          {/* Last Sync Time */}
          {lastSyncTime && (
            <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last synced: {formatLastSync(lastSyncTime)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRetrying ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking connection...
                </div>
              ) : (
                'Try Again'
              )}
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {isAuthenticated ? 'Go to Feed' : 'Go to Home'}
            </button>
          </div>

          {/* Offline Features Info */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              What you can do offline
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Browse cached content
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                View your profile
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Create or edit posts
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Like or comment on posts
              </div>
            </div>
          </div>

          {/* Network Tips */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Troubleshooting tips
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Check your WiFi or mobile data connection</li>
              <li>• Try switching between WiFi and mobile data</li>
              <li>• Restart your router or modem</li>
              <li>• Contact your internet service provider</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;