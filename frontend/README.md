# Twitter/X Clone Frontend

A modern, responsive Twitter/X-like social media application built with React and Tailwind CSS. This frontend provides a complete social media experience with user authentication, post creation, real-time interactions, and commenting system.

## 🚀 Features

### Authentication System
- **User Registration**: Complete signup flow with form validation
- **User Login**: Secure authentication with JWT tokens
- **Protected Routes**: Secure pages requiring authentication
- **Auto Logout**: Automatic token management and logout

### Social Media Core Features
- **Create Posts**: Text and image post creation
- **Interactive Feed**: Real-time feed with posts from all users
- **Like System**: Like/unlike posts with real-time updates
- **Comment System**: Add and view comments on posts
- **User Profiles**: Profile pictures and user information display

### Modern UI/UX
- **Twitter/X-like Design**: Authentic dark theme interface
- **Fully Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Hover effects, loading states, and transitions
- **Real-time Updates**: Optimistic UI updates for better user experience
- **Loading States**: Skeleton screens and spinners for all async operations

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks and functional components
- **React Router 7.7.0**: Client-side routing and navigation
- **Tailwind CSS 4.1.11**: Utility-first CSS framework for styling
- **Axios 1.10.0**: HTTP client for API communication
- **React Icons 5.5.0**: Icon library for UI components

### Build Tools
- **Vite 7.0.4**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **React SWC**: Fast refresh and compilation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- **Backend API server**: Clone and run the [Twitter REST API Backend](https://github.com/vishwaravi/twitter-rest-api) on `localhost:8080`

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd twitter-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── api.js                 # Axios API configuration
│   ├── assets/
│   │   └── dp-placeholder.svg     # Default profile picture
│   ├── components/
│   │   ├── Privateroute.jsx       # Protected route wrapper
│   │   ├── feed/
│   │   │   ├── CreatePost.jsx     # Post creation component
│   │   │   ├── Feed.jsx           # Main feed display
│   │   │   ├── Post.jsx           # Individual post component
│   │   │   └── CommentSection/
│   │   │       ├── Comment.jsx    # Individual comment
│   │   │       └── CommentSection.jsx # Comments container
│   │   └── login/
│   │       ├── Login.jsx          # Login form
│   │       ├── LoginPage.jsx      # Login page wrapper
│   │       ├── Logout.jsx         # Logout handler
│   │       └── Signup.jsx         # Registration form
│   ├── utils/
│   │   └── time.js               # Time formatting utilities
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind imports
├── README.md
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 🔧 Configuration

### API Configuration
The application connects to a backend API at `localhost:8080`. Update the base URL in `src/api/api.js` if your backend runs on a different port:

```javascript
const api = axios.create({
    baseURL: "http://localhost:8080"  // Change this to your backend URL
})
```

### Environment Variables
Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 📡 API Endpoints Used

The frontend communicates with the [Twitter REST API Backend](https://github.com/vishwaravi/twitter-rest-api) using the following endpoints:

### Authentication
- `POST /login` - User login
- `POST /register` - User registration

### Posts
- `GET /home` - Fetch all posts
- `POST /home` - Create new post
- `PUT /home/{id}/like` - Like a post
- `PUT /home/{id}/dislike` - Unlike a post

### Comments
- `GET /home/{id}/comments` - Fetch comments for a post
- `POST /home/{id}/comment` - Add comment to a post

## 🎨 Design Features

### Dark Theme
- Pure black background (#000000) matching Twitter/X
- Gray color palette for secondary elements
- Blue accent color (#3B82F6) for primary actions

### Responsive Design
- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: Optimized spacing and larger touch targets
- **Desktop**: Centered layout with proper max-widths

### Component Features
- **Posts**: Image support, like counter, comment navigation
- **Comments**: Real-time commenting with character counter
- **Forms**: Input validation, loading states, error handling
- **Navigation**: Sticky headers, back buttons, smooth transitions

## 🔐 Authentication Flow

1. **New User**: Register → Email validation → Auto login → Home feed
2. **Returning User**: Login → JWT token storage → Protected routes access
3. **Session Management**: Automatic token validation and logout on expiry

## 📱 Mobile-First Design

The application is built with a mobile-first approach:
- Touch-optimized buttons and interactions
- Responsive typography and spacing
- Swipe-friendly navigation
- Optimized images and media loading

## 🚀 Performance Features

- **Code Splitting**: Lazy loading of route components
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Image Optimization**: Proper image sizing and loading
- **Minimal Bundle Size**: Tree-shaking and efficient imports

## 🧪 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔧 Customization

### Styling
- Modify `src/index.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Component-specific styles use Tailwind utility classes

### Components
- All components are functional React components with hooks
- State management using useState and useEffect
- Error boundaries and loading states included

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure the [backend server](https://github.com/vishwaravi/twitter-rest-api) is running on `localhost:8080`
   - Check CORS configuration on backend
   - Verify API endpoints match backend implementation

2. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Verify responsive breakpoints

## 📄 License

This project is open source and available under the [MIT License](LICENSE).


**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
