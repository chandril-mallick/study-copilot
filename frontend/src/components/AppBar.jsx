import React from 'react';
import { Bell, Search, LogOut, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import DabbaBotLogo from './DabbaBotLogo';

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
  sidebarCollapsed,
  onCollapseToggle,
  notificationCount = 0
}) => {
  return (
    <header
      className="w-full"
      style={{
        background: 'rgba(10,10,10,0.90)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(0,217,255,0.07), 0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Left: Logo + Institution */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile hamburger */}
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
          {/* Desktop collapse/expand toggle */}
          <button
            onClick={onCollapseToggle}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg hover:bg-charcoal-light/50 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed
              ? <PanelLeftOpen className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
              : <PanelLeftClose className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />}
          </button>
          
          <div className="flex items-center gap-2">
            <DabbaBotLogo iconOnly={sidebarCollapsed} className="scale-90 origin-left" />
            {!sidebarCollapsed && (
              <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-widest ml-1 font-semibold border-l border-white/10 pl-3">
                {institutionName}
              </p>
            )}
          </div>
        </div>

        {/* Center: AI Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
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
            className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-charcoal-light/50 transition-all group"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-neon-blue transition-colors" />
            <span className="text-xs sm:text-sm text-gray-400 hidden lg:inline">Ask Dabba AI</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-charcoal-light/50 transition-all group"
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
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-charcoal-light/50 transition-all"
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
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize"
                  style={{
                    background: {
                      student: 'rgba(0,217,255,0.15)',
                      faculty: 'rgba(16,185,129,0.15)',
                      teacher: 'rgba(16,185,129,0.15)',
                      verifier: 'rgba(245,158,11,0.15)',
                      admin: 'rgba(139,92,246,0.15)',
                      management: 'rgba(236,72,153,0.15)',
                    }[userRole] || 'rgba(255,255,255,0.1)',
                    color: {
                      student: '#00D9FF',
                      faculty: '#10B981',
                      teacher: '#10B981',
                      verifier: '#F59E0B',
                      admin: '#8B5CF6',
                      management: '#EC4899',
                    }[userRole] || '#9CA3AF',
                  }}
                >
                  {userRole || 'Student'}
                </span>
              </div>
            </div>
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-red-500/20 transition-all group"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppBar;
