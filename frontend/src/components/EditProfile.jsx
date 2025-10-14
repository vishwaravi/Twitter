import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { uploadImageToSupabase } from '../api/supabase'
import { getCurrentUserId } from '../utils/auth'
import { IoArrowBack, IoCamera } from 'react-icons/io5'

const EditProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userDob: '',
    profile: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profilePreview, setProfilePreview] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/user/${getCurrentUserId()}`)
        if (response.status === 200) {
          const userData = response.data
          setFormData({
            userName: userData.userName || '',
            userEmail: userData.userEmail || '',
            userDob: userData.userDob || '',
            profile: null
          })
          setProfilePreview(userData.profileUrl || null)
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login')
        }
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, profile: file }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSaving(true)

      let uploadedUrl = null
      if (formData.profile instanceof File) {
        uploadedUrl = await uploadImageToSupabase(formData.profile, 'avatars')
      }

      // Persist locally so Profile can display immediately without backend change
      if (uploadedUrl) {
        try { localStorage.setItem('profileUrlOverride', uploadedUrl) } catch (_) {}
      }

      // Backend expects multipart form with fields mapped to RegisterDto; send profilePath to store URL
      const body = new FormData()
      if (formData.userName) body.append('userName', formData.userName)
      if (formData.userEmail) body.append('userEmail', formData.userEmail)
      if (formData.userDob) body.append('userDob', formData.userDob)
      if (uploadedUrl) body.append('profilePath', uploadedUrl)

      const response = await api.patch(`/user/${getCurrentUserId()}`, body)

      if (response.status === 200) {
        navigate('/profile')
      }
    } catch (err) {
      console.log(err)
      // Handle error (show toast or error message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200 mr-4"
            >
              <IoArrowBack className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Edit Profile</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Cover Photo Section */}
        <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-700 relative">
          {/* Add cover photo functionality here if needed */}
        </div>

        {/* Profile Picture Section */}
        <div className="px-4 pb-6">
          <div className="relative -mt-16 mb-8">
            <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-black overflow-hidden relative group">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {formData.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              
              {/* Camera overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <IoCamera className="w-8 h-8 text-white" />
              </div>
              
              {/* File input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="userName" className="block text-white text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your display name"
                maxLength={50}
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label htmlFor="userEmail" className="block text-white text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                readOnly
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
