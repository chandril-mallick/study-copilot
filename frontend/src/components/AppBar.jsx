import React from 'react';
import { Bell, Search, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const AppBar = ({ 
  institutionName = "Brainware University",
  aiStatus = "live", // "live" | "learning"
  userRole,
  userName,
  userAvatar,
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onLogout,
  sidebarOpen,
  notificationCount = 0
}) => {
  return (
    <div className="sticky top-0 z-[60] w-full border-b border-charcoal-light/20 bg-onyx/95 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Left: Logo + Institution */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-charcoal-light/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
            )}
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/download-removebg-preview (1).png"
              alt="Dabba AI Logo"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg font-heading font-bold text-white">
                Dabba AI
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400">{institutionName}</p>
            </div>
          </div>
        </div>

        {/* Center: AI Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card">
          <div className={cn(
            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse",
            aiStatus === "live" ? "bg-emerald-DEFAULT" : "bg-neon-blue"
          )} />
          <span className="text-xs sm:text-sm font-medium text-gray-300">
            AI {aiStatus === "live" ? "Live" : "Learning"}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Search */}
          <button
            onClick={onSearchClick}
            className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg glass hover:bg-charcoal-light/50 transition-all group"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-neon-blue transition-colors" />
            <span className="text-xs sm:text-sm text-gray-400 hidden lg:inline">Ask Dabba AI</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-1.5 sm:p-2 rounded-lg glass hover:bg-charcoal-light/50 transition-all group"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-DEFAULT text-white text-[10px] sm:text-xs font-bold flex items-center justify-center animate-pulse-neon">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg glass hover:bg-charcoal-light/50 transition-all"
            aria-label="Profile"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-neon-blue/50"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neon-blue to-emerald-DEFAULT flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-white">{userName || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole || 'Student'}</p>
            </div>
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-lg glass hover:bg-red-500/20 transition-all group"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;

