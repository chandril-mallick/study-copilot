import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileSearch, 
  UploadCloud, 
  AlertOctagon, 
  CheckCircle,
  FileText,
  AlertTriangle,
  Search,
  ExternalLink
} from 'lucide-react';

const PlagiarismScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setReport({
        score: 35, // 35% plagiarized
        matches: [
          { id: 1, source: "Wikipedia - Artificial Neural Networks", similarity: 88, snippet: "...inspired by the biological neural networks that constitute animal brains." },
          { id: 2, source: "Medium Article: Deep Learning 101", similarity: 65, snippet: "...backpropagation is an algorithm efficiently used in training feedforward neural networks." },
          { id: 3, source: "Course Textbook: Chapter 4", similarity: 42, snippet: "...gradient descent is an iterative optimization algorithm used to minimize a function." }
        ],
        safe: 65
      });
      setIsScanning(false);
    }, 2500);
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col items-center max-w-5xl mx-auto">
      
      {!report ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
              <FileSearch className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Plagiarism Scanner</h2>
            <p className="text-gray-500 text-lg">
              Upload assignments, essays, or research papers to detect AI-generated content and copied text.
            </p>
          </div>

          <Card className="w-full border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50/50 hover:bg-indigo-50/30">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
              <div className="space-y-2">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleScan} disabled={isScanning}>
                  {isScanning ? "Scanning Document..." : "Select File to Scan"}
                </Button>
                <p className="text-xs text-gray-400">Supported formats: .pdf, .docx, .txt</p>
              </div>
            </CardContent>
          </Card>
          
          {isScanning && (
            <div className="w-full max-w-sm space-y-2">
              <Progress value={66} className="h-2" />
              <p className="text-xs text-center text-gray-500 animate-pulse">Analyzing text patterns & cross-referencing web database...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setReport(null)} className="rounded-full w-10 h-10 p-0">
                <Search className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Report</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="w-4 h-4" /> submission_final_v2.pdf • 2.4 MB
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100">
                 Reject Submission
               </Button>
               <Button className="bg-indigo-600 hover:bg-indigo-700">
                 Download PDF Report
               </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Score Card */}
            <Card className="col-span-1 border-none shadow-lg overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-full h-2 ${report.score > 20 ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center">
                <div className="relative w-48 h-48 mb-6">
                   {/* Simple circular metric visualization */}
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                     <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                     <path className="text-red-500 drop-shadow-lg" strokeDasharray={`${report.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-5xl font-extrabold text-red-600">{report.score}%</span>
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Similarity</span>
                   </div>
                </div>
                
                <div className="space-y-4 w-full">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="flex items-center gap-2 text-red-800 font-medium">
                      <AlertOctagon className="w-5 h-5" /> Plagiarized Content
                    </span>
                    <span className="font-bold text-red-600">{report.score}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="flex items-center gap-2 text-green-800 font-medium">
                      <CheckCircle className="w-5 h-5" /> Original Content
                    </span>
                    <span className="font-bold text-green-600">{report.safe}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matches List */}
            <Card className="col-span-1 lg:col-span-2 flex flex-col">
              <div className="p-6 border-b bg-gray-50/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Identified Matches ({report.matches.length})
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {report.matches.map((match) => (
                   <div key={match.id} className="p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all group">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                         <ExternalLink className="w-4 h-4" /> {match.source}
                       </h4>
                       <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                         {match.similarity}% Match
                       </Badge>
                     </div>
                     <p className="text-sm text-gray-600 italic bg-white p-3 rounded border border-gray-100 border-l-4 border-l-red-400">
                       "...{match.snippet}..."
                     </p>
                   </div>
                 ))}
              </div>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default PlagiarismScanner;
