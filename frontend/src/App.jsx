import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Signup from "./components/login/Signup";
import PrivateRoute from "./components/Privateroute";
import Feed from "./components/feed/Feed";
import CreatePost from "./components/feed/CreatePost";
import Logout from "./components/login/Logout";
import CommentSection from "./components/feed/CommentSection/CommentSection";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";


function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto bg-black border-x border-gray-800 min-h-screen">
        <Routes>
          {/* Login Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="logout" element={<Logout />} />
          
          {/* Secured Routes */}
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="/home" element={<PrivateRoute><Feed /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/home/:id/comments" element={<PrivateRoute><CommentSection /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />

          <Route path="/test" element={<CreatePost />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
