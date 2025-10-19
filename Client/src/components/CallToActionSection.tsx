import React, { useState } from 'react'
import { Mail } from 'lucide-react'

const CallToActionSection: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <div className="relative bg-gradient-to-r from-primary-700 to-primary-800 py-8 mb-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-cyan-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-cyan-200 to-transparent"></div>
        {/* Speckled pattern effect */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
          backgroundSize: '15px 15px, 20px 20px, 18px 18px'
        }}></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-0.5 sm:px-0.5 lg:px-0.5">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {/* No Spam Promise */}
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
              No Spam Promise
            </span>
          </div>

          {/* Main Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-primary-600 text-center mb-4">
            Are you a landlord?
          </h2>

          {/* Description */}
          <p className="text-base text-silver-600 text-center mb-6 max-w-xl mx-auto">
            Discover ways to increase your home's value and get listed. No Spam.
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-500 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </form>

          {/* Community Text */}
          <div className="text-center">
            <p className="text-sm text-silver-600">
              Join 10,000+ other landlords in our{' '}
              <span className="text-primary-600 font-semibold">estatery</span> community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallToActionSection
