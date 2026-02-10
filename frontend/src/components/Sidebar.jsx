import React from 'react';
import { cn } from '../lib/utils';
import {
  MessageCircle,
  Upload,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Settings,
  BarChart,
  BookMarked,
  Library,
  Users,
  HelpCircle,
  School,
  ChevronLeft,
  Home,
  FileText,
  Calendar,
  Brain,
  Target,
  CheckSquare,
  FileCheck,
  Database,
  Workflow,
  Shield,
  TrendingUp,
  Download,
  Clock,
  Zap,
  Sigma,
  Plus
} from 'lucide-react';
import useChatStore from '../store/useChatStore';

const Sidebar = ({ 
  userRole, 
  activeTab, 
  onTabChange, 
  isOpen, 
  onToggle 
}) => {
  const roleMenus = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
      { id: 'student-tools', label: 'Study Tools', icon: Brain },
      { id: 'assignments', label: 'Assignments', icon: BookMarked },
      { id: 'future-launch-pad', label: 'Future Launch Pad', icon: Briefcase },
      { id: 'resource-library', label: 'Resources', icon: Library },
      { id: 'study-groups', label: 'Study Groups', icon: Users },
      { id: 'qna-forum', label: 'Q&A Forum', icon: HelpCircle },
    ],
    faculty: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
      { id: 'uploads', label: 'Upload Center', icon: Upload },
      { id: 'teacher-tools', label: 'Teacher Tools', icon: Briefcase },
      { id: 'assignments', label: 'Assignments', icon: BookMarked },
      { id: 'qna-forum', label: 'Q&A Moderation', icon: HelpCircle },
      { id: 'analytics', label: 'Analytics', icon: BarChart },
    ],
    verifier: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'verifier-tools', label: 'Document Review', icon: FileCheck },
      { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
      { id: 'management-tools', label: 'User Management', icon: Settings },
      { id: 'management-tools', label: 'AI Knowledge Base', icon: Database },
      { id: 'management-tools', label: 'Workflow Builder', icon: Workflow },
      { id: 'management-tools', label: 'Security & Logs', icon: Shield },
      { id: 'analytics', label: 'System Analytics', icon: BarChart },
    ],
    management: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'analytics', label: 'Institution KPIs', icon: TrendingUp },
      { id: 'management-tools', label: 'Reports', icon: Download },
      { id: 'university', label: 'University Settings', icon: School },
      { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
    ],
  };

  const { useContext, setUseContext, mathMode, setMathMode, createNewSession } = useChatStore();
  const menuItems = roleMenus[userRole] || roleMenus.student;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[65] lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] z-[70] lg:z-30",
          "w-64 bg-charcoal-dark/95 backdrop-blur-xl border-r border-charcoal-light/20",
          "transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-charcoal-light/20">
          <button
            onClick={() => {
              createNewSession();
              onTabChange('chat');
              if (window.innerWidth < 1024) onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-card bg-neon-blue text-black font-bold text-sm hover:bg-neon-blue/90 transition-all shadow-lg shadow-neon-blue/20 mb-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </button>
          
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-[10px] font-heading font-semibold text-gray-500 uppercase tracking-widest">
              Navigation
            </h2>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded hover:bg-charcoal-light/50"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-card",
                  "text-left transition-all duration-200",
                  "group",
                  isActive
                    ? "bg-neon-blue/20 text-neon-blue border-l-2 border-neon-blue"
                    : "text-gray-400 hover:text-white hover:bg-charcoal-light/30"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-neon-blue" : "text-gray-500 group-hover:text-neon-blue"
                  )}
                />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-neon-blue animate-pulse-neon" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-charcoal-light/20 space-y-3">
          <div className="glass-card rounded-card p-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Intelligence Settings</p>
            
            <div className="space-y-2">
              {/* Context Toggle */}
              <button
                onClick={() => setUseContext(!useContext)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300",
                  useContext 
                    ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-2">
                  <Zap className={cn("h-3.5 w-3.5", useContext ? "text-neon-blue" : "text-gray-500")} />
                  <span className="text-xs font-medium">Context</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{useContext ? "ON" : "OFF"}</span>
              </button>

              {/* Math Mode Toggle */}
              <button
                onClick={() => setMathMode(!mathMode)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300",
                  mathMode 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sigma className={cn("h-3.5 w-3.5", mathMode ? "text-emerald-400" : "text-gray-500")} />
                  <span className="text-xs font-medium">Math Mode</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{mathMode ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full w-fit mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">AI Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

