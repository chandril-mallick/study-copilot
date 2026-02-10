import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Building2, 
  Globe2,
  ShieldCheck
} from 'lucide-react';

const CrossDatabaseVerification = () => {
  const [searchId, setSearchId] = useState("");
  const [status, setStatus] = useState("idle"); // idle, searching, found, not-found
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    if (!searchId.trim()) return;
    setStatus("searching");
    
    // Simulate API Call
    setTimeout(() => {
       setStatus("found");
       setResult({
          name: "Amit Verma",
          dob: "15-08-2001",
          idType: "Aadhaar / UIDAI",
          status: "Active",
          issuedBy: "Government of India",
          matchScore: 100,
          details: {
             address: "123, Gandhi Road, Kolkata, WB",
             institution: "Brainware University",
             enrollmentYear: "2023"
          }
       });
    }, 2000);
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6 max-w-4xl mx-auto">
      
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Globe2 className="w-8 h-8 text-indigo-600" />
          Cross-Database Verification
        </h2>
        <p className="text-gray-500">Instantly validate credentials against National and Institutional databases.</p>
      </div>

      <Card className="shadow-lg border-indigo-100">
         <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
               <div className="flex-1 w-full space-y-2">
                 <label className="text-sm font-medium text-gray-700">Enter Document ID / Enrollment No.</label>
                 <div className="relative">
                    <Database className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <Input 
                      placeholder="Ex: 5432-8765-1234 or BWU-2023-CS-001" 
                      className="pl-10 h-12 text-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                    />
                 </div>
               </div>
               <Button 
                onClick={handleVerify} 
                disabled={status === 'searching' || !searchId}
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-lg"
               >
                 {status === 'searching' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Now'}
               </Button>
            </div>

            {/* Supported Databases Badges */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
               <Badge variant="outline" className="bg-gray-50 text-gray-500 font-normal py-1"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> UIDAI (Aadhaar)</Badge>
               <Badge variant="outline" className="bg-gray-50 text-gray-500 font-normal py-1"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> CBSE / ICSE</Badge>
               <Badge variant="outline" className="bg-gray-50 text-gray-500 font-normal py-1"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> DigiLocker</Badge>
               <Badge variant="outline" className="bg-gray-50 text-gray-500 font-normal py-1"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> NAD (National Academic Depository)</Badge>
            </div>
         </CardContent>
      </Card>

      {/* Results Area */}
      {status === 'searching' && (
         <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="w-6 h-6 text-indigo-600 animate-pulse" />
               </div>
            </div>
            <p className="text-gray-500 font-medium">Querying external nodes securely...</p>
         </div>
      )}

      {status === 'found' && result && (
         <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-32 h-32 text-green-600" />
               </div>

               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Status Indicator */}
                  <div className="flex flex-col items-center">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                     </div>
                     <Badge className="bg-green-600 hover:bg-green-700 text-base px-4 py-1">Verified Match</Badge>
                  </div>

                  {/* Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                     <div>
                        <div className="text-sm text-gray-500">Full Name</div>
                        <div className="text-lg font-bold text-gray-900">{result.name}</div>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">Date of Birth</div>
                        <div className="text-lg font-bold text-gray-900">{result.dob}</div>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">ID Source</div>
                        <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                           <Building2 className="w-4 h-4 text-gray-400" /> {result.idType}
                        </div>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">Issuer</div>
                        <div className="text-lg font-bold text-gray-900">{result.issuedBy}</div>
                     </div>
                     <div className="col-span-1 sm:col-span-2 mt-2 pt-4 border-t border-green-200">
                        <div className="text-xs text-green-800 font-medium">Additional Metadata Fetched:</div>
                        <p className="text-sm text-gray-700 mt-1">
                           Address: {result.details.address} • Institution: {result.details.institution}
                        </p>
                     </div>
                  </div>

               </div>
            </div>
            <div className="text-center mt-6">
               <Button variant="ghost" onClick={() => { setStatus('idle'); setSearchId(''); }} className="text-gray-400 hover:text-gray-600">
                  Perform Another Check
               </Button>
            </div>
         </div>
      )}

    </div>
  );
};

export default CrossDatabaseVerification;
