import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

const WorkflowAutomation = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(null);

  const workflows = [
    { id: 1, name: "Student Admission", status: "Active", runs: 1240, lastRun: "2m ago" },
    { id: 2, name: "Scholarship Approval", status: "Paused", runs: 45, lastRun: "2d ago" },
    { id: 3, name: "Faculty Onboarding", status: "Active", runs: 12, lastRun: "5h ago" },
  ];

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-8 h-8 text-blue-600" />
            Workflow Automation
          </h2>
          <p className="text-gray-500">Design and manage automated processes without writing code.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Workflow List */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto">
          {workflows.map((wf) => (
            <Card 
              key={wf.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${activeWorkflow === wf.id ? 'border-blue-500 bg-blue-50/50' : 'hover:border-blue-200'}`}
              onClick={() => setActiveWorkflow(wf.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{wf.name}</h3>
                  <Badge variant={wf.status === 'Active' ? 'default' : 'secondary'} className={wf.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                    {wf.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {wf.runs} runs</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {wf.lastRun}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2 hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer">
            <Plus className="w-8 h-8" />
            <span className="font-medium">New Workflow Template</span>
          </div>
        </div>

        {/* Builder / Visualizer Area */}
        <Card className="lg:col-span-2 bg-slate-50 border-slate-200 shadow-inner overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="font-bold text-gray-700">Editor: {activeWorkflow ? workflows.find(w => w.id === activeWorkflow).name : "Select a Workflow"}</span>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" disabled={!activeWorkflow}><Settings className="w-4 h-4 mr-2" /> Settings</Button>
               <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={!activeWorkflow}><Play className="w-4 h-4 mr-2" /> Test Run</Button>
            </div>
          </div>
          
          <div className="flex-1 relative p-8 overflow-auto flex items-center justify-center">
            {activeWorkflow ? (
               <div className="flex flex-col items-center gap-8 w-full max-w-md animate-in zoom-in-95 duration-300">
                  {/* Start Node */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 w-full relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Trigger</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Form Submitted</div>
                        <div className="text-xs text-gray-500">When 'Registration' is received</div>
                      </div>
                    </div>
                    <div className="absolute bottom-[-34px] left-1/2 -translate-x-1/2">
                       <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 w-full relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Auto-Verification</div>
                        <div className="text-xs text-gray-500">Run 'Document Check' AI</div>
                      </div>
                    </div>
                    <div className="absolute bottom-[-34px] left-1/2 -translate-x-1/2">
                       <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 w-full relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Faculty Approval</div>
                        <div className="text-xs text-gray-500">Assign to 'Department Head'</div>
                      </div>
                    </div>
                  </div>

               </div>
            ) : (
              <div className="text-center text-gray-400">
                 <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-20" />
                 <p>Select a workflow to visualize or edit.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowAutomation;
