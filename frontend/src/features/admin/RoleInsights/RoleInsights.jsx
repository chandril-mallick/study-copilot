import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  BarChart, 
  Clock,
  ArrowUpRight,
  MoreVertical,
  Activity,
  RefreshCw,
  Loader2,
  TrendingUp,
  Eye,
  Zap,
  Target,
  Brain,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const RoleInsights = () => {
  const [activeTab, setActiveTab] = useState("Faculty");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({});

  const roles = [
    { 
      id: "Faculty", 
      icon: Briefcase, 
      color: "text-purple-600", 
      bg: "bg-purple-100", 
      gradient: "from-purple-500 to-indigo-600",
      count: 124,
      change: "+12%",
      description: "Active educators"
    },
    { 
      id: "Students", 
      icon: GraduationCap, 
      color: "text-green-600", 
      bg: "bg-green-100", 
      gradient: "from-green-500 to-emerald-600",
      count: 2850,
      change: "+8%",
      description: "Enrolled learners"
    },
    { 
      id: "Verifiers", 
      icon: ShieldCheck, 
      color: "text-blue-600", 
      bg: "bg-blue-100", 
      gradient: "from-blue-500 to-cyan-600",
      count: 18,
      change: "+2",
      description: "Quality assurance"
    },
  ];

  const activities = [
    { type: "Faculty", name: "Prof. Sharma", action: "Uploaded Lecture Notes", time: "2 min ago", avatar: "PS", priority: "high" },
    { type: "Student", name: "Rahul D.", action: "Completed Assignment #4", time: "5 min ago", avatar: "RD", priority: "medium" },
    { type: "Verifier", name: "Admin_03", action: "Approved 12 Documents", time: "12 min ago", avatar: "AD", priority: "high" },
    { type: "Faculty", name: "Dr. Anjali", action: "Started Live Class", time: "15 min ago", avatar: "DA", priority: "high" },
    { type: "Student", name: "Priya K.", action: "Posted in Q&A Forum", time: "22 min ago", avatar: "PK", priority: "low" },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }, 1500);
  };

  useEffect(() => {
    // Animate values on mount
    const timer = setTimeout(() => {
      setAnimatedValues({
        avgActivity: 84,
        peakTime: "11:00 AM",
        avgSession: "42m"
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Role Insights & Heatmap
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Monitor activity levels and engagement across all university roles
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Monitoring
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Role Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {roles.map((role) => (
            <div 
              key={role.id} 
              onClick={() => setActiveTab(role.id)}
              className={`group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border ${
                activeTab === role.id 
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 transform -translate-y-1' 
                  : 'border-slate-200/50 dark:border-slate-700/50 hover:-translate-y-1'
              }`}
            >
              {/* Gradient overlay for active state */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300 ${
                activeTab === role.id ? 'opacity-10' : ''
              }`}></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${role.gradient} rounded-xl shadow-md transform transition-transform duration-300 ${
                    activeTab === role.id ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                  }`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab === role.id && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      role.change.startsWith('+') 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      {role.change}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {role.count.toLocaleString()}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {role.id}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {role.description}
                  </p>
                </div>
                
                {activeTab === role.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">View Details</span>
                      <ChevronRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          
          {/* Enhanced Activity Heatmap */}
          <div className="col-span-1 lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <BarChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeTab} Activity Heatmap
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Daily engagement metrics over last month
                    </p>
                  </div>
                </div>
                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px] flex items-end justify-between p-6 gap-1 relative overflow-hidden">
              {/* Enhanced Bar Chart */}
              {[...Array(30)].map((_, i) => {
                const height = Math.floor(Math.random() * 80) + 10;
                return (
                  <div key={i} className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-all duration-300 rounded-t-sm relative group h-full flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-80 group-hover:opacity-100 transition-all duration-300 rounded-t-sm group-hover:from-indigo-700 group-hover:to-indigo-500" 
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
                    </div>
                    {/* Enhanced Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 dark:bg-slate-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg border border-slate-700">
                      <div className="font-semibold">Day {i+1}</div>
                      <div className="text-indigo-300">{height * 12} interactions</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45"></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Stats Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Avg Daily Active */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">
                      Avg Daily Activity
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                    {animatedValues.avgActivity || 0}%
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Engagement consistency
                  </span>
                </div>

                {/* Peak Time */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">
                      Peak Time
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                    {animatedValues.peakTime || '--'}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Highest activity window
                  </span>
                </div>

                {/* Avg Session */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">
                      Avg Session Duration
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                    {animatedValues.avgSession || '--'}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Time spent per user
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Live Activity Feed */}
          <div className="col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Live Activity Feed
                  </h2>
                </div>
                <Badge className="text-[10px] font-mono animate-pulse bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activities.map((act, i) => (
                <div
                  key={i}
                  className="group px-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 flex gap-3
                             hover:bg-slate-50 dark:hover:bg-slate-700/50
                             transition-all duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700">
                      <AvatarFallback
                        className={`text-[10px] font-bold transition-all duration-300 ${
                          act.type === "Faculty"
                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                            : act.type === "Student"
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                            : "bg-gradient-to-br from-sky-500 to-blue-600 text-white"
                        }`}
                      >
                        {act.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {/* Priority indicator */}
                    {act.priority === 'high' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {act.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                        {act.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                      {act.action}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] h-5 px-2 transition-all duration-300 ${
                          act.type === "Faculty"
                            ? "border-violet-200 text-violet-700 bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:bg-violet-900/20"
                            : act.type === "Student"
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-900/20"
                            : "border-sky-200 text-sky-700 bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:bg-sky-900/20"
                        }`}
                      >
                        {act.type}
                      </Badge>
                      
                      {act.priority === 'high' && (
                        <Badge className="text-[9px] h-5 px-2 bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                          <Zap className="w-3 h-3 mr-1" />
                          High
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  View All Activity
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInsights;
