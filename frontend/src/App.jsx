import { useState, useRef, useEffect } from "react";
import useChatStore from "./store/useChatStore";
import axios from "axios";

import AppBar from "./components/AppBar";
import Sidebar from "./components/Sidebar";
import FloatingChatButton from "./components/FloatingChatButton";
import GlobalSearch from "./components/GlobalSearch";
import Toast from "./components/Toast";
import Chat from "./components/Chat";
import Upload from "./components/Upload";
import University from "./components/University";
import Tools from "./components/Tools";
import Analytics from "./components/Analytics";
import StudyGroups from "./components/StudyGroups";
import ResourceLibrary from "./components/ResourceLibrary";
import Assignments from "./components/Assignments";
import AssignmentsEnhanced from "./components/AssignmentsEnhanced";
import QnAForum from "./components/QnAForum";
import HistorySidebar from "./components/HistorySidebar";
import { FutureLaunchPad } from "./features/student";
import { ManagementAnalyticsDashboard } from "./features/management";

// Dashboards
import StudentDashboard from "./components/dashboards/StudentDashboard";
import FacultyDashboard from "./components/dashboards/FacultyDashboard";
import VerifierDashboard from "./components/dashboards/VerifierDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import ManagementDashboard from "./components/dashboards/ManagementDashboard";

import LoginPage from "./components/LoginPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { authService } from "./services/authService";
import websocketService from "./services/websocketService";
import SplashScreen from "./components/SplashScreen";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const {
    messages,
    isLoading,
    init: initChatStore,
    handleSendMessage,
    addSystemMessage,
    setMessages,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDark, setIsDark] = useState(true); // Dark mode default
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("User");

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Check if user is already authenticated
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserName(user.name || user.email?.split('@')[0] || "User");
    }
  }, []);

  // WebSocket connection on authentication
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('access_token');
      // Only connect if we have a real token (skips in Dev Mode)
      if (token) {
        websocketService.connect(token);
        
        // Subscribe to notifications
        websocketService.subscribe('notification', (data) => {
          // Show notification to user
          console.log('Notification:', data);
        });

        // Subscribe to announcements
        websocketService.subscribe('announcement', (data) => {
          console.log('Announcement:', data);
        });
      }

      return () => {
        websocketService.disconnect();
      };
    }
  }, [isAuthenticated]);

  // Scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Theme initialization
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(stored ? stored === "dark" : prefersDark);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Initialize store
  useEffect(() => {
    initChatStore();
  }, [initChatStore]);

  // Send wrapper
  const handleSendMessageWrapper = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    handleSendMessage(inputMessage);
    setInputMessage("");
  };

  // Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      !file.name.toLowerCase().endsWith(".pdf") &&
      !file.name.toLowerCase().endsWith(".txt")
    ) {
      alert("Please select a PDF or TXT file.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload_material`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          type: response.data.file_type,
          chunks: response.data.chunks_processed,
          uploadTime: new Date().toLocaleTimeString(),
        },
      ]);

      addSystemMessage(response.data.message);
    } catch (error) {
      console.error("Upload error:", error);
      addSystemMessage(
        error.response?.data?.detail || "File upload failed. Try again."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setActiveTab("dashboard"); // Start with dashboard
    const user = authService.getCurrentUser();
    if (user) {
      setUserName(user.name || user.email?.split('@')[0] || "User");
    }
    setToast({ message: `Welcome! Logged in as ${role}`, type: "success" });
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab("chat");
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="dark">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  // Render dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard userName={userName} />;
      case 'faculty':
      case 'teacher':
        return <FacultyDashboard userName={userName} />;
      case 'verifier':
        return <VerifierDashboard userName={userName} />;
      case 'admin':
        return <AdminDashboard userName={userName} />;
      case 'management':
        return <ManagementDashboard userName={userName} />;
      default:
        return <StudentDashboard userName={userName} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-onyx dark">
      {/* App Bar */}
      <AppBar
        institutionName="Brainware University"
        aiStatus="live"
        userRole={userRole}
        userName={userName}
        sidebarOpen={sidebarOpen}
        notificationCount={3}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearchClick={() => setSearchOpen(true)}
        onNotificationClick={() => setToast({ message: "No new notifications", type: "info" })}
        onProfileClick={() => setToast({ message: "Profile settings coming soon", type: "info" })}
        onLogout={handleLogout}
      />

      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] transition-all duration-300">
          {activeTab === "dashboard" && renderDashboard()}
          
          {activeTab === "chat" && (
            <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
              <Chat
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessageWrapper}
                isLoading={isLoading}
                setMessages={setMessages}
              />
            </div>
          )}

          {activeTab === "uploads" && (
            <div className="p-3 sm:p-4 md:p-6">
              <Upload
                uploadedFiles={uploadedFiles}
                isUploading={isUploading}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
              />
            </div>
          )}

          {activeTab === "university" && (
            <div className="p-3 sm:p-4 md:p-6">
              <University />
            </div>
          )}
          
          {activeTab === "qna-forum" && (
            <div className="p-3 sm:p-4 md:p-6">
              <QnAForum />
            </div>
          )}
          
          {activeTab === "assignments" && (
            <div className="p-3 sm:p-4 md:p-6">
              <AssignmentsEnhanced viewMode={userRole === 'teacher' || userRole === 'faculty' ? 'teacher' : 'student'} />
            </div>
          )}
          
          {activeTab === "resource-library" && (
            <div className="p-3 sm:p-4 md:p-6">
              <ResourceLibrary />
            </div>
          )}
          
          {activeTab === "study-groups" && (
            <div className="p-3 sm:p-4 md:p-6">
              <StudyGroups />
            </div>
          )}
          
          {activeTab === "analytics" && (
            <div className="p-3 sm:p-4 md:p-6">
              {(userRole === 'management' || userRole === 'admin') 
                ? <ManagementAnalyticsDashboard /> 
                : <Analytics />}
            </div>
          )}
          
          {activeTab === "student-tools" && (
            <div className="p-3 sm:p-4 md:p-6">
              <Tools category="student" onNavigate={(tab) => setActiveTab(tab)} />
            </div>
          )}

          {activeTab === "future-launch-pad" && (
            <div className="p-3 sm:p-4 md:p-6">
              <FutureLaunchPad />
            </div>
          )}
          
          {activeTab === "teacher-tools" && (
            <div className="p-3 sm:p-4 md:p-6">
              <Tools category="teacher" onNavigate={(tab) => setActiveTab(tab)} />
            </div>
          )}
          
          {activeTab === "management-tools" && (
            <div className="p-3 sm:p-4 md:p-6">
              <Tools category="management" onNavigate={(tab) => setActiveTab(tab)} />
            </div>
          )}
          
          {activeTab === "verifier-tools" && (
            <div className="p-3 sm:p-4 md:p-6">
              <Tools category="verifier" onNavigate={(tab) => setActiveTab(tab)} />
            </div>
          )}
        </main>
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton
        onToggle={() => {
          setChatOpen(!chatOpen);
          if (!chatOpen) {
            setActiveTab("chat");
          }
        }}
        isOpen={chatOpen}
      />

      {/* Global Search */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={(query) => {
          setToast({ message: `Searching for: ${query}`, type: "info" });
        }}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
