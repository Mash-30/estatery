import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../lib/api'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'buyer' | 'seller' | 'agent' | 'admin'
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshToken: () => Promise<boolean>
  loading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role?: 'buyer' | 'seller' | 'agent'
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to store tokens
  const storeTokens = (tokens: AuthTokens) => {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  // Helper function to clear tokens
  const clearTokens = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // Helper function to get stored tokens
  const getStoredTokens = (): AuthTokens | null => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken }
    }
    return null
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = getStoredTokens()
      const storedUser = localStorage.getItem('user')
      
      if (tokens && storedUser) {
        try {
          // Set the access token for API calls
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
          
          // Verify token and get fresh user data
          const response = await api.get('/users/me')
          setUser(response.data)
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            const refreshed = await refreshToken()
            if (refreshed) {
              const response = await api.get('/users/me')
              setUser(response.data)
            } else {
              clearTokens()
            }
          } catch (refreshError) {
            clearTokens()
          }
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password })
      const { user: userData, tokens } = response.data
      
      storeTokens(tokens)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
      
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/users/register', userData)
      const { user: newUser, tokens } = response.data
      
      storeTokens(tokens)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
      
      setUser(newUser)
    } catch (error) {
      throw error
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const tokens = getStoredTokens()
      if (!tokens) return false

      const response = await api.post('/users/refresh-token', {
        refreshToken: tokens.refreshToken
      })
      
      const { tokens: newTokens } = response.data
      storeTokens(newTokens)
      
      // Update authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`
      
      return true
    } catch (error) {
      clearTokens()
      return false
    }
  }

  const logout = async () => {
    try {
      const tokens = getStoredTokens()
      if (tokens) {
        await api.post('/users/logout', {
          refreshToken: tokens.refreshToken
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearTokens()
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const logoutAll = async () => {
    try {
      await api.post('/users/logout-all')
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      clearTokens()
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    logoutAll,
    refreshToken,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
