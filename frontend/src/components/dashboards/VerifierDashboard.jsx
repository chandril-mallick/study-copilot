import React from 'react';
import { 
  FileCheck, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Timer,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

const VerifierDashboard = ({ userName = "Verifier" }) => {
  const pendingVerifications = [
    { 
      id: 1, 
      type: "Scholarship Application", 
      applicant: "John Doe", 
      submitted: "2 hours ago",
      sla: "4h remaining",
      priority: "high",
      status: "pending"
    },
    { 
      id: 2, 
      type: "Admission Document", 
      applicant: "Jane Smith", 
      submitted: "5 hours ago",
      sla: "1h remaining",
      priority: "urgent",
      status: "pending"
    },
    { 
      id: 3, 
      type: "Certificate Verification", 
      applicant: "Bob Johnson", 
      submitted: "1 day ago",
      sla: "2 days remaining",
      priority: "medium",
      status: "pending"
    },
  ];

  const flaggedDocuments = [
    { id: 1, reason: "Signature mismatch", count: 3 },
    { id: 2, reason: "Date inconsistency", count: 2 },
    { id: 3, reason: "Document quality", count: 1 },
  ];

  const stats = {
    pending: 12,
    completed: 234,
    flagged: 5,
    avgTime: "2.3h"
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          Welcome, {userName}! 🛡️
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Document verification and review dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Pending</p>
          <p className="text-xl sm:text-2xl font-heading font-bold text-white">{stats.pending}</p>
        </div>
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-DEFAULT" />
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Completed</p>
          <p className="text-xl sm:text-2xl font-heading font-bold text-white">{stats.completed}</p>
        </div>
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Flagged</p>
          <p className="text-xl sm:text-2xl font-heading font-bold text-white">{stats.flagged}</p>
        </div>
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Avg. Time</p>
          <p className="text-xl sm:text-2xl font-heading font-bold text-white">{stats.avgTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Verifications */}
        <div className="lg:col-span-2 glass-card rounded-card-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-heading font-semibold text-white flex items-center gap-2">
              <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue" />
              Pending Verifications
            </h2>
            <button className="text-sm text-neon-blue hover:text-neon-blue-light transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {pendingVerifications.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white group-hover:text-neon-blue transition-colors">
                      {item.type}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{item.applicant}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    item.priority === "urgent" && "bg-red-500/20 text-red-400",
                    item.priority === "high" && "bg-amber-500/20 text-amber-500",
                    item.priority === "medium" && "bg-neon-blue/20 text-neon-blue"
                  )}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Submitted {item.submitted}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-medium">{item.sla}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Documents */}
        <div className="glass-card rounded-card-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
            Flagged Issues
          </h2>
          <div className="space-y-3">
            {flaggedDocuments.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-card bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-sm">{item.reason}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;

