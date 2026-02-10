import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileText, 
  BrainCircuit, 
  GalleryVerticalEnd, 
  RefreshCw,
  UploadCloud,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wand2,
  Clipboard,
  AlignLeft
} from 'lucide-react';
import { studentService } from '../../../services/studentService';
import api from '../../../services/api';
import Toast from '../../../components/Toast';

const RevisionEngine = () => {
  const [activeTab, setActiveTab] = useState("summaries");
  const [flippedCard, setFlippedCard] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(null);
  
  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [currentContext, setCurrentContext] = useState(null);
  const fileInputRef = useRef(null);
  
  // New Text Input State
  const [inputType, setInputType] = useState('file'); // 'file' or 'text'
  const [textInput, setTextInput] = useState('');

  // Data State
  const [summaries, setSummaries] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mindmap, setMindmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Store raw content for direct API passing (bypassing RAG reliance for pasted text)
  const [rawContent, setRawContent] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRawContent(""); // Clear raw content on file upload
    await processFileUpload(file);
  };

  const handleTextUpload = async () => {
    if (!textInput.trim()) {
      setToast({ message: "Please enter some text first.", type: 'error' });
      return;
    }

    // Save raw content for direct use
    setRawContent(textInput);

    // Create a virtual file from text
    const blob = new Blob([textInput], { type: "text/plain" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const file = new File([blob], `Pasted-Notes-${timestamp}.txt`, { type: "text/plain" });

    await processFileUpload(file);
    setTextInput(""); // Clear after upload
  };

  const processFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use configured api client which handles auth and base_url
      const response = await api.post(`/upload_material`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCurrentContext(file.name);
      // Show success message
      if (response.data && response.data.message) {
        setToast({ message: `Material processed successfully! ${response.data.chunks_processed || 0} chunks.`, type: 'success' });
      }
    } catch (error) {
      console.error("Upload failed", error);
      setToast({ message: "Upload failed. Please try again.", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const generateSummary = async () => {
    if (!currentContext) {
      alert("Please upload a file first");
      return;
    }
    setLoading(true);
    try {
      // Extract subject from filename (remove extension and clean up)
      const subject = currentContext.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() || "Study Material";
      
      // Pass rawContent if available, otherwise empty content triggers FAISS RAG search in backend
      const res = await studentService.generateSummary(
        rawContent || "", 
        subject, 
        500 // max length
      );
      
      if(res.success && res.summary) {
        setSummaries(prev => [{
            id: Date.now(),
            title: `Summary of ${currentContext}`,
            content: res.summary
        }, ...prev]);
        setToast({ message: 'Summary generated successfully!', type: 'success' });
      } else {
        setToast({ message: res.message || "Failed to generate summary. Make sure the file was uploaded successfully.", type: 'error' });
      }
    } catch (err) {
      console.error("Summary generation error:", err);
      setToast({ message: "Failed to generate summary. Please try again.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateMindMap = async () => {
    if (!currentContext) {
      alert("Please upload a file first");
      return;
    }
    setLoading(true);
    try {
      // Extract topic from filename (remove extension and clean up)
      const topic = currentContext.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() || "Study Material";
      const subject = "Study Material"; // General subject
      
      // We don't have a content param for generateMindMap in the original code, 
      // but the backend MindMapRequest DOES NOT have a content field in the Pydantic model shown in step 59.
      // Wait, let's check backend model again.
      // Class MindMapRequest(BaseModel): topic: str, subject: str.
      // It DOES NOT have content field.
      // So passing rawContent here won't help unless I update the backend model too.
      // I will update frontend to pass it, and then update backend to accept it.
      
      // Wait, studentService.generateMindMap also needs to be updated if I add arguments.
      // Currently: async generateMindMap(topic, subject) { ... }
      // I need to update studentService.js as well.
      
      const res = await studentService.generateMindMap(topic, subject, rawContent || "");
      
      if(res.success && res.mindmap) {
        // Ensure mindmap has required structure
        if (!res.mindmap.central_topic) {
          res.mindmap.central_topic = topic;
        }
        if (!res.mindmap.branches || !Array.isArray(res.mindmap.branches)) {
          res.mindmap.branches = [
            {"name": "Overview", "sub_branches": ["Key Concepts", "Main Topics"]}
          ];
        }
        setMindmap(res.mindmap);
        setToast({ message: 'Mind map generated successfully!', type: 'success' });
      } else {
        setToast({ message: res.message || "Failed to generate mind map", type: 'error' });
      }
    } catch (err) {
      console.error("Mind map generation error:", err);
      setToast({ message: "Failed to generate mind map. Please try again.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    if (!currentContext) {
      alert("Please upload a file first");
      return;
    }
    setLoading(true);
    try {
      // Extract subject from filename (remove extension and clean up)
      const subject = currentContext.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() || "Study Material";
      
      // Pass rawContent if available
      const res = await studentService.generateFlashcards(rawContent || "", 10, subject);
      
      if(res.success && res.cards && res.cards.length > 0) {
        setFlashcards(res.cards);
        setCurrentCardIndex(0);
        setFlippedCard(null);
        setToast({ message: `Generated ${res.cards.length} flashcards successfully!`, type: 'success' });
      } else {
        setToast({ message: res.message || "Failed to generate flashcards. Make sure the file was uploaded successfully.", type: 'error' });
      }
    } catch (err) {
      console.error("Flashcard generation error:", err);
      setToast({ message: "Failed to generate flashcards. Please try again.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
    setFlippedCard(null);
  };

  const prevCard = () => {
    setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
    setFlippedCard(null);
  };

  return (
    <div className="h-full p-6 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-green-600" />
            Revision Engine
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
            AI-powered persistence. Turn your documents into active recall tools.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:min-w-[400px]">
            {/* Context Active Badge */}
            <div className="h-8 mb-2">
                {currentContext ? (
                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 animate-in fade-in slide-in-from-right-5 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Context Active: {currentContext}
                    </div>
                ) : (
                    <div className="text-xs text-gray-400 font-medium italic py-1">
                        No material selected. Upload or paste text to start.
                    </div>
                )}
            </div>

            {/* Input Method Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                <button
                    onClick={() => setInputType('file')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${inputType === 'file' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <UploadCloud className="w-3 h-3" /> Upload File
                </button>
                <button
                    onClick={() => setInputType('text')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${inputType === 'text' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <AlignLeft className="w-3 h-3" /> Paste Text
                </button>
            </div>

            {/* Input Area */}
            <div className="w-full relative group">
                {inputType === 'file' ? (
                    <>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept=".pdf,.txt"
                            onChange={handleFileUpload}
                        />
                        <Button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full gap-2 bg-white text-gray-900 border-2 border-dashed border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all h-12 md:h-14 shadow-sm"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-5 h-5 text-emerald-500" />}
                            <span className="font-medium">{isUploading ? "Reading File..." : "Click to Upload PDF or TXT"}</span>
                        </Button>
                    </>
                ) : (
                    <div className="relative w-full animate-in fade-in zoom-in-95 duration-200">
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Paste your notes, article content, or summary here..."
                            className="w-full h-32 p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm transition-all pr-12 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700"
                        />
                        <button
                            onClick={handleTextUpload}
                            disabled={isUploading || !textInput.trim()}
                            className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                            title="Process Text"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      <Tabs defaultValue="summaries" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-100/80 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner">
                <TabsTrigger value="summaries" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all gap-2"><FileText className="w-4 h-4" /> Summaries</TabsTrigger>
                <TabsTrigger value="mindmaps" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all gap-2"><BrainCircuit className="w-4 h-4" /> Mind Maps</TabsTrigger>
                <TabsTrigger value="flashcards" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all gap-2"><GalleryVerticalEnd className="w-4 h-4" /> Flashcards</TabsTrigger>
            </TabsList>
        </div>

        {/* Summaries Tab */}
        <TabsContent value="summaries" className="flex-1 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            {!summaries.length && !loading && (
                 <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-gray-50/50 dark:bg-gray-900/50">
                    <Wand2 className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Upload a file and generate your first summary.</p>
                 </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {summaries.map((s) => (
                    <Card key={s.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-mono text-gray-400">{new Date(s.id).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white line-clamp-1">{s.title}</h3>
                        <div className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed ${expandedSummary === s.id ? '' : 'line-clamp-4'}`}>
                            {s.content}
                        </div>
                        <button 
                            onClick={() => setExpandedSummary(expandedSummary === s.id ? null : s.id)}
                            className="mt-4 text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 uppercase tracking-wider"
                        >
                            {expandedSummary === s.id ? 'Read Less' : 'Read Full Summary'} <ChevronRight className="w-3 h-3" />
                        </button>
                    </CardContent>
                    </Card>
                ))}
          </div>

          <Button 
            onClick={generateSummary}
            disabled={!currentContext || loading}
            className="w-full py-6 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 hover:border-green-400 hover:text-green-600 dark:hover:border-green-500 dark:hover:text-green-400 transition-all rounded-2xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform text-yellow-500" />}
            <span className="font-semibold">{loading ? "Analyzing Document..." : "Generate New Summary"}</span>
          </Button>
        </TabsContent>

        {/* Mind Maps Tab */}
        <TabsContent value="mindmaps" className="flex-1 focus-visible:outline-none focus-visible:ring-0">
             {loading ? (
                 <div className="h-[500px] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                    <p className="text-purple-900 dark:text-purple-300 font-medium animate-pulse">Constructing Neural Connections...</p>
                 </div>
             ) : mindmap ? (
                 <div className="h-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    <div className="absolute top-4 right-4 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Mind Map Mode
                    </div>
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center">
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{mindmap.central_topic}</h3>
                            <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mindmap.branches?.map((branch, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
                                    <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 flex items-center justify-center text-xs">{i+1}</span>
                                        {branch.name}
                                    </h4>
                                    <ul className="space-y-2">
                                        {branch.sub_branches?.map((sub, j) => (
                                            <li key={j} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-300"></span>
                                                {typeof sub === 'object' ? sub.name || sub.content : sub}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
             ) : (
                <div className="h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="bg-white dark:bg-purple-900/30 p-4 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-500">
                        <BrainCircuit className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Visual Knowledge Graph</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md text-center mb-8">
                        Convert your linear notes into a structured 2D mind map for better holistic understanding.
                    </p>
                    <Button 
                        onClick={generateMindMap}
                        disabled={!currentContext}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 dark:shadow-none shadow-lg px-8 py-6 rounded-xl text-lg font-semibold"
                    >
                        Generate Mind Map
                    </Button>
                </div>
             )}
        </TabsContent>

        {/* Flashcards Tab */}
        <TabsContent value="flashcards" className="flex-1 flex flex-col items-center py-4 focus-visible:outline-none focus-visible:ring-0">
           {!flashcards.length ? (
                <div className="flex flex-col items-center justify-center w-full max-w-2xl py-16 px-4 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-3xl border border-dashed border-blue-200 dark:border-blue-900">
                    <GalleryVerticalEnd className="w-20 h-20 text-blue-200 mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Active Recall Deck</h3>
                    <p className="text-gray-500 text-center mb-8 max-w-sm">
                        Create a set of rapid-fire flashcards from your notes to test your memory.
                    </p>
                    <Button 
                        onClick={generateFlashcards}
                        disabled={!currentContext || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-200 dark:shadow-none"
                    >
                        {loading ? "Generating..." : "Create Flashcards Deck"}
                    </Button>
                </div>
           ) : (
               <div className="w-full max-w-3xl flex flex-col items-center">
                   <div className="w-full flex justify-between items-center mb-6 px-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Card {currentCardIndex + 1} / {flashcards.length}</span>
                        <div className="flex gap-2">
                             <Button size="icon" variant="outline" onClick={prevCard} className="rounded-full hover:bg-blue-50 hover:text-blue-600"><ChevronLeft className="w-4 h-4" /></Button>
                             <Button size="icon" variant="outline" onClick={nextCard} className="rounded-full hover:bg-blue-50 hover:text-blue-600"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                   </div>

                   <div 
                        className="relative w-full aspect-[16/9] max-h-[400px] perspective-1000 cursor-pointer group"
                        onClick={() => setFlippedCard(flippedCard === currentCardIndex ? null : currentCardIndex)}
                   >
                        <div className={`absolute inset-0 backface-hidden w-full h-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-12 text-center transition-all duration-700 transform ${flippedCard === currentCardIndex ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'}`}>
                            <span className="inline-block p-3 rounded-full bg-blue-50 text-blue-600 mb-6">
                                <GalleryVerticalEnd className="w-8 h-8" />
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                {flashcards[currentCardIndex].question}
                            </h3>
                            <span className="absolute bottom-8 text-sm font-semibold text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                                Click to Flip <RefreshCw className="w-3 h-3" />
                            </span>
                        </div>

                        <div className={`absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-12 text-center transition-all duration-700 transform ${flippedCard === currentCardIndex ? 'rotate-y-0 opacity-100' : '-rotate-y-180 opacity-0'}`}>
                            <span className="inline-block p-2 rounded-full bg-white/20 text-white mb-6 backdrop-blur-sm">
                                <Sparkles className="w-6 h-6" />
                            </span>
                            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
                                {flashcards[currentCardIndex].answer}
                            </p>
                        </div>
                   </div>

                   <div className="flex gap-4 mt-8">
                       <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setFlashcards([])}>Discard Deck</Button>
                       <Button onClick={generateFlashcards} disabled={loading} className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900">{loading ? "Regenerating..." : "Regenerate Deck"}</Button>
                   </div>
               </div>
           )}
        </TabsContent>
      </Tabs>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default RevisionEngine;
