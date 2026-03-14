import React, { useState } from 'react';
import { cn } from '../lib/utils';
import {
  MessageCircle,
  Upload,
  Briefcase,
  BarChart,
  BookMarked,
  Library,
  Users,
  HelpCircle,
  School,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Home,
  Brain,
  FileCheck,
  Database,
  Workflow,
  Shield,
  TrendingUp,
  Download,
  Zap,
  Sigma,
  Plus,
  BookOpen,
  ClipboardList,
  MessagesSquare,
  PieChart,
  UserCog,
  FileBadge,
  FlaskConical,
  Rocket,
  MonitorCheck,
  Star,
  FileText,
  HelpCircle as HelpIcon,
} from 'lucide-react';
import useChatStore from '../store/useChatStore';

// ─────────────────────────────────────────────────────────────────────────────
// Role menus with optional collapsible children groups
// ─────────────────────────────────────────────────────────────────────────────
const roleMenus = {
  student: [
    { id: 'dashboard',  label: 'Dashboard',   icon: Home },
    { id: 'chat',       label: 'Ask Dabba AI', icon: MessageCircle },
    {
      id: 'learning', label: 'Learning', icon: BookOpen, group: true,
      children: [
        { id: 'student-tools',    label: 'Study Tools',  icon: Brain },
        { id: 'assignments',      label: 'Assignments',  icon: BookMarked },
        { id: 'resource-library', label: 'Resources',    icon: Library },
        { id: 'student-applications', label: 'My Applications', icon: FileText },
        { id: 'future-launch-pad', label: 'Launch Pad', icon: Rocket },
      ],
    },
    {
      id: 'community', label: 'Community', icon: Users, group: true,
      children: [
        { id: 'study-groups', label: 'Study Groups', icon: MessagesSquare },
        { id: 'qna-forum',    label: 'Q&A Forum',    icon: HelpCircle },
      ],
    },
  ],
  faculty: [
    { id: 'dashboard', label: 'Dashboard',   icon: Home },
    { id: 'chat',      label: 'Ask Dabba AI', icon: MessageCircle },
    {
      id: 'teaching', label: 'Teaching', icon: Briefcase, group: true,
      children: [
        { id: 'teacher-tools', label: 'Teacher Tools', icon: FlaskConical },
        { id: 'assignments',   label: 'Assignments',   icon: ClipboardList },
        { id: 'uploads',       label: 'Upload Center', icon: Upload },
      ],
    },
    {
      id: 'engagement', label: 'Engagement', icon: MessagesSquare, group: true,
      children: [
        { id: 'qna-forum', label: 'Q&A Moderation', icon: HelpCircle },
        { id: 'analytics', label: 'Analytics',       icon: BarChart },
      ],
    },
  ],
  verifier: [
    { id: 'dashboard', label: 'Dashboard',   icon: Home },
    {
      id: 'review', label: 'Document Review', icon: FileBadge, group: true,
      children: [
        { id: 'verifier-tools', label: 'Pending Review', icon: FileCheck },
        { id: 'verifier-approved', label: 'Approved Docs',  icon: Star },
      ],
    },
    { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard',   icon: Home },
    { id: 'chat',      label: 'Ask Dabba AI', icon: MessageCircle },
    {
      id: 'system', label: 'System', icon: Shield, group: true,
      children: [
        { id: 'admin-users',     label: 'User Management',   icon: UserCog },
        { id: 'management-tools', label: 'AI Knowledge Base', icon: Database },
        { id: 'admin-workflows', label: 'Workflow Builder',  icon: Workflow },
        { id: 'admin-security',  label: 'Security & Logs',   icon: Shield },
      ],
    },
    {
      id: 'reporting', label: 'Reporting', icon: PieChart, group: true,
      children: [
        { id: 'analytics', label: 'System Analytics', icon: BarChart },
      ],
    },
  ],
  management: [
    { id: 'dashboard', label: 'Dashboard',   icon: Home },
    {
      id: 'insights', label: 'Insights', icon: TrendingUp, group: true,
      children: [
        { id: 'analytics',        label: 'Institution KPIs', icon: PieChart },
        { id: 'management-tools', label: 'Reports',          icon: Download },
      ],
    },
    {
      id: 'admin-settings', label: 'Administration', icon: MonitorCheck, group: true,
      children: [
        { id: 'university', label: 'University Settings', icon: School },
      ],
    },
    { id: 'chat', label: 'Ask Dabba AI', icon: MessageCircle },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ userRole, activeTab, onTabChange, isOpen, onToggle, collapsed, onCollapseToggle }) => {
  const menuItems = roleMenus[userRole] || roleMenus.student;

  // All groups open by default
  const defaultOpen = {};
  menuItems.forEach((item) => { if (item.group) defaultOpen[item.id] = true; });
  const [openGroups, setOpenGroups] = useState(defaultOpen);

  const toggleGroup = (id) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const { useContext, setUseContext, mathMode, setMathMode, createNewSession } =
    useChatStore();

  const handleNav = (tabId) => {
    onTabChange(tabId);
    if (window.innerWidth < 1024) onToggle();
  };

  // Width based on collapsed state (desktop only)
  const sidebarWidth = collapsed ? '64px' : '256px';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[65] lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        style={{ width: sidebarWidth, minWidth: sidebarWidth }}
        className={cn(
          'fixed inset-y-16 left-0 z-[70] lg:z-30',
          'bg-charcoal-dark/95 backdrop-blur-xl border-r border-charcoal-light/20',
          'transition-all duration-300 ease-in-out flex flex-col overflow-hidden',
          // Mobile: controlled by isOpen; Desktop: always visible, width controlled by collapsed
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* ── Header ── */}
        <div className={cn('border-b border-charcoal-light/20 transition-all duration-300', collapsed ? 'p-2' : 'p-4')}>
          {collapsed ? (
            // Collapsed: just a new chat icon button
            <button
              onClick={() => { createNewSession(); handleNav('chat'); }}
              title="New Chat"
              className="w-full flex items-center justify-center p-2.5 rounded-card bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => { createNewSession(); handleNav('chat'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-card bg-neon-blue text-black font-bold text-sm hover:bg-neon-blue/90 transition-all shadow-lg shadow-neon-blue/20 mb-3"
              >
                <Plus className="h-5 w-5" />
                <span>New Chat</span>
              </button>
              <div className="flex items-center justify-between">
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
            </>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav className={cn('flex-1 overflow-y-auto scrollbar-thin', collapsed ? 'py-2 px-1.5 space-y-1' : 'py-3 px-3 space-y-0.5')}>
          {menuItems.map((item) => {
            const Icon = item.icon;

            /* ── Collapsed: all items shown as icon-only buttons ── */
            if (collapsed) {
              const allIds = item.group
                ? (item.children || []).map((c) => c.id)
                : [item.id];
              const isActive = allIds.includes(activeTab);

              if (item.group) {
                // Show group children as icon-only in collapsed mode
                return item.children?.map((child, ci) => {
                  const CIcon = child.icon;
                  const childActive = activeTab === child.id;
                  return (
                    <button
                      key={child.id + child.label + ci}
                      onClick={() => handleNav(child.id)}
                      title={child.label}
                      className={cn(
                        'w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-150',
                        childActive
                          ? 'bg-neon-blue/20 text-neon-blue'
                          : 'text-gray-500 hover:text-white hover:bg-charcoal-light/25'
                      )}
                    >
                      <CIcon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                    </button>
                  );
                });
              }

              return (
                <button
                  key={item.id + item.label}
                  onClick={() => handleNav(item.id)}
                  title={item.label}
                  className={cn(
                    'w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-150',
                    activeTab === item.id
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'text-gray-500 hover:text-white hover:bg-charcoal-light/25'
                  )}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                </button>
              );
            }

            /* ── Expanded: flat item ── */
            if (!item.group) {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id + item.label}
                  onClick={() => handleNav(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'text-left transition-all duration-150 group',
                    isActive
                      ? 'bg-neon-blue/15 text-neon-blue border-l-2 border-neon-blue pl-[10px]'
                      : 'text-gray-400 hover:text-white hover:bg-charcoal-light/25 border-l-2 border-transparent'
                  )}
                >
                  <Icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', isActive ? 'text-neon-blue' : 'text-gray-500 group-hover:text-neon-blue')} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse-neon" />}
                </button>
              );
            }

            /* ── Expanded: collapsible group ── */
            const isExpanded = openGroups[item.id];
            const anyChildActive = item.children?.some((c) => c.id === activeTab);

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'text-left transition-all duration-150 group select-none',
                    anyChildActive ? 'text-neon-blue' : 'text-gray-400 hover:text-white hover:bg-charcoal-light/20'
                  )}
                >
                  <Icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', anyChildActive ? 'text-neon-blue' : 'text-gray-500 group-hover:text-neon-blue')} />
                  <span className="font-heading font-semibold text-xs uppercase tracking-wider flex-1 whitespace-nowrap">
                    {item.label}
                  </span>
                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                    : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
                </button>

                {/* Children — animated */}
                <div
                  className="overflow-hidden transition-all duration-250 ease-in-out"
                  style={{
                    maxHeight: isExpanded ? `${(item.children?.length ?? 0) * 52}px` : '0px',
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <div className="ml-3 pl-3 border-l border-charcoal-light/30 space-y-0.5 pb-1">
                    {item.children?.map((child, ci) => {
                      const CIcon = child.icon;
                      const isActive = activeTab === child.id;
                      return (
                        <button
                          key={child.id + child.label + ci}
                          onClick={() => handleNav(child.id)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg',
                            'text-left transition-all duration-150 group',
                            isActive
                              ? 'bg-neon-blue/10 text-neon-blue'
                              : 'text-gray-500 hover:text-white hover:bg-charcoal-light/20'
                          )}
                        >
                          <CIcon className={cn('h-3.5 w-3.5 flex-shrink-0', isActive ? 'text-neon-blue' : 'text-gray-600 group-hover:text-gray-300')} />
                          <span className="text-sm font-medium">{child.label}</span>
                          {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-neon-blue" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Footer: Intelligence Settings (hidden when collapsed) ── */}
        {!collapsed && (
          <div className="p-4 border-t border-charcoal-light/20 space-y-3">
            <div className="glass-card rounded-card p-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                Intelligence Settings
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setUseContext(!useContext)}
                  title="Context Mode: AI uses your uploaded study materials to answer questions"
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300',
                    useContext ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Zap className={cn('h-3.5 w-3.5', useContext ? 'text-neon-blue' : 'text-gray-500')} />
                    <span className="text-xs font-medium">C</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold">{useContext ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={() => setMathMode(!mathMode)}
                  title="Math Mode: Enables LaTeX equation rendering and math keyboard"
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300',
                    mathMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Sigma className={cn('h-3.5 w-3.5', mathMode ? 'text-emerald-400' : 'text-gray-500')} />
                    <span className="text-xs font-medium">M</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold">{mathMode ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full w-fit mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">AI Active</span>
            </div>
          </div>
        )}

        {/* Collapsed footer: AI status dot */}
        {collapsed && (
          <div className="p-3 border-t border-charcoal-light/20 flex justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="AI Active" />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
