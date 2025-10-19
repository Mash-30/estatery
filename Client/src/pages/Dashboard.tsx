import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Home as HomeIcon, Plus, Settings, Phone, LogOut, Edit, Trash2, Eye, LogOutIcon } from 'lucide-react'
import api from '../lib/api'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, logoutAll } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  })
  const queryClient = useQueryClient()

  const { data: userProperties, isLoading } = useQuery({
    queryKey: ['user-properties'],
    queryFn: async () => {
      if (user?.role === 'seller' || user?.role === 'agent') {
        const response = await api.get('/properties')
        return response.data.properties.filter((property: any) => 
          property.owner._id === user._id
        )
      }
      return []
    },
    enabled: !!user && (user.role === 'seller' || user.role === 'agent')
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/users/${user?._id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      setShowProfileModal(false)
    }
  })

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await api.delete(`/properties/${propertyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-properties'] })
    }
  })

  const handleLogout = async () => {
    await logout()
    setShowLogoutModal(false)
  }

  const handleLogoutAll = async () => {
    await logoutAll()
    setShowLogoutModal(false)
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to access your dashboard.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.firstName}!</p>
      </div>

      {/* User Profile Card */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800'
                  : user.role === 'agent'
                  ? 'bg-blue-100 text-blue-800'
                  : user.role === 'seller'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              {user.phone && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="btn-secondary flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div 
          className="card text-center hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/properties')}
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <HomeIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Properties</h3>
          <p className="text-gray-600 text-sm">Explore available properties</p>
        </div>

        {(user.role === 'seller' || user.role === 'agent') && (
          <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">List Property</h3>
            <p className="text-gray-600 text-sm">Add a new property listing</p>
          </div>
        )}

      </div>

      {/* User's Properties (for sellers/agents) */}
      {(user.role === 'seller' || user.role === 'agent') && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : userProperties && userProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProperties.map((property: any) => (
                <div key={property._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-3">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.location.city}, {property.location.state}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      ${property.price.toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : property.status === 'sold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  {/* Property Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deletePropertyMutation.mutate(property._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        disabled={deletePropertyMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-4">Start by listing your first property</p>
              <button className="btn-primary">
                List Your First Property
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Account created</p>
              <p className="text-xs text-gray-600">Welcome to RealEstate!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logout Options</h3>
            <p className="text-gray-600 mb-6">
              Choose how you want to logout from your account.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout from this device</span>
              </button>
              <button
                onClick={handleLogoutAll}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Logout from all devices</span>
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
