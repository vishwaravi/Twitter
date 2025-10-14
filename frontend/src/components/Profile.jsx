import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import Post from './feed/Post'
import { PiEmptyBold } from 'react-icons/pi'
import { IoArrowBack } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { getCurrentUserId } from '../utils/auth'

const Profile = () => {
  const navigate = useNavigate()
  const params = useParams()
  const routeUserId = params.userId
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const localProfileOverride = useMemo(() => {
    try {
      return localStorage.getItem('profileUrlOverride') || null
    } catch (_) {
      return null
    }
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const currentUserId = getCurrentUserId()
        
        // Fetch user profile data
  const targetUserId = routeUserId || getCurrentUserId()
  const profileResponse = await api.get(`/user/${targetUserId}`)
        if (profileResponse.status === 200) {
          const userData = profileResponse.data
          setUser(userData)
          setFollowerCount(userData.followers || 0)
          setFollowingCount(userData.following || 0)
          // Check if this is the current user's profile
          const isOwn = !routeUserId || routeUserId === currentUserId
          setIsOwnProfile(isOwn)

          // Fetch user posts
          if (isOwn) {
            const postsResponse = await api.get(`/feed/myposts`)
            if (postsResponse.status === 200) {
              setUserPosts(postsResponse.data)
            }
          } else {
            const feedResponse = await api.get('/feed')
            if (feedResponse.status === 200) {
              const filtered = Array.isArray(feedResponse.data)
                ? feedResponse.data.filter(p => p.userId === targetUserId)
                : []
              setUserPosts(filtered)
            }
          }
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

    fetchUserProfile()
  }, [navigate, routeUserId])

  const handleFollowToggle = async () => {
    try {
      const targetUserId = params.userId || getCurrentUserId()
      const endpoint = isFollowing ? `/user/${targetUserId}/unfollow` : `/user/${targetUserId}/follow`
      const response = await api.put(endpoint)
      if (response.status === 200) {
        setIsFollowing(!isFollowing)
        setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditProfile = () => {
    // Navigate to edit profile page (to be implemented)
    navigate('/profile/edit')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center px-8">
        <div className="bg-gray-900/30 p-8 rounded-full mb-6">
          <PiEmptyBold className="w-16 h-16 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
        <p className="text-gray-400 text-lg mb-6">
          This account doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
        >
          Go to Home
        </button>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200 mr-4"
          >
            <IoArrowBack className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{user.userName}</h1>
            <p className="text-sm text-gray-400">{userPosts.length} posts</p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-700 relative">
        {user.bannerUrl && (
          <img
            src={user.bannerUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        {/* Profile Picture */}
        <div className="relative -mt-16 mb-4">
          <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-black overflow-hidden">
            { (localProfileOverride || user.profileUrl) ? (
              <img
                src={localProfileOverride || user.profileUrl}
                alt={user.userId}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user.userId?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mb-4">
          {isOwnProfile ? (
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 bg-transparent border border-gray-600 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              <MdEdit className="w-4 h-4" />
              Edit profile
            </button>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`font-bold py-2 px-6 rounded-full transition-colors duration-200 ${
                isFollowing
                  ? 'bg-transparent border border-gray-600 text-white hover:bg-red-600 hover:border-red-600 hover:text-white'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-1">
            {user.userName}
          </h2>
          <p className="text-gray-400 mb-3">@{user.userId}</p>
          
          {user.bio && (
            <p className="text-white text-base mb-3 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Additional Info (not available in backend model; keeping minimal) */}
          <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-3" />

          {/* Follow Stats */}
          <div className="flex gap-6 text-sm">
            <button className="hover:underline">
              <span className="font-bold text-white">{followingCount}</span>
              <span className="text-gray-400 ml-1">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-white">{followerCount}</span>
              <span className="text-gray-400 ml-1">Followers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="border-t border-gray-800">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          <button className="flex-1 py-4 text-center text-white font-medium border-b-2 border-blue-500">
            Posts
          </button>
        </div>

        {/* Posts */}
        <div className="divide-y divide-gray-800">
          {userPosts.length ? (
            userPosts.map(post => (
              <Post
                key={post.id}
                youLiked={post.isLiked}
                tweetId={post.id}
                tweetContent={post.tweetContent}
                tweetFilePath={post.tweetFilePath}
                userId={post.userId}
                likesCount={post.likesCount}
                hashtags={post.hashtags}
                timestamp={post.timeStamp}
                userProfile={post.userProfile}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="bg-gray-900/30 p-8 rounded-full mb-6">
                <PiEmptyBold className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
              </h3>
              <p className="text-gray-400 text-base mb-6 max-w-sm">
                {isOwnProfile 
                  ? "Share your thoughts with the world by creating your first post."
                  : "When they post something, it will show up here."
                }
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/create')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
                >
                  Create your first post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
