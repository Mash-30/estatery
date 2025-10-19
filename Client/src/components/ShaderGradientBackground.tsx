import React, { useEffect } from 'react'

const ShaderGradientBackground: React.FC = () => {
  useEffect(() => {
    console.log('ShaderGradientBackground component mounted')
    // Add CSS animations to the document head
    const style = document.createElement('style')
    style.textContent = `
      @keyframes waterFlow {
        0% {
          background-position: 0% 0%, 0% 0%, 0% 0%;
          transform: rotate(0deg) scale(1);
        }
        25% {
          background-position: 25% 25%, 25% 25%, 25% 25%;
          transform: rotate(1deg) scale(1.02);
        }
        50% {
          background-position: 50% 50%, 50% 50%, 50% 50%;
          transform: rotate(0deg) scale(1.05);
        }
        75% {
          background-position: 75% 75%, 75% 75%, 75% 75%;
          transform: rotate(-1deg) scale(1.02);
        }
        100% {
          background-position: 100% 100%, 100% 100%, 100% 100%;
          transform: rotate(0deg) scale(1);
        }
      }
      
      @keyframes waveMotion {
        0% {
          transform: translateX(0px) translateY(0px) rotate(0deg);
        }
        33% {
          transform: translateX(20px) translateY(-10px) rotate(1deg);
        }
        66% {
          transform: translateX(-15px) translateY(15px) rotate(-1deg);
        }
        100% {
          transform: translateX(0px) translateY(0px) rotate(0deg);
        }
      }
      
      @keyframes colorShift {
        0% {
          filter: hue-rotate(0deg) brightness(1.1);
        }
        50% {
          filter: hue-rotate(10deg) brightness(1.2);
        }
        100% {
          filter: hue-rotate(0deg) brightness(1.1);
        }
      }
    `
    document.head.appendChild(style)
    
    // Cleanup function to remove the style when component unmounts
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div 
      className="fixed inset-0"
      style={{
        zIndex: -999,
             background: `
               radial-gradient(ellipse at 20% 30%, #f8fafc 0%, transparent 60%),
               radial-gradient(ellipse at 80% 70%, #f1f5f9 0%, transparent 60%),
               radial-gradient(ellipse at 50% 50%, #e2e8f0 0%, transparent 70%),
               linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 60%, #e2e8f0 100%)
             `,
        backgroundSize: '300% 300%, 400% 400%, 500% 500%, 200% 200%',
        animation: 'waterFlow 15s ease-in-out infinite, colorShift 20s ease-in-out infinite',
        filter: 'brightness(1.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Water Wave Layer 1 */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
             background: `
               radial-gradient(ellipse at 60% 20%, rgba(248, 250, 252, 0.4) 0%, transparent 50%),
               radial-gradient(ellipse at 30% 80%, rgba(241, 245, 249, 0.4) 0%, transparent 50%)
             `,
          backgroundSize: '600% 600%, 700% 700%',
          animation: 'waveMotion 12s ease-in-out infinite reverse'
        }}
      />
      
      {/* Water Wave Layer 2 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
             background: `
               radial-gradient(ellipse at 40% 60%, rgba(226, 232, 240, 0.3) 0%, transparent 60%),
               radial-gradient(ellipse at 70% 40%, rgba(203, 213, 225, 0.3) 0%, transparent 60%)
             `,
          backgroundSize: '800% 800%, 900% 900%',
          animation: 'waveMotion 18s ease-in-out infinite'
        }}
      />
      
      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 75px 75px',
          animation: 'waveMotion 25s linear infinite'
        }}
      />
    </div>
  )
}

export default ShaderGradientBackground
