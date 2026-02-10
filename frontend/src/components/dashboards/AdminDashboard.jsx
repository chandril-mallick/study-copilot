import React from 'react';
import { 
  Server, 
  Users, 
  Database,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Cpu,
  HardDrive
} from 'lucide-react';

const AdminDashboard = ({ userName = "Admin" }) => {
  const systemHealth = {
    status: "healthy",
    uptime: "99.9%",
    responseTime: "45ms",
    activeUsers: 1247,
  };

  const userStats = {
    total: 5420,
    students: 4200,
    faculty: 180,
    admins: 12,
    verifiers: 28,
  };

  const aiMetrics = {
    accuracy: 94.2,
    queriesProcessed: 12543,
    knowledgeBaseSize: "2.4TB",
    vectorIndexStatus: "synced",
  };

  const recentActivity = [
    { type: "User Created", user: "john.doe@brainware.edu", time: "5m ago", status: "success" },
    { type: "Knowledge Base Updated", user: "System", time: "1h ago", status: "success" },
    { type: "Permission Changed", user: "admin@brainware.edu", time: "2h ago", status: "warning" },
    { type: "Vector Index Rebuilt", user: "System", time: "3h ago", status: "success" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          System Administration, {userName} ⚙️
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Monitor and manage the Dabba AI ecosystem
        </p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Server className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-DEFAULT" />
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-DEFAULT/20 text-emerald-DEFAULT">
              {systemHealth.status}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">System Status</p>
          <p className="text-xl sm:text-2xl font-heading font-bold text-white">{systemHealth.uptime}</p>
        </div>
        <div className="glass-card rounded-card-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-neon-blue" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Response Time</p>
          <p className="text-2xl font-heading font-bold text-white">{systemHealth.responseTime}</p>
        </div>
        <div className="glass-card rounded-card-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Active Users</p>
          <p className="text-2xl font-heading font-bold text-white">{systemHealth.activeUsers.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-card-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-sm text-gray-400 mb-1">AI Accuracy</p>
          <p className="text-2xl font-heading font-bold text-white">{aiMetrics.accuracy}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Statistics */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />
            User Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-card bg-charcoal-light/30">
              <span className="text-gray-400">Total Users</span>
              <span className="text-xl font-bold text-white">{userStats.total.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-card bg-charcoal-light/30">
                <p className="text-sm text-gray-400 mb-1">Students</p>
                <p className="text-lg font-bold text-white">{userStats.students.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-card bg-charcoal-light/30">
                <p className="text-sm text-gray-400 mb-1">Faculty</p>
                <p className="text-lg font-bold text-white">{userStats.faculty}</p>
              </div>
              <div className="p-3 rounded-card bg-charcoal-light/30">
                <p className="text-sm text-gray-400 mb-1">Admins</p>
                <p className="text-lg font-bold text-white">{userStats.admins}</p>
              </div>
              <div className="p-3 rounded-card bg-charcoal-light/30">
                <p className="text-sm text-gray-400 mb-1">Verifiers</p>
                <p className="text-lg font-bold text-white">{userStats.verifiers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Knowledge Base */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-DEFAULT" />
            AI Knowledge Base
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-card bg-charcoal-light/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Knowledge Base Size</span>
                <HardDrive className="h-5 w-5 text-neon-blue" />
              </div>
              <p className="text-2xl font-bold text-white">{aiMetrics.knowledgeBaseSize}</p>
            </div>
            <div className="p-4 rounded-card bg-charcoal-light/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Queries Processed</span>
                <Cpu className="h-5 w-5 text-emerald-DEFAULT" />
              </div>
              <p className="text-2xl font-bold text-white">{aiMetrics.queriesProcessed.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-card bg-charcoal-light/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Vector Index</span>
                <CheckCircle2 className="h-5 w-5 text-emerald-DEFAULT" />
              </div>
              <p className="text-lg font-bold text-white capitalize">{aiMetrics.vectorIndexStatus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
          Recent Activity
        </h2>
        <div className="space-y-2">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-card bg-charcoal-light/30"
            >
              <div className="flex items-center gap-3">
                {activity.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-DEFAULT" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">{activity.type}</p>
                  <p className="text-xs text-gray-400">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

