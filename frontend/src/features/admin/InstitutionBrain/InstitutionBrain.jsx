import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  Database, 
  Cpu, 
  Activity, 
  Server, 
  GitCommit,
  Share2,
  Zap
} from 'lucide-react';

const InstitutionBrain = () => {
  return (
    <div className="h-full p-4 md:p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-indigo-600" />
            Institution Brain
          </h2>
          <p className="text-gray-500">Centralized intelligence monitoring and data ingestion status.</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
                <Activity className="w-3 h-3" /> System Healthy
             </div>
             <Badge variant="outline" className="font-mono">v4.2.0-stable</Badge>
        </div>
      </div>

     {/* Metrics Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

  {/* Data Ingested */}
  <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
          <Database className="w-6 h-6 text-white" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
          Data Ingested
        </span>
      </div>

      <div className="text-3xl font-bold leading-tight">
        2.4 TB
      </div>
      <div className="text-xs opacity-80">
        +120 GB this week
      </div>

      <Progress
        value={78}
        className="h-1 mt-4 bg-black/20"
        indicatorClassName="bg-white/90"
      />
    </CardContent>
  </Card>

  {/* AI Accuracy */}
  <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-sm">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-sky-500/10 rounded-lg">
          <Zap className="w-6 h-6 text-sky-600" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          AI Accuracy
        </span>
      </div>

      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        98.2%
      </div>
      <div className="text-xs text-emerald-600 font-medium">
        Auto-grading confidence
      </div>
    </CardContent>
  </Card>

  {/* Knowledge Nodes */}
  <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-sm">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Share2 className="w-6 h-6 text-orange-600" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Knowledge Nodes
        </span>
      </div>

      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        8.5M
      </div>
      <div className="text-xs text-gray-500">
        Interconnected concepts
      </div>
    </CardContent>
  </Card>

  {/* Uptime */}
  <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-sm">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Server className="w-6 h-6 text-emerald-600" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Uptime
        </span>
      </div>

      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        99.99%
      </div>
      <div className="text-xs text-gray-500">
        Last downtime: 42 days ago
      </div>
    </CardContent>
  </Card>

</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* Knowledge Graph Visualization (Simulated) */}
<Card className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
  <CardHeader className="border-b bg-gray-50 dark:bg-zinc-800/60">
    <CardTitle className="flex items-center gap-2 text-lg">
      <Network className="w-5 h-5 text-indigo-500" />
      Live Knowledge Graph
    </CardTitle>
    <CardDescription>
      Real-time mapping of institutional intelligence and data relationships
    </CardDescription>
  </CardHeader>

  <div className="flex-1 relative overflow-hidden h-[420px] bg-gradient-to-br from-slate-900 via-slate-950 to-black">

    {/* Subtle Grid Overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:24px_24px] opacity-40" />

    {/* Simulated Nodes & Connections */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full h-full animate-[spin_80s_linear_infinite]">

        {/* Central Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-indigo-500/40 rounded-full blur-[70px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.9)] z-10" />

        {/* Orbiting Nodes (Departments) */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-sky-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            style={{
              transform: `rotate(${i * 45}deg) translateX(${110 + Math.random() * 40}px)`
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-full -translate-y-1/2 w-[220px] h-[1px] bg-indigo-500/30 -z-10" />
          </div>
        ))}

        {/* Outer Nodes (Courses / Concepts) */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i + 10}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-violet-400 rounded-full opacity-70"
            style={{
              transform: `rotate(${i * 30 + 15}deg) translateX(${190 + Math.random() * 60}px)`
            }}
          />
        ))}
      </div>
    </div>

    {/* Legend Overlay */}
    <div className="absolute bottom-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white text-xs space-y-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        Core Institution
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
        Departments
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
        Courses & Concepts
      </div>
    </div>

  </div>
</Card>


  {/* Data Ingestion Status */}
<Card className="col-span-1 flex flex-col bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
  <CardHeader className="border-b bg-gray-50 dark:bg-zinc-800/60">
    <CardTitle className="text-lg">Data Pipeline</CardTitle>
    <CardDescription>
      Real-time status of institutional data ingestion
    </CardDescription>
  </CardHeader>

  <CardContent className="flex-1 overflow-y-auto pr-2 space-y-6">

    {/* Pipeline Sources */}
    <div className="space-y-4">
      {[
        { name: "Student Records (SIS)", status: "Active", speed: "120 rec/s", color: "green" },
        { name: "LMS Activity Logs", status: "Active", speed: "850 events/s", color: "green" },
        { name: "Library Digital Archives", status: "Indexing", speed: "45 docs/m", color: "blue" },
        { name: "Research Papers Repository", status: "Idle", speed: "-", color: "gray" },
        { name: "Biometric Attendance", status: "Syncing", speed: "1.2k rec/m", color: "orange" },
      ].map((source, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between group px-2 py-1 rounded-lg
                     hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                source.color === "green"
                  ? "bg-emerald-500 animate-pulse"
                  : source.color === "blue"
                  ? "bg-sky-500"
                  : source.color === "orange"
                  ? "bg-orange-500"
                  : "bg-gray-400"
              }`}
            />
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {source.name}
              </div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">
                {source.status}
              </div>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {source.speed}
          </div>
        </div>
      ))}
    </div>

    {/* Alerts */}
    <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        System Alerts
      </div>

      <div className="flex gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400">
        <span className="w-1 rounded-full bg-red-500 shrink-0" />
        <div>
          <span className="font-bold block">
            Latency Spike Detected
          </span>
          LMS ingestion delayed by 450ms. Auto-rerouting pipeline.
        </div>
      </div>
    </div>

  </CardContent>
</Card>


      </div>
    </div>
  );
};

export default InstitutionBrain;
