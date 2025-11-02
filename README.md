# Social Media Frontend

A modern, responsive social media application frontend built with React, Vite, and Tailwind CSS. This application provides a complete social media experience with user authentication, post creation, commenting, and real-time interactions featuring a clean, professional light theme design.

## 🚀 Features

### Core Features
- **User Authentication** - Secure login/signup with JWT token management
- **Social Feed** - View and interact with posts from all users with advanced filtering and sorting
- **Post Management** - Create, edit, and delete posts with rich content and image support
- **Comments System** - Add, edit, and delete comments on posts with inline editing
- **User Profiles** - View and edit user profiles with comprehensive avatar support
- **Avatar System** - Complete avatar functionality with image display and fallback to initials
- **Light Theme Design** - Clean, professional light theme optimized for readability
- **Responsive Design** - Mobile-first design that works seamlessly on all devices

### Enhanced UI Features
- **Interactive Navigation** - Active page indicators with green highlights and blue hover effects
- **Modal System** - Elegant modals with semi-transparent overlays for editing posts and viewing comments
- **Animated Elements** - Smooth animations and transitions throughout the interface
- **Advanced Feed Controls** - Search, filter by user posts, and sort by newest/oldest/most liked
- **Image Upload** - Support for both file upload and URL-based image sharing
- **Character Counters** - Real-time character counting for posts and comments

### Technical Features
- **Real-time Updates** - Dynamic content loading and updates with optimistic UI
- **Form Validation** - Comprehensive client-side validation with user-friendly error messages
- **Error Handling** - Robust error handling with graceful fallbacks
- **Loading States** - Smooth loading indicators and skeleton screens
- **Offline Support** - Graceful handling of network connectivity issues
- **Performance Optimized** - Efficient rendering and state management

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.7** - Fast build tool and development server
- **React Router DOM 7.9.5** - Client-side routing

### Styling & UI
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **React Icons 5.5.0** - Popular icon library
- **React Modal 3.16.3** - Accessible modal components
- **Clsx 2.1.1** - Conditional className utility

### State Management & API
- **React Context** - Global state management for authentication
- **Axios 1.13.1** - HTTP client for API requests
- **Custom API Client** - Wrapper for standardized API interactions

### Forms & Validation
- **React Hook Form 7.66.0** - Performant forms with easy validation
- **Yup 1.7.1** - Schema validation library

### Utilities
- **Day.js 1.11.19** - Lightweight date manipulation
- **UUID 13.0.0** - Unique identifier generation
- **React Toastify 11.0.5** - Toast notification system

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── apiClient.js       # Base API client with auth handling
│   ├── authAPI.js         # Authentication endpoints
│   ├── postsApi.js        # Posts CRUD operations
│   ├── commentsApi.js     # Comments CRUD operations
│   ├── usersApi.js        # User management endpoints
│   └── index.js           # API exports
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   │   ├── Avatar.jsx     # User avatar component with fallback
│   │   ├── Button.jsx     # Styled button component
│   │   ├── Input.jsx      # Form input component
│   │   ├── Textarea.jsx   # Form textarea component
│   │   ├── Spinner.jsx    # Loading spinner
│   │   └── index.js       # UI components export
│   ├── AuthForm.jsx       # Login/Signup form with light theme
│   ├── CommentItem.jsx    # Individual comment display with avatars
│   ├── CommentList.jsx    # Comments container with user avatars
│   ├── CommentEditInline.jsx # Inline comment editing
│   ├── Footer.jsx         # App footer (light theme only)
│   ├── Navbar.jsx         # Navigation with active indicators & avatars
│   ├── PostCard.jsx       # Individual post display with avatars
│   ├── PostForm.jsx       # Post creation form with user avatar
│   ├── PostEditModal.jsx  # Post editing modal with light overlay
│   └── SiteBanner.jsx     # Site-wide banner
├── context/               # React Context providers
│   └── AuthContext.jsx    # Authentication state management with refreshUser
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Authentication hook
├── pages/                 # Page components (all light theme)
│   ├── Landing.jsx        # Landing page with animated icons
│   ├── Login.jsx          # Login page
│   ├── Signup.jsx         # Registration page
│   ├── Feed.jsx           # Main social feed with filtering & search
│   ├── Profile.jsx        # User profile page with avatar sync
│   ├── ErrorPage.jsx      # Error handling page
│   ├── NotFound.jsx       # 404 page
│   └── Offline.jsx        # Offline status page
├── styles/                # Global styles
│   └── globals.css        # Global CSS styles (light theme only)
├── assets/                # Static assets
└── App.jsx                # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API server running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshkolte01/sm-frontend.git
   cd sm-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   
   Available environment variables:
   - `VITE_API_URL` - Backend API base URL (default: http://localhost:5000)
   - `VITE_APP_NAME` - Application name for branding

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎨 Design System

The application features a clean, professional light theme design:

- **Light Theme Only** - Optimized light theme for maximum readability and accessibility
- **Consistent Color Palette** - Blue accent colors (#3b82f6) with gray neutrals
- **Professional Styling** - Clean, modern interface with subtle shadows and borders
- **Tailwind Integration** - Utility-first CSS with custom component styling
- **Responsive Typography** - Optimized text sizing and spacing across all devices
- **Interactive Elements** - Hover states, focus indicators, and smooth transitions

## 🖼️ Avatar System

Comprehensive avatar functionality throughout the application:

- **Image Display** - Shows user profile pictures when available
- **Fallback System** - Displays user initials when no image is available
- **Error Handling** - Graceful fallback when images fail to load
- **Real-time Sync** - Avatar updates propagate across all components
- **Consistent Sizing** - Responsive avatar sizes for different contexts
- **Components Integration** - Avatars in navbar, posts, comments, and forms

## � Authentication

The app implements JWT-based authentication:

- **Token Storage** - Secure token storage in localStorage
- **Auto-refresh** - Automatic token validation on app load
- **Route Protection** - Protected routes redirect to login
- **Error Handling** - Graceful handling of expired tokens
- **User Context** - Global user state with refreshUser functionality

## 📱 Responsive Design

Built with mobile-first approach:

- **Breakpoints** - Tailwind's responsive breakpoints
- **Touch-friendly** - Optimized for touch interactions
- **Performance** - Optimized images and lazy loading
- **Accessibility** - ARIA labels and keyboard navigation

## 🔌 API Integration

The frontend communicates with a REST API backend:

- **Base URL** - Configurable via environment variables
- **Authentication** - Automatic JWT token inclusion
- **Error Handling** - Standardized error responses
- **Loading States** - UI feedback for all API calls

### API Endpoints Used

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/posts` - Fetch posts feed
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

### Manual Deployment

1. Build the project: `npm run build`
2. Serve the `dist` folder with any static file server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 Code Style

- **ESLint** - Code linting with React-specific rules
- **Prettier** - Code formatting (recommended)
- **Component Structure** - Functional components with hooks
- **File Naming** - PascalCase for components, camelCase for utilities

## 🆕 Recent Updates & Improvements

### Version 2.0 - Light Theme Redesign
- **Complete Theme Overhaul** - Removed dark mode, implemented professional light theme
- **Enhanced Avatar System** - Comprehensive avatar support with image display and fallback
- **Improved Navigation** - Active page indicators and hover effects
- **Modal System Upgrade** - Light, semi-transparent overlays for better UX
- **Component Cleanup** - Removed unused theme files and optimized styling
- **Bug Fixes** - Resolved component errors and styling conflicts

### Key Architectural Changes
- **Removed Files**: `ThemeContext.jsx`, `ThemeToggle.jsx`, `useTheme.js`, `themes.css`
- **Enhanced Components**: All components now support avatar display with graceful fallbacks
- **Styling Consistency**: Standardized color palette using Tailwind blue variants
- **Performance Improvements**: Cleaner CSS, reduced bundle size, optimized rendering

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify `VITE_API_URL` in `.env` file
   - Ensure backend server is running
   - Check network connectivity

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`

3. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Check token expiration
   - Verify API endpoints

4. **Avatar Display Issues**
   - Check image URL validity
   - Verify user data is properly loaded
   - Fallback to initials should work automatically

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Harsh Kolte**
- GitHub: [@harshkolte01](https://github.com/harshkolte01)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vite team for the fast build tool
- All contributors and open-source libraries used

---

For backend setup and API documentation, please refer to the backend repository.
