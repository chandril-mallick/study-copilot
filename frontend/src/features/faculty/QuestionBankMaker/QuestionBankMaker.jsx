import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckSquare, 
  Type,
  List,
  Copy
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { facultyService } from '../../../services/facultyService';

const QuestionBankMaker = () => {
  const [sourceText, setSourceText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    if (questions.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Question Bank", 10, 10);
    
    let yPos = 20;
    doc.setFontSize(12);

    questions.forEach((q, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 10;
        }

        doc.setFont("helvetica", "bold");
        const questionTitle = `${index + 1}. ${q.question} (${q.type})`;
        const splitTitle = doc.splitTextToSize(questionTitle, 180);
        doc.text(splitTitle, 10, yPos);
        yPos += (splitTitle.length * 7);

        doc.setFont("helvetica", "normal");
        if (q.type === 'MCQ' && q.options) {
            q.options.forEach((opt, i) => {
                doc.text(`   ${String.fromCharCode(65+i)}. ${opt}`, 10, yPos);
                yPos += 7;
            });
        }
        
        doc.text(`   Answer: ${q.answer}`, 10, yPos);
        yPos += 10;
    });

    doc.save("Question_Bank.pdf");
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) return;
    setIsGenerating(true);

    try {
        const result = await facultyService.generateQuestions(
            "General", 
            "General",
            sourceText, 
            5, 
            "mixed"
        );
        
        if (Array.isArray(result.questions)) {
             setQuestions(result.questions);
        } else {
             alert("AI response format issue. See console.");
             console.log("Raw Response:", result.questions);
        }

    } catch (error) {
        console.error("Failed to generate questions", error);
        alert("Generation failed: " + error.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-8 h-8 text-indigo-500" />
            Auto-Question Bank
          </h2>
          <p className="text-gray-500">Convert notes into quizzes instantly.</p>
        </div>
        <Button className="gap-2" onClick={handleDownloadPDF} disabled={questions.length === 0}>
          <Save className="w-4 h-4" /> Download PDF
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        
        {/* Input Text Area */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 border-gray-200 shadow-sm flex flex-col">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-700">Source Material</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSourceText("Mitochondria are membrane-bound cell organelles (mitochondrion, singular) that generate most of the chemical energy needed to power the cell's biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP).")}>
                Paste Sample
              </Button>
            </div>
            <textarea 
              className="flex-1 w-full p-4 resize-none outline-none text-sm leading-relaxed"
              placeholder="Paste your lecture notes, article, or paragraph here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
            <div className="p-4 border-t bg-white">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700" 
                onClick={handleGenerate}
                disabled={isGenerating || !sourceText.trim()}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 w-4 h-4" /> Generate Questions
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <Card className="flex-1 flex flex-col border-gray-200 shadow-sm overflow-hidden bg-gray-50/50">
            <div className="p-3 border-b bg-white flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <List className="w-4 h-4" /> Generated Questions ({questions.length})
              </span>
              <div className="flex gap-2">
                 <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">MCQ</Badge>
                 <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">True/False</Badge>
                 <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Short Answer</Badge>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{q.type}</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-gray-400 hover:text-red-500 -mt-1 -mr-1"
                          onClick={() => removeQuestion(q.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <p className="font-medium text-gray-800 mb-2">
                        {idx + 1}. {q.question}
                      </p>

                      {q.type === 'MCQ' && (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`text-xs p-2 rounded border ${opt === q.answer ? 'bg-green-50 border-green-200 text-green-700 font-medium' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                              {String.fromCharCode(65+i)}. {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {(q.type === 'True/False' || q.type === 'Short Answer') && (
                         <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100 inline-block">
                           <span className="font-bold">Answer:</span> {q.answer}
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <Copy className="w-12 h-12 mb-3" />
                  <p>Generated questions will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default QuestionBankMaker;
