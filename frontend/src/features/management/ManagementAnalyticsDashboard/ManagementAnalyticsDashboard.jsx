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
  PieChart,
  RefreshCw,
  Loader2,
  Brain,
  Target,
  Eye,
  Zap,
  ChevronUp,
  ChevronDown,
  Clock
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

const ManagementAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [placementData, setPlacementData] = useState(null);
  const [researchData, setResearchData] = useState(null);
  const [dropoutRisks, setDropoutRisks] = useState([]);
  const [performanceForecasts, setPerformanceForecasts] = useState([]);

  useEffect(() => {
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = async () => {
    try {
      if (placementData) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
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
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Loading Analytics Dashboard</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Fetching real-time insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  University Analytics
                  <span className="text-2xl animate-bounce">🌊</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Real-time insights for strategic decision making
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Data
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={fetchAllData} 
              disabled={refreshing}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {refreshing ? (
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

        {/* Enhanced Top Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Placement Rate Card */}
          <div className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-3 h-3" />
                  {placementData?.trend}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-indigo-100 text-sm font-medium">Avg Placement Rate</p>
                <h3 className="text-4xl font-bold">{placementData?.brainware}%</h3>
                <p className="text-indigo-200 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  vs Last Year
                </p>
              </div>
            </div>
          </div>

          {/* Research Output Card */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  <TrendingUp className="w-3 h-3" />
                  Above Avg
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Research Output</p>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">{researchData?.papers_per_faculty}</h3>
                <p className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                  vs National Avg ({researchData?.national_avg})
                </p>
              </div>
            </div>
          </div>

          {/* At-Risk Departments Card */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-md">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">At-Risk Departments</p>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {dropoutRisks.filter(d => d.risk_percentage > 10).length}
                </h3>
                <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  High Dropout Probability
                </p>
              </div>
            </div>
          </div>

          {/* Total Students Card */}
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Active
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Students</p>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">1,250</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Active across all depts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Department Performance Forecast */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Department Performance
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      GPA projections based on current assessments
                    </p>
                  </div>
                </div>
                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              
              <div className="space-y-4">
                {performanceForecasts.map((dept, idx) => (
                  <div key={idx} className="group p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          dept.status === 'improving' 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                            : 'bg-gradient-to-br from-red-400 to-pink-600'
                        }`}>
                          {dept.status === 'improving' ? (
                            <ChevronUp className="w-4 h-4 text-white" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {dept.department}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {dept.status === 'improving' ? 'Positive trend' : 'Needs attention'}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                        dept.status === 'improving' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {dept.status === 'improving' ? '+' : '-'}{Math.abs(dept.projected_gpa - dept.current_gpa).toFixed(1)} GPA
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current GPA</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {dept.current_gpa}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Forecast GPA</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {dept.projected_gpa}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dropout Risk Analysis */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Dropout Risk Analysis
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      AI-predicted retention risks by department
                    </p>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="space-y-4">
                {dropoutRisks.map((risk, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          risk.risk_percentage > 10 
                            ? 'bg-gradient-to-br from-red-400 to-pink-600' 
                            : 'bg-gradient-to-br from-yellow-400 to-orange-600'
                        }`}>
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {risk.department}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Risk assessment updated
                          </p>
                        </div>
                      </div>
                      <Badge className={`${
                        risk.risk_percentage > 10 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {risk.risk_percentage}% Risk
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Risk Level</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{risk.risk_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                            risk.risk_percentage > 10 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          }`}
                          style={{ width: `${risk.risk_percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Key Factors
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {risk.key_factors.map((factor, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 text-xs bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-full text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Footer */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-indigo-100">Student Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">45</p>
              <p className="text-sm text-indigo-100">Active Programs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">250+</p>
              <p className="text-sm text-indigo-100">Faculty Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">A+</p>
              <p className="text-sm text-indigo-100">NAAC Grade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementAnalyticsDashboard;
