import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Lightbulb,
  FileText,
  Plus,
  X,
  Loader2,
  Eye,
  Edit,
  Trash2,
  Download,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { studentService } from '../services/studentService';
import { facultyService } from '../services/facultyService';
import { handleApiError, showErrorToast } from '../utils/errorHandler';
import AIHintsPanel from './AIHintsPanel';
import Skeleton, { SkeletonCard } from './Skeleton';
import Toast from './Toast';

const AssignmentsEnhanced = ({ viewMode = 'student', onToast }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showHintsPanel, setShowHintsPanel] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [plagiarismCheck, setPlagiarismCheck] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);
  const [toast, setToast] = useState(null);

  // New assignment form (faculty)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    maxMarks: 100
  });
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Submissions View
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissionsList, setSubmissionsList] = useState([]);

  // Grading form (faculty)
  const [gradingData, setGradingData] = useState({
    grade: '',
    feedback: '',
    autoGrade: false
  });

  // Fetch assignments
  useEffect(() => {
    fetchAssignments();
  }, [viewMode]);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Both students and faculty can use the same endpoint now
      const data = await studentService.getAssignments();
      setAssignments(data || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showErrorToast(err, setToast);
      
      // Log for debugging
      console.error('Error fetching assignments:', {
        error: err,
        response: err.response,
        status: err.response?.status,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
    setSubmissionFile(null);
    setSubmissionText('');
    setPlagiarismCheck(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissionFile(file);
      // Read file content for text files
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSubmissionText(e.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleCheckPlagiarism = async () => {
    if (!submissionText.trim() && !submissionFile) {
      setToast({ message: 'Please upload a file or enter text first', type: 'warning' });
      return;
    }

    setCheckingPlagiarism(true);
    try {
      const content = submissionText || (submissionFile ? await readFileContent(submissionFile) : '');
      const result = await studentService.checkPlagiarism(selectedAssignment.id, content);
      setPlagiarismCheck(result);
    } catch (err) {
      showErrorToast(err, setToast);
    } finally {
      setCheckingPlagiarism(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleConfirmSubmission = async () => {
    if (!submissionText.trim() && !submissionFile) {
      setToast({ message: 'Please upload a file or enter text', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const content = submissionText || (submissionFile ? await readFileContent(submissionFile) : '');
      await studentService.submitAssignment(selectedAssignment.id, content);
      
      setToast({ message: 'Assignment submitted successfully!', type: 'success' });
      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSubmissionFile(null);
      setSubmissionText('');
      setPlagiarismCheck(null);
      fetchAssignments(); // Refresh list
    } catch (err) {
      showErrorToast(err, setToast);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAssignment = (assignment) => {
    setNewAssignment({
      title: assignment.title,
      description: assignment.description || '',
      subject: assignment.subject,
      dueDate: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '',
      maxMarks: assignment.max_marks || 100
    });
    setEditingId(assignment.id);
    setIsEditingAssignment(true);
    setShowCreateModal(true);
  };

  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setLoading(true); // Re-using loading state for modal content might be tricky if it hides whole page. Better use local loading or just checkingPlagiarism equivalent.
    // Let's use a specific loading state for this or just rely on async
    try {
      const data = await facultyService.getAssignmentSubmissions(assignment.id);
      setSubmissionsList(data.submissions || []);
      setShowSubmissionsModal(true);
    } catch (err) {
      showErrorToast(err, setToast);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newAssignment.title || !newAssignment.description || !newAssignment.subject || !newAssignment.dueDate) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    try {
      // Convert date string to ISO format for backend
      const assignmentData = {
        ...newAssignment,
        dueDate: new Date(newAssignment.dueDate).toISOString()
      };
      

      
      if (isEditingAssignment) {
        await facultyService.updateAssignment(editingId, assignmentData);
        setToast({ message: 'Assignment updated successfully!', type: 'success' });
      } else {
        await facultyService.createAssignment(assignmentData);
        setToast({ message: 'Assignment created successfully!', type: 'success' });
      }
      
      setShowCreateModal(false);
      setNewAssignment({ title: '', description: '', subject: '', dueDate: '', maxMarks: 100 });
      setIsEditingAssignment(false);
      setEditingId(null);
      fetchAssignments();
    } catch (err) {
      showErrorToast(err, setToast);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    setSubmitting(true);
    try {
      if (gradingData.autoGrade) {
        const result = await facultyService.autoGradeSubmission(submissionId);
        setToast({ message: 'Assignment auto-graded successfully!', type: 'success' });
      } else {
        // Manual grading
        if (!gradingData.grade || !gradingData.feedback) {
          setToast({ message: 'Please provide both grade and feedback', type: 'error' });
          return;
        }
        const result = await facultyService.manualGradeSubmission(
          submissionId,
          parseFloat(gradingData.grade),
          gradingData.feedback
        );
        setToast({ message: 'Grade saved successfully!', type: 'success' });
      }
      setShowGradeModal(false);
      setGradingData({ grade: '', feedback: '', autoGrade: false });
      fetchAssignments();
    } catch (err) {
      showErrorToast(err, setToast);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment? This will strictly delete all student submissions associated with it and cannot be undone.")) {
      return;
    }

    setSubmitting(true);
    try {
      await facultyService.deleteAssignment(assignmentId);
      setToast({ message: 'Assignment deleted successfully', type: 'success' });
      fetchAssignments();
    } catch (err) {
      showErrorToast(err, setToast);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'submitted': return 'bg-neon-blue/20 text-neon-blue border-neon-blue/30';
      case 'graded': return 'bg-emerald-DEFAULT/20 text-emerald-DEFAULT border-emerald-DEFAULT/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getGradeColor = (grade, maxGrade) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-emerald-DEFAULT';
    if (percentage >= 80) return 'text-neon-blue';
    if (percentage >= 70) return 'text-amber-500';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="glass-card rounded-card-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-white mb-2">Error Loading Assignments</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchAssignments}
            className="px-4 py-2 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
              <BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-neon-blue" />
              <span className="break-words">{viewMode === 'teacher' ? 'Assignment Management' : 'My Assignments'}</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              {viewMode === 'teacher' 
                ? 'Create, manage, and grade student assignments'
                : 'Track and submit your assignments'}
            </p>
          </div>
          {viewMode === 'teacher' && (
            <button
              onClick={() => {
                setIsEditingAssignment(false);
                setNewAssignment({ title: '', description: '', subject: '', dueDate: '', maxMarks: 100 });
                setShowCreateModal(true);
              }}
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-card",
                "bg-gradient-to-r from-neon-blue to-emerald-DEFAULT",
                "text-white hover:shadow-neon",
                "transition-all font-medium text-sm sm:text-base",
                "w-full sm:w-auto justify-center"
              )}
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Create Assignment</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
        </div>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="glass-card rounded-card-lg p-12 text-center">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-white mb-2">No Assignments</h3>
          <p className="text-gray-400">
            {viewMode === 'teacher' 
              ? 'Create your first assignment to get started'
              : 'You have no assignments at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="glass-card rounded-card-lg p-6 hover:shadow-neon transition-all group"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  {assignment.subject}
                </span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  getStatusColor(assignment.status)
                )}>
                  {assignment.status}
                </span>
              </div>

              <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors">
                {assignment.title}
              </h3>

              {assignment.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {assignment.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                {assignment.due_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                  </div>
                )}
                {assignment.grade !== null && assignment.grade !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-DEFAULT" />
                    <span className={getGradeColor(assignment.grade, assignment.max_marks || 100)}>
                      Grade: {assignment.grade}/{assignment.max_marks || 100}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-charcoal-light/20">
                {viewMode === 'student' ? (
                  <>
                    {assignment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowHintsPanel(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white text-sm font-medium transition-colors"
                        >
                          <Lightbulb className="h-4 w-4" />
                          Hints
                        </button>
                        <button
                          onClick={() => handleSubmitAssignment(assignment)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white text-sm font-medium transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Submit
                        </button>
                      </>
                    )}
                    {assignment.status === 'submitted' && (
                      <div className="w-full text-center py-2 text-sm text-neon-blue">
                        <span className="animate-pulse">●</span> Awaiting Grade
                      </div>
                    )}
                    {assignment.status === 'graded' && (
                      <button className="w-full py-2 rounded-card bg-emerald-DEFAULT/20 hover:bg-emerald-DEFAULT/30 text-emerald-DEFAULT text-sm font-medium transition-colors">
                        View Feedback
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleViewSubmissions(assignment)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-card bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-sm font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button 
                      onClick={() => handleEditAssignment(assignment)}
                      className="px-3 py-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white text-sm transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="px-3 py-2 rounded-card bg-red-500/20 hover:bg-red-500/30 text-red-500 text-sm transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <SubmitModal
          assignment={selectedAssignment}
          submissionFile={submissionFile}
          submissionText={submissionText}
          setSubmissionFile={setSubmissionFile}
          setSubmissionText={setSubmissionText}
          plagiarismCheck={plagiarismCheck}
          checkingPlagiarism={checkingPlagiarism}
          submitting={submitting}
          onCheckPlagiarism={handleCheckPlagiarism}
          onSubmit={handleConfirmSubmission}
          onClose={() => {
            setShowSubmitModal(false);
            setSelectedAssignment(null);
            setSubmissionFile(null);
            setSubmissionText('');
            setPlagiarismCheck(null);
          }}
        />
      )}

      {/* Create Assignment Modal (Faculty) */}
      {showCreateModal && (
        <CreateAssignmentModal
          newAssignment={newAssignment}
          setNewAssignment={setNewAssignment}
          submitting={submitting}
          onSubmit={handleSaveAssignment}
          onClose={() => {
            setShowCreateModal(false);
            setNewAssignment({ title: '', description: '', subject: '', dueDate: '', maxMarks: 100 });
            setIsEditingAssignment(false);
            setEditingId(null);
          }}
          isEditing={isEditingAssignment}
        />
      )}

      {/* Submissions List Modal */}
      {showSubmissionsModal && (
        <SubmissionsListModal
          submissions={submissionsList}
          assignment={selectedAssignment}
          onClose={() => {
            setShowSubmissionsModal(false);
            setSelectedAssignment(null);
            setSubmissionsList([]);
          }}
          onGrade={handleGradeSubmission}
        />
      )}

      {/* AI Hints Panel */}
      {showHintsPanel && selectedAssignment && (
        <AIHintsPanel
          assignmentId={selectedAssignment.id}
          question={selectedAssignment.description || ''}
          context=""
          onClose={() => {
            setShowHintsPanel(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* Toast */}
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

// Submit Modal Component
const SubmitModal = ({
  assignment,
  submissionFile,
  submissionText,
  setSubmissionFile,
  setSubmissionText,
  plagiarismCheck,
  checkingPlagiarism,
  submitting,
  onCheckPlagiarism,
  onSubmit,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="glass-card rounded-card-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-semibold text-white">
            Submit Assignment: {assignment.title}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-charcoal-light/50">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload File (PDF, DOC, TXT)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setSubmissionFile(e.target.files[0])}
              className={cn(
                "w-full px-4 py-3 rounded-card",
                "bg-charcoal-light/50 border border-charcoal-light/30",
                "text-white",
                "focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
              )}
            />
            {submissionFile && (
              <p className="mt-2 text-sm text-gray-400">{submissionFile.name}</p>
            )}
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Enter Text Directly
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your assignment here..."
              className={cn(
                "w-full px-4 py-3 rounded-card",
                "bg-charcoal-light/50 border border-charcoal-light/30",
                "text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-neon-blue/50",
                "resize-none"
              )}
              rows={8}
            />
          </div>

          {/* Plagiarism Check */}
          {plagiarismCheck && (
            <div className={cn(
              "p-4 rounded-card border",
              plagiarismCheck.status === 'safe'
                ? "bg-emerald-DEFAULT/10 border-emerald-DEFAULT/30"
                : "bg-amber-500/10 border-amber-500/30"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">Plagiarism Check</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  plagiarismCheck.status === 'safe'
                    ? "bg-emerald-DEFAULT/20 text-emerald-DEFAULT"
                    : "bg-amber-500/20 text-amber-500"
                )}>
                  {plagiarismCheck.plagiarism_score}% similarity
                </span>
              </div>
              <p className="text-sm text-gray-300">{plagiarismCheck.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCheckPlagiarism}
              disabled={checkingPlagiarism || (!submissionText.trim() && !submissionFile)}
              className={cn(
                "flex-1 py-2 rounded-card font-medium transition-colors",
                "bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {checkingPlagiarism ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Plagiarism'
              )}
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting || (!submissionText.trim() && !submissionFile)}
              className={cn(
                "flex-1 py-2 rounded-card font-medium transition-colors",
                "bg-gradient-to-r from-neon-blue to-emerald-DEFAULT text-white",
                "hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create/Edit Assignment Modal (Faculty)
const CreateAssignmentModal = ({ newAssignment, setNewAssignment, submitting, onSubmit, onClose, isEditing }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="glass-card rounded-card-lg p-6 max-w-2xl w-full animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-semibold text-white">
            {isEditing ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-charcoal-light/50">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              required
              className={cn(
                "w-full px-4 py-3 rounded-card",
                "bg-charcoal-light/50 border border-charcoal-light/30",
                "text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
              )}
              placeholder="Assignment title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              required
              rows={6}
              className={cn(
                "w-full px-4 py-3 rounded-card",
                "bg-charcoal-light/50 border border-charcoal-light/30",
                "text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-neon-blue/50",
                "resize-none"
              )}
              placeholder="Assignment description and requirements"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                required
                className={cn(
                  "w-full px-4 py-3 rounded-card",
                  "bg-charcoal-light/50 border border-charcoal-light/30",
                  "text-white placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                )}
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Marks</label>
              <input
                type="number"
                value={newAssignment.maxMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: parseInt(e.target.value) })}
                required
                min="1"
                className={cn(
                  "w-full px-4 py-3 rounded-card",
                  "bg-charcoal-light/50 border border-charcoal-light/30",
                  "text-white placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
            <input
              type="datetime-local"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              required
              className={cn(
                "w-full px-4 py-3 rounded-card",
                "bg-charcoal-light/50 border border-charcoal-light/30",
                "text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
              )}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "flex-1 py-2 rounded-card font-medium transition-colors",
                "bg-gradient-to-r from-neon-blue to-emerald-DEFAULT text-white",
                "hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                isEditing ? 'Update Assignment' : 'Create Assignment'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Submissions List Modal
const SubmissionsListModal = ({ submissions, assignment, onClose, onGrade }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="glass-card rounded-card-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-heading font-semibold text-white">
              Submissions: {assignment.title}
            </h3>
            <p className="text-sm text-gray-400">
              {submissions.length} total submissions
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-charcoal-light/50">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No submissions found for this assignment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal-light/30">
                  <th className="p-4 text-sm font-medium text-gray-400">Student</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Plagiarism</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Grade</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-charcoal-light/10 hover:bg-charcoal-light/10">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-blue to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                          {sub.student_name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{sub.student_name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        sub.status === 'graded' 
                          ? "bg-emerald-DEFAULT/20 text-emerald-DEFAULT border-emerald-DEFAULT/30"
                          : "bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                      )}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {sub.plagiarism_score ? (
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          sub.plagiarism_score < 20
                            ? "text-emerald-DEFAULT bg-emerald-DEFAULT/10"
                            : "text-amber-500 bg-amber-500/10"
                        )}>
                          {sub.plagiarism_score}%
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {sub.grade !== null ? (
                        <span className="text-emerald-DEFAULT font-medium">{sub.grade}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {sub.file_path && (
                          <button className="p-2 rounded-lg bg-charcoal-light/30 hover:bg-charcoal-light/50 text-neon-blue transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => onGrade(sub.id)}
                          className="px-3 py-1.5 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white text-xs font-medium transition-colors"
                        >
                          {sub.status === 'graded' ? 'Regrade' : 'Grade'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsEnhanced;

