import React from 'react'

interface EstateryLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const EstateryLogo: React.FC<EstateryLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Custom House Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House shape - rounded base with tapered top */}
          <path
            d="M16 2L28 12V28H20V18H12V28H4V12L16 2Z"
            fill="#8B5CF6"
            className="drop-shadow-sm"
          />
          {/* Curved white element inside */}
          <path
            d="M8 20C8 18.5 9.5 17 12 17C14.5 17 16 18.5 16 20C16 21.5 14.5 23 12 23C9.5 23 8 21.5 8 20Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
      
      {/* Estatery Text */}
      <span className={`font-bold text-primary-600 ${textSizes[size]}`}>
        Estatery
      </span>
    </div>
  )
}

export default EstateryLogo
