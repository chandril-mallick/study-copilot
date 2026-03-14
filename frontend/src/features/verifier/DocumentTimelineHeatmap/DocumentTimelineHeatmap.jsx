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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <CalendarClock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Metadata Timeline
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Track the complete lifecycle of a document to spot inconsistencies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm">
                <AlertOctagon className="w-4 h-4" />
                1 Suspicious Event Detected
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Timeline Visualization */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/20">
            <CardTitle className="text-slate-900 dark:text-white">Audit Trail: admission_cert_final.pdf</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Visual history of file operations</CardDescription>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            <div className="absolute left-[31px] md:left-[39px] top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

            <div className="space-y-8">
              {timelineEvents.map((event) => (
                <div key={event.id} className="relative pl-14 md:pl-16 flex gap-4 group">
                  <div className="absolute left-0 top-0 w-16 md:w-20 h-16 md:h-20 -ml-8 md:-ml-10 flex items-center justify-center">
                    <div
                      className={`w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center z-10 transition-all duration-200 group-hover:scale-105 ${
                        event.risk === 'high'
                          ? 'bg-gradient-to-br from-red-100 to-rose-200 text-red-700'
                          : 'bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-700'
                      }`}
                    >
                      <event.icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div
                    className={`flex-1 p-4 md:p-5 rounded-2xl border shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 ${
                      event.risk === 'high'
                        ? 'bg-red-50/80 dark:bg-red-900/15 border-red-200/70 dark:border-red-800/50'
                        : 'bg-white/80 dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-700/60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h4 className={`font-bold ${event.risk === 'high' ? 'text-red-800 dark:text-red-200' : 'text-slate-900 dark:text-white'}`}>
                        {event.type}
                      </h4>
                      <Badge
                        variant={event.risk === 'high' ? 'destructive' : 'outline'}
                        className={`text-[10px] ${
                          event.risk === 'high'
                            ? ''
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {event.risk === 'high' ? 'Risk' : 'Safe'}
                      </Badge>
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex flex-wrap items-center gap-2">
                      <span>{event.date}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {event.device}
                      </span>
                    </div>

                    {event.details && (
                      <div className="text-xs p-3 rounded-xl text-red-700 dark:text-red-300 font-semibold border border-red-200/80 dark:border-red-800/60 bg-white/70 dark:bg-slate-900/20 flex items-start gap-2">
                        <AlertOctagon className="w-4 h-4 mt-0.5" />
                        <span>{event.details}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Analysis Panel */}
        <Card className="col-span-1 flex flex-col overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
            <CardTitle className="text-slate-900 dark:text-white">Safety Analysis</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Risk summary and consistency checks</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6 p-6">
            <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 rounded-2xl border border-red-200/60 dark:border-red-800/50">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold text-red-800 dark:text-red-200 uppercase tracking-wide">Primary Concern</div>
                <Badge variant="destructive" className="text-[10px]">High</Badge>
              </div>
              <p className="text-red-800 dark:text-red-200 text-sm font-semibold mt-2">
                Modification Timestamp Mismatch
              </p>
              <p className="text-red-700/80 dark:text-red-200/80 text-xs mt-2 leading-relaxed">
                The file was modified externally *before* it was exported as a final PDF. This suggests content tampering during the drafting phase.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3 text-sm p-3.5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/70 dark:border-slate-700/60 rounded-xl">
                <span className="text-slate-700 dark:text-slate-300">Geo-Location Match</span>
                <Badge variant="outline" className="text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Valid
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-3 text-sm p-3.5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/70 dark:border-slate-700/60 rounded-xl">
                <span className="text-slate-700 dark:text-slate-300">Software Signature</span>
                <Badge variant="outline" className="text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                </Badge>
              </div>
              <div className="flex justify-between items-center gap-3 text-sm p-3.5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/70 dark:border-slate-700/60 rounded-xl">
                <span className="text-slate-700 dark:text-slate-300">Revision History</span>
                <Badge variant="outline" className="text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                  <AlertOctagon className="w-3 h-3 mr-1" /> Gaps Found
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  );
};

export default DocumentTimelineHeatmap;
