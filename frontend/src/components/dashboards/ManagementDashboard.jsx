import React from 'react';
import { 
  TrendingUp, 
  Users, 
  GraduationCap,
  AlertTriangle,
  BarChart3,
  Download,
  Calendar,
  Target,
  Building2,
  Award
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ManagementDashboard = ({ userName = "Dean" }) => {
  const institutionKPIs = [
    { label: "Total Students", value: "12,450", change: "+8.2%", trend: "up" },
    { label: "Active Courses", value: "342", change: "+12", trend: "up" },
    { label: "Faculty Members", value: "280", change: "+5", trend: "up" },
    { label: "AI Engagement", value: "94%", change: "+3.1%", trend: "up" },
  ];

  const studentRisk = [
    { category: "At Risk", count: 45, percentage: 3.6, color: "red" },
    { category: "Needs Attention", count: 128, percentage: 10.3, color: "amber" },
    { category: "On Track", count: 11277, percentage: 86.1, color: "emerald" },
  ];

  const departmentComparison = [
    { name: "Computer Science", students: 2450, engagement: 96, risk: 2.1 },
    { name: "Engineering", students: 3200, engagement: 94, risk: 3.2 },
    { name: "Business", students: 2800, engagement: 92, risk: 4.1 },
    { name: "Arts", students: 1800, engagement: 89, risk: 5.3 },
    { name: "Science", students: 2200, engagement: 91, risk: 3.8 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          Leadership Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Institution-wide insights and performance metrics
        </p>
      </div>

      {/* Institution KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {institutionKPIs.map((kpi, index) => (
          <div key={index} className="glass-card rounded-card-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">{kpi.label}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-DEFAULT">
                <TrendingUp className="h-3 w-3" />
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Student Risk Prediction */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Student Risk Prediction
          </h2>
          <button className="text-sm text-neon-blue hover:text-neon-blue-light transition-colors">
            View Details
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studentRisk.map((item, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-card",
                item.color === "red" && "bg-red-500/10 border border-red-500/20",
                item.color === "amber" && "bg-amber-500/10 border border-amber-500/20",
                item.color === "emerald" && "bg-emerald-DEFAULT/10 border border-emerald-DEFAULT/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">{item.category}</h3>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  item.color === "red" && "bg-red-500/20 text-red-400",
                  item.color === "amber" && "bg-amber-500/20 text-amber-500",
                  item.color === "emerald" && "bg-emerald-DEFAULT/20 text-emerald-DEFAULT"
                )}>
                  {item.percentage}%
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{item.count.toLocaleString()}</p>
              <div className="mt-2 w-full bg-charcoal-light rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    item.color === "red" && "bg-red-500",
                    item.color === "amber" && "bg-amber-500",
                    item.color === "emerald" && "bg-emerald-DEFAULT"
                  )}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Comparison */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-neon-blue" />
            Department Comparison
          </h2>
          <button className="text-sm text-neon-blue hover:text-neon-blue-light transition-colors">
            Export Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-light/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Department</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Students</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Engagement</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Risk %</th>
              </tr>
            </thead>
            <tbody>
              {departmentComparison.map((dept, index) => (
                <tr key={index} className="border-b border-charcoal-light/10 hover:bg-charcoal-light/20 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{dept.name}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{dept.students.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-DEFAULT font-medium">{dept.engagement}%</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "font-medium",
                      dept.risk < 3 ? "text-emerald-DEFAULT" : dept.risk < 5 ? "text-amber-500" : "text-red-400"
                    )}>
                      {dept.risk}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="glass-card rounded-card-lg p-4 sm:p-6 text-left hover:bg-charcoal-light/30 transition-all group">
          <Download className="h-6 w-6 text-neon-blue mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-white mb-1">Generate Report</h3>
          <p className="text-sm text-gray-400">Download performance PDF</p>
        </button>
        <button className="glass-card rounded-card-lg p-4 sm:p-6 text-left hover:bg-charcoal-light/30 transition-all group">
          <Calendar className="h-6 w-6 text-emerald-DEFAULT mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-white mb-1">Academic Calendar</h3>
          <p className="text-sm text-gray-400">Manage schedules</p>
        </button>
        <button className="glass-card rounded-card-lg p-4 sm:p-6 text-left hover:bg-charcoal-light/30 transition-all group">
          <Target className="h-6 w-6 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-white mb-1">Set Goals</h3>
          <p className="text-sm text-gray-400">Institutional targets</p>
        </button>
      </div>
    </div>
  );
};

export default ManagementDashboard;

