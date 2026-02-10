import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart4, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Globe2,
  Building2,
  ArrowRight
} from 'lucide-react';

const NationalBenchmarking = () => {
  const [activeMetric, setActiveMetric] = useState('placement');

  const rankingData = {
    placement: {
      title: "Placement Rate (2024)",
      unit: "%",
      ours: 92,
      nationalAvg: 76,
      topTierAvg: 95,
      trend: "+4.5%",
      insight: "Brainware is outperforming the national average by 16% and closing the gap with top-tier institutes."
    },
    research: {
      title: "Research Output / Faculty",
      unit: "papers",
      ours: 3.2,
      nationalAvg: 1.8,
      topTierAvg: 5.5,
      trend: "+0.8",
      insight: "Research output has doubled since 2022, largely driven by the CS and Bio-Tech departments."
    },
    satisfaction: {
      title: "Student Satisfaction Score",
      unit: "/ 10",
      ours: 8.8,
      nationalAvg: 7.2,
      topTierAvg: 9.0,
      trend: "+0.3",
      insight: "Campus facilities and digital infrastructure upgrades have boosted satisfaction ratings."
    }
  };

  const currentData = rankingData[activeMetric];

  // Helper to calculate bar width relative to max value (approx 100 or top tier + buffer)
  const getWidth = (val) => Math.min((val / (currentData.topTierAvg * 1.1)) * 100, 100);

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe2 className="w-8 h-8 text-blue-600" />
            National Benchmarking
          </h2>
          <p className="text-gray-500">Compare institutional performance against national standards.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="px-3 py-1 text-base border-blue-200 bg-blue-50 text-blue-700">
             NIRF Ranking: <span className="font-bold ml-1">#87</span> (Engineering)
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Metric Selector */}
        <Card className="col-span-1 border-0 shadow-none bg-transparent">
           <div className="space-y-3">
              <div 
                onClick={() => setActiveMetric('placement')}
                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                  activeMetric === 'placement' ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-white hover:border-blue-300 text-gray-700'
                }`}
              >
                 <div className={`p-2 rounded-lg ${activeMetric === 'placement' ? 'bg-white/20' : 'bg-blue-50'}`}>
                    <Building2 className={`w-6 h-6 ${activeMetric === 'placement' ? 'text-white' : 'text-blue-600'}`} />
                 </div>
                 <div>
                    <h3 className="font-bold">Placement Rate</h3>
                    <p className={`text-xs ${activeMetric === 'placement' ? 'text-blue-100' : 'text-gray-500'}`}>92% Placement in 2024</p>
                 </div>
              </div>

              <div 
                onClick={() => setActiveMetric('research')}
                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                  activeMetric === 'research' ? 'bg-purple-600 border-purple-600 text-white shadow-lg scale-[1.02]' : 'bg-white hover:border-purple-300 text-gray-700'
                }`}
              >
                 <div className={`p-2 rounded-lg ${activeMetric === 'research' ? 'bg-white/20' : 'bg-purple-50'}`}>
                    <Award className={`w-6 h-6 ${activeMetric === 'research' ? 'text-white' : 'text-purple-600'}`} />
                 </div>
                 <div>
                    <h3 className="font-bold">Research Output</h3>
                    <p className={`text-xs ${activeMetric === 'research' ? 'text-purple-100' : 'text-gray-500'}`}>3.2 Papers per Faculty</p>
                 </div>
              </div>

              <div 
                onClick={() => setActiveMetric('satisfaction')}
                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                  activeMetric === 'satisfaction' ? 'bg-green-600 border-green-600 text-white shadow-lg scale-[1.02]' : 'bg-white hover:border-green-300 text-gray-700'
                }`}
              >
                 <div className={`p-2 rounded-lg ${activeMetric === 'satisfaction' ? 'bg-white/20' : 'bg-green-50'}`}>
                    <TrendingUp className={`w-6 h-6 ${activeMetric === 'satisfaction' ? 'text-white' : 'text-green-600'}`} />
                 </div>
                 <div>
                    <h3 className="font-bold">Student Satisfaction</h3>
                    <p className={`text-xs ${activeMetric === 'satisfaction' ? 'text-green-100' : 'text-gray-500'}`}>Rated 8.8/10</p>
                 </div>
              </div>
           </div>

           <Card className="mt-6 bg-gradient-to-br from-gray-900 to-slate-800 text-white border-none">
              <CardContent className="p-6">
                 <h4 className="font-bold mb-2 flex items-center gap-2"><Award className="text-yellow-400" /> AI Recommendation</h4>
                 <p className="text-sm text-gray-300 mb-4">
                   To reach the top-tier bracket in <strong>{currentData.title}</strong>, focus on:
                 </p>
                 <ul className="text-xs space-y-2 text-gray-400 list-disc list-inside">
                    <li>Launch industry mentorship programs</li>
                    <li>Incentivize Q1 journal publications</li>
                    <li>Upgrade lab facilities for IoT & AI</li>
                 </ul>
              </CardContent>
           </Card>
        </Card>

      {/* Chart Area */}
<Card className="col-span-1 lg:col-span-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border shadow-lg">
  <CardHeader className="border-b bg-gray-50 dark:bg-zinc-800/60">
    <div className="flex justify-between items-start gap-4">
      <div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Comparative Analysis: {currentData.title}
        </CardTitle>
        <CardDescription className="mt-1">
          Brainware University vs National Benchmarks
        </CardDescription>
      </div>

      <Badge className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-200">
        <TrendingUp className="w-3 h-3" />
        {currentData.trend} YoY Growth
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="space-y-8 pt-6">

    {/* Brainware Bar */}
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-semibold">
        <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span className="w-3 h-3 rounded-full bg-indigo-600" />
          Brainware University
        </span>
        <span className="text-indigo-600 font-bold">
          {currentData.ours}{currentData.unit}
        </span>
      </div>

      <div className="h-10 w-full bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden group">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500
                     rounded-lg transition-all duration-1000 ease-out
                     flex items-center justify-end px-3"
          style={{ width: `${getWidth(currentData.ours)}%` }}
        >
          <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            You are here
          </span>
        </div>
      </div>
    </div>

    {/* National Average */}
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400" />
          National Average
        </span>
        <span>
          {currentData.nationalAvg}{currentData.unit}
        </span>
      </div>

      <div className="h-8 w-full bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
        <div
          className="h-full bg-gray-400 rounded-lg transition-all duration-1000 ease-out"
          style={{ width: `${getWidth(currentData.nationalAvg)}%` }}
        />
      </div>
    </div>

    {/* Top Tier */}
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          Top Tier Institutes (Top 10)
        </span>
        <span>
          {currentData.topTierAvg}{currentData.unit}
        </span>
      </div>

      <div className="h-8 w-full bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
        <div
          className="h-full bg-emerald-500/40 border-2 border-emerald-500
                     border-dashed rounded-lg transition-all duration-1000 ease-out"
          style={{ width: `${getWidth(currentData.topTierAvg)}%` }}
        />
      </div>
    </div>

    {/* Insight Box */}
    <div className="mt-8 flex gap-4 items-start p-4 rounded-xl
                    bg-indigo-500/5 border border-indigo-500/20">
      <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-600 mt-1">
        <BarChart4 className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          Strategic Insight
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
          {currentData.insight}
        </p>
      </div>
    </div>

  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default NationalBenchmarking;
