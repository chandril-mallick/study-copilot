import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  Lock, 
  UserCheck, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Smartphone,
  Globe,
  Key
} from 'lucide-react';

const SecurityCompliance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-600" />
            Security & Compliance Center
          </h2>
          <p className="text-gray-500">Manage access controls, monitor threats, and ensure institutional compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100">
            <AlertTriangle className="w-4 h-4 mr-2" /> System Lockdown
          </Button>
          <Button className="bg-gray-900 text-white hover:bg-black">
             Download Audit Log
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
           <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-green-200 rounded-lg"><CheckCircle className="w-5 h-5 text-green-700" /></div>
                 <span className="text-green-700 font-bold text-xs uppercase">Secure</span>
              </div>
              <div className="mt-4">
                 <div className="text-2xl font-bold text-green-800">99.8%</div>
                 <div className="text-xs text-green-600">Compliance Score</div>
              </div>
           </CardContent>
        </Card>

        <Card>
           <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-blue-100 rounded-lg"><Smartphone className="w-5 h-5 text-blue-700" /></div>
              </div>
              <div className="mt-4">
                 <div className="text-2xl font-bold text-gray-800">84%</div>
                 <div className="text-xs text-gray-500">MFA Adoption Rate</div>
              </div>
           </CardContent>
        </Card>

        <Card>
           <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-700" /></div>
                 <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">2 Active</Badge>
              </div>
              <div className="mt-4">
                 <div className="text-2xl font-bold text-gray-800">5</div>
                 <div className="text-xs text-gray-500">Threats Blocked (24h)</div>
              </div>
           </CardContent>
        </Card>

        <Card>
           <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-purple-100 rounded-lg"><UserCheck className="w-5 h-5 text-purple-700" /></div>
              </div>
              <div className="mt-4">
                 <div className="text-2xl font-bold text-gray-800">12,450</div>
                 <div className="text-xs text-gray-500">Active Sessions</div>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
         
         {/* Live Threat Log */}
         <Card className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
            <CardHeader className="border-b">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Globe className="w-5 h-5 text-gray-500" /> Global Threat Monitor
               </CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 sticky top-0">
                     <tr>
                        <th className="p-4 font-medium">Severity</th>
                        <th className="p-4 font-medium">Event Type</th>
                        <th className="p-4 font-medium">Source IP</th>
                        <th className="p-4 font-medium">Location</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Time</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {[
                       { sev: "High", type: "Multiple Failed Logins", ip: "192.168.4.22", loc: "Moscow, RU", status: "Blocked", time: "2 min ago" },
                       { sev: "Medium", type: "Unusual Download Vol", ip: "10.0.0.45", loc: "Campus Lab 4", status: "Flagged", time: "14 min ago" },
                       { sev: "Low", type: "New Device Login", ip: "172.16.0.4", loc: "Mumbai, IN", status: "Verified", time: "32 min ago" },
                       { sev: "High", type: "SQL Injection Attempt", ip: "45.2.1.99", loc: "Unknown", status: "Blocked", time: "1h ago" },
                       { sev: "Low", type: "Password Reset", ip: "192.168.1.1", loc: "Kolkata, IN", status: "Completed", time: "2h ago" },
                     ].map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                           <td className="p-4">
                              <Badge variant="outline" className={
                                 log.sev === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                                 log.sev === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                 'bg-blue-50 text-blue-700 border-blue-200'
                              }>{log.sev}</Badge>
                           </td>
                           <td className="p-4 font-medium text-gray-800">{log.type}</td>
                           <td className="p-4 font-mono text-gray-500 text-xs">{log.ip}</td>
                           <td className="p-4 text-gray-600">{log.loc}</td>
                           <td className="p-4">
                              <span className={`flex items-center gap-1.5 font-medium ${
                                 log.status === 'Blocked' ? 'text-red-600' : 
                                 log.status === 'Verified' || log.status === 'Completed' ? 'text-green-600' :
                                 'text-orange-600'
                              }`}>
                                 {log.status === 'Blocked' && <ShieldAlert className="w-3 h-3" />}
                                 {log.status}
                              </span>
                           </td>
                           <td className="p-4 text-gray-400">{log.time}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>

         {/* Access Control Matrix Preview */}
         <Card className="col-span-1 flex flex-col">
            <CardHeader className="border-b bg-gray-50/50">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Key className="w-5 h-5 text-indigo-500" /> Access Control Matrix
               </CardTitle>
            </CardHeader>
            <div className="p-4 flex-1">
               <div className="space-y-4">
                  {[
                    { role: "Super Admin", access: ["Full System", "Billing", "User Mgmt"], level: 3 },
                    { role: "Department Head", access: ["Faculty Mgmt", "Curriculum", "Reports"], level: 2 },
                    { role: "Faculty", access: ["Grading", "Course Content", "Student Data (Limited)"], level: 1 },
                    { role: "Student", access: ["Learning Portal", "My Profile"], level: 0 },
                  ].map((role, i) => (
                    <div key={i} className="p-4 border rounded-lg hover:border-indigo-200 transition-all">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800">{role.role}</span>
                          <div className="flex gap-1">
                             {[...Array(3)].map((_, stars) => (
                               <div key={stars} className={`w-2 h-2 rounded-full ${stars < role.level ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                             ))}
                          </div>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {role.access.map((acc, a) => (
                             <Badge key={a} variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 font-medium">
                               {acc}
                             </Badge>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
               <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">Manage Policy</Button>
            </div>
         </Card>

      </div>
    </div>
  );
};

export default SecurityCompliance;
