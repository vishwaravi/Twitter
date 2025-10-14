import React, { useState } from 'react'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi'
import { BiShare } from 'react-icons/bi'
import api from '../../api/api'
import getPostTime from '../../utils/time'
import DpPlaceHolder from '../../assets/dp-placeholder.svg'
import { useNavigate } from 'react-router-dom'

const Post = ({ tweetId, userProfile, userId, tweetContent, tweetFilePath, likesCount, timestamp, youLiked }) => {
  const [isliked, setIsLiked] = useState(youLiked)
  const [curLikesCount, setCurLikesCount] = useState(likesCount)
  const [isLiking, setIsLiking] = useState(false)
  const navigate = useNavigate()

  
  const handleLike = async () => {
    if (isLiking) return // Prevent double clicks
    
    setIsLiking(true)
    const previousLiked = isliked
    const previousCount = curLikesCount

    // Optimistic update
    setIsLiked(!isliked)
    setCurLikesCount(isliked ? curLikesCount - 1 : curLikesCount + 1)

    try {
      if (isliked) {
        await api.put(`/feed/${tweetId}/dislike`, {})
      } else {
        await api.put(`/feed/${tweetId}/like`, {})
      }
    } catch (err) {
      // Revert on error
      setIsLiked(previousLiked)
      setCurLikesCount(previousCount)
      console.log(err)
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentClick = () => {
    navigate(`/home/${tweetId}/comments`)
  }

  return (
    <div className="bg-black border-b border-gray-800 px-4 py-3 hover:bg-gray-950/50 transition-colors duration-200 cursor-pointer">
      <div className="flex space-x-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img 
            className="w-12 h-12 rounded-full object-cover" 
            src={userProfile || DpPlaceHolder} 
            alt="Profile" 
          />
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white hover:underline cursor-pointer">
                {userId}
              </h3>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                {getPostTime(timestamp)}
              </span>
            </div>
            
            {/* More options */}
            <button className="p-2 rounded-full hover:bg-gray-900/50 transition-colors group">
              <FiMoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </button>
          </div>

          {/* Tweet Content */}
          <div className="mb-3">
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
              {tweetContent}
            </p>
          </div>

          {/* Tweet Image */}
          {tweetFilePath && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-800">
              <img 
                src={tweetFilePath} 
                className="w-full object-cover max-h-96" 
                alt="Tweet media" 
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between max-w-md mt-3">
            {/* Comment */}
            <button 
              onClick={handleCommentClick}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 transition-colors group"
            >
              <FiMessageCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
            </button>

            {/* Like */}
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors group ${
                isliked 
                  ? 'text-red-500' 
                  : 'hover:bg-red-900/20'
              }`}
            >
              {isliked ? (
                <FaHeart className={`w-5 h-5 text-red-500 ${isLiking ? '' : 'animate-pulse'}`} />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
              )}
              <span className={`text-sm transition-colors ${
                isliked 
                  ? 'text-red-500' 
                  : 'text-gray-500 group-hover:text-red-400'
              }`}>
                {curLikesCount}
              </span>
            </button>

            {/* Share */}
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 transition-colors group">
              <BiShare className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post