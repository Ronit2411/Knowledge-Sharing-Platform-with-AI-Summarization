import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })

    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login only if not already on login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        console.log('🔄 Redirecting to login due to 401 error')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },
}

// Articles API functions
export const articlesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/articles', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/articles/${id}`)
    return response.data
  },

  create: async (articleData) => {
    const response = await api.post('/articles', articleData)
    return response.data
  },

  update: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/articles/${id}`)
    return response.data
  },

  search: async (query, params = {}) => {
    const response = await api.get('/articles/search', {
      params: { q: query, ...params }
    })
    return response.data
  },

  getSummary: async (id) => {
    const response = await api.get(`/articles/${id}/summary`)
    return response.data
  },

  generateSummary: async (id) => {
    const response = await api.post(`/articles/${id}/summary`)
    return response.data
  },

  getRevisions: async (id) => {
    const response = await api.get(`/articles/${id}/revisions`)
    return response.data
  },

  getMyArticles: async (params = {}) => {
    const response = await api.get('/articles/my/articles', { params })
    return response.data
  },

  getByAuthor: async (authorId, params = {}) => {
    const response = await api.get(`/articles/author/${authorId}`, { params })
    return response.data
  },
}

// Convenience functions for common operations
export const getArticles = articlesAPI.getAll
export const getArticle = articlesAPI.getById
export const createArticle = articlesAPI.create
export const updateArticle = articlesAPI.update
export const deleteArticle = articlesAPI.delete
export const searchArticles = articlesAPI.search
export const getArticleSummary = articlesAPI.getSummary
export const generateArticleSummary = articlesAPI.generateSummary
export const getArticleRevisions = articlesAPI.getRevisions
export const getMyArticles = articlesAPI.getMyArticles
export const getArticlesByAuthor = articlesAPI.getByAuthor

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw new Error(`API is not available: ${error.message}`)
  }
}

export default api 