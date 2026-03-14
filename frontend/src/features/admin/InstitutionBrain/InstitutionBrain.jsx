import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  Database, 
  Cpu, 
  Activity, 
  Server, 
  GitCommit,
  Share2,
  Zap,
  RefreshCw,
  Loader2,
  TrendingUp,
  Brain,
  Eye,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

const InstitutionBrain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({});
  const [systemHealth, setSystemHealth] = useState('healthy');

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefreshed(new Date());
      setSystemHealth('healthy');
    }, 1500);
  };

  useEffect(() => {
    // Animate values on mount
    const timer = setTimeout(() => {
      setAnimatedValues({
        dataIngested: '2.4',
        aiAccuracy: 98.2,
        knowledgeNodes: '8.5',
        uptime: 99.99
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Institution Brain
                  <Brain className="w-6 h-6 text-purple-500 animate-pulse" />
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Centralized intelligence monitoring and data ingestion status
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    systemHealth === 'healthy' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${systemHealth === 'healthy' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    {systemHealth === 'healthy' ? 'System Healthy' : 'System Alert'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="font-mono bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                v4.2.0-stable
              </Badge>
              <Button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Data Ingested Card */}
          <div className="group relative bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-110">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-3 h-3" />
                  +120 GB
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold transition-all duration-500">
                  {animatedValues.dataIngested || '0'} TB
                </h3>
                <p className="text-indigo-100 text-sm">
                  +120 GB this week
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-indigo-200">Storage Used</span>
                  <span className="text-white font-semibold">78%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Accuracy Card */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-110">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  <TrendingUp className="w-3 h-3" />
                  +2.1%
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                  {animatedValues.aiAccuracy || 0}%
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Auto-grading confidence
                </p>
              </div>
            </div>
          </div>

          {/* Knowledge Nodes Card */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-110">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                  <TrendingUp className="w-3 h-3" />
                  +0.5M
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                  {animatedValues.knowledgeNodes || '0'}M
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Interconnected concepts
                </p>
              </div>
            </div>
          </div>

          {/* Uptime Card */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-110">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Stable
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                  {animatedValues.uptime || 0}%
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Last downtime: 42 days ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Enhanced Knowledge Graph Visualization */}
          <div className="col-span-1 lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Network className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Live Knowledge Graph
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Real-time mapping of institutional intelligence
                    </p>
                  </div>
                </div>
                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden h-[420px] bg-gradient-to-br from-slate-900 via-slate-950 to-black">
              {/* Enhanced Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:24px_24px] opacity-60"></div>
              
              {/* Enhanced Animated Nodes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full animate-[spin_100s_linear_infinite]">
                  
                  {/* Central Core with enhanced glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-[80px] opacity-60 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.9)] z-10">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
                  </div>

                  {/* Enhanced Orbiting Nodes */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.8)] group"
                      style={{
                        transform: `rotate(${i * 45}deg) translateX(${120 + Math.random() * 30}px)`
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-full -translate-y-1/2 w-[240px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent -z-10"></div>
                      <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  ))}

                  {/* Enhanced Outer Nodes */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i + 10}
                      className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-80 group"
                      style={{
                        transform: `rotate(${i * 30 + 15}deg) translateX(${200 + Math.random() * 50}px)`
                      }}
                    >
                      <div className="absolute inset-0 bg-violet-400 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="absolute bottom-4 left-4 p-4 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 text-white text-xs space-y-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse"></div>
                  <span className="font-medium">Core Institution</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.8)]"></div>
                  <span className="font-medium">Departments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-purple-500"></div>
                  <span className="font-medium">Courses & Concepts</span>
                </div>
              </div>
            </div>
          </div>


          {/* Enhanced Data Pipeline Status */}
          <div className="col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Data Pipeline
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Real-time status of institutional data ingestion
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Enhanced Pipeline Sources */}
              <div className="space-y-4">
                {[
                  { name: "Student Records (SIS)", status: "Active", speed: "120 rec/s", color: "green", icon: Database },
                  { name: "LMS Activity Logs", status: "Active", speed: "850 events/s", color: "green", icon: Activity },
                  { name: "Library Digital Archives", status: "Indexing", speed: "45 docs/m", color: "blue", icon: Server },
                  { name: "Research Papers Repository", status: "Idle", speed: "-", color: "gray", icon: GitCommit },
                  { name: "Biometric Attendance", status: "Syncing", speed: "1.2k rec/m", color: "orange", icon: Zap },
                ].map((source, idx) => (
                  <div
                    key={idx}
                    className="group px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-3 h-3 rounded-full ${
                            source.color === "green"
                              ? "bg-emerald-500 animate-pulse"
                              : source.color === "blue"
                              ? "bg-sky-500"
                              : source.color === "orange"
                              ? "bg-orange-500"
                              : "bg-slate-400"
                          }`}></div>
                          {source.color === 'green' && (
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                          )}
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <source.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {source.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                            {source.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {source.speed}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">
                          throughput
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced System Alerts */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    System Alerts
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex gap-3">
                      <div className="w-1 rounded-full bg-red-500 shrink-0 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-red-700 dark:text-red-400">
                            Latency Spike Detected
                          </span>
                          <span className="text-[9px] text-red-600 dark:text-red-500">2 min ago</span>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          LMS ingestion delayed by 450ms. Auto-rerouting pipeline.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex gap-3">
                      <div className="w-1 rounded-full bg-amber-500 shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                            High Memory Usage
                          </span>
                          <span className="text-[9px] text-amber-600 dark:text-amber-500">5 min ago</span>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Memory usage at 87%. Scaling resources automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionBrain;
