import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  BarChart2, 
  Clock,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

const FacultyDashboard = () => {
  const atRiskStudents = [
    { id: 1, name: "David Kim", risk: "High", reason: "Missed 3 assignments", score: 45 },
    { id: 2, name: "Sarah Jenkins", risk: "Medium", reason: "Declining quiz scores", score: 62 },
  ];

  return (
    <div className="h-full p-4 md:p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Dashboard</h2>
          <p className="text-gray-500">Real-time insights into student performance and course health.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Last updated: Just now</span>
            <Button variant="outline" size="sm"><TrendingUp className="w-4 h-4 mr-2" /> Download Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +2.1% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+ (87%)</div>
            <p className="text-xs text-muted-foreground">Top 10% compared to dept.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8 Students</div>
            <p className="text-xs text-muted-foreground">Needs immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Area (Mock) */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Engagement Trends</CardTitle>
            <CardDescription>Activity vs. Performance over the last 12 weeks</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Visual Placeholder for a Chart */}
            <div className="h-[300px] w-full bg-gradient-to-t from-gray-50 to-white flex items-end justify-between px-4 pb-4 gap-2 rounded-lg border border-dashed relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                 <BarChart2 className="w-32 h-32" />
               </div>
               
               {[40, 65, 55, 80, 75, 90, 85, 70, 60, 75, 88, 92].map((h, i) => (
                 <div key={i} className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm relative group" style={{height: `${h}%`}}>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     Week {i+1}: {h}%
                   </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* At Risk Sidebar */}
<Card className="col-span-1 border-red-300/40 bg-gradient-to-b from-red-50/40 to-white dark:from-red-950/30 dark:to-neutral-900">
  <CardHeader className="pb-3">
    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
      <AlertTriangle className="w-5 h-5 animate-pulse" />
      Early Warning System
    </CardTitle>
    <CardDescription className="text-sm">
      AI-detected students requiring academic support
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    {atRiskStudents.map((student) => (
      <div
        key={student.id}
        className="flex items-start justify-between p-3 rounded-xl
                   bg-white dark:bg-neutral-900
                   border border-red-200/50 dark:border-red-500/20
                   hover:shadow-md transition-all"
      >
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border border-red-200 dark:border-red-400/30 shadow-sm">
            <AvatarFallback className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold">
              {student.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">
              {student.name}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
              {student.reason}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Current Score: <span className="font-medium">{student.score}%</span>
            </div>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    ))}

    <Button
      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
    >
      Message All At-Risk Students
    </Button>
  </CardContent>
</Card>


      </div>
      
      {/* Topics Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery Breakdown</CardTitle>
          <CardDescription>Where students are struggling vs. excelling</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
             <div className="space-y-1">
               <div className="flex justify-between text-sm">
                 <span className="font-medium">Linear Regression</span>
                 <span className="text-green-600 font-bold">92% Mastery</span>
               </div>
               <Progress value={92} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
             </div>
             
             <div className="space-y-1">
               <div className="flex justify-between text-sm">
                 <span className="font-medium">Neural Networks</span>
                 <span className="text-indigo-600 font-bold">78% Mastery</span>
               </div>
               <Progress value={78} className="h-2 bg-gray-100" indicatorClassName="bg-indigo-500" />
             </div>

             <div className="space-y-1">
               <div className="flex justify-between text-sm">
                 <span className="font-medium">Backpropagation Math</span>
                 <span className="text-red-600 font-bold">45% Mastery (Critical)</span>
               </div>
               <Progress value={45} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
             </div>
           </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default FacultyDashboard;
