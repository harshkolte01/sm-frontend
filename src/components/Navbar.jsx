import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to determine if a path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get nav link classes
  const getNavLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile
      ? "block px-3 py-2 text-base font-medium transition-colors relative focus:outline-none focus:ring-0 focus:border-transparent"
      : "px-3 py-2 text-sm font-medium transition-colors relative focus:outline-none focus:ring-0 focus:border-transparent";
    
    const isActive = isActivePath(path);
    
    if (isActive) {
      return `${baseClasses} text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-400 after:content-['']`;
    } else {
      return `${baseClasses} text-gray-700 hover:text-blue-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-blue-400 hover:after:content-['']`;
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Site Name */}
          <div className="shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={closeMobileMenu}
            >
              SocialApp
            </Link>
          </div>

          {/* Right Side - Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/"
              className={getNavLinkClasses('/')}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/feed"
                  className={getNavLinkClasses('/feed')}
                >
                  Feed
                </Link>
                <Link
                  to="/profile"
                  className={getNavLinkClasses('/profile')}
                >
                  Profile
                </Link>
                
                {/* User Avatar and Name */}
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="relative w-8 h-8">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium ${user?.avatar ? 'hidden' : ''}`}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={getNavLinkClasses('/login')}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={getNavLinkClasses('/signup')}
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                to="/"
                className={getNavLinkClasses('/', true)}
                onClick={closeMobileMenu}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/feed"
                    className={getNavLinkClasses('/feed', true)}
                    onClick={closeMobileMenu}
                  >
                    Feed
                  </Link>
                  <Link
                    to="/profile"
                    className={getNavLinkClasses('/profile', true)}
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  
                  {/* User Info Mobile */}
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="relative w-8 h-8">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.name}'s avatar`}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium ${user?.avatar ? 'hidden' : ''}`}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <span className="text-gray-700 text-base font-medium">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={getNavLinkClasses('/login', true)}
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={getNavLinkClasses('/signup', true)}
                    onClick={closeMobileMenu}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;