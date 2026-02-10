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
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* LEFT: ASSIGNMENT */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            {selectedAssignment.title}
          </h2>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-300/30">
              {selectedAssignment.subject}
            </Badge>
            <Badge className="bg-rose-500/10 text-rose-600 border-rose-300/30">
              {deadlineText}
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          {questions.map((q, idx) => (
            <Card
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              className={`mb-4 cursor-pointer border-l-4 transition-all ${
                selectedQuestion?.id === q.id
                  ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/20 shadow"
                  : "border-transparent hover:border-indigo-300"
              }`}
            >
              <CardContent className="p-4 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="flex-1 text-sm text-gray-700 dark:text-gray-200">
                  {q.text}
                </p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>
          ))}

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold flex gap-2 text-amber-800">
              <ShieldCheck className="w-5 h-5" />
              Academic Integrity
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              AI provides guidance only. Plagiarism detection is enabled.
            </p>
          </div>
        </ScrollArea>

        {/* SUBMISSION */}
        <div className="border-t pt-4">
          <h3 className="font-semibold flex gap-2 mb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            Your Submission
          </h3>

          {mySubmission && !isEditing ? (
            <Card className="p-4 space-y-3">
              <Badge className="bg-emerald-500/10 text-emerald-600">
                Submitted {mySubmission.submittedAt}
              </Badge>
              <p className="text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded font-mono line-clamp-3">
                {mySubmission.content}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setIsEditing(true);
                  setSubmissionText(mySubmission.content);
                }}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <textarea
                className="w-full h-28 p-3 rounded border bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your answer here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isEditing ? "Update" : "Submit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: AI ASSISTANT */}
      <div className="w-full lg:w-96 flex flex-col rounded-xl border shadow-lg overflow-hidden bg-white dark:bg-gray-900">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <h3 className="font-bold flex gap-2">
            <Sparkles className="w-5 h-5" />
            Smart AI Assistant
          </h3>
          <p className="text-xs opacity-80">Context-aware academic help</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {selectedQuestion ? (
            <>
              <p className="italic text-sm mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                “{selectedQuestion.text}”
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedQuestion.explanation}
              </p>
              <Button
                variant="outline"
                className="w-full text-indigo-600"
                onClick={() => setShowHintsPanel(true)}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get AI Hints
              </Button>
            </>
          ) : (
            <p className="text-center text-gray-400">
              Select a question to get help.
            </p>
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
