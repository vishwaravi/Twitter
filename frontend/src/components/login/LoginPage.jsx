import React from 'react'
import Login from './Login'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="mb-4">
            {/* Twitter/X Logo placeholder */}
            <div className="w-8 h-8 bg-white rounded-full mx-auto mb-8"></div>
          </div>
          <h1 className="text-white text-3xl font-bold mb-3 tracking-tight">
            Happening now
          </h1>
          <p className="text-gray-300 text-lg font-normal">
            Join Today.
          </p>
        </div>

        {/* Login Component */}
        <Login />

        {/* Sign Up Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">Don't have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-transparent border border-gray-700 text-blue-400 hover:text-blue-300 font-bold py-3 px-6 rounded-full text-base hover:bg-gray-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage