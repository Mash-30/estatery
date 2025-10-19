import React from 'react'
import { TrendingUp, Home, DollarSign, Check } from 'lucide-react'

const HeroSection2: React.FC = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-primary-200 shadow-lg p-6 sm:p-8 md:p-12 mb-8 sm:mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Left Side - Text and Statistics */}
        <div className="space-y-6 sm:space-y-8">
          {/* Heading */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600 leading-tight">
              The new way to find
              <br />
              <span className="text-4xl sm:text-5xl md:text-6xl">your new home</span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-silver-600 leading-relaxed">
            Find your dream place to live in with more than 10k+ properties listed.
          </p>

          {/* Statistics Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Badge 1 - Property Return Rate */}
            <div className="bg-white rounded-xl border border-primary-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full mb-3 sm:mb-4 mx-auto">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">7.4%</div>
                <div className="text-xs sm:text-sm text-silver-600">Property Return Rate</div>
              </div>
            </div>

            {/* Badge 2 - Properties in Sell & Rent */}
            <div className="bg-white rounded-xl border border-primary-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full mb-3 sm:mb-4 mx-auto">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">3,856</div>
                <div className="text-xs sm:text-sm text-silver-600">Property in Sell & Rent</div>
              </div>
            </div>

            {/* Badge 3 - Daily Completed Transactions */}
            <div className="bg-white rounded-xl border border-primary-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full mb-3 sm:mb-4 mx-auto">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1">2,540</div>
                <div className="text-xs sm:text-sm text-silver-600">Daily Completed Transactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Isometric House Illustration */}
        <div className="flex justify-center lg:justify-end order-first lg:order-last">
          <div className="w-full max-w-sm sm:max-w-md">
            <svg
              viewBox="0 0 400 300"
              className="w-full h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground Plane */}
              <path
                d="M50 250L350 250L400 200L100 200L50 250Z"
                fill="#E9D5FF"
                stroke="#C084FC"
                strokeWidth="2"
              />
              
              {/* House Base */}
              <path
                d="M100 200L300 200L300 120L100 120L100 200Z"
                fill="#F3E8FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Roof */}
              <path
                d="M100 120L200 60L300 120L100 120Z"
                fill="#DDD6FE"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Front Wall */}
              <path
                d="M100 200L100 120L200 60L200 140L100 200Z"
                fill="#F3E8FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Garage Door */}
              <rect
                x="120"
                y="160"
                width="60"
                height="40"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Front Door */}
              <rect
                x="200"
                y="160"
                width="30"
                height="40"
                fill="#DDD6FE"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Windows */}
              <rect
                x="120"
                y="130"
                width="25"
                height="20"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="155"
                y="130"
                width="25"
                height="20"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="240"
                y="130"
                width="25"
                height="20"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="275"
                y="130"
                width="25"
                height="20"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Dormer Windows */}
              <rect
                x="130"
                y="100"
                width="20"
                height="15"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="160"
                y="100"
                width="20"
                height="15"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="220"
                y="100"
                width="20"
                height="15"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Chimney */}
              <rect
                x="250"
                y="80"
                width="20"
                height="40"
                fill="#DDD6FE"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Fence */}
              <path
                d="M350 200L400 200L400 180L350 180L350 200Z"
                fill="#E9D5FF"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="360"
                y="180"
                width="4"
                height="20"
                fill="#8B5CF6"
              />
              <rect
                x="375"
                y="180"
                width="4"
                height="20"
                fill="#8B5CF6"
              />
              <rect
                x="390"
                y="180"
                width="4"
                height="20"
                fill="#8B5CF6"
              />
              
              {/* Pathway/Patio */}
              <rect
                x="300"
                y="200"
                width="50"
                height="50"
                fill="#F3E8FF"
                stroke="#C084FC"
                strokeWidth="1"
              />
              <rect
                x="310"
                y="210"
                width="10"
                height="10"
                fill="#E9D5FF"
              />
              <rect
                x="325"
                y="210"
                width="10"
                height="10"
                fill="#E9D5FF"
              />
              <rect
                x="340"
                y="210"
                width="10"
                height="10"
                fill="#E9D5FF"
              />
              <rect
                x="310"
                y="225"
                width="10"
                height="10"
                fill="#E9D5FF"
              />
              <rect
                x="325"
                y="225"
                width="10"
                height="10"
                fill="#E9D5FF"
              />
              <rect
                x="340"
                y="225"
                width="10"
                height="10"
                fill="#E9D5FF"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection2
