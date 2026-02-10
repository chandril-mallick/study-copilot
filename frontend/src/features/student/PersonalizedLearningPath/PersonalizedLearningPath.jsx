import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ArrowRight, 
  Target, 
  BookOpen,
  Trophy,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  Clock,
  Loader2
} from 'lucide-react';
import { studentService } from '../../../services/studentService';
import { handleApiError } from '../../../utils/errorHandler';
import Toast from '../../../components/Toast';

const PersonalizedLearningPath = ({ onNavigate }) => {
  const [activeWeek, setActiveWeek] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [toast, setToast] = useState(null);

  // Fetch learning path data
  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getLearningPath();
      setWeeklyPlan(data.weekly_plan || []);
      setWeakTopics(data.weak_topics || []);
      setOverallProgress(data.overall_progress || 0);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced AI Insights based on weak topics
  const aiInsights = [
    {
      id: 1,
      type: "prediction",
      message: "You're likely to struggle with 'Backpropagation Math' based on your recent quiz scores in Calculus.",
      icon: BrainCircuit,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
    },
    {
      id: 2,
      type: "suggestion",
      message: "Revision recommended: Standard Deviations. It's a prerequisite for next week's 'Gaussian Distributions'.",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20"
    }
  ];

  // Transform API data to match UI format
  const transformedWeeklyPlan = weeklyPlan.map((week, index) => ({
    week: week.week || index + 1,
    title: week.topic || `Week ${week.week || index + 1}`,
    status: week.status === 'completed' ? 'completed' : 
            week.status === 'in_progress' ? 'current' : 
            week.progress === 0 ? 'upcoming' : 'current',
    completion: week.progress || 0,
    topics: week.topics || [week.topic || 'Topic'],
    confidence: week.confidence || Math.min(week.progress || 0, 100),
    summary: week.summary || `Progress: ${week.progress || 0}%`
  }));

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your personalized learning path...</p>
        </div>
      </div>
    );
  }

  if (error && !weeklyPlan.length) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Learning Path</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchLearningPath}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6 space-y-8 overflow-y-auto max-w-7xl mx-auto bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-3">
              <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </span>
              Personalized Learning Path
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Your AI-curated roadmap to mastery, updated weekly based on your performance.
            </p>
          </div>
          
          <Badge
  variant="outline"
  className="hidden md:flex px-4 py-2 gap-2 text-sm font-medium
             backdrop-blur-md
             bg-emerald-500/10 text-emerald-600
             border-emerald-400/40
             dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/30"
>
  <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
  <span>AI Status: Active</span>
</Badge>

        </div>
        
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[{
            icon: Clock,
            title: "Start Smart",
            desc: "Saves time by focusing only on what you need.",
            color: "blue"
          }, {
            icon: BrainCircuit,
            title: "AI Adaptive",
            desc: "Reorders lessons dynamically as you improve.",
            color: "purple"
          }, {
            icon: TrendingUp,
            title: "Track Growth",
            desc: "Topic-wise tracking with confidence scores.",
            color: "emerald"
          }].map((item, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm
              bg-${item.color}-50/50 border-${item.color}-100 dark:bg-${item.color}-900/10 dark:border-${item.color}-800`}>
              <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${item.color}-600 dark:text-${item.color}-400`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Weekly Schedule</h2>
      <Badge
  variant="outline"
  className="px-3 py-1 text-sm font-medium
             bg-blue-500/10 text-blue-600
             border-blue-400/40
             dark:bg-blue-400/10 dark:text-blue-400"
>
  Week {activeWeek} of 12
</Badge>

          </div>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.75rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-gray-300 before:to-transparent z-0">
            {transformedWeeklyPlan.map((week, index) => (
              <div key={week.week} className={`relative flex items-center md:items-start flex-col md:flex-row gap-6 ${week.status === 'locked' ? 'opacity-60' : ''}`}>
                
                {/* Date/Week Label (Desktop) */}
                <div className="hidden md:flex flex-col items-end w-24 pt-2 text-right shrink-0">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">Week {week.week}</span>
                  <span className="block text-xs text-gray-500 capitalize">{week.status.replace('-', ' ')}</span>
                </div>

                {/* Visual Timeline Marker */}
                <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-100 dark:border-gray-800 z-10">
                  {week.status === 'completed' ? (
                    <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : week.status === 'current' ? (
                    <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse">
                      <Target className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Card Content */}
                <Card className={`flex-1 w-full transition-all duration-300 hover:shadow-lg ${week.status === 'current' ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{week.title}</CardTitle>
                        <CardDescription className="mt-1">{week.summary}</CardDescription>
                      </div>
                      {week.status === 'completed' && <Badge className="bg-green-500">Done</Badge>}
                      {week.status === 'current' && <Badge className="bg-blue-600">In Progress</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {week.topics.map((topic, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Progress Bar or Confidence */}
                      {week.status !== 'locked' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Completion</span>
                            <span>{week.completion}%</span>
                          </div>
                          <Progress value={week.completion} className="h-2" />
                        </div>
                      )}

                      {(week.status === 'completed' || week.status === 'current') && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          AI Confidence Score: <span className="font-bold">{week.confidence}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: AI Insights & Weak Areas */}
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-700 delay-200">
          <Card className="overflow-hidden border-none shadow-xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 opacity-95" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                AI Tutor Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm leading-relaxed text-blue-50 hover:bg-white/20 transition-colors cursor-pointer group">
                  <p className="flex gap-3">
                    <insight.icon className="w-5 h-5 shrink-0 mt-0.5 text-yellow-300 group-hover:scale-110 transition-transform" />
                    {insight.message}
                  </p>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10">
               <Button

               onClick={() => onNavigate && onNavigate('chat')}
               className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.03] shadow-xl shadow-cyan-500/30 transition-all font-bold group relative overflow-hidden"
                 >

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    Ask AI Tutor for Help
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Topic Mastery
              </CardTitle>
              <CardDescription>Areas requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(weakTopics.length > 0 ? weakTopics : [
                { topic: "Calculus (Gradients)", score: 45, priority: "high" },
                { topic: "Python OOP", score: 68, priority: "medium" },
                { name: "Data Structures", score: 92, priority: "low" }
              ]).map((topic, i) => {
                const topicName = topic.topic || topic.name || 'Topic';
                const score = topic.score || 0;
                const priority = topic.priority || (score < 50 ? 'high' : score < 75 ? 'medium' : 'low');
                const status = priority === 'high' ? 'Weak' : priority === 'medium' ? 'Moderate' : 'Strong';
                const color = priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'green';
                return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{topicName}</span>
                    <Badge variant="secondary" className={`text-${color}-600 bg-${color}-100 dark:bg-${color}-900/30`}>
                      {status}
                    </Badge>
                  </div>
                  <Progress value={score} className={`h-2 bg-${color}-100 [&>div]:bg-${color}-500`} />
                </div>
              );
              })}
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-xl shadow-lg flex items-center gap-4 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar className="w-24 h-24 rotate-12" />
             </div>
             
             <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
               <Calendar className="w-6 h-6 text-white" />
             </div>
             <div className="relative z-10">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Upcoming</p>
                <p className="font-bold text-lg">Mid-Term Assessment</p>
                <p className="text-xs text-gray-300 mt-1">In 2 weeks • Covers Weeks 1-4</p>
             </div>
          </div>
        </div>
      </div>

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

export default PersonalizedLearningPath;
