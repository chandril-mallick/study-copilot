import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart2,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  X,
  Loader2,
  BookOpen,
  ClipboardCheck,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { facultyService } from '../../../services/facultyService';

// ── Create / Edit Assignment Modal ─────────────────────────────────────────────
const CreateAssignmentModal = ({ isEditing, data, setData, submitting, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 max-w-lg w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            {isEditing ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
              placeholder="e.g. Week 5 - Data Structures Quiz"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              required
              rows={4}
              placeholder="Describe the assignment requirements..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Subject + Max Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={data.subject}
                onChange={(e) => setData({ ...data, subject: e.target.value })}
                required
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Marks</label>
              <input
                type="number"
                value={data.maxMarks}
                onChange={(e) => setData({ ...data, maxMarks: parseInt(e.target.value) || 100 })}
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date & Time <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              value={data.dueDate}
              onChange={(e) => setData({ ...data, dueDate: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                "disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
              )}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {isEditing ? 'Saving...' : 'Creating...'}</>
              ) : (
                <>{isEditing ? 'Save Changes' : 'Create Assignment'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete Confirmation Modal ──────────────────────────────────────────────────
const DeleteConfirmModal = ({ assignment, onConfirm, onClose, submitting }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in text-center">
      <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Assignment?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        You're about to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{assignment.title}"</span>.
      </p>
      <p className="text-xs text-red-500 mb-6">This will also delete all student submissions and cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ── Toast ──────────────────────────────────────────────────────────────────────
const SimpleToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-indigo-600',
  };
  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl',
      colors[type] || colors.info
    )}>
      {message}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const FacultyDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const emptyForm = { title: '', description: '', subject: '', dueDate: '', maxMarks: 100 };
  const [formData, setFormData] = useState(emptyForm);

  const atRiskStudents = [
    { id: 1, name: "David Kim", risk: "High", reason: "Missed 3 assignments", score: 45 },
    { id: 2, name: "Sarah Jenkins", risk: "Medium", reason: "Declining quiz scores", score: 62 },
  ];

  // ── Fetch assignments ───────────────────────────────────────────────────────
  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const response = await facultyService.getAssignments();
      setAssignments(response.assignments || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setToast({ message: 'Failed to load assignments', type: 'error' });
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ── Create / Edit submit ────────────────────────────────────────────────────
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.subject || !formData.dueDate) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData, dueDate: new Date(formData.dueDate).toISOString() };
      if (isEditing) {
        await facultyService.updateAssignment(editingId, payload);
        setToast({ message: 'Assignment updated successfully!', type: 'success' });
      } else {
        await facultyService.createAssignment(payload);
        setToast({ message: 'Assignment created successfully!', type: 'success' });
      }
      setShowCreate(false);
      setFormData(emptyForm);
      setIsEditing(false);
      setEditingId(null);
      fetchAssignments();
    } catch (err) {
      setToast({ message: err?.response?.data?.detail || 'Action failed. Try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Open Create Modal ───────────────────────────────────────────────────────
  const openCreateModal = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setEditingId(null);
    setShowCreate(true);
  };

  // ── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEditModal = (a) => {
    setFormData({
      title: a.title,
      description: a.description || '',
      subject: a.subject,
      dueDate: a.due_date ? new Date(a.due_date).toISOString().slice(0, 16) : '',
      maxMarks: a.max_marks || 100,
    });
    setEditingId(a.id);
    setIsEditing(true);
    setShowCreate(true);
  };

  // ── Open Delete Confirm ─────────────────────────────────────────────────────
  const openDeleteConfirm = (a) => {
    setAssignmentToDelete(a);
    setShowDeleteConfirm(true);
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!assignmentToDelete) return;
    setSubmitting(true);
    try {
      await facultyService.deleteAssignment(assignmentToDelete.id);
      setToast({ message: 'Assignment deleted successfully', type: 'success' });
      setShowDeleteConfirm(false);
      setAssignmentToDelete(null);
      fetchAssignments();
    } catch (err) {
      setToast({ message: err?.response?.data?.detail || 'Delete failed. Try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full p-4 md:p-6 space-y-6 overflow-y-auto">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Dashboard</h2>
          <p className="text-gray-500">Real-time insights into student performance and course health.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Last updated: Just now</span>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" /> Download Report
          </Button>
          {/* ── PRIMARY CTA ── */}
          <button
            id="create-assignment-btn"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +2.1% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+ (87%)</div>
            <p className="text-xs text-muted-foreground">Top 10% compared to dept.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8 Students</div>
            <p className="text-xs text-muted-foreground">Needs immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* ── MY ASSIGNMENTS ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-500" />
              My Assignments
            </CardTitle>
            <CardDescription>Manage assignments you've created</CardDescription>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" /> Create
          </button>
        </CardHeader>
        <CardContent>
          {loadingAssignments ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading assignments…</span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No assignments yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">Create your first assignment to get started</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> Create Assignment
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="col-span-4">Title</span>
                <span className="col-span-2">Subject</span>
                <span className="col-span-2">Due Date</span>
                <span className="col-span-1 text-center">Marks</span>
                <span className="col-span-1 text-center">Submissions</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>

              {/* Rows */}
              {assignments.map((a) => {
                const isPast = a.due_date && new Date(a.due_date) < new Date();
                return (
                  <div
                    key={a.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-3 py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"
                  >
                    <div className="md:col-span-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-medium text-sm text-gray-900 dark:text-white truncate">{a.title}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {a.subject}
                      </span>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className={cn(isPast ? 'text-red-500' : 'text-gray-500')}>
                        {a.due_date ? new Date(a.due_date).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <div className="md:col-span-1 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {a.max_marks ?? 100}
                    </div>
                    <div className="md:col-span-1 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {a.submission_count ?? 0}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <button
                        id={`edit-assignment-${a.id}`}
                        onClick={() => openEditModal(a)}
                        title="Edit Assignment"
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-assignment-${a.id}`}
                        onClick={() => openDeleteConfirm(a)}
                        title="Delete Assignment"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Refresh */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={fetchAssignments}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Chart + At-Risk ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Engagement Trends</CardTitle>
            <CardDescription>Activity vs. Performance over the last 12 weeks</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[260px] w-full bg-gradient-to-t from-gray-50 to-white flex items-end justify-between px-4 pb-4 gap-2 rounded-lg border border-dashed relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <BarChart2 className="w-32 h-32" />
              </div>
              {[40, 65, 55, 80, 75, 90, 85, 70, 60, 75, 88, 92].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Week {i + 1}: {h}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-red-300/40 bg-gradient-to-b from-red-50/40 to-white dark:from-red-950/30 dark:to-neutral-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" /> Early Warning System
            </CardTitle>
            <CardDescription className="text-sm">AI-detected students requiring academic support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {atRiskStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-start justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-red-200/50 dark:border-red-500/20 hover:shadow-md transition-all"
              >
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 border border-red-200 dark:border-red-400/30 shadow-sm">
                    <AvatarFallback className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold">
                      {student.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{student.name}</div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">{student.reason}</div>
                    <div className="text-xs text-gray-400 mt-1">Current Score: <span className="font-medium">{student.score}%</span></div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md">
              Message All At-Risk Students
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Topic Mastery ────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery Breakdown</CardTitle>
          <CardDescription>Where students are struggling vs. excelling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { topic: 'Linear Regression', value: 92, color: 'bg-green-500', label: 'text-green-600' },
              { topic: 'Neural Networks', value: 78, color: 'bg-indigo-500', label: 'text-indigo-600' },
              { topic: 'Backpropagation Math', value: 45, color: 'bg-red-500', label: 'text-red-600' },
            ].map(({ topic, value, color, label }) => (
              <div key={topic} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{topic}</span>
                  <span className={cn('font-bold', label)}>{value}% Mastery{value < 50 ? ' (Critical)' : ''}</span>
                </div>
                <Progress value={value} className="h-2 bg-gray-100" indicatorClassName={color} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {showCreate && (
        <CreateAssignmentModal
          isEditing={isEditing}
          data={formData}
          setData={setFormData}
          submitting={submitting}
          onSubmit={handleSubmitAssignment}
          onClose={() => { setShowCreate(false); setFormData(emptyForm); setIsEditing(false); setEditingId(null); }}
        />
      )}

      {showDeleteConfirm && assignmentToDelete && (
        <DeleteConfirmModal
          assignment={assignmentToDelete}
          onConfirm={handleDelete}
          onClose={() => { setShowDeleteConfirm(false); setAssignmentToDelete(null); }}
          submitting={submitting}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <SimpleToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;
