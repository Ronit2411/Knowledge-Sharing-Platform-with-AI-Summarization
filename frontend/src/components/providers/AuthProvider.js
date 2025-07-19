'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../../lib/api'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (authChecked && user && (pathname === '/login' || pathname === '/signup')) {
      console.log('🔄 Redirecting authenticated user away from auth page')
      router.push('/')
    }
  }, [user, pathname, router, authChecked])

  const checkAuth = async () => {
    try {
      setLoading(true)
      console.log('🔍 Checking authentication status...')
      const response = await authAPI.getProfile()
      console.log('✅ User authenticated:', response.user)
      setUser(response.user)
      setError(null)
    } catch (error) {
      console.log('❌ User not authenticated:', error.message)
      setUser(null)
      setError(null) // Don't set error for auth check
    } finally {
      setLoading(false)
      setAuthChecked(true)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔐 Attempting login...')
      const response = await authAPI.login(credentials)
      console.log('✅ Login successful:', response.user)
      setUser(response.user)
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      console.error('❌ Login failed:', message)
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      console.log('📝 Attempting signup...')
      const response = await authAPI.signup(userData)
      console.log('✅ Signup successful:', response.user)
      setUser(response.user)
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      console.error('❌ Signup failed:', message)
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      console.log('🚪 Attempting logout...')
      await authAPI.logout()
      console.log('✅ Logout successful')
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Still clear user even if logout fails
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.updateProfile(userData)
      setUser(response.user)
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    authChecked,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 