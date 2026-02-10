import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  BrainCircuit,
  Users,
  GraduationCap,
  ArrowRightCircle
} from 'lucide-react';

const PredictiveInsights = () => {
  const dropoutRisks = [
    { dept: "Civil Engineering", risk: 12, trend: "up", reason: "Low internship placements" },
    { dept: "Mechanical", risk: 8, trend: "stable", reason: "Attendance correlated drop" },
    { dept: "Computer Science", risk: 3, trend: "down", reason: "High engagement in labs" },
  ];

  const deptPerformance = [
    { name: "Bio-Technology", current: 8.2, projected: 8.5, status: "Improving" },
    { name: "Electronics (ECE)", current: 7.8, projected: 7.6, status: "Declining" },
    { name: "Law", current: 8.0, projected: 8.0, status: "Stable" },
  ];

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-purple-600" />
            Predictive Institute Insights
          </h2>
          <p className="text-gray-500">AI forecasts for student retention and academic performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto">
        
       {/* Dropout Prediction */}
<Card className="border-red-500/20 bg-red-500/5 dark:bg-red-500/10">
  <CardHeader className="border-b border-red-500/20">
    <div className="flex items-center gap-2">
      <AlertTriangle className="text-red-600 w-5 h-5" />
      <CardTitle className="text-red-700 dark:text-red-400">
        Dropout Risk Forecast (Next Semester)
      </CardTitle>
    </div>
    <CardDescription>
      Departments with the highest predicted attrition risk
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    {dropoutRisks.map((item, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-zinc-900 p-4 rounded-xl
                   border border-red-500/20 shadow-sm
                   flex items-center justify-between"
      >
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {item.dept}
          </h4>
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            Key Factor: {item.reason}
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-red-700 dark:text-red-400">
            {item.risk}%
          </div>
          <div
            className={`text-xs font-semibold flex items-center justify-end gap-1 ${
              item.trend === "up"
                ? "text-red-600"
                : item.trend === "down"
                ? "text-emerald-600"
                : "text-gray-500"
            }`}
          >
            {item.trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : item.trend === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {item.trend === "up"
              ? "Risk Increasing"
              : item.trend === "down"
              ? "Risk Reducing"
              : "Stable"}
          </div>
        </div>
      </div>
    ))}

    <div className="pt-4">
      <button
        className="w-full text-sm font-medium text-red-600
                   hover:text-red-700 flex items-center justify-center gap-2"
      >
        View At-Risk Student List
        <ArrowRightCircle className="w-4 h-4" />
      </button>
    </div>
  </CardContent>
</Card>

      {/* Dept Performance Forecast */}
<Card className="border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10">
  <CardHeader className="border-b border-indigo-500/20">
    <div className="flex items-center gap-2">
      <TrendingUp className="text-indigo-600 w-5 h-5" />
      <CardTitle className="text-indigo-700 dark:text-indigo-400">
        Department Performance Outlook
      </CardTitle>
    </div>
    <CardDescription>
      AI-projected average GPA for upcoming final exams
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    {deptPerformance.map((dept, idx) => (
      <div key={idx} className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-gray-900 dark:text-white">
            {dept.name}
          </span>
          <Badge
            variant={
              dept.status === "Improving"
                ? "default"
                : dept.status === "Declining"
                ? "destructive"
                : "secondary"
            }
            className="text-[10px] px-2"
          >
            {dept.status}
          </Badge>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
          {/* Current */}
          <div
            className="h-full bg-gray-400"
            style={{ width: `${dept.current * 10}%` }}
            title={`Current: ${dept.current}`}
          />
          {/* Projection */}
          <div
            className={`h-full ${
              dept.projected >= dept.current
                ? "bg-emerald-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${Math.abs(dept.projected - dept.current) * 10}%`
            }}
            title={`Projected: ${dept.projected}`}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>Current: {dept.current} GPA</span>
          <span className="font-semibold text-indigo-600">
            Forecast: {dept.projected} GPA
          </span>
        </div>
      </div>
    ))}
  </CardContent>
</Card>


        {/* Strategic Recommendations */}
        <Card className="col-span-1 lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0 shadow-lg">
           <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="p-4 bg-white/10 rounded-full">
                 <GraduationCap className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="flex-1 space-y-2">
                 <h3 className="text-xl font-bold">AI Strategic Recommendation</h3>
                 <p className="text-slate-300">
                    Based on the predicted <strong>12% dropout risk</strong> in Civil Engineering, we recommend implementing critical intervention programs immediately.
                 </p>
                 <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-yellow-300 border-yellow-300/30">Action: Schedule Counseling</Badge>
                    <Badge variant="outline" className="text-yellow-300 border-yellow-300/30">Action: Revise Internship Policy</Badge>
                 </div>
              </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default PredictiveInsights;
