import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ScanEye, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  ZoomIn,
  Fingerprint,
  RefreshCw
} from 'lucide-react';

const DeepFakeDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLayer, setActiveLayer] = useState("original");

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        score: 88, // 88% probability of being fake
        flags: [
          { id: 1, type: "Pixel Inconsistency", loc: "Signature Block", severity: "High" },
          { id: 2, type: "Metadata Anomaly", loc: "Creation Date", severity: "Medium" },
          { id: 3, type: "Font Mismatch", loc: "Body Text (Para 2)", severity: "Low" }
        ],
        confidence: 94
      });
      setIsScanning(false);
      setActiveLayer("heatmap");
    }, 3000);
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ScanEye className="w-8 h-8 text-blue-600" />
            Deepfake Document Detector
          </h2>
          <p className="text-gray-500">Forensic analysis of digital documents to detect manipulation.</p>
        </div>
        {!result && (
           <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
             <UploadCloud className="w-4 h-4" /> Upload Document
           </Button>
        )}
        {result && (
           <Button onClick={() => { setResult(null); setActiveLayer("original"); }} variant="outline" className="gap-2">
             <RefreshCw className="w-4 h-4" /> New Scan
           </Button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Document Viewer Area */}
        <Card className="col-span-1 lg:col-span-2 bg-slate-900 border-slate-800 shadow-xl overflow-hidden flex flex-col relative group">
           
           {/* Scan Overlay Animation */}
           {isScanning && (
             <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  <Fingerprint className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse" />
                </div>
                <div className="text-blue-400 font-mono text-lg animate-pulse">Running Forensic Analysis...</div>
                <div className="w-64 mt-4 space-y-1">
                   <Progress value={66} className="h-1 bg-blue-900/50" indicatorClassName="bg-blue-500" />
                   <div className="flex justify-between text-[10px] text-blue-300/60 uppercase">
                      <span>ELA Analysis</span>
                      <span>Metadata Check</span>
                      <span>Pixel Peeping</span>
                   </div>
                </div>
             </div>
           )}

           {/* Toolbar */}
           <div className="p-3 bg-slate-950 border-b border-white/10 flex justify-between items-center z-10">
              <div className="flex gap-2">
                 <Button 
                   size="sm" 
                   variant={activeLayer === 'original' ? 'secondary' : 'ghost'} 
                   className="text-xs h-7 bg-white/10 hover:bg-white/20 text-white border-0"
                   onClick={() => setActiveLayer('original')}
                 >
                   Original
                 </Button>
                 <Button 
                   size="sm" 
                   variant={activeLayer === 'heatmap' ? 'secondary' : 'ghost'} 
                   className="text-xs h-7 bg-white/10 hover:bg-white/20 text-white border-0"
                   onClick={() => result && setActiveLayer('heatmap')}
                   disabled={!result}
                 >
                   <Layers className="w-3 h-3 mr-1" /> Heatmap
                 </Button>
              </div>
              <div className="flex gap-2 text-white/50">
                <ZoomIn className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
           </div>

           {/* Canvas / Document Simulation */}
           <div className="flex-1 bg-slate-800 p-8 flex items-center justify-center overflow-auto relative">
              <div className="w-[400px] h-[550px] bg-white shadow-2xl relative transition-transform duration-500">
                 {/* Fake Document Content */}
                 <div className="p-8 space-y-4 opacity-80 pointer-events-none select-none">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-200 w-3/4"></div>
                    <div className="h-4 bg-gray-100 w-full"></div>
                    <div className="h-4 bg-gray-100 w-full"></div>
                    <div className="h-4 bg-gray-100 w-5/6"></div>
                    
                    <div className="h-32 bg-gray-50 border border-gray-100 mt-8"></div>
                    
                    <div className="flex justify-between mt-12 pt-8">
                       <div className="h-20 w-32 relative">
                          <div className="absolute bottom-0 border-b-2 border-black w-full"></div>
                          <span className="font-script text-2xl absolute bottom-2 left-2 text-blue-900 -rotate-3">John Doe</span>
                       </div>
                       <div className="h-24 w-24 rounded-full border-4 border-double border-red-900/30 flex items-center justify-center relative">
                          <div className="text-[10px] text-red-900/50 font-bold uppercase rotate-[-30deg]">Official Seal</div>
                       </div>
                    </div>
                 </div>

                 {/* Heatmap Overlay */}
                 {activeLayer === 'heatmap' && result && (
                    <div className="absolute inset-0 mix-blend-multiply opacity-70 transition-opacity duration-300">
                       <div className="absolute bottom-20 left-10 w-40 h-16 bg-red-500 blur-xl opacity-60 rounded-full animate-pulse"></div>
                       <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-400 blur-2xl opacity-40 rounded-full"></div>
                    </div>
                 )}
              </div>
           </div>
        </Card>

        {/* Analysis Panel */}
        <div className="col-span-1 flex flex-col gap-4">
           
           {/* Action Card */}
           {!result && !isScanning && (
             <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center space-y-4">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <UploadCloud className="w-8 h-8 text-blue-600" />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-800">Start Analysis</h3>
                     <p className="text-sm text-gray-500">Upload a PDF, JPG, or PNG to scan for manipulations.</p>
                   </div>
                   <Button onClick={handleScan} className="w-full bg-blue-600 hover:bg-blue-700">Select File</Button>
                </CardContent>
             </Card>
           )}

           {/* Results View */}
           {result && (
             <>
               <Card className={result.score > 70 ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
                  <CardContent className="p-6 text-center">
                     <span className="text-xs font-bold uppercase tracking-widest block mb-2 text-gray-500">Likelihood of Manipulation</span>
                     <div className={`text-5xl font-extrabold mb-2 ${result.score > 70 ? "text-red-600" : "text-green-600"}`}>
                        {result.score}%
                     </div>
                     <Badge variant={result.score > 70 ? "destructive" : "default"} className="px-3 py-1">
                        {result.score > 70 ? "High Risk Detected" : "Low Risk"}
                     </Badge>
                  </CardContent>
               </Card>

               <Card className="flex-1 flex flex-col">
                  <div className="p-4 border-b bg-gray-50 font-semibold text-sm flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4 text-orange-500" /> Detected Anomalies
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {result.flags.map((flag) => (
                        <div key={flag.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-red-200 transition-colors">
                           <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-sm text-gray-800">{flag.type}</span>
                              <Badge variant="outline" className="text-[10px]">{flag.severity}</Badge>
                           </div>
                           <div className="text-xs text-gray-500">Found in: {flag.loc}</div>
                        </div>
                     ))}
                  </div>
                  <div className="p-4 border-t bg-gray-50">
                     <Button variant="destructive" className="w-full">Flag for Manual Review</Button>
                  </div>
               </Card>
             </>
           )}
        </div>

      </div>
    </div>
  );
};

export default DeepFakeDetection;
