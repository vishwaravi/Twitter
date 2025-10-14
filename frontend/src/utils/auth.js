export const getCurrentUserId = () => {
  return localStorage.getItem('userId') || ''
}

export const getCurrentToken = () => {
  return localStorage.getItem('jtoken')
}

export const isAuthenticated = () => {
  return !!(getCurrentToken() && getCurrentUserId())
}

export const clearAuth = () => {
  localStorage.removeItem('jtoken')
  localStorage.removeItem('userId')
}
