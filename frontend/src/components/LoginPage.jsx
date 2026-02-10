import React, { useState } from "react";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Settings, 
  LineChart,
  ArrowRight,
  Loader2,
  Brain,
  Lock,
  Key
} from "lucide-react";

import { cn } from "../lib/utils";
import { authService } from "../services/authService";

const roles = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Access courses, assignments, and study groups.",
    gradient: "from-neon-blue to-emerald-DEFAULT",
    accent: "neon-blue",
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: Briefcase,
    description: "Manage classes, upload content, and view analytics.",
    gradient: "from-emerald-DEFAULT to-neon-blue",
    accent: "emerald-DEFAULT",
  },
  {
    id: "verifier",
    label: "Verifier",
    icon: ShieldCheck,
    description: "Review and approve submitted documents.",
    gradient: "from-amber-500 to-orange-500",
    accent: "amber-500",
  },
  {
    id: "admin",
    label: "Admin",
    icon: Settings,
    description: "Full system control and configuration.",
    gradient: "from-purple-500 to-pink-500",
    accent: "purple-500",
  },
  {
    id: "management",
    label: "Management",
    icon: LineChart,
    description: "Overview of institutional performance.",
    gradient: "from-rose-500 to-red-500",
    accent: "rose-500",
  },
];

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setShowForm(true);
    setError(null);
    
    // Pre-fill with dev credentials
    const credentials = {
      student: { email: "student@brainware.edu", password: "student123" },
      faculty: { email: "faculty@brainware.edu", password: "faculty123" },
      verifier: { email: "verifier@brainware.edu", password: "verifier123" },
      admin: { email: "admin@brainware.edu", password: "admin123" },
      management: { email: "management@brainware.edu", password: "management123" }
    };
    
    const creds = credentials[roleId];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    setError(null);
    try {
      // Real backend login through authService (which handles localStorage 'access_token')
      const user = await authService.login(email, password);
      
      onLogin(selectedRole);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen flex items-center justify-center bg-onyx p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-neon" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-DEFAULT/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/download-removebg-preview (1).png"
              alt="Dabba AI Logo"
              className="w-16 h-16"
            />
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white">
              Dabba AI
            </h1>
          </div>
          <p className="text-2xl md:text-3xl font-heading font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-emerald-DEFAULT">
            India's First Self-Learning Institutional AI
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your Campus. Your Data. Your AI Brain.
          </p>
        </div>

        {!showForm ? (
          /* Role Selection Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  disabled={loading}
                  className={cn(
                    "group relative flex flex-col items-start p-6 rounded-card-lg transition-all duration-300",
                    "glass-card hover:shadow-neon",
                    "hover:scale-[1.02] hover:-translate-y-1",
                    "focus:outline-none focus:ring-2 focus:ring-neon-blue/50",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-card mb-4 bg-gradient-to-br",
                    role.gradient,
                    "shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                    {role.label}
                  </h3>
                  
                  <p className="text-sm text-gray-400 text-left leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-neon-blue transition-colors mt-auto">
                    <span>Login as {role.label}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse-neon" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <div className="glass-card rounded-card-lg p-8 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {selectedRoleData && (
                    <>
                      <div className={cn(
                        "p-3 rounded-card bg-gradient-to-br",
                        selectedRoleData.gradient
                      )}>
                        {React.createElement(selectedRoleData.icon, { className: "w-6 h-6 text-white" })}
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-white">
                        Login as {selectedRoleData.label}
                      </h2>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedRole(null);
                    setError(null);
                  }}
                  className="text-sm text-gray-400 hover:text-neon-blue transition-colors"
                >
                  ← Select different role
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-card",
                        "bg-charcoal-light/50 border border-charcoal-light/30",
                        "text-white placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue",
                        "transition-all"
                      )}
                      placeholder="your.email@brainware.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-card",
                        "bg-charcoal-light/50 border border-charcoal-light/30",
                        "text-white placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue",
                        "transition-all"
                      )}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-card bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full py-3 rounded-card font-medium",
                    "bg-gradient-to-r from-neon-blue to-emerald-DEFAULT",
                    "text-white hover:shadow-neon",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login as {selectedRoleData?.label}</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                    Forgot Password?
                  </a>
                  <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                    University SSO
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
