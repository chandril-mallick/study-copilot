import React, { useState, useEffect, useCallback } from 'react';
import { qnaService } from '../services/qnaService';
import { authService } from '../services/authService';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  Eye, 
  Clock, 
  Filter, 
  User, 
  CheckCircle2, 
  MoreVertical,
  AlertCircle,
  X,
  Send,
  Hash,
  BookOpen,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Toast from './Toast';

const QnAForum = () => {
  const [activeSubject, setActiveSubject] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  
  // State for Modals
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  
  // Form State
  const [newQuestion, setNewQuestion] = useState({
    title: '', content: '', subject: 'Mathematics', tags: ''
  });
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // Check if service is online first
      const isOnline = await qnaService.checkHealth();
      if (!isOnline) {
        throw new Error('Q&A Forum service is offline');
      }
      
      const data = await qnaService.getQuestions({
        subject: activeSubject !== 'all' ? activeSubject : null,
        search: searchTerm || null
      });
      
      // Ensure data is an array
      setQuestions(Array.isArray(data) ? data : []);
      setConnectionError(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setConnectionError(true);
      
      // Only show fallback data if we have no questions at all
      setQuestions(prev => {
        if (prev.length === 0) {
          return [
            {
              id: 1,
              title: 'How to solve differential equations with separation of variables?',
              content: 'I\'m having trouble understanding the method of separation of variables.',
              subject: 'Mathematics',
              author_name: 'Alex Johnson',
              author_type: 'student',
              votes: 15,
              views: 142,
              is_resolved: true,
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              answers: [],
              tags: ['calculus', 'differential-equations']
            }
          ];
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  }, [activeSubject, searchTerm]);

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    try {
      const data = await qnaService.getSubjects();
      // Format subjects: add 'all' option and ensure proper format
      const formattedSubjects = [
        { id: 'all', name: 'All Topics', count: 0 }
      ];
      
      // Add subjects from API
      if (Array.isArray(data)) {
        data.forEach(sub => {
          if (typeof sub === 'string') {
            formattedSubjects.push({ id: sub, name: sub, count: 0 });
          } else {
            formattedSubjects.push({ id: sub.id || sub.name, name: sub.name || sub.id, count: sub.count || 0 });
          }
        });
      }
      
      // Update 'All Topics' count
      const totalCount = formattedSubjects.reduce((sum, sub) => sum + (sub.count || 0), 0);
      formattedSubjects[0].count = totalCount;
      
      setSubjects(formattedSubjects);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      // Fallback subjects
      setSubjects([
        { id: 'all', name: 'All Topics', count: 0 },
        { id: 'Mathematics', name: 'Mathematics', count: 0 },
        { id: 'Physics', name: 'Physics', count: 0 },
        { id: 'Chemistry', name: 'Chemistry', count: 0 },
        { id: 'Computer Science', name: 'Computer Science', count: 0 }
      ]);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Handle question submission
  const handleSubmitQuestion = async () => {
    if (!newQuestion.title || !newQuestion.content) {
      alert('Please fill in both title and content');
      return;
    }

    setSubmitting(true);
    try {
      await qnaService.createQuestion({
        title: newQuestion.title,
        content: newQuestion.content,
        subject: newQuestion.subject,
        authorName: authService.getCurrentUser()?.name || authService.getCurrentUser()?.email?.split('@')[0] || 'User',
        authorType: authService.getCurrentUser()?.role || 'student',
        tags: newQuestion.tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setConnectionError(false);
      await fetchQuestions();
      await fetchSubjects(); // Refresh subjects to update counts
      setShowNewQuestionModal(false);
      setNewQuestion({ title: '', content: '', subject: 'Mathematics', tags: '' });
      setToast({ message: 'Question posted successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to create question:', err);
      const errorMessage = err.message || 'Failed to create question. Please try again.';
      if (errorMessage.includes('Network error') || errorMessage.includes('offline')) {
        setConnectionError(true);
        alert('Q&A Forum service is offline. Please check your connection and try again.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle opening answer modal - fetch full question details
  const handleOpenAnswerModal = async (question) => {
    setSelectedQuestion(question);
    setShowAnswerModal(true);
    setLoadingQuestion(true);
    try {
      // Fetch full question details with all answers
      const fullQuestion = await qnaService.getQuestion(question.id);
      setSelectedQuestion(fullQuestion);
      setConnectionError(false);
    } catch (err) {
      console.error('Failed to load question details:', err);
      // Keep the question from list if fetch fails
      const errorMessage = err.message || 'Failed to load question details.';
      if (errorMessage.includes('Network error') || errorMessage.includes('offline')) {
        setConnectionError(true);
        setToast({ message: 'Q&A Forum service is offline. Showing cached data.', type: 'warning' });
      }
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !selectedQuestion) {
      setToast({ message: 'Please enter an answer', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await qnaService.createAnswer(selectedQuestion.id, {
        content: newAnswer.trim(),
        authorName: authService.getCurrentUser()?.name || authService.getCurrentUser()?.email?.split('@')[0] || 'User',
        authorType: authService.getCurrentUser()?.role || 'student'
      });
      setConnectionError(false);
      // Refresh the question to show new answer
      const updatedQuestion = await qnaService.getQuestion(selectedQuestion.id);
      setSelectedQuestion(updatedQuestion);
      setNewAnswer('');
      await fetchQuestions(); // Refresh list
      setToast({ message: 'Answer posted successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to post answer:', err);
      const errorMessage = err.message || 'Failed to post answer. Please try again.';
      if (errorMessage.includes('Network error') || errorMessage.includes('offline')) {
        setConnectionError(true);
        setToast({ message: 'Q&A Forum service is offline. Please check your connection and try again.', type: 'error' });
      } else {
        setToast({ message: errorMessage, type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(q => 
    (activeSubject === 'all' || q.subject === activeSubject) &&
    (q.title.toLowerCase().includes(searchTerm.toLowerCase()) || q.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Physics': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Computer Science': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full opacity-50 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
             <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Community Forum</h2>
             <div className="flex items-center gap-2">
                {connectionError ? (
                    <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200 flex gap-1">
                        <AlertCircle className="w-3 h-3" /> Offline Mode
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 flex gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live
                    </Badge>
                )}
                {connectionError && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchQuestions}
                        className="text-xs"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                    </Button>
                )}
             </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Collaborate, ask questions, and share knowledge with peers and faculty.</p>
        </div>

        <Button 
            onClick={() => setShowNewQuestionModal(true)}
            className="relative z-10 shadow-lg shadow-blue-200 dark:shadow-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-xl transition-all hover:scale-105"
        >
            <Plus className="w-5 h-5 mr-2" /> Ask Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Sidebar / Filters */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search questions..." 
                        className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 px-1">
                    <Filter className="w-4 h-4" /> Topics
                </h3>
                <div className="space-y-1">
                    {subjects.map((sub, index) => {
                      const subjectId = typeof sub === 'string' ? sub : (sub.id || sub.name || `subject-${index}`);
                      const subjectName = typeof sub === 'string' ? sub : (sub.name || sub.id || 'Unknown');
                      const subjectCount = typeof sub === 'object' ? (sub.count || 0) : 0;
                      
                      return (
                        <button
                            key={subjectId}
                            onClick={() => setActiveSubject(subjectId)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeSubject === subjectId 
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{subjectName}</span>
                                {subjectCount > 0 && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeSubject === subjectId ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                      {subjectCount}
                                  </span>
                                )}
                            </div>
                        </button>
                      );
                    })}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Top Contributor</h3>
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-white/30">
                        <AvatarFallback className="bg-white/20 text-white">JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">Jane Doe</div>
                        <div className="text-xs text-indigo-100">Physics Major</div>
                    </div>
                </div>
                <div className="flex justify-between text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="font-bold text-xl">42</div>
                        <div className="text-indigo-200 text-xs">Answers</div>
                    </div>
                    <div className="text-center border-l border-white/20 pl-4">
                        <div className="font-bold text-xl">1.2k</div>
                        <div className="text-indigo-200 text-xs">Points</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Questions Feed */}
        <div className="lg:col-span-3 space-y-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                     <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                     <p className="text-gray-500">Loading community discussions...</p>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No questions found</h3>
                    <p className="text-gray-500 mb-4">Be the first to ask about this topic!</p>
                    <Button onClick={() => setShowNewQuestionModal(true)} variant="outline">Ask a Question</Button>
                </div>
            ) : (
                filteredQuestions.map(q => (
                    <Card key={q.id} className="hover:shadow-md transition-shadow duration-200 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2 mr-4 sm:mr-0 min-w-[60px]">
                                    <div className="flex sm:flex-col items-center gap-1 sm:gap-0 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 min-w-[50px]">
                                        <ThumbsUp className="w-4 h-4 text-gray-400 mb-0 sm:mb-1" />
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{q.votes}</span>
                                    </div>
                                    <div className={`flex sm:flex-col items-center p-2 rounded-lg min-w-[50px] ${q.is_resolved ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                        <CheckCircle2 className={`w-4 h-4 mb-0 sm:mb-1 ${q.is_resolved ? 'text-green-600' : 'text-gray-400'}`} />
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSubjectColor(q.subject)}`}>
                                            {q.subject}
                                        </span>
                                        {q.tags?.map((t, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                                                <Hash className="w-3 h-3" /> {t}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 
                                        className="text-lg font-bold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                        onClick={() => handleOpenAnswerModal(q)}
                                    >
                                        {q.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
                                        {q.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">{q.author_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {q.author_name} • <span className="capitalize">{q.author_type}</span>
                                            </span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(q.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {q.answers?.length || 0} answers</span>
                                                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {q.views || 0}</span>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                                                onClick={() => handleOpenAnswerModal(q)}
                                            >
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                Answer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
      </div>

      {/* New Question Modal */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ask the Community</h3>
                    <button onClick={() => setShowNewQuestionModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <Input value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} placeholder="e.g., How does photosynthesis work?" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                            <select 
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={newQuestion.subject} onChange={e => setNewQuestion({...newQuestion, subject: e.target.value})}
                            >
                                <option>Mathematics</option><option>Physics</option><option>Computer Science</option><option>Chemistry</option><option>Biology</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                             <Input value={newQuestion.tags} onChange={e => setNewQuestion({...newQuestion, tags: e.target.value})} placeholder="comma, separated" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea 
                            className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={newQuestion.content} onChange={e => setNewQuestion({...newQuestion, content: e.target.value})} 
                            placeholder="Describe your question in detail..."
                        />
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowNewQuestionModal(false)}>Cancel</Button>
                    <Button onClick={handleSubmitQuestion} className="bg-blue-600 hover:bg-blue-700">Post Question</Button>
                </div>
            </div>
        </div>
      )}

      {/* Answer Modal */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
             <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-900/50 rounded-t-2xl">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{selectedQuestion.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                             <span className="font-medium text-blue-600">{selectedQuestion.author_name}</span>
                             <span>•</span>
                             <span>{new Date(selectedQuestion.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <button onClick={() => setShowAnswerModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                
                <ScrollArea className="flex-1 p-6">
                    {loadingQuestion ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading question details...</span>
                        </div>
                    ) : (
                        <>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                                {selectedQuestion.content}
                            </div>

                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Answers <Badge variant="secondary">{selectedQuestion.answers?.length || 0}</Badge>
                            </h4>

                            <div className="space-y-6 mb-6">
                                {!selectedQuestion.answers || selectedQuestion.answers.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 italic bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p>No answers yet. Be the first to help!</p>
                                    </div>
                                ) : (
                                    selectedQuestion.answers.map(ans => (
                                        <div key={ans.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="bg-green-100 text-green-700 text-xs font-bold">
                                                            {ans.author_name?.charAt(0)?.toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <span className="font-semibold text-sm text-gray-900 dark:text-white block">{ans.author_name}</span>
                                                        <Badge variant="outline" className="text-[10px] h-4 mt-1">{ans.author_type}</Badge>
                                                    </div>
                                                </div>
                                                {ans.is_accepted && (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Accepted Answer
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 pl-11 leading-relaxed whitespace-pre-wrap">
                                                {ans.content}
                                            </div>
                                            {ans.created_at && (
                                                <div className="text-xs text-gray-400 mt-3 pl-11 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(ans.created_at).toLocaleDateString()} at {new Date(ans.created_at).toLocaleTimeString()}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {!loadingQuestion && (
                        <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Post Your Answer</label>
                            </div>
                            <textarea 
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={5}
                                placeholder="Share your knowledge and help others... (Be clear, detailed, and respectful)"
                                disabled={submitting}
                            />
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-gray-400">
                                    {newAnswer.length} characters
                                </span>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            setShowAnswerModal(false);
                                            setNewAnswer('');
                                        }}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSubmitAnswer}
                                        disabled={!newAnswer.trim() || submitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Post Answer
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
      )}

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

export default QnAForum;
