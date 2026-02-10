import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileClock,
  CalendarClock,
  FileSignature,
  FilePlus,
  UploadCloud,
  Globe,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';

const DocumentTimelineHeatmap = () => {
  const timelineEvents = [
    { id: 1, type: "Created", date: "Oct 12, 2023 10:45 AM", device: "Adobe InDesign (Mac)", risk: "low", icon: FilePlus },
    { id: 2, type: "Modified", date: "Oct 14, 2023 02:30 PM", device: "Unknown Device", risk: "high", icon: FileClock, details: "Content altered after initial save" },
    { id: 3, type: "Exported", date: "Oct 14, 2023 02:35 PM", device: "PDF Library v1.4", risk: "low", icon: UploadCloud },
    { id: 4, type: "Signed", date: "Oct 15, 2023 09:00 AM", device: "Adobe Sign Service", risk: "low", icon: FileSignature },
    { id: 5, type: "Uploaded", date: "Today 11:20 AM", device: "Web Client (Chrome)", risk: "low", icon: Globe },
  ];

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-8 h-8 text-indigo-600" />
            Metadata Timeline
          </h2>
          <p className="text-gray-500">Track the complete lifecycle of a document to spot inconsistencies.</p>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
           <AlertOctagon className="w-4 h-4" /> 1 Suspicious Event Detected
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Timeline Visualization */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
           <CardHeader className="border-b bg-gray-50/50">
             <CardTitle>Audit Trail: admission_cert_final.pdf</CardTitle>
             <CardDescription>Visual history of file operations</CardDescription>
           </CardHeader>
           <div className="flex-1 overflow-y-auto p-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gray-200"></div>

              <div className="space-y-8">
                 {timelineEvents.map((event) => (
                    <div key={event.id} className="relative pl-16 flex gap-4 group">
                       {/* Icon Bubble */}
                       <div className={`absolute left-0 top-0 w-20 h-20 -ml-10 flex items-center justify-center`}> 
                          <div className={`w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${
                             event.risk === 'high' ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                             <event.icon className="w-5 h-5" />
                          </div>
                       </div>
                       
                       {/* Content Card */}
                       <div className={`flex-1 p-4 rounded-xl border transition-all ${
                          event.risk === 'high' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-white border-gray-100 hover:border-indigo-200'
                       }`}>
                          <div className="flex justify-between items-start mb-1">
                             <h4 className={`font-bold ${event.risk === 'high' ? 'text-red-700' : 'text-gray-800'}`}>{event.type}</h4>
                             <Badge variant={event.risk === 'high' ? 'destructive' : 'outline'} className="text-[10px]">
                                {event.risk === 'high' ? 'Risk' : 'Safe'}
                             </Badge>
                          </div>
                          <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                             <span>{event.date}</span> • <span className="font-mono text-xs bg-gray-100 px-1 rounded">{event.device}</span>
                          </div>
                          {event.details && (
                             <div className="text-xs bg-white/50 p-2 rounded text-red-600 font-medium border border-red-100 flex items-center gap-2">
                                <AlertOctagon className="w-3 h-3" /> {event.details}
                             </div>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </Card>

        {/* Analysis Panel */}
        <Card className="col-span-1 flex flex-col">
           <CardHeader>
             <CardTitle>Safety Analysis</CardTitle>
           </CardHeader>
           <CardContent className="flex-1 space-y-6">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                 <div className="text-xs font-bold text-red-800 uppercase mb-2">Primary Concern</div>
                 <p className="text-red-700 text-sm font-medium">
                    Modification Timestamp Mismatch
                 </p>
                 <p className="text-red-600/80 text-xs mt-1">
                    The file was modified externally *before* it was exported as a final PDF. This suggests content tampering during the drafting phase.
                 </p>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Geo-Location Match</span>
                    <Badge variant="outline" className="text-green-600 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1" /> Valid</Badge>
                 </div>
                 <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Software Signature</span>
                    <Badge variant="outline" className="text-green-600 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>
                 </div>
                 <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Revision History</span>
                    <Badge variant="outline" className="text-orange-600 bg-orange-50"><AlertOctagon className="w-3 h-3 mr-1" /> Gaps Found</Badge>
                 </div>
              </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DocumentTimelineHeatmap;
