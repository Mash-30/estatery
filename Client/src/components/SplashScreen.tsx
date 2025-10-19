import React, { useState, useEffect } from 'react'
import EstateryLogo from './EstateryLogo'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [logoScale, setLogoScale] = useState(0)
  const [textOpacity, setTextOpacity] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Logo animation
    const logoTimer = setTimeout(() => {
      setLogoScale(1)
    }, 300)

    // Text animation
    const textTimer = setTimeout(() => {
      setTextOpacity(1)
    }, 800)

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    // Complete splash screen
    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete()
      }, 500)
    }, 6000)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(textTimer)
      clearInterval(progressInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/15 rounded-full animate-ping"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-transparent to-white/10 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Logo Animation */}
        <div 
          className="mb-8 transition-transform duration-1000 ease-out"
          style={{ 
            transform: `scale(${logoScale})`,
            transformOrigin: 'center'
          }}
        >
          <EstateryLogo size="lg" />
        </div>

        {/* Welcome Text */}
        <div 
          className="mb-12 transition-opacity duration-1000 ease-out"
          style={{ opacity: textOpacity }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-white/90">
            Your Dream Home Awaits
          </h2>
        </div>

        {/* Loading Progress */}
        <div className="w-80 max-w-full px-4">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/80 text-sm mt-3 font-medium">
            {progress < 100 ? 'Loading amazing properties...' : 'Ready to explore!'}
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-2 mt-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-1 h-8 bg-white/30 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.6); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default SplashScreen
