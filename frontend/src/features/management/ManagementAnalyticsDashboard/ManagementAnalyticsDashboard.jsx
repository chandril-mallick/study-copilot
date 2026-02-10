import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  BookOpen, 
  Award,
  Activity,
  PieChart
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

const ManagementAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [placementData, setPlacementData] = useState(null);
  const [researchData, setResearchData] = useState(null);
  const [dropoutRisks, setDropoutRisks] = useState([]);
  const [performanceForecasts, setPerformanceForecasts] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [placement, research, dropout, performance] = await Promise.all([
        adminService.getPlacementBenchmark(),
        adminService.getResearchBenchmark(),
        adminService.getDropoutRisks(),
        adminService.getPerformancePredictions()
      ]);

      setPlacementData(placement);
      setResearchData(research);
      setDropoutRisks(dropout.predictions);
      setPerformanceForecasts(performance.forecasts);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-8 h-8 text-indigo-600" />
            University Analytics
          </h2>
          <p className="text-gray-500">Real-time insights for strategic decision making.</p>
        </div>
        <Button onClick={fetchAllData} variant="outline" className="gap-2">
           <Activity className="w-4 h-4" /> Refresh Data
        </Button>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Avg Placement Rate</p>
                <h3 className="text-3xl font-bold mt-2">{placementData?.brainware}%</h3>
                <span className="text-indigo-200 text-xs flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> {placementData?.trend} vs Last Year
                </span>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 shadow-sm">
           <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-gray-500 text-sm font-medium">Research Output</p>
                 <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{researchData?.papers_per_faculty}</h3>
                 <span className="text-green-600 text-xs flex items-center mt-1">
                   <TrendingUp className="w-3 h-3 mr-1" /> vs National Avg ({researchData?.national_avg})
                 </span>
               </div>
               <div className="p-2 bg-blue-50 rounded-lg">
                 <BookOpen className="w-6 h-6 text-blue-600" />
               </div>
             </div>
           </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 shadow-sm">
           <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-gray-500 text-sm font-medium">At-Risk Departments</p>
                 <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {dropoutRisks.filter(d => d.risk_percentage > 10).length}
                 </h3>
                 <span className="text-red-500 text-xs flex items-center mt-1">
                   High Dropout Probability
                 </span>
               </div>
               <div className="p-2 bg-red-50 rounded-lg">
                 <AlertTriangle className="w-6 h-6 text-red-600" />
               </div>
             </div>
           </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 shadow-sm">
           <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-gray-500 text-sm font-medium">Total Students</p>
                 <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">1,250</h3>
                 <span className="text-gray-400 text-xs flex items-center mt-1">
                   Active across all depts
                 </span>
               </div>
               <div className="p-2 bg-green-50 rounded-lg">
                 <Users className="w-6 h-6 text-green-600" />
               </div>
             </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Department Performance Forecast */}
          <Card className="border-gray-200 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Department Performance Forecast
                </CardTitle>
                <CardDescription>GPA projections based on current assessments</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {performanceForecasts.map((dept, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold text-gray-800">{dept.department}</h4>
                                <div className="text-xs text-gray-500 mt-1">
                                    Current GPA: <span className="font-medium">{dept.current_gpa}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-lg font-bold ${dept.status === 'improving' ? 'text-green-600' : 'text-red-500'}`}>
                                    {dept.projected_gpa}
                                </div>
                                <div className="text-xs text-gray-400 capitalize">{dept.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

          {/* Dropout Risk Analysis */}
          <Card className="border-gray-200 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Dropout Risk Analysis
                </CardTitle>
                <CardDescription>AI-predicted retention risks by department</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {dropoutRisks.map((risk, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <strong className="text-gray-800">{risk.department}</strong>
                                <Badge variant={risk.risk_percentage > 10 ? "destructive" : "secondary"}>
                                    {risk.risk_percentage}% Risk
                                </Badge>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                <div 
                                    className={`h-2 rounded-full ${risk.risk_percentage > 10 ? 'bg-red-500' : 'bg-yellow-400'}`} 
                                    style={{width: `${risk.risk_percentage}%`}}
                                ></div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {risk.key_factors.map((factor, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {factor}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

      </div>
    </div>
  );
};

export default ManagementAnalyticsDashboard;
