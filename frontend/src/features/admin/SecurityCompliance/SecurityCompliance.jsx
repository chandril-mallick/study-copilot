import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  Lock, 
  UserCheck, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Smartphone,
  Globe,
  Key,
  RefreshCw,
  Loader2,
  TrendingUp,
  Zap,
  Brain,
  Activity,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const SecurityCompliance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState({});

  const securityMetrics = [
    {
      title: "Compliance Score",
      value: "99.8%",
      change: "+2.1%",
      status: "excellent",
      icon: ShieldCheck,
      color: "from-green-500 to-emerald-600",
      description: "Overall security compliance rating"
    },
    {
      title: "Active Sessions",
      value: "12,450",
      change: "+847",
      status: "normal",
      icon: Activity,
      color: "from-blue-500 to-indigo-600",
      description: "Currently authenticated users"
    },
    {
      title: "Threats Blocked",
      value: "1,247",
      change: "+156",
      status: "good",
      icon: ShieldAlert,
      color: "from-red-500 to-pink-600",
      description: "Threats neutralized in last 24h"
    },
    {
      title: "Security Score",
      value: "A+",
      change: "Stable",
      status: "excellent",
      icon: Key,
      color: "from-purple-500 to-indigo-600",
      description: "Overall security rating"
    }
  ];

  const threatLogs = [
    { 
      sev: "High", 
      type: "SQL Injection Attempt", 
      ip: "45.2.1.99", 
      loc: "Unknown", 
      status: "Blocked", 
      time: "1h ago",
      description: "Automated SQL injection attempt blocked"
    },
    { 
      sev: "Medium", 
      type: "Brute Force Attack", 
      ip: "192.168.1.105", 
      loc: "Internal Network", 
      status: "Blocked", 
      time: "2h ago",
      description: "Multiple failed login attempts detected"
    },
    { 
      sev: "Low", 
      type: "Suspicious Activity", 
      ip: "10.0.0.45", 
      loc: "Campus WiFi", 
      status: "Monitoring", 
      time: "5m ago",
      description: "Unusual access pattern detected"
    },
    { 
      sev: "Critical", 
      type: "Data Breach Attempt", 
      ip: "172.16.0.42", 
      loc: "External", 
      status: "Blocked", 
      time: "15m ago",
      description: "Unauthorized access attempt prevented"
    }
  ];

  const accessMatrix = [
    { 
      role: "Super Admin", 
      access: ["Full System", "Billing", "User Mgmt", "Security", "Database", "API Keys"], 
      level: 5,
      icon: ShieldCheck,
      color: "from-red-500 to-pink-600"
    },
    { 
      role: "Department Head", 
      access: ["Faculty Mgmt", "Curriculum", "Reports", "Student Data"], 
      level: 4,
      icon: UserCheck,
      color: "from-orange-500 to-amber-600"
    },
    { 
      role: "Faculty", 
      access: ["Course Content", "Grading", "Attendance", "Schedule"], 
      level: 3,
      icon: Brain,
      color: "from-blue-500 to-indigo-600"
    },
    { 
      role: "Student", 
      access: ["Learning Portal", "My Profile", "Grades", "Library"], 
      level: 2,
      icon: Smartphone,
      color: "from-green-500 to-emerald-600"
    },
    { 
      role: "Guest", 
      access: ["Public Content", "Course Catalog"], 
      level: 1,
      icon: Globe,
      color: "from-gray-500 to-slate-600"
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }, 1500);
  };

  useEffect(() => {
    // Animate stats on mount
    const timer = setTimeout(() => {
      setAnimatedStats({
        totalThreats: threatLogs.length,
        blockedThreats: threatLogs.filter(log => log.status === 'Blocked').length,
        criticalThreats: threatLogs.filter(log => log.sev === 'Critical').length
      });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threatLogs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-red-900 dark:to-orange-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Security & Compliance
                  <ShieldCheck className="w-6 h-6 text-orange-500 animate-pulse" />
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Manage access controls, monitor threats, and ensure institutional compliance
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {animatedStats.blockedThreats || 0} Threats Blocked
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    {animatedStats.criticalThreats || 0} Critical
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
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
              <Button className="gap-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <AlertTriangle className="w-4 h-4" />
                System Lockdown
              </Button>
              <Button className="gap-2 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                <Eye className="w-4 h-4" />
                View Logs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {securityMetrics.map((metric, index) => (
          <div
            key={index}
            className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br ${metric.color} rounded-xl shadow-md transform transition-transform duration-300 group-hover:scale-110">
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    metric.status === 'excellent' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : metric.status === 'good' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {metric.status}
                  </div>
                  {metric.status === 'excellent' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                  {metric.value}
                </h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {metric.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {metric.change} from last month
                  </span>
                  {metric.change.startsWith('+') && (
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enhanced Threat Monitoring Table */}
        <Card className="col-span-1 lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col overflow-hidden">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-500" />
              Global Threat Monitor
            </CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 sticky top-0">
                <tr>
                  <th className="p-4 font-medium">Severity</th>
                  <th className="p-4 font-medium">Event Type</th>
                  <th className="p-4 font-medium">Source IP</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {threatLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="p-4">
                      <Badge variant="outline" className={
                        log.sev === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                        log.sev === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                        log.sev === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }>{log.sev}</Badge>
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{log.type}</td>
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400 text-xs">{log.ip}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{log.loc}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 font-medium ${
                        log.status === 'Blocked' ? 'text-red-600 dark:text-red-400' : 
                        log.status === 'Verified' || log.status === 'Completed' ? 'text-green-600 dark:text-green-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>
                        {log.status === 'Blocked' && <ShieldAlert className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 dark:text-slate-500">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Enhanced Access Control Matrix */}
         <Card className="col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              Access Control Matrix
            </CardTitle>
          </CardHeader>
          <div className="p-6">
            <div className="space-y-6">
              {accessMatrix.map((role, index) => (
                <div key={index} className="p-4 border rounded-xl hover:border-indigo-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl shadow-md transform transition-transform duration-300 ${
                        role.level >= 4 ? 'scale-110' : ''
                      }`}>
                        <role.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{role.role}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Level {role.level} Access</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5 - role.level)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < role.level ? 'bg-indigo-500' : 'bg-slate-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {role.access.map((acc, accIndex) => (
                      <Badge
                        key={accIndex}
                        variant="secondary"
                        className="text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                      >
                        {acc}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Manage Policy
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SecurityCompliance;
