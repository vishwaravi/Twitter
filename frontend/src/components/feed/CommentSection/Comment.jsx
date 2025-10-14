import React from 'react'
import DpPlaceHolder from '../../../assets/dp-placeholder.svg'
import getPostTime from '../../../utils/time'

const Comment = ({ commentContent, userId, timeStamp, userProfile }) => {
  return (
    <div className="bg-black border-b border-gray-800 px-4 py-3 hover:bg-gray-950/50 transition-colors duration-200">
      <div className="flex space-x-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img 
            className="w-10 h-10 rounded-full object-cover" 
            src={userProfile || DpPlaceHolder} 
            alt="Profile" 
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-white hover:underline cursor-pointer text-sm">
              {userId}
            </h3>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm hover:underline cursor-pointer">
              {getPostTime(timeStamp)}
            </span>
          </div>

          {/* Comment Text */}
          <div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {commentContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment