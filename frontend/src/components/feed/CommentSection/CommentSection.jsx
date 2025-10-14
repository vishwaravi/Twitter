import React, { useEffect, useState } from 'react'
import Comment from './Comment'
import api from '../../../api/api'
import { useParams, useNavigate } from 'react-router-dom'
import { PiEmptyBold } from 'react-icons/pi'
import { IoMdArrowRoundBack, IoMdSend } from 'react-icons/io'

const CommentSection = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getComments = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/feed/${id}/comments`)
        const comments = Array.isArray(response.data) ? response.data : []
        setComments(comments)
      } catch (err) {
        console.log(err)
        setError('Failed to load comments')
      } finally {
        setIsLoading(false)
      }
    }
    getComments()
  }, [id])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await api.post(`/feed/${id}/comment`, {
        commentContent: newComment.trim()
      })

      if (response.status === 200 || response.status === 201) {
        // Add the new comment to the beginning of the comments array
        const newCommentData = response.data
        setComments(prev => [newCommentData, ...prev])
        setNewComment('')
      }
    } catch (err) {
      console.log('Error adding comment:', err)
      if (err.response?.status === 401) {
        setError('You must be logged in to comment')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to add comment. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    navigate('/home')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center px-4 py-3">
          <button 
            onClick={goBack}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors mr-4"
          >
            <IoMdArrowRoundBack className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Comments</h1>
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="border-b border-gray-800 p-4">
        <form onSubmit={handleSubmitComment} className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent text-white text-xl placeholder-gray-500 border-none outline-none resize-none min-h-[60px] max-h-[200px]"
              rows="2"
              maxLength={280}
              disabled={isSubmitting}
            />
            
            {/* Comment Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-gray-500">
                {newComment.length}/280
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-full transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <IoMdSend className="w-4 h-4" />
                    <span>Reply</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Comments Content */}
      <div className="divide-y divide-gray-800">
        {comments.length ? (
          comments.map(comment => (
            <Comment
              key={comment.id}
              commentContent={comment.commentContent}
              userId={comment.userId}
              timeStamp={comment.timeStamp}
              userProfile={comment.userProfile}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
            <div className="bg-gray-900/30 p-8 rounded-full mb-6">
              <PiEmptyBold className="w-16 h-16 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No comments yet</h2>
            <p className="text-gray-400 text-lg max-w-sm">
              Be the first to share your thoughts about this post.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection