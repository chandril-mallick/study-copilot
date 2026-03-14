import { useState, useEffect, useCallback } from 'react';
import useChatStore from './store/useChatStore';
import axios from 'axios';
import { authService } from './services/authService';
import { cn } from './lib/utils';

import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import FloatingChatButton from './components/FloatingChatButton';
import GlobalSearch from './components/GlobalSearch';
import Toast from './components/Toast';
import Chat from './components/Chat';
import Upload from './components/Upload';
import University from './components/University';
import Tools from './components/Tools';
import Analytics from './components/Analytics';
import StudyGroups from './components/StudyGroups';
import ResourceLibrary from './components/ResourceLibrary';
import AssignmentsEnhanced from './components/AssignmentsEnhanced';
import QnAForum from './components/QnAForum';
import { FutureLaunchPad, StudentApplications } from './features/student';
import { ManagementAnalyticsDashboard } from './features/management';

import StudentDashboard from './components/dashboards/StudentDashboard';
import FacultyDashboard from './components/dashboards/FacultyDashboard';
import VerifierDashboard from './components/dashboards/VerifierDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ManagementDashboard from './components/dashboards/ManagementDashboard';

import LoginPage from './components/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import Scene3DBackground from './components/Scene3DBackground';
import { PageLoader, LoadingOverlay } from './components/ui/LoadingStates';
import type { UserRole, ToastData, UploadedFile, User } from './types';

import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {
    messages,
    isLoading: chatLoading,
    init: initChatStore,
    handleSendMessage,
    addSystemMessage,
    setMessages,
    showBackground,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const userRole = user?.role ?? null;
  const userName = user?.name ?? 'User';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    initChatStore();
  }, [initChatStore]);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser as User);
      setIsAuthenticated(true);
    }
  }, []);

  const normalizeRole = useCallback((role: string | undefined): UserRole => {
    if (!role) return 'student';
    const r = role.toLowerCase();
    if (r === 'teacher') return 'faculty';
    return r as UserRole;
  }, []);

  const handleSendMessageWrapper = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    handleSendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, handleSendMessage]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.txt'];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(extension)) {
      setToast({ message: 'Please select a PDF or TXT file.', type: 'error' });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload_material`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setUploadedFiles(prev => [
        ...prev,
        {
          name: file.name,
          type: response.data.file_type,
          chunks: response.data.chunks_processed,
          uploadTime: new Date().toLocaleTimeString(),
        },
      ]);

      addSystemMessage(response.data.message);
      setToast({ message: 'File uploaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      const message = error?.response?.data?.detail || 'File upload failed. Try again.';
      addSystemMessage(message);
      setToast({ message, type: 'error' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }, [addSystemMessage]);

  const handleLogin = useCallback((loggedInUser: { role: string; name?: string; email?: string }) => {
    const role = normalizeRole(loggedInUser.role);
    setUser(loggedInUser as User);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    const welcomeMessages: Record<string, string> = {
      student: 'Welcome back! Priya is ready to help you study',
      faculty: 'Good to see you! Your courses are waiting',
      verifier: 'Welcome! Your document review queue is ready',
      admin: 'System nominal. All services operational',
      management: 'Welcome back! Institution insights are ready',
    };
    setToast({ message: welcomeMessages[role] || `Welcome! Logged in as ${role}`, type: 'success' });
  }, [normalizeRole]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('chat');
    setToast({ message: 'You have been logged out.', type: 'info' });
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const displayRole = normalizeRole(userRole ?? undefined);
  const displayName = isAuthenticated ? userName : 'Guest';

  const renderDashboard = () => {
    const dashboardProps = { userName: displayName };
    switch (displayRole) {
      case 'student':
        return <StudentDashboard {...dashboardProps} />;
      case 'faculty':
      case 'teacher':
        return <FacultyDashboard {...dashboardProps} />;
      case 'verifier':
        return <VerifierDashboard {...dashboardProps} />;
      case 'admin':
        return <AdminDashboard {...dashboardProps} />;
      case 'management':
        return <ManagementDashboard {...dashboardProps} />;
      default:
        return <StudentDashboard {...dashboardProps} />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'chat':
        return (
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            <Chat
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessageWrapper}
              isLoading={chatLoading}
              setMessages={setMessages}
            />
          </div>
        );
      case 'uploads':
        return (
          <div className="p-3 sm:p-4 md:p-6">
            <Upload
              uploadedFiles={uploadedFiles}
              isUploading={isUploading}
              fileInputRef={{ current: null }}
              handleFileUpload={handleFileUpload}
            />
          </div>
        );
      case 'university':
        return <University />;
      case 'qna-forum':
        return <QnAForum />;
      case 'assignments':
        return (
          <AssignmentsEnhanced 
            viewMode={displayRole === 'teacher' || displayRole === 'faculty' ? 'teacher' : 'student'} 
          />
        );
      case 'resource-library':
        return <ResourceLibrary />;
      case 'study-groups':
        return <StudyGroups />;
      case 'analytics':
        return displayRole === 'management' || displayRole === 'admin' 
          ? <ManagementAnalyticsDashboard /> 
          : <Analytics />;
      case 'student-tools':
        return <Tools category="student" onNavigate={handleTabChange} />;
      case 'future-launch-pad':
        return <FutureLaunchPad />;
      case 'student-applications':
        return <StudentApplications />;
      case 'teacher-tools':
        return <Tools category="teacher" onNavigate={handleTabChange} />;
      case 'management-tools':
        return <Tools category="management" onNavigate={handleTabChange} />;
      case 'admin-users':
      case 'admin-workflows':
      case 'admin-security':
        return <Tools category="management" onNavigate={handleTabChange} />;
      case 'verifier-tools':
        return <Tools category="verifier" onNavigate={handleTabChange} />;
      case 'verifier-approved':
        return <Tools category="verifier" onNavigate={handleTabChange} />;
      default:
        return renderDashboard();
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isAppLoading) {
    return <PageLoader text="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen dark" style={{ background: '#0A0A0A' }}>
        {showBackground && (
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
            <Scene3DBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-onyx/85 via-onyx/75 to-onyx/90" />
          </div>
        )}

        {isAuthenticated && (
          <div className="sticky top-0 z-[80]">
            <AppBar
              institutionName="Brainware University"
              aiStatus="live"
              userRole={displayRole}
              userName={userName}
              sidebarOpen={sidebarOpen}
              sidebarCollapsed={sidebarCollapsed}
              notificationCount={0}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              onSearchClick={() => setSearchOpen(true)}
              onNotificationClick={() => setToast({ message: "You're all caught up! No new notifications", type: 'info' })}
              onProfileClick={() => setToast({ message: 'Profile settings coming soon', type: 'info' })}
              onLogout={handleLogout}
            />
          </div>
        )}

        <div className="relative flex z-10 w-full overflow-hidden">
          <Sidebar
            userRole={displayRole}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <LoadingOverlay 
            isLoading={isUploading} 
            text="Uploading file..."
            size="md"
          >
            <main
              className={cn(
                "flex-1 transition-all duration-300",
                activeTab === "chat" && "overflow-hidden"
              )}
              style={{
                marginLeft: `var(--sidebar-w, 0)`,
                height: "calc(100vh - 4rem)",
                overflow: activeTab === "chat" ? "hidden" : "auto",
              }}
              role="main"
              aria-label="Main content area"
            >
              <style>{`
                @media (min-width: 1024px) {
                  :root { --sidebar-w: ${sidebarCollapsed ? '64px' : '256px'}; }
                }
                @media (max-width: 1023px) {
                  :root { --sidebar-w: 0px; }
                }
              `}</style>
              {renderContent()}
            </main>
          </LoadingOverlay>
        </div>

        <FloatingChatButton
          onToggle={() => {
            setChatOpen(!chatOpen);
            if (!chatOpen) {
              setActiveTab('chat');
            }
          }}
          isOpen={chatOpen}
          aria-label={chatOpen ? 'Close chat' : 'Open chat'}
        />

        <GlobalSearch
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={(query) => {
            setInputMessage(query);
            setActiveTab('chat');
            setSearchOpen(false);
            setToast({ message: `Searching for: "${query}"`, type: 'info' });
          }}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {!isAuthenticated && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Login"
          >
            <div className="absolute inset-0 bg-onyx/90 backdrop-blur-sm" />
            <div className="relative z-10 dark">
              <LoginPage onLogin={handleLogin} />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
