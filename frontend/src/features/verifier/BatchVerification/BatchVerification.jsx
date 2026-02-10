import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FolderArchive, 
  Upload, 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  Play,
  Download,
  Filter
} from 'lucide-react';

const BatchVerification = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    // Simulate initial file load
    setFiles([
      { id: 1, name: "Student_Batch_A_2023.zip", status: "queued", count: 45 },
    ]);
  };

  const startProcessing = () => {
    setIsProcessing(true);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
       currentProgress += 5;
       setProgress(currentProgress);

       if (currentProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setFiles([
             { 
               id: 1, 
               name: "Student_Batch_A_2023.zip", 
               status: "completed", 
               count: 45,
               results: { approved: 42, flagged: 3 }
             }
          ]);
       }
    }, 150);
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderArchive className="w-8 h-8 text-orange-500" />
            Batch Verification
          </h2>
          <p className="text-gray-500">Bulk process thousands of documents via ZIP uploads.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter History</Button>
           <Button className="bg-orange-600 hover:bg-orange-700">
             <Download className="w-4 h-4 mr-2" /> Export Reports
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Upload Zone */}
        <Card className="md:col-span-1 border-2 border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center p-8 space-y-4 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
             <Upload className="w-10 h-10 text-orange-500" />
          </div>
          <div className="text-center">
             <h3 className="font-bold text-gray-800">Upload ZIP Archive</h3>
             <p className="text-sm text-gray-500 mt-1">Drag & drop or click to select</p>
             <p className="text-xs text-gray-400 mt-2">Max size: 500MB</p>
          </div>
          <Button onClick={handleUpload} variant="secondary" className="mt-4">Select Files</Button>
        </Card>

        {/* Queue / Progress List */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
           <CardHeader className="border-b bg-white pb-4">
              <CardTitle className="flex justify-between items-center">
                 <span>Processing Queue</span>
                 {files.length > 0 && files[0].status === 'queued' && (
                    <Button size="sm" onClick={startProcessing} className="bg-green-600 hover:bg-green-700">
                       <Play className="w-4 h-4 mr-2" /> Start Processing
                    </Button>
                 )}
              </CardTitle>
           </CardHeader>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {files.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <FolderArchive className="w-12 h-12 mb-2" />
                    <p>No active batches</p>
                 </div>
              ) : (
                 files.map((file) => (
                    <div key={file.id} className="bg-white p-4 rounded-xl border shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">zip</div>
                             <div>
                                <h4 className="font-bold text-gray-800">{file.name}</h4>
                                <p className="text-xs text-gray-500">{file.count} documents inside</p>
                             </div>
                          </div>
                          <Badge variant={file.status === 'completed' ? 'secondary' : 'outline'} 
                                 className={file.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}>
                             {file.status === 'completed' ? 'Done' : isProcessing ? 'Processing...' : 'Ready'}
                          </Badge>
                       </div>
                       
                       {isProcessing && file.status !== 'completed' && (
                          <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-500">
                                <span>Verifying Document {Math.floor((progress / 100) * file.count)} of {file.count}...</span>
                                <span>{progress}%</span>
                             </div>
                             <Progress value={progress} className="h-2" />
                          </div>
                       )}

                       {file.status === 'completed' && (
                          <div className="flex gap-4 pt-2 border-t mt-4">
                             <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                                <CheckCircle className="w-4 h-4" /> {file.results.approved} Approved
                             </div>
                             <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
                                <ShieldAlert className="w-4 h-4" /> {file.results.flagged} Flagged
                             </div>
                             <Button variant="link" size="sm" className="ml-auto text-blue-600 h-auto p-0">View Details</Button>
                          </div>
                       )}
                    </div>
                 ))
              )}
           </div>
        </Card>

      </div>
    </div>
  );
};

export default BatchVerification;
