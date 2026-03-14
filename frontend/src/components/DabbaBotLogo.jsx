import React from 'react';

const DabbaBotLogo = ({ className = "", showText = true, iconOnly = false, centered = false }) => {
  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center text-center' : ''} ${className}`}>
      {/* Icon: Bold Modern 'D' with Neural Nodes */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="h-9 w-9 sm:h-11 sm:w-11 drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* The Outer 'D' Shell */}
          <path 
            d="M25 15C25 12.2386 27.2386 10 30 10H60C76.5685 10 90 23.4315 90 40V60C90 76.5685 76.5685 90 60 90H30C27.2386 90 25 87.7614 25 85V15Z"
            fill="#0B0F14"
            stroke="#00FF88"
            strokeWidth="6"
          />
          
          {/* Circuitry / Neural Nodes Connection */}
          <path
            d="M45 35L55 45M55 45L45 55M55 45H70"
            stroke="#00FF88"
            strokeWidth="2"
            strokeOpacity="0.4"
            strokeDasharray="4 2"
          />

          {/* Neural Nodes (Connected Dots) */}
          <circle cx="45" cy="35" r="3" fill="#00FF88" />
          <circle cx="45" cy="55" r="3" fill="#00C873" />
          <circle cx="55" cy="45" r="4" fill="#00FF88" className="animate-pulse" />
          <circle cx="70" cy="45" r="3" fill="#00C873" />
        </svg>
      </div>

      {/* Typography: DABBABOT */}
      {!iconOnly && showText && (
        <div className="flex flex-col">
          <span 
            className="text-white font-bold tracking-[0.15em] text-lg sm:text-xl leading-none" 
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            DABBA AI
          </span>
          <span className="text-[#00FF88] text-[5px] tracking-[0.2em] uppercase font-bold opacity-70 mt-0.5">
            Brainware University's own AI
          </span>
        </div>
      )}
    </div>
  );
};

export default DabbaBotLogo;
