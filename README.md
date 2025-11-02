# Social Media Frontend

A modern, responsive social media application frontend built with React, Vite, and Tailwind CSS. This application provides a complete social media experience with user authentication, post creation, commenting, and real-time interactions.

## 🚀 Features

### Core Features
- **User Authentication** - Secure login/signup with JWT token management
- **Social Feed** - View and interact with posts from all users
- **Post Management** - Create, edit, and delete posts with rich content
- **Comments System** - Add, edit, and delete comments on posts
- **User Profiles** - View and edit user profiles with avatar support
- **Dark/Light Theme** - Toggle between themes with system preference detection
- **Responsive Design** - Mobile-first design that works on all devices

### Technical Features
- **Real-time Updates** - Dynamic content loading and updates
- **Form Validation** - Client-side validation with React Hook Form and Yup
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Loading States** - Smooth loading indicators throughout the app
- **Offline Support** - Graceful handling of network connectivity issues
- **Toast Notifications** - User feedback for actions and errors

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
- **React Context** - Global state management for auth and theme
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
│   │   ├── Avatar.jsx     # User avatar component
│   │   ├── Button.jsx     # Styled button component
│   │   ├── Input.jsx      # Form input component
│   │   ├── Textarea.jsx   # Form textarea component
│   │   ├── Spinner.jsx    # Loading spinner
│   │   └── index.js       # UI components export
│   ├── AuthForm.jsx       # Login/Signup form
│   ├── CommentItem.jsx    # Individual comment display
│   ├── CommentList.jsx    # Comments container
│   ├── CommentEditInline.jsx # Inline comment editing
│   ├── Footer.jsx         # App footer
│   ├── Navbar.jsx         # Navigation bar
│   ├── PostCard.jsx       # Individual post display
│   ├── PostForm.jsx       # Post creation/editing form
│   ├── PostEditModal.jsx  # Post editing modal
│   ├── SiteBanner.jsx     # Site-wide banner
│   └── ThemeToggle.jsx    # Dark/light theme switcher
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state management
│   └── ThemeContext.jsx   # Theme state management
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   └── useTheme.js        # Theme management hook
├── pages/                 # Page components
│   ├── Landing.jsx        # Landing/home page
│   ├── Login.jsx          # Login page
│   ├── Signup.jsx         # Registration page
│   ├── Feed.jsx           # Main social feed
│   ├── Profile.jsx        # User profile page
│   ├── ErrorPage.jsx      # Error handling page
│   ├── NotFound.jsx       # 404 page
│   └── Offline.jsx        # Offline status page
├── styles/                # Global styles
│   ├── globals.css        # Global CSS styles
│   └── themes.css         # Theme-specific styles
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
   git clone https://github.com/harshkolte01/social-media-frontend.git
   cd social-media-frontend
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

## 🎨 Theming

The application supports both light and dark themes:

- **Automatic Detection** - Respects system theme preference
- **Manual Toggle** - Users can switch themes manually
- **Persistent Storage** - Theme preference is saved in localStorage
- **Tailwind Integration** - Uses Tailwind's dark mode classes

## 🔐 Authentication

The app implements JWT-based authentication:

- **Token Storage** - Secure token storage in localStorage
- **Auto-refresh** - Automatic token validation on app load
- **Route Protection** - Protected routes redirect to login
- **Error Handling** - Graceful handling of expired tokens

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
