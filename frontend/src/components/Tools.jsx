import React, { useState } from 'react';
import { 
  PersonalizedLearningPath, 
  AITutorMode, 
  SmartAssignmentAssistant, 
  RevisionEngine, 
  StudyGroupModerator,
  DailyFeedback,
  FutureLaunchPad 
} from '../features/student';

import {
  AIAutoGrader,
  LessonMaterialGenerator,
  FacultyDashboard,
  QuestionBankMaker,
  PlagiarismScanner,
  StudentFeedback
} from '../features/faculty';

import {
  WorkflowAutomation,
  InstitutionBrain,
  RoleInsights,
  SecurityCompliance,
  ScholarshipAutomation,
  AdmissionAutomation
} from '../features/admin';

import {
  DeepFakeDetection,
  CrossDatabaseVerification,
  BatchVerification,
  DocumentTimelineHeatmap
} from '../features/verifier';

import {
  NationalBenchmarking,
  PredictiveInsights,
  AIPolicyGenerator,
  ManagementAnalyticsDashboard
} from '../features/management';

import { 
  ArrowLeft,
  GraduationCap,
  Map,
  Bot,
  Zap,
  RefreshCw,
  Users,
  Briefcase,
  PieChart,
  CheckCircle,
  BookOpen,
  Library,
  ShieldAlert,
  MonitorPlay,
  ScanFace,
  Database,
  Layers,
  TrendingUp,
  Lightbulb,
  FileText,
  BrainCircuit,
  GitBranch,
  UserCheck,
  ShieldCheck,
  BarChart,
  Award,
  UserPlus,
  History,
  MessageSquare
} from 'lucide-react';

const Tools = ({ category, onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const getTitle = () => {
    if (activeFeature) return 'Back to Tools';
    if (category === 'student') return '🎓 Student Tools';
    if (category === 'teacher') return '👨‍🏫 Teacher Tools';
    if (category === 'management') return '🏢 Admin Tools';
    if (category === 'verifier') return '🔍 Verification Suite';
    return '🛠️ Educational Tools';
  }

  // If a feature is active, render it full screen within the tab
  if (activeFeature) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4 bg-gray-50 dark:bg-gray-900">
          <button 
            onClick={() => setActiveFeature(null)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Back to Tools Dashboard</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {/* Student Features */}
          {activeFeature === 'learning-path' && <PersonalizedLearningPath onNavigate={onNavigate} />}
          {activeFeature === 'ai-tutor' && <AITutorMode />}
          {activeFeature === 'assignment-assistant' && <SmartAssignmentAssistant />}
          {activeFeature === 'revision-engine' && <RevisionEngine />}
          {activeFeature === 'study-groups' && <StudyGroupModerator />}
          {activeFeature === 'daily-feedback' && <DailyFeedback />}
          {activeFeature === 'future-launch-pad' && <FutureLaunchPad />}

          {/* Faculty Features */}
          {activeFeature === 'auto-grader' && <AIAutoGrader />}
          {activeFeature === 'lesson-generator' && <LessonMaterialGenerator />}
          {activeFeature === 'faculty-dashboard' && <FacultyDashboard />}
          {activeFeature === 'question-bank' && <QuestionBankMaker />}
          {activeFeature === 'plagiarism-scanner' && <PlagiarismScanner />}
          {activeFeature === 'student-feedback' && <StudentFeedback />}

          {/* Admin Features */}
          {activeFeature === 'workflow-automation' && <WorkflowAutomation />}
          {activeFeature === 'institution-brain' && <InstitutionBrain />}
          {activeFeature === 'role-insights' && <RoleInsights />}
          {activeFeature === 'security-compliance' && <SecurityCompliance />}
          {activeFeature === 'scholarship-automation' && <ScholarshipAutomation />}
          {activeFeature === 'admission-automation' && <AdmissionAutomation />}

          {/* Verifier Features */}
          {activeFeature === 'deepfake-detection' && <DeepFakeDetection />}
          {activeFeature === 'cross-db-verification' && <CrossDatabaseVerification />}
          {activeFeature === 'batch-verification' && <BatchVerification />}
          {activeFeature === 'doc-timeline' && <DocumentTimelineHeatmap />}

          {/* Management Features */}
          {activeFeature === 'national-benchmarking' && <NationalBenchmarking />}
          {activeFeature === 'predictive-insights' && <PredictiveInsights />}
          {activeFeature === 'ai-policy-generator' && <AIPolicyGenerator />}
          {activeFeature === 'management-analytics' && <ManagementAnalyticsDashboard />}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <div className={`bg-gradient-to-r ${category === 'teacher' ? 'from-purple-600 to-indigo-700' : 'from-blue-600 to-indigo-700'} dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 mb-6 transition-colors`}>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{getTitle()}</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Powerful AI-powered tools for {category === 'student' ? 'students' : category === 'teacher' ? 'teachers' : category === 'management' ? 'administrators' : 'everyone'} at Brainware University
            </p>
            <div className="mt-2 text-sm text-green-400 font-mono font-bold bg-white/10 inline-block px-3 py-1 rounded-full border border-white/20">
              ⚡ AI Features v2.1 Active
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${!category ? 'lg:grid-cols-2' : ''} gap-6 mb-6`}>
        
        {/* Student Tools */}
        {(category === 'student' || !category) && (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md">
          {/* Decorative Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                 <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Student AI Suite</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Personalized learning ecosystem powered by GenAI.
                  </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

             {/* Personalized Path */}
             <div
               onClick={() => setActiveFeature('learning-path')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Map className="w-24 h-24 text-emerald-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Map className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                   Personalized Path
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Adaptive weekly study plans that evolve with your performance.
                 </p>
               </div>
             </div>

             {/* AI Tutor Mode */}
             <div
               onClick={() => setActiveFeature('ai-tutor')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Bot className="w-24 h-24 text-blue-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Bot className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                   AI Tutor Mode
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Interactive problem solving with step-by-step logic explanations.
                 </p>
               </div>
             </div>

             {/* Assignment Helper */}
             <div
               onClick={() => setActiveFeature('assignment-assistant')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Zap className="w-24 h-24 text-amber-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                   Assignment Helper
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Plagiarism-safe hints, research guides, and structure suggestions.
                 </p>
               </div>
             </div>

             {/* Revision Engine */}
             <div
               onClick={() => setActiveFeature('revision-engine')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <RefreshCw className="w-24 h-24 text-purple-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <RefreshCw className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                   Revision Engine
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Turn notes into crisp summaries, mind maps, and flashcards instantly.
                 </p>
               </div>
             </div>

             {/* Study Groups */}
             <div
               onClick={() => setActiveFeature('study-groups')}
               className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Users className="w-32 h-32 text-pink-600" />
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Users className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      Study Group Moderator
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                      Find your perfect study squad. Validates skills and matches you with peers at your pace.
                    </p>
                 </div>
               </div>
             </div>

              {/* Daily Feedback */}
              <div
                onClick={() => setActiveFeature('daily-feedback')}
                className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                   <MessageSquare className="w-32 h-32 text-cyan-600" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                     <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                       Daily Class Feedback
                     </h4>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                       Share your thoughts after each class. Rate, ask questions, and get teacher responses.
                     </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        )}

        {/* Teacher Tools */}
        {(category === 'teacher' || !category) && (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md">
          {/* Decorative Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                 <Briefcase className="w-8 h-8" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher AI Suite</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Advanced tools to enhance teaching effectiveness and automate workflows.
                  </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

             {/* Faculty Dashboard */}
             <div
               onClick={() => setActiveFeature('faculty-dashboard')}
               className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <PieChart className="w-32 h-32 text-indigo-600" />
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <PieChart className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Faculty Dashboard
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                      Real-time student insights, at-risk alerts, and class performance tracking.
                    </p>
                 </div>
               </div>
             </div>

             {/* AI Auto Grader */}
             <div
               onClick={() => setActiveFeature('auto-grader')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <CheckCircle className="w-24 h-24 text-pink-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                   AI Auto-Grader
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Automated grading with detailed feedback & scoring.
                 </p>
               </div>
             </div>

             {/* Lesson Generator */}
             <div
               onClick={() => setActiveFeature('lesson-generator')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <MonitorPlay className="w-24 h-24 text-purple-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MonitorPlay className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                   Lesson Generator
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Instantly create slides & notes from any topic or document.
                 </p>
               </div>
             </div>

             {/* Question Bank */}
             <div
               onClick={() => setActiveFeature('question-bank')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Library className="w-24 h-24 text-blue-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Library className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                   Question Bank Maker
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Turn content into MCQs & quizzes automatically.
                 </p>
               </div>
             </div>

             {/* Plagiarism Scanner */}
             <div
               onClick={() => setActiveFeature('plagiarism-scanner')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-red-200 dark:hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <ShieldAlert className="w-24 h-24 text-red-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ShieldAlert className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                   Plagiarism Scanner
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Detect AI content & copied text in submissions.
                 </p>
               </div>
             </div>

              {/* Student Feedback */}
              <div
                onClick={() => setActiveFeature('student-feedback')}
                className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-teal-200 dark:hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                   <MessageSquare className="w-32 h-32 text-teal-600" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                     <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                       Student Feedback Dashboard
                     </h4>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                       View daily class feedback from students. Respond to queries and track satisfaction ratings.
                     </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        )}

        {/* Admin / Management Tools */}
        {(category === 'management' || !category) && (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md">
          {/* Decorative Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-slate-500/20">
                 <BrainCircuit className="w-8 h-8" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Control Center</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    System-wide management, automation, and analytics.
                  </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
             {/* National Benchmarking */}
             <div
               onClick={() => setActiveFeature('national-benchmarking')}
               className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-teal-200 dark:hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <TrendingUp className="w-32 h-32 text-teal-600" />
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      National Benchmarking
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                      Compare Brainware vs National Averages & Top Tier institutions.
                    </p>
                 </div>
               </div>
             </div>

             {/* Predictive Insights */}
             <div
               onClick={() => setActiveFeature('predictive-insights')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Lightbulb className="w-24 h-24 text-purple-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                   Predictive Insights
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Dropout forecasts & performance predictions.
                 </p>
               </div>
             </div>

             {/* AI Policy Generator */}
             <div
               onClick={() => setActiveFeature('ai-policy-generator')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <FileText className="w-24 h-24 text-pink-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                   Policy Generator
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Auto-draft circulars & compliance docs.
                 </p>
               </div>
             </div>

             {/* Institution Brain */}
             <div
               onClick={() => setActiveFeature('institution-brain')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <BrainCircuit className="w-24 h-24 text-indigo-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BrainCircuit className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                   Institution Brain
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Centralized data intelligence & accuracy dashboard.
                 </p>
               </div>
             </div>

             {/* Workflow Automation */}
             <div
               onClick={() => setActiveFeature('workflow-automation')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <GitBranch className="w-24 h-24 text-blue-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <GitBranch className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                   Workflow Automation
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Drag & drop builder for university processes.
                 </p>
               </div>
             </div>

             {/* Role Insights */}
             <div
               onClick={() => setActiveFeature('role-insights')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <UserCheck className="w-24 h-24 text-orange-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                   Role Insights
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Activity heatmaps & engagement tracking.
                 </p>
               </div>
             </div>

             {/* Security Compliance */}
             <div
               onClick={() => setActiveFeature('security-compliance')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-red-200 dark:hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <ShieldCheck className="w-24 h-24 text-red-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                   Security Center
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Threat monitoring & access control matrix.
                 </p>
               </div>
             </div>

             {/* Management Analytics Dashboard */}
             <div
               onClick={() => setActiveFeature('management-analytics')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <BarChart className="w-24 h-24 text-cyan-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                   Analytics Dashboard
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Department-wise performance & strategic insights.
                 </p>
               </div>
             </div>

             {/* Scholarship Automation */}
             <div
               onClick={() => setActiveFeature('scholarship-automation')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-yellow-200 dark:hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Award className="w-24 h-24 text-yellow-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                   Scholarship Automation
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   AI-powered scholarship application processing.
                 </p>
               </div>
             </div>

             {/* Admission Automation */}
             <div
               onClick={() => setActiveFeature('admission-automation')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-green-200 dark:hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <UserPlus className="w-24 h-24 text-green-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                   Admission Automation
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Streamlined admission application processing & approval.
                 </p>
               </div>
             </div>

            </div>
          </div>
        </div>
        )}

        {/* Verifier Tools */}
        {(category === 'verifier' || !category) && (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md">
          {/* Decorative Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/20">
                 <ScanFace className="w-8 h-8" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Suite</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Identity authentication and document forensic analysis tools.
                  </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

             {/* DeepFake Detection */}
             <div
               onClick={() => setActiveFeature('deepfake-detection')}
               className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <ScanFace className="w-32 h-32 text-cyan-600" />
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <ScanFace className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      Deepfake Forensic Scanner
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                      Advanced pixel-level manipulation analysis and ELA checks.
                    </p>
                 </div>
               </div>
             </div>

             {/* Cross-Database */}
             <div
               onClick={() => setActiveFeature('cross-db-verification')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Database className="w-24 h-24 text-blue-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                   Cross-Database Check
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Verify against UIDAI, DigiLocker & Education Boards.
                 </p>
               </div>
             </div>

             {/* Timeline Heatmap */}
             <div
               onClick={() => setActiveFeature('doc-timeline')}
               className="group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <History className="w-24 h-24 text-orange-600" />
               </div>

               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <History className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                   Metadata Timeline
                 </h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Detailed document audit trail & tamper detection.
                 </p>
               </div>
             </div>

              {/* Batch Verification */}
              <div
               onClick={() => setActiveFeature('batch-verification')}
               className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-xl p-6 cursor-pointer border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Layers className="w-32 h-32 text-indigo-600" />
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Layers className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Batch Verification Processor
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                      Verify thousands of students via bulk upload instantly.
                    </p>
                 </div>
               </div>
             </div>

            </div>
          </div>
        </div>
        )}
      </div>

   
      

     
    </div>
  );
};

export default Tools;
