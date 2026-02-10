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
  MessageSquare,
  Star,
  Send,
  Filter,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { feedbackService } from '../../../services/feedbackService';
import { handleApiError } from '../../../utils/errorHandler';
import Toast from '../../../components/Toast';

const StudentFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, responded
  const [responseText, setResponseText] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Class session creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    subject: '',
    topic: '',
    date: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [selectedDate, subjectFilter]);

  const fetchFeedback = async () => {
    try {
      const data = await feedbackService.getDailyFeedback(selectedDate, subjectFilter);
      setFeedbacks(data);
    } catch (error) {
      handleApiError(error, setToast);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await feedbackService.getFeedbackStats(selectedDate);
      setStats(statsData);
    } catch (error) {
      handleApiError(error, setToast);
    }
  };

  const handleRespondToFeedback = async (feedbackId) => {
    const response = responseText[feedbackId];
    if (!response || !response.trim()) {
      setToast({ show: true, message: 'Please enter a response', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await feedbackService.respondToFeedback(feedbackId, response);
      setToast({ show: true, message: 'Response submitted successfully!', type: 'success' });
      
      // Clear response text
      setResponseText({ ...responseText, [feedbackId]: '' });
      
      // Refresh data
      fetchFeedback();
      fetchStats();
    } catch (error) {
      handleApiError(error, setToast);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (statusFilter === 'all') return true;
    return feedback.status === statusFilter;
  });

  const uniqueSubjects = [...new Set(feedbacks.map(f => f.subject))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Student Feedback</h1>
            <p className="text-gray-300">View and respond to student queries</p>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Feedback</p>
                    <p className="text-3xl font-bold text-white">{stats.total_feedback}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-white">{stats.pending_feedback}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Responded</p>
                    <p className="text-3xl font-bold text-white">{stats.responded_feedback}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold text-white">{stats.average_rating.toFixed(1)}</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-purple-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Subject
                </label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" className="bg-slate-800">All Subjects</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject} className="bg-slate-800">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="responded" className="bg-slate-800">Responded</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Student Feedback ({filteredFeedbacks.length})
          </h2>

          {filteredFeedbacks.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No feedback found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters or check a different date
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredFeedbacks.map((feedback) => (
                <Card
                  key={feedback.id}
                  className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all"
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {feedback.student_name}
                          </h3>
                          {feedback.student_enrollment && (
                            <Badge variant="outline" className="bg-white/10 text-gray-300 border-white/20">
                              {feedback.student_enrollment}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {feedback.subject}
                          </span>
                          {feedback.topic && (
                            <span>• {feedback.topic}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(feedback.submitted_at)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={feedback.status === 'responded' ? 'success' : 'warning'}
                        className={`${
                          feedback.status === 'responded'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}
                      >
                        {feedback.status === 'responded' ? 'Responded' : 'Pending'}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Student Rating:</p>
                      {renderStars(feedback.rating)}
                    </div>

                    {/* Query */}
                    {feedback.query && (
                      <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400 mb-2">Student's Question:</p>
                        <p className="text-white">{feedback.query}</p>
                      </div>
                    )}

                    {/* Response Section */}
                    {feedback.status === 'pending' ? (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white">Your Response:</label>
                        <textarea
                          value={responseText[feedback.id] || ''}
                          onChange={(e) =>
                            setResponseText({ ...responseText, [feedback.id]: e.target.value })
                          }
                          placeholder="Type your response to the student..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                        <Button
                          onClick={() => handleRespondToFeedback(feedback.id)}
                          disabled={loading || !responseText[feedback.id]?.trim()}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                        <p className="text-sm font-semibold text-green-300 mb-2">Your Response:</p>
                        <p className="text-white">{feedback.teacher_response}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Responded on {formatDate(feedback.responded_at)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default StudentFeedback;
