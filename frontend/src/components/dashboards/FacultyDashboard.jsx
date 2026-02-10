import React from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  AlertTriangle,
  Upload,
  MessageSquare,
  BarChart3,
  ArrowUp,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

const FacultyDashboard = ({ userName = "Professor" }) => {
  const engagementMetrics = [
    { label: "Active Students", value: "142", change: "+12%", trend: "up" },
    { label: "Avg. Engagement", value: "87%", change: "+5%", trend: "up" },
    { label: "Content Views", value: "1,234", change: "+23%", trend: "up" },
    { label: "Questions Answered", value: "89", change: "-3%", trend: "down" },
  ];

  const confusedTopics = [
    { topic: "Linear Algebra - Eigenvalues", students: 23, severity: "high" },
    { topic: "Data Structures - Trees", students: 18, severity: "medium" },
    { topic: "Database Normalization", students: 15, severity: "medium" },
    { topic: "Algorithm Complexity", students: 12, severity: "low" },
  ];

  const recentUploads = [
    { name: "Lecture 5 - Advanced Algorithms", date: "2 hours ago", status: "processed" },
    { name: "Assignment 3 Solutions", date: "1 day ago", status: "processing" },
    { name: "Week 4 Notes", date: "2 days ago", status: "processed" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          Welcome back, {userName}! 👨‍🏫
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Here's your teaching overview and student engagement insights
        </p>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {engagementMetrics.map((metric, index) => (
          <div key={index} className="glass-card rounded-card-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">{metric.label}</p>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                metric.trend === "up" ? "text-emerald-DEFAULT" : "text-red-400"
              )}>
                {metric.trend === "up" ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {metric.change}
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Most Confused Topics */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-heading font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              Most Confused Topics
            </h2>
            <button className="text-xs sm:text-sm text-neon-blue hover:text-neon-blue-light transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {confusedTopics.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white">{item.topic}</h3>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    item.severity === "high" && "bg-red-500/20 text-red-400",
                    item.severity === "medium" && "bg-amber-500/20 text-amber-500",
                    item.severity === "low" && "bg-emerald-DEFAULT/20 text-emerald-DEFAULT"
                  )}>
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{item.students} students need help</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Upload Activity */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-heading font-semibold text-white flex items-center gap-2">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />
              Recent Uploads
            </h2>
            <button className="text-xs sm:text-sm text-neon-blue hover:text-neon-blue-light transition-colors">
              Upload New
            </button>
          </div>
          <div className="space-y-3">
            {recentUploads.map((upload, index) => (
              <div
                key={index}
                className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white">{upload.name}</h3>
                  {upload.status === "processed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-DEFAULT" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <p className="text-sm text-gray-400">{upload.date}</p>
                {upload.status === "processing" && (
                  <div className="mt-2 w-full bg-charcoal-light rounded-full h-2">
                    <div className="bg-neon-blue h-2 rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-card-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all text-left group">
            <BookOpen className="h-6 w-6 text-neon-blue mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white mb-1">Create Quiz</h3>
            <p className="text-sm text-gray-400">Generate AI-powered quiz</p>
          </button>
          <button className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all text-left group">
            <MessageSquare className="h-6 w-6 text-emerald-DEFAULT mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white mb-1">Moderate Q&A</h3>
            <p className="text-sm text-gray-400">Review flagged questions</p>
          </button>
          <button className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all text-left group">
            <BarChart3 className="h-6 w-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white mb-1">View Analytics</h3>
            <p className="text-sm text-gray-400">Student progress insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

