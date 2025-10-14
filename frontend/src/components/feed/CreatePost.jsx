import React, { useState, useRef } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { IoCloseCircle } from 'react-icons/io5'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import { uploadImageToSupabase } from '../../api/supabase'

const CreatePost = () => {
  const navigate = useNavigate()
  const [tweetContent, setTweetContent] = useState('')
  const [imageSrc, setImageSrc] = useState(null)
  const [file, setFile] = useState(null)
  const [isPosting, setIsPosting] = useState(false)
  const textareaRef = useRef(null)
  const uploadRef = useRef(null)

  // Function for auto grow the text area when writing
  const handleInputChange = (event) => {
    setTweetContent(event.target.value)
    // Adjust the height of the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set new height based on content
    }
  }

  // For arrow previous page or going back
  const goBack = () => {
    navigate('/home')
  }

  const handleUploadClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const tmpfile = e.target.files[0]
    setFile(e.target.files[0])
    if (tmpfile) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result) // Setting the Uploaded image source to the file content
      }
      reader.readAsDataURL(tmpfile) // Read file as a data URL
    }
  }

  const handleImgRemove = () => {
    setImageSrc(null)
    setFile(null)
  }

  // Function for Posting the Content
  const handlePost = async () => {
    if (!tweetContent.trim() && !file) {
      alert('Please add some content to your post')
      return
    }

    setIsPosting(true)
    try {
      let mediaUrl = null
      if (file) {
        // Upload to Supabase first
        mediaUrl = await uploadImageToSupabase(file, 'posts')
      }
      console.log(mediaUrl);
      console.log("-------------------------------------");
      const response = await api.post('/feed', {
        tweetContent,
      filePath: mediaUrl,
      })
      if (response.status === 201 || response.status === 200) {
        navigate('/home')
      }
    } catch (err) {
      console.log(err)
      alert('Failed to post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const isPostDisabled = (!tweetContent.trim() && !file) || isPosting

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={goBack}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors mr-4"
            >
              <IoMdArrowRoundBack className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Create Post</h1>
          </div>
          <button
            onClick={handlePost}
            disabled={isPostDisabled}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isPosting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Posting...
              </div>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </div>

      {/* Post Creation Area */}
      <div className="p-4">
        <div className="flex space-x-4">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img 
              className="w-12 h-12 rounded-full object-cover" 
              src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg" 
              alt="Profile" 
            />
          </div>

          {/* Input Area */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={tweetContent}
              onChange={handleInputChange}
              placeholder="What's happening?"
              className="w-full bg-transparent text-xl text-white placeholder-gray-500 border-none resize-none focus:outline-none min-h-[120px]"
              rows="4"
            />

            {/* Image Preview */}
            {imageSrc && (
              <div className="relative mt-4 rounded-2xl overflow-hidden border border-gray-800">
                <button 
                  onClick={handleImgRemove}
                  className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-800 text-white p-1 rounded-full transition-colors z-10"
                >
                  <IoCloseCircle className="w-6 h-6" />
                </button>
                <img 
                  src={imageSrc} 
                  className="w-full object-cover max-h-96" 
                  alt="Preview" 
                />
              </div>
            )}

            {/* Media Upload Button */}
            <div className="flex items-center mt-4 pt-4 border-t border-gray-800">
              <button
                onClick={handleUploadClick}
                className="p-2 text-blue-500 hover:bg-blue-900/20 rounded-full transition-colors"
                title="Add photo"
              >
                <BiImageAdd className="w-6 h-6" />
              </button>
              <input 
                ref={uploadRef} 
                onChange={handleFileChange} 
                type="file" 
                accept="image/*"
                className="hidden" 
              />
              
              {/* Character count or other indicators can go here */}
              <div className="flex-1 text-right">
                <span className={`text-sm ${tweetContent.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
                  {tweetContent.length}/280
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost