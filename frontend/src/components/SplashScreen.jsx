import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2; // Adjust speed here
      });
    }, 30); // Adjust interval here

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setOpacity(0);
        setTimeout(() => {
          onComplete(); // Notify parent that splash is done
        }, 500); // Wait for fade out animation
      }, 500); // Wait a bit at 100%
    }
  }, [progress, onComplete]);

  if (!opacity && progress === 100) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-onyx transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="mb-8 relative">
           {/* Outer Glow */}
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Logo Icon Placeholder - Replace with actual SVG or Image if available */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce-slow relative z-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-12 h-12 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        {/* Text Branding */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-300 to-primary background-animate mb-2 tracking-wider">
          DABBA AI
        </h1>
        <p className="text-gray-400 text-sm tracking-[0.2em] uppercase mb-8">
          Next Gen Education
        </p>

        {/* Loading Bar */}
        <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Percentage */}
        <div className="mt-2 text-xs text-gray-500 font-mono">
          {progress}%
        </div>
      </div>
      
      <div className="absolute bottom-8 text-gray-600 text-xs text-center">
        <p>Powered by Advanced Intelligence</p>
      </div>
    </div>
  );
};

export default SplashScreen;
