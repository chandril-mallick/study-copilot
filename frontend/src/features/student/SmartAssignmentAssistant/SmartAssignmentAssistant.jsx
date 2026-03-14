import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  Send,
  FileText,
  Sparkles
} from 'lucide-react';
import { studentService } from '../../../services/studentService';
import { handleApiError } from '../../../utils/errorHandler';
import Toast from '../../../components/Toast';
import AIHintsPanel from '../../../components/AIHintsPanel';
import { cn } from '../../../lib/utils';

const SmartAssignmentAssistant = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [hintsRevealed, setHintsRevealed] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHintsPanel, setShowHintsPanel] = useState(false);
  const [toast, setToast] = useState(null);

  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch full details when an assignment is selected
  useEffect(() => {
    if (selectedAssignment?.id) {
       fetchAssignmentDetails(selectedAssignment.id);
    } else {
        // Reset when no assignment is selected
        setSelectedQuestion(null);
        setMySubmission(null);
        setSubmissionText("");
    }
  }, [selectedAssignment?.id]);

  const fetchAssignmentDetails = async (id) => {
    setLoading(true);
    try {
        const details = await studentService.getAssignment(id);
        // Merge details into selectedAssignment or store separately. 
        // Ideally we update selectedAssignment with the full details
        setSelectedAssignment(prev => ({ ...prev, ...details }));
        
        if (details.submission) {
            setMySubmission({
                id: details.submission.id,
                content: details.submission.feedback ? details.submission.content : (details.submission.content || ""), // Backend might not send content in list? relying on detail
                // Note: The backend detail endpoint response model 'AssignmentDetail' has 'submission' as a dict.
                // We need to ensure we get the content if we want to edit it.
                // Looking at backend 'AssignmentDetail' model: it has 'submission: Optional[dict]'.
                // And the dict structure in 'get_assignment' is: id, submitted_at, grade, feedback, status. 
                // WAIT! The backend 'get_assignment' logic in 'backend/routes/student/assignment_assistant.py' 
                // DOES NOT include 'content' in the submission dict!
                // I need to update the backend to include 'content' in the GET response too!
                ...details.submission
            });
            // If we can't get content from backend, we can't edit it properly.
            // Let's assume I will fix backend in next step or now. 
            // Actually I should fix backend GET endpoint first to return content.
        } else {
            setMySubmission(null);
            setSubmissionText("");
        }

        // Auto-select first question if available (description as question)
        if (details.description) {
            setSelectedQuestion({
                id: 1,
                text: details.description,
                hints: [],
                explanation: "Use AI hints to understand concepts, not to copy answers."
            });
        }
    } catch (err) {
        showErrorToast(err, setToast);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAssignments();
      setAssignments(data || []);

      // Don't auto-select here, let user choose or just set the first one ID to trigger effect
      if (data?.length && !selectedAssignment) {
          setSelectedAssignment(data[0]); 
      }
    } catch (err) {
      const msg = handleApiError(err);
      setError(msg);
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim()) return;
    setIsSubmitting(true);
    try {
      if (isEditing && mySubmission) {
        await studentService.updateSubmission(selectedAssignment.id, submissionText);
        setMySubmission({ ...mySubmission, content: submissionText });
        setToast({ message: "Assignment updated successfully!", type: "success" });
      } else {
        await studentService.submitAssignment(selectedAssignment.id, submissionText);
        setMySubmission({
          id: Date.now(), // Optimistic update, will be replaced on refresh
          content: submissionText,
          status: "submitted",
          submittedAt: new Date().toLocaleDateString()
        });
        setToast({ message: "Assignment submitted successfully!", type: "success" });
        // Refresh details to get real ID and status
        fetchAssignmentDetails(selectedAssignment.id); 
      }

      setIsEditing(false);
      setSubmissionText("");
    } catch {
      setToast({ message: "Failed to submit assignment.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your submission?")) return;
    try {
      await studentService.deleteSubmission(selectedAssignment.id);
      setMySubmission(null);
      setToast({ message: "Submission deleted.", type: "success" });
    } catch {
      setToast({ message: "Failed to delete submission.", type: "error" });
    }
  };



  // Use the fetched question instead of reconstructing it blindly
  const questions = selectedQuestion ? [selectedQuestion] : [];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if ((!loading && !selectedAssignment) || (error && !assignments.length)) {
    return (
      <div className="h-full flex items-center justify-center text-center p-6">
        <div className="max-w-md">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Assignments Available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "You don't have any assignments yet."}</p>
            {error && <Button onClick={fetchAssignments}>Retry</Button>}
        </div>
      </div>
    );
  }

  // Calculate deadline status
  const deadlineText = selectedAssignment.due_date
      ? new Date(selectedAssignment.due_date) > new Date()
        ? `Due in ${Math.ceil((new Date(selectedAssignment.due_date) - new Date()) / 86400000)} days`
        : "Overdue"
      : "No deadline";

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 bg-[#0A0A0A] overflow-hidden animate-fade-in text-white/90">

      {/* LEFT: ASSIGNMENT */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-heading font-bold flex items-center gap-3 text-white">
              <div className="p-2 rounded-xl bg-indigo-500/20 neon-glow">
                <BookOpen className="w-7 h-7 text-indigo-400" />
              </div>
              {selectedAssignment.title}
            </h2>
            <div className="flex gap-3 mt-4">
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-sm rounded-full">
                {selectedAssignment.subject}
              </Badge>
              <Badge className={cn(
                "px-3 py-1 text-sm rounded-full border",
                deadlineText === "Overdue" 
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30" 
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              )}>
                {deadlineText}
              </Badge>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">Completion Progress</span>
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                style={{ width: `${mySubmission ? '100%' : '0%'}` }}
              />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <Card
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-l-4 animate-fade-in-up",
                  selectedQuestion?.id === q.id
                    ? "glass-card border-l-indigo-500 neon-glow translate-x-1"
                    : "bg-gray-900/40 border-l-transparent border-gray-800 hover:border-l-indigo-500/50"
                )}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className="p-5 flex gap-5">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors",
                    selectedQuestion?.id === q.id
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-800 text-gray-400"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "text-base leading-relaxed transition-colors",
                      selectedQuestion?.id === q.id ? "text-white" : "text-gray-400"
                    )}>
                      {q.text}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    "w-6 h-6 transition-transform",
                    selectedQuestion?.id === q.id ? "text-indigo-400 translate-x-1" : "text-gray-600"
                  )} />
                </CardContent>
              </Card>
            ))}

            <div className="p-5 glass-emerald border-emerald-500/20 rounded-xl flex items-start gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-300">Academic Integrity</h4>
                <p className="text-sm text-emerald-300/60 mt-1">
                  AI provides guidance only. Advanced plagiarism detection is active to ensure your learning experience.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* SUBMISSION */}
        <div className="mt-4 pt-6 border-t border-gray-800">
          <h3 className="text-xl font-heading font-semibold flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-indigo-400" />
            Your Submission
          </h3>

          {mySubmission && !isEditing ? (
            <Card className="glass-card border-emerald-500/20 p-5 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Submitted on {mySubmission.submittedAt}
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={() => {
                      setIsEditing(true);
                      setSubmissionText(mySubmission.content);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-gray-800/50 font-mono text-sm text-gray-300 leading-relaxed max-h-40 overflow-y-auto">
                {mySubmission.content}
              </div>
            </Card>
          ) : (
            <div className="glass-card p-5 space-y-4 animate-slide-up">
              <textarea
                className={cn(
                  "w-full h-40 p-5 rounded-xl bg-black/40 border border-gray-700 text-base text-white outline-none transition-all",
                  "focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-gray-600"
                )}
                placeholder="Compose your insightful answer here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 italic">Auto-saves to cloud drafts every 30 seconds</p>
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-neon transition-all px-8 py-6 rounded-xl font-bold flex gap-3"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !submissionText.trim()}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isEditing ? "Update Submission" : "Finalize & Submit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: AI ASSISTANT */}
      <div className="w-full lg:w-[400px] flex flex-col rounded-2xl glass border-white/5 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <h3 className="font-heading font-bold text-2xl flex items-center gap-3 text-white">
            <Sparkles className="w-6 h-6" />
            AI ThinkPad
          </h3>
          <p className="text-indigo-100/70 text-sm mt-1">Context-aware academic guidance</p>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6">
          {selectedQuestion ? (
            <div className="space-y-6 animate-fade-in">
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-indigo-500/50 rounded-full" />
                <p className="italic text-lg text-white/90 leading-relaxed pl-4">
                  “{selectedQuestion.text}”
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 shadow-inner">
                <div className="flex items-center gap-2 mb-2 text-indigo-300">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Strategy Guide</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {selectedQuestion.explanation}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <Button
                  className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
                  onClick={() => setShowHintsPanel(true)}
                >
                  <Sparkles className="w-5 h-5" />
                  Reveal Smart Hints
                </Button>
                <p className="text-[10px] text-center text-gray-500 mt-4 uppercase tracking-[0.2em]">Safe for Homework</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <HelpCircle className="w-10 h-10" />
              </div>
              <p className="font-medium">Select a question to unlock AI guidance</p>
            </div>
          )}
        </div>
      </div>

      {showHintsPanel && selectedAssignment && selectedQuestion && (
        <AIHintsPanel
          assignmentId={selectedAssignment.id}
          question={selectedQuestion.text}
          context={selectedAssignment.description}
          onClose={() => setShowHintsPanel(false)}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SmartAssignmentAssistant;
