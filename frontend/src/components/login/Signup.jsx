import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from 'react-icons/io'
import api from '../../api/api'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userName: '',
    userId: '',
    userEmail: '',
    userDob: '',
    userPasswd: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/user/register', {
        userName: formData.userName,
        userId: formData.userId,
        userEmail: formData.userEmail,
        userDob: formData.userDob,
        userPasswd: formData.userPasswd
      })

      if (response.status === 201 || response.status === 200) {
        setSuccess(true)
        // Clear form data
        setFormData({
          userName: '',
          userId: '',
          userEmail: '',
          userDob: '',
          userPasswd: ''
        })

        // Show success message briefly then redirect to login
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError('User with this email or username already exists')
      } else if (err.response?.status === 400) {
        setError('Please check your input and try again')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
      console.log('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 mt-4">
          <button
            onClick={() => navigate('/login')}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors mr-8"
          >
            <IoMdArrowRoundBack className="w-6 h-6" />
          </button>
          <div className="flex-1">
            {/* Twitter/X Logo placeholder */}
            <div className="w-8 h-8 bg-white rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                Account created successfully! Redirecting to login...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-base placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>

          {/* User ID Input */}
          <div className="relative">
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="User ID"
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-base placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-base placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>

          {/* Date of Birth Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date of birth
            </label>
            <input
              type="date"
              name="userDob"
              value={formData.userDob}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="userPasswd"
              value={formData.userPasswd}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-4 text-white text-base placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-full text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black mt-8"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Sign up'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup