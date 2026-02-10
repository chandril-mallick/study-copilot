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
  CheckCircle,
  Clock,
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { feedbackService } from '../../../services/feedbackService';
import { handleApiError } from '../../../utils/errorHandler';
import Toast from '../../../components/Toast';

const DailyFeedback = () => {
  const [classSessions, setClassSessions] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [rating, setRating] = useState(0);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchClassSessions();
    fetchFeedbackHistory();
  }, []);

  const fetchClassSessions = async () => {
    try {
      const sessions = await feedbackService.getClassSessions();
      setClassSessions(sessions);
    } catch (error) {
      handleApiError(error, setToast);
    }
  };

  const fetchFeedbackHistory = async () => {
    try {
      const history = await feedbackService.getMyFeedback();
      setFeedbackHistory(history);
    } catch (error) {
      handleApiError(error, setToast);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSession) {
      setToast({ show: true, message: 'Please select a class session', type: 'error' });
      return;
    }
    if (rating === 0) {
      setToast({ show: true, message: 'Please provide a rating', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await feedbackService.submitFeedback({
        class_session_id: parseInt(selectedSession),
        rating,
        query: query.trim() || null
      });

      setToast({ show: true, message: 'Feedback submitted successfully!', type: 'success' });
      
      // Reset form
      setSelectedSession('');
      setRating(0);
      setQuery('');
      
      // Refresh data
      fetchClassSessions();
      fetchFeedbackHistory();
    } catch (error) {
      handleApiError(error, setToast);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (currentRating, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 transition-all ${
              star <= currentRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
            onClick={() => interactive && setRating(star)}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Daily Class Feedback</h1>
            <p className="text-gray-300">Share your thoughts and get teacher responses</p>
          </div>
        </div>

        {/* Feedback Submission Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Submit Today's Feedback
            </CardTitle>
            <CardDescription className="text-gray-300">
              Let your teacher know how the class went
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Select Class
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" className="bg-slate-800">Select a class session...</option>
                {classSessions.map((session) => (
                  <option key={session.id} value={session.id} className="bg-slate-800">
                    {session.subject} - {session.topic || 'General'} ({formatDate(session.date)})
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rate the Class
              </label>
              <div className="flex items-center gap-4">
                {renderStars(rating, true)}
                {rating > 0 && (
                  <span className="text-white font-medium">
                    {rating} {rating === 1 ? 'Star' : 'Stars'}
                  </span>
                )}
              </div>
            </div>

            {/* Query/Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Questions or Comments (Optional)
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Share your questions, doubts, or suggestions..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitFeedback}
              disabled={loading || !selectedSession || rating === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feedback History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            Your Feedback History
          </h2>

          {feedbackHistory.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No feedback submitted yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Submit your first feedback to see it here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {feedbackHistory.map((feedback) => (
                <Card
                  key={feedback.id}
                  className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          {feedback.subject}
                        </h3>
                        {feedback.topic && (
                          <p className="text-gray-300 text-sm mt-1">{feedback.topic}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(feedback.date)}
                        </p>
                      </div>
                      <Badge
                        variant={feedback.status === 'responded' ? 'success' : 'warning'}
                        className={`${
                          feedback.status === 'responded'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        } flex items-center gap-1`}
                      >
                        {feedback.status === 'responded' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Responded
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">Your Rating:</p>
                      {renderStars(feedback.rating)}
                    </div>

                    {/* Query */}
                    {feedback.query && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Your Question:</p>
                        <p className="text-white">{feedback.query}</p>
                      </div>
                    )}

                    {/* Teacher Response */}
                    {feedback.teacher_response && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <p className="text-sm font-semibold text-green-300">Teacher's Response:</p>
                        </div>
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

export default DailyFeedback;
