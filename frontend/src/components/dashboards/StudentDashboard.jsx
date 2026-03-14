import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Brain,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';


const StudentDashboard = ({ userName = "Student" }) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    { label: 'Courses Enrolled', value: '6', icon: BookOpen, color: '#00D9FF', bg: 'rgba(0,217,255,0.1)' },
    { label: 'Assignments Done', value: '12/15', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Study Streak', value: '7 days 🔥', icon: TrendingUp, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'AI Sessions', value: '23', icon: Brain, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  ];
  const subjects = [
    { name: "Mathematics", progress: 75, color: "neon-blue" },
    { name: "Computer Science", progress: 88, color: "emerald-DEFAULT" },
    { name: "Physics", progress: 62, color: "amber-500" },
    { name: "Chemistry", progress: 70, color: "purple-500" },
  ];

  const upcomingAssignments = [
    { id: 1, title: "Linear Algebra Assignment", due: "2 days", subject: "Mathematics", status: "pending" },
    { id: 2, title: "Data Structures Project", due: "5 days", subject: "Computer Science", status: "in-progress" },
    { id: 3, title: "Physics Lab Report", due: "1 week", subject: "Physics", status: "pending" },
  ];

  const weeklyPath = [
    { day: "Mon", topic: "Linear Algebra", status: "completed" },
    { day: "Tue", topic: "Data Structures", status: "completed" },
    { day: "Wed", topic: "Algorithm Design", status: "in-progress" },
    { day: "Thu", topic: "Database Systems", status: "pending" },
    { day: "Fri", topic: "Web Development", status: "pending" },
  ];

  const studyGroups = [
    { name: "CS Study Group", members: 12, activity: "Active 2h ago" },
    { name: "Math Helpers", members: 8, activity: "Active 5h ago" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Personalized Greeting */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          {greeting()}, {userName}! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Here's your personalized learning overview for this week
        </p>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-card-lg p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: stat.bg }}>
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-white leading-tight truncate">{stat.value}</p>
                <p className="text-[11px] text-gray-400 leading-tight">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome CTA Banner */}
      <div className="glass-card rounded-card-lg p-5 bg-gradient-to-r from-[#00D9FF]/5 to-[#10B981]/5 border border-[#00D9FF]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-heading font-semibold text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-neon-blue" />
              Quick Actions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Jump right in with your AI-powered tools</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.location.hash = 'ai-tutor'}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/25 transition-all flex items-center gap-1.5"
            >
              <Brain className="h-3.5 w-3.5" /> Ask Priya AI
            </button>
            <button
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" /> Study Tools
            </button>
            <button
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <Target className="h-3.5 w-3.5" /> View Goals
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Learning Path */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white flex items-center gap-2">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />
            <span className="hidden sm:inline">AI-Generated </span>Weekly Learning Path
          </h2>
          <button className="text-xs sm:text-sm text-neon-blue hover:text-neon-blue-light transition-colors flex items-center gap-1">
            View Full Path
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        
        <div className="relative overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] sm:min-w-0">
            {weeklyPath.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center relative z-0">
                {/* Connecting Line */}
                {index < weeklyPath.length - 1 && (
                  <div 
                    className={cn(
                      "absolute top-5 sm:top-6 left-1/2 w-full h-0.5 -z-10 hidden sm:block",
                      item.status === "completed" ? "bg-emerald-DEFAULT" : "bg-gray-700"
                    )} 
                  />
                )}
                
                {/* Node Circle */}
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 z-10 bg-onyx", // Added z-10 and bg-onyx to cover line
                  item.status === "completed" && "border-2 border-emerald-DEFAULT", // Removed bg-emerald/20 to avoid transparency issues with line
                  item.status === "in-progress" && "border-2 border-neon-blue animate-pulse-neon shadow-[0_0_10px_rgba(4,217,255,0.3)]",
                  item.status === "pending" && "border-2 border-gray-600"
                )}>
                  {item.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-DEFAULT" />
                  ) : item.status === "in-progress" ? (
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-neon-blue" />
                  ) : (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-500" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-1">{item.day}</p>
                <p className="text-[10px] sm:text-xs text-gray-300 text-center px-1">{item.topic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge Graph Visualization - WOW Factor (Temporarily Removed) */}
      {/* <div className="h-[400px] flex items-center justify-center text-gray-500">Knowledge Graph View</div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Progress Rings */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-DEFAULT" />
            Subject Progress
          </h2>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-charcoal-light"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - subject.progress / 100)}`}
                      className={cn(
                        subject.color === "neon-blue" && "text-neon-blue",
                        subject.color === "emerald-DEFAULT" && "text-emerald-DEFAULT",
                        subject.color === "amber-500" && "text-amber-500",
                        subject.color === "purple-500" && "text-purple-500"
                      )}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{subject.progress}%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{subject.name}</p>
                  <div className="w-full bg-charcoal-light rounded-full h-2 mt-1">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        subject.color === "neon-blue" && "bg-neon-blue",
                        subject.color === "emerald-DEFAULT" && "bg-emerald-DEFAULT",
                        subject.color === "amber-500" && "bg-amber-500",
                        subject.color === "purple-500" && "bg-purple-500"
                      )}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            Upcoming Assignments
          </h2>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white group-hover:text-neon-blue transition-colors">
                    {assignment.title}
                  </h3>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    assignment.status === "pending" && "bg-amber-500/20 text-amber-500",
                    assignment.status === "in-progress" && "bg-neon-blue/20 text-neon-blue"
                  )}>
                    {assignment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{assignment.subject}</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Due in {assignment.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Group Activity */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-DEFAULT" />
          Study Group Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyGroups.map((group, index) => (
            <div
              key={index}
              className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all cursor-pointer"
            >
              <h3 className="font-medium text-white mb-2">{group.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{group.members} members</span>
                <span>{group.activity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

