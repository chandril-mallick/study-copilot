import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Sparkles, 
  FileText, 
  Presentation, 
  Download, 
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { facultyService } from '../../../services/facultyService';

const LessonMaterialGenerator = () => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState(""); // Added Subject state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !subject.trim()) return;
    setIsGenerating(true);
    
    try {
        const result = await facultyService.generateLesson(topic, subject);
        
        setGeneratedContent({
            title: topic,
            slides: [
                { title: topic, content: "Lesson Plan Generated Successfully" },
                { title: "Content", content: "Please review the detailed lesson notes below." }
            ],
            notes: result.lesson_plan
        });
        setStep(3);
    } catch (error) {
        alert("Failed to generate lesson: " + error.message);
        setStep(1);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownload = () => {
      if (!generatedContent) return;
      const element = document.createElement("a");
      const file = new Blob([generatedContent.notes], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${topic.replace(/\s+/g, '_')}_Lesson_Plan.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col items-center justify-center max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Lesson Material Generator
        </h2>
        <p className="text-gray-500">
          Transform a simple topic into comprehensive lesson slides and notes instantly.
        </p>
      </div>

      {/* Wizard Steps */}
      <div className="w-full relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div className="flex justify-between w-full max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-colors ${
              step >= s 
                ? 'bg-purple-600 border-purple-600 text-white' 
                : 'bg-white border-gray-200 text-gray-400'
            }`}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full bg-white dark:bg-gray-800 shadow-lg border-0 overflow-hidden min-h-[400px] flex flex-col">
        <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center">
          
          {/* STEP 1: Input */}
          {step === 1 && (
            <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-purple-50 p-6 rounded-2xl mb-6">
                <BookOpen className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-900 mb-2">What are you teaching?</h3>
                <p className="text-purple-700 text-sm">Enter a topic and subject.</p>
              </div>
              
              <div className="space-y-4">
                <Input 
                  placeholder="Subject (e.g., Mathematics, History)" 
                  className="text-lg py-6"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <Input 
                  placeholder="Topic (e.g., Linear Algebra, The Cold War)" 
                  className="text-lg py-6"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button 
                  size="lg" 
                  className="w-full bg-purple-600 hover:bg-purple-700 font-bold"
                  onClick={() => { setStep(2); handleGenerate(); }}
                  disabled={!topic.trim() || !subject.trim()}
                >
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Configuration & Generation */}
          {step === 2 && (
             <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-right-4">
               <h3 className="text-xl font-bold">Generating Materials for "{topic}"...</h3>
               
               <div className="space-y-4 w-full">
                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-600 animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                 </div>
                 <div className="text-sm text-gray-500 flex flex-col gap-2">
                   <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Analyzing Topic</span>
                   <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-purple-500" /> Structuring Content</span>
                   <span className="flex items-center gap-2 text-gray-300"><Loader2 className="w-4 h-4" /> Writing Lesson Plan</span>
                 </div>
               </div>
             </div>
          )}

          {/* STEP 3: Result */}
          {step === 3 && generatedContent && (
            <div className="w-full h-full flex flex-col animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center mb-6 w-full">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                   <CheckCircle className="w-6 h-6 text-green-500" />
                   Generation Complete!
                 </h3>
                 <div className="flex gap-2">
                    <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 w-4 h-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {setStep(1); setTopic(""); setSubject(""); }}>
                        Start Over
                    </Button>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full flex-1">
                 {/* Slides Preview */}
                 <div className="border bg-gray-900 rounded-xl p-4 text-white shadow-xl relative group">
                    <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                      Slide 1/4
                    </div>
                    <div className="h-full flex flex-col justify-center items-center text-center p-8 border-2 border-white/10 border-dashed rounded-lg">
                      <Presentation className="w-16 h-16 text-purple-400 mb-6" />
                      <h1 className="text-3xl font-bold mb-4">{generatedContent.title}</h1>
                      <p className="text-gray-400 text-lg">Introduction & Overview</p>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm rounded-xl">
                      <Button variant="secondary"><Download className="mr-2 w-4 h-4" /> Download PPT</Button>
                    </div>
                 </div>

                 {/* Notes Preview */}
                 <div className="border bg-yellow-50 text-yellow-900 rounded-xl p-6 shadow-sm relative font-mono text-sm leading-relaxed whitespace-pre-wrap text-left">
                    <FileText className="absolute top-6 right-6 w-8 h-8 opacity-20" />
                    {generatedContent.notes}
                    
                    <div className="mt-8 pt-4 border-t border-yellow-200">
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        <Download className="mr-2 w-4 h-4" /> Export Lesson Plan (PDF)
                      </Button>
                    </div>
                 </div>
               </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default LessonMaterialGenerator;
