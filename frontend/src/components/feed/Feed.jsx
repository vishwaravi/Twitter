import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import Post from './Post'
import { useNavigate } from 'react-router-dom'
import { PiEmptyBold } from 'react-icons/pi'
import { IoMdAdd } from 'react-icons/io'
import { IoPersonCircleOutline } from 'react-icons/io5'

const Feed = () => {
  const navigate = useNavigate()
  const [feed, setFeed] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/feed')

        if (response.status === 200) {
          setFeed(response.data)
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
    fetchFeed()
  }, [navigate])

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
              className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200 mr-3"
            >
              <IoPersonCircleOutline className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Home</h1>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <IoMdAdd className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="divide-y divide-gray-800">
        {feed.length ? (
          feed.map(post => (
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
            <div className="bg-gray-900/30 p-8 rounded-full mb-6">
              <PiEmptyBold className="w-16 h-16 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to X!</h2>
            <p className="text-gray-400 text-lg mb-6 max-w-sm">
              This is the best place to see what's happening in your world.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Create your first post
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed