import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Plus, 
  Play, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Users,
  FileText,
  ArrowRight,
  RefreshCw,
  Loader2,
  TrendingUp,
  Zap,
  Brain,
  Eye,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const WorkflowAutomation = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const workflows = [
    { 
      id: 1, 
      name: "Student Admission", 
      status: "Active", 
      runs: 1240, 
      lastRun: "2m ago",
      efficiency: 98.5,
      description: "Automated student registration and document verification"
    },
    { 
      id: 2, 
      name: "Scholarship Approval", 
      status: "Paused", 
      runs: 45, 
      lastRun: "2d ago",
      efficiency: 87.2,
      description: "AI-powered scholarship eligibility assessment"
    },
    { 
      id: 3, 
      name: "Faculty Onboarding", 
      status: "Active", 
      runs: 12, 
      lastRun: "5h ago",
      efficiency: 92.1,
      description: "Automated faculty setup and account provisioning"
    },
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
        totalRuns: workflows.reduce((acc, wf) => acc + wf.runs, 0),
        activeWorkflows: workflows.filter(wf => wf.status === 'Active').length,
        avgEfficiency: workflows.reduce((acc, wf) => acc + wf.efficiency, 0) / workflows.length
      });
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Workflow Automation
                  <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Design and manage automated processes without writing code
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {animatedStats.activeWorkflows || 0} Active
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
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
              <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                Create Workflow
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Workflow List */}
        <div className="lg:col-span-1 space-y-4 sm:gap-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Active Workflows</h2>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {animatedStats.activeWorkflows || 0} Active
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                {animatedStats.totalRuns || 0} Total Runs
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                {animatedStats.avgEfficiency?.toFixed(1) || 0}% Avg Efficiency
              </span>
            </div>
          </div>
          
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => setActiveWorkflow(wf.id)}
              className={`group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border ${
                activeWorkflow === wf.id 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 transform -translate-y-1' 
                  : 'border-slate-200/50 dark:border-slate-700/50 hover:-translate-y-1'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl shadow-md transform transition-transform duration-300 ${
                      wf.status === 'Active' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 scale-110' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      {wf.status === 'Active' ? (
                        <Play className="w-5 h-5 text-white" />
                      ) : (
                        <Settings className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {wf.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {wf.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-medium px-3 py-1 rounded-full ${
                      wf.status === 'Active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {wf.status}
                    </Badge>
                    {wf.status === 'Active' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white transition-all duration-500">
                      {wf.runs}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Total Runs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {wf.efficiency}%
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {wf.lastRun}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Last Run</div>
                  </div>
                </div>
                
                {activeWorkflow === wf.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">View Details</span>
                      <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">
              Create New Workflow Template
            </span>
          </div>
        </div>

        {/* Enhanced Workflow Builder/Visualizer */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Workflow Visualizer
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {activeWorkflow ? workflows.find(w => w.id === activeWorkflow).name : "Select a Workflow"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!activeWorkflow}
                  className="gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button 
                  size="sm" 
                  disabled={!activeWorkflow}
                  className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="w-4 h-4" />
                  Test Run
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative p-8 overflow-auto flex items-center justify-center min-h-[400px]">
            {activeWorkflow ? (
              <div className="flex flex-col items-center gap-8 w-full max-w-4xl animate-in zoom-in-95 duration-500">
                
                {/* Enhanced Workflow Steps */}
                <div className="space-y-6 w-full">
                  {/* Trigger Step */}
                  <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-green-200 dark:border-green-800 w-full">
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                      Trigger
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-slate-900 dark:text-white">Form Submitted</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">When 'Registration' is received</div>
                      </div>
                    </div>
                    <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2">
                       <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                    </div>
                  </div>

                  {/* Processing Steps */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 w-full">
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                          Process 1
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-slate-900 dark:text-white">Auto-Verification</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Run 'Document Check' AI</div>
                          </div>
                        </div>
                        <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2">
                           <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800 w-full">
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                          Process 2
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-slate-900 dark:text-white">Faculty Approval</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Assign to 'Department Head'</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                  <GitBranch className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                    Select a workflow to visualize
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Choose from the available workflows on the left to see the detailed process flow and make edits.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAutomation;
