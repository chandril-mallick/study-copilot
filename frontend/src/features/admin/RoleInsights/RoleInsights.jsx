import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';

const RoleInsights = () => {
  const [activeTab, setActiveTab] = useState("Faculty");

  const roles = [
    { id: "Faculty", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100", count: 124 },
    { id: "Students", icon: GraduationCap, color: "text-green-600", bg: "bg-green-100", count: 2850 },
    { id: "Verifiers", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-100", count: 18 },
  ];

  const activities = [
    { type: "Faculty", name: "Prof. Sharma", action: "Uploaded Lecture Notes", time: "2 min ago", avatar: "PS" },
    { type: "Student", name: "Rahul D.", action: "Completed Assignment #4", time: "5 min ago", avatar: "RD" },
    { type: "Verifier", name: "Admin_03", action: "Approved 12 Documents", time: "12 min ago", avatar: "AD" },
    { type: "Faculty", name: "Dr. Anjali", action: "Started Live Class", time: "15 min ago", avatar: "DA" },
    { type: "Student", name: "Priya K.", action: "Posted in Q&A Forum", time: "22 min ago", avatar: "PK" },
  ];

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
       
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-orange-500" />
            Role Insights & Heatmap
          </h2>
          <p className="text-gray-500">Monitor activity levels and engagement across all university roles.</p>
        </div>
      </div>

      {/* Role Selector / High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card 
            key={role.id} 
            className={`cursor-pointer transition-all ${activeTab === role.id ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:bg-gray-50'}`}
            onClick={() => setActiveTab(role.id)}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${role.bg}`}>
                   <role.icon className={`w-6 h-6 ${role.color}`} />
                </div>
                <div>
                   <div className="text-sm font-medium text-gray-500">{role.id}</div>
                   <div className="text-2xl font-bold">{role.count}</div>
                </div>
              </div>
              <div className="h-full flex items-center">
                <Activity className={`w-8 h-8 opacity-20 ${role.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Main Analytics Chart */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>{activeTab} Activity Heatmap</CardTitle>
            <CardDescription>Daily engagement metrics over the last month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] flex items-end justify-between p-6 gap-1 relative overflow-hidden">
             {/* Simulated Bar Chart */}
             {[...Array(30)].map((_, i) => {
               const height = Math.floor(Math.random() * 80) + 10;
               return (
                 <div key={i} className="flex-1 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-t-sm relative group h-full flex items-end">
                    <div 
                      className="w-full bg-indigo-500 opacity-80 group-hover:opacity-100 transition-all rounded-t-sm" 
                      style={{ height: `${height}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      Day {i+1}: {height * 12} interactions
                    </div>
                 </div>
               )
             })}
        </CardContent>

<div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
  <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
    
    {/* Avg Daily Active */}
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">
        Avg Daily Activity
      </span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        84%
      </span>
      <span className="text-xs text-gray-500">
        Engagement consistency
      </span>
    </div>

    {/* Peak Time */}
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">
        Peak Time
      </span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        11:00 AM
      </span>
      <span className="text-xs text-gray-500">
        Highest activity window
      </span>
    </div>

    {/* Avg Session */}
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">
        Avg Session Duration
      </span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        42m
      </span>
      <span className="text-xs text-gray-500">
        Time spent per user
      </span>
    </div>

  </div>
</div>
</Card>

     {/* Live Activity Feed */}
<Card className="col-span-1 flex flex-col overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
  <CardHeader className="border-b bg-gray-50 dark:bg-zinc-800/60 py-4">
    <div className="flex justify-between items-center">
      <CardTitle className="text-lg font-semibold">
        Live Activity Feed
      </CardTitle>
      <Badge className="text-[10px] font-mono animate-pulse bg-emerald-500/10 text-emerald-600 border-emerald-200">
        ● LIVE
      </Badge>
    </div>
  </CardHeader>

  <div className="flex-1 overflow-y-auto">
    {activities.map((act, i) => (
      <div
        key={i}
        className="px-4 py-3 border-b last:border-0 flex gap-3
                   hover:bg-gray-50 dark:hover:bg-zinc-800/40
                   transition-colors"
      >
        <Avatar className="h-9 w-9 border border-gray-200 dark:border-zinc-700">
          <AvatarFallback
            className={`text-[10px] font-bold ${
              act.type === "Faculty"
                ? "bg-violet-500/15 text-violet-600"
                : act.type === "Student"
                ? "bg-emerald-500/15 text-emerald-600"
                : "bg-sky-500/15 text-sky-600"
            }`}
          >
            {act.avatar}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {act.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {act.time}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {act.action}
          </p>

          <Badge
            variant="outline"
            className="text-[9px] h-4 mt-2 border-gray-200 dark:border-zinc-700 text-gray-500"
          >
            {act.type}
          </Badge>
        </div>
      </div>
    ))}

    <div className="p-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        View All Activity
      </Button>
    </div>
  </div>
</Card>


      </div>
    </div>
  );
};

export default RoleInsights;
