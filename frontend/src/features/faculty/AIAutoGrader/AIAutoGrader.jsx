import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  GraduationCap,
  Loader2,
  Sparkles,
  Trash2
} from 'lucide-react';
import { facultyService } from '../../../services/facultyService';

const AIAutoGrader = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeOverride, setGradeOverride] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getPendingSubmissions();
      const mapped = data.pending_submissions.map(s => ({
        id: s.submission_id,
        student: `Student ${s.student_id}`,
        assignment: s.assignment_title,
        submittedAt: new Date(s.submitted_at).toLocaleDateString(),
        status: "Pending Review",
        content: "Loading content...",
        aiScore: null,
        feedback: [],
        fullFeedback: ""
      }));
      setSubmissions(mapped);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGrade = async () => {
    if (!selectedSubmission) return;
    setGrading(true);
    try {
      const result = await facultyService.autoGradeSubmission(selectedSubmission.id);

      const updatedSub = {
        ...selectedSubmission,
        aiScore: result.grade,
        status: "Graded",
        fullFeedback: result.feedback
      };

      setSelectedSubmission(updatedSub);
      setSubmissions(prev =>
        prev.map(s => s.id === result.submission_id ? updatedSub : s)
      );
    } catch (err) {
      alert("Auto-grading failed: " + err.message);
    } finally {
      setGrading(false);
    }
  };

  const approveGrade = (sub) => {
    alert(`Grade ${sub.aiScore} approved!`);
  };

  const handleDeleteSubmission = async (id) => {
      if(!window.confirm("Are you sure you want to delete this submission?")) return;
      
      try {
          await facultyService.deleteSubmission(id);
          setSubmissions(prev => prev.filter(s => s.id !== id));
          if (selectedSubmission?.id === id) {
              setSelectedSubmission(null);
          }
      } catch (err) {
          alert("Failed to delete submission: " + err.message);
      }
  };

  const getScoreColor = (score) => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            AI Auto-Grader
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-400/30">
              Faculty Tool
            </Badge>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mt-1">
            Review, adjust, and approve AI-generated grades with human oversight.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchSubmissions}>
          Refresh
        </Button>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

        {/* ===== SUBMISSION LIST ===== */}
        <Card className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b">
            <CardTitle className="text-lg">
              Submissions ({submissions.length})
            </CardTitle>
          </CardHeader>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading && (
              <div className="p-6 text-center text-gray-400">Loading...</div>
            )}

            {!loading && submissions.map(sub => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  selectedSubmission?.id === sub.id
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-500/40 shadow-sm"
                    : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {sub.student}
                  </span>
                  <span className={`font-bold ${getScoreColor(sub.aiScore)}`}>
                    {sub.aiScore !== null ? `${sub.aiScore}%` : "-"}
                  </span>
                </div>

                <div className="text-sm text-gray-500 truncate mb-2">
                  {sub.assignment}
                </div>

                <div className="flex justify-between items-center">
                  <Badge
                    className={`text-[10px] ${
                      sub.status === "Graded"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/30"
                        : "bg-amber-500/10 text-amber-600 border-amber-400/30"
                    }`}
                  >
                    {sub.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {sub.submittedAt}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(sub.id);
                        }}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && submissions.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                No pending submissions found.
              </div>
            )}
          </div>
        </Card>

        {/* ===== DETAILED REVIEW ===== */}
        {selectedSubmission ? (
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <Card className="flex-1 flex flex-col rounded-xl border border-gray-200 dark:border-gray-800">

              {/* HEADER */}
              <CardHeader className="border-b flex flex-row justify-between items-center">
                <div>
                  <CardTitle>{selectedSubmission.assignment}</CardTitle>
                  <CardDescription>
                    Submitted by {selectedSubmission.student}
                  </CardDescription>
                </div>

                <div className="text-right bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase">
                    AI Suggested Score
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedSubmission.aiScore)}`}>
                    {gradeOverride ?? selectedSubmission.aiScore ?? "-"} / 100
                  </div>
                </div>
              </CardHeader>

              {/* BODY */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">

                {/* CONTENT */}
                <div className="border-r overflow-y-auto p-6 bg-white dark:bg-gray-950 font-mono text-sm leading-relaxed">
                  The Goblin Rebellions were a series of rebellions by goblins
                  against wizarding oppression...
                </div>

                {/* AI PANEL */}
                <div className="flex flex-col overflow-y-auto p-6 bg-white dark:bg-gray-900">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    AI Evaluation Summary
                  </h3>

                  {!selectedSubmission.aiScore ? (
                    <div className="text-center mt-10">
                      <p className="text-gray-500 mb-4">
                        No analysis available yet.
                      </p>
                      <Button
                        onClick={handleAutoGrade}
                        disabled={grading}
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                      >
                        {grading
                          ? <Loader2 className="animate-spin w-4 h-4" />
                          : <Sparkles className="w-4 h-4 text-yellow-300" />
                        }
                        {grading ? "Analyzing…" : "Run AI Auto-Grader"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-500/20 text-sm whitespace-pre-wrap">
                        {selectedSubmission.fullFeedback}
                      </div>

                      <div className="mt-auto space-y-4 pt-6">
                        <div>
                          <label className="text-sm font-medium">
                            Adjust Grade
                          </label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setGradeOverride(Math.max(0, (gradeOverride ?? selectedSubmission.aiScore) - 5))
                              }
                            >
                              -5
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setGradeOverride(Math.min(100, (gradeOverride ?? selectedSubmission.aiScore) + 5))
                              }
                            >
                              +5
                            </Button>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md"
                          onClick={() => approveGrade(selectedSubmission)}
                        >
                          Approve & Finalize Grade
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-700">
            <div className="text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              Select a submission to review
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAutoGrader;
