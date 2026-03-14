import React, { useState } from "react";
import {
  Mail,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Settings,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Globe,
  TrendingUp
} from "lucide-react";

import { cn } from "../lib/utils";
import { authService } from "../services/authService";
import DabbaBotLogo from "./DabbaBotLogo";

/* ─────────────────────────────────────────
   Roles
───────────────────────────────────────── */

const roles = [
  {
    id: "student",
    label: "Student",
    description: "Personalized AI tutor & study companion",
    icon: GraduationCap,
    color: "#00D9FF",
    accent: "bg-[#00D9FF]/10"
  },
  {
    id: "faculty",
    label: "Faculty",
    description: "Course assistant & research multiplier",
    icon: Briefcase,
    color: "#10B981",
    accent: "bg-[#10B981]/10"
  },
  {
    id: "verifier",
    label: "Document Verifier",
    description: "Knowledge integrity & review console",
    icon: ShieldCheck,
    color: "#F59E0B",
    accent: "bg-[#F59E0B]/10"
  },
  {
    id: "admin",
    label: "University Admin",
    description: "System orchestration & governance",
    icon: Settings,
    color: "#8B5CF6",
    accent: "bg-[#8B5CF6]/10"
  },
  {
    id: "management",
    label: "Management",
    description: "Executive analytics & KPI tracking",
    icon: TrendingUp,
    color: "#EC4899",
    accent: "bg-[#EC4899]/10"
  }
];

/* ─────────────────────────────────────────
   HERO PANEL (LEFT SIDE)
───────────────────────────────────────── */

const HeroPanel = () => {
  return (
    <div className="hidden md:flex flex-col h-full px-10 py-12 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00FF88]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00C873]/10 blur-[120px] rounded-full" />

      {/* logo */}
      <div className="relative z-10">
        <DabbaBotLogo className="scale-125 origin-left" />
      </div>

      {/* center hero text */}
      <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10">

        <div className="max-w-3xl">

          <h1 className="text-6xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
            Own AI Brain for Your
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00C873]">
              University .
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            Empowering students and educators with an AI-driven ecosystem
            designed for the future of your university.
          </p>

        </div>

      </div>

      {/* bottom pills */}
      <div className="relative z-10 flex flex-wrap justify-center gap-3">

        {["AI Tutor Priya", "Smart Summaries", "24/7 Support"].map((p) => (

          <div
            key={p}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300 flex items-center gap-2"
          >
            <Zap className="h-3.5 w-3.5 text-[#00FF88]" />
            {p}
          </div>

        ))}

      </div>

    </div>
  );
};

/* ─────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────── */

const LoginPage = ({ onLogin }) => {

  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (roleId) => {

    setSelectedRole(roleId);
    setError("");

    const devLogins = {
      student: { e: "student@brainware.edu", p: "student123" },
      faculty: { e: "faculty@brainware.edu", p: "faculty123" },
      verifier: { e: "verifier@brainware.edu", p: "verifier123" },
      admin: { e: "admin@brainware.edu", p: "admin123" },
      management: { e: "management@brainware.edu", p: "management123" }
    };

    if (devLogins[roleId]) {
      setEmail(devLogins[roleId].e);
      setPassword(devLogins[roleId].p);
    }

    setTimeout(() => setShowForm(true), 150);
  };

  const handleBack = () => {
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your credentials");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const user = await authService.login(email, password, selectedRole);
      onLogin(user);

    } catch (err) {

      setError(err.message || "Authentication failed");

    } finally {

      setLoading(false);

    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (

    <div className="flex h-screen w-screen bg-[#0A0A0A] overflow-hidden font-body">

      {/* LEFT PANEL */}
      <div className="flex-[1.2] lg:flex-1 hidden md:block bg-[#0B0F14] border-r border-white/5">
        <HeroPanel />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">

        <div className="w-full max-w-[420px] relative z-10">

          {!showForm ? (

            <div className="space-y-8">

              <div className="space-y-1">
                <h2 className="text-3xl font-heading font-bold text-white">
                  Welcome back
                </h2>
                <p className="text-gray-400">
                  Select your role to continue
                </p>
              </div>

              <div className="grid gap-3">

                {roles.map(role => {

                  const Icon = role.icon;

                  return (

                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="w-full p-4 rounded-2xl flex items-center gap-4 text-left bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                    >

                      <div className={cn("p-2.5 rounded-xl", role.accent)}>
                        <Icon
                          className="h-5 w-5"
                          style={{ color: role.color }}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-white font-bold">
                          {role.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {role.description}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-gray-600" />

                    </button>

                  );

                })}

              </div>

            </div>

          ) : (

            <div className="space-y-8">

              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to roles
              </button>

              <div>
                <h2 className="text-3xl font-heading font-bold text-white">
                  Sign in
                </h2>
                <p className="text-gray-400 text-sm">
                  Use your institutional credentials
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* email */}
                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    autoComplete="username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white"
                  />

                </div>

                {/* password */}
                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />

                  <input
                    type={showPassword ? "text":"password"}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white"
                  />

                  <button
                    type="button"
                    onClick={()=>setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >

                    {showPassword
                      ? <EyeOff className="h-4 w-4"/>
                      : <Eye className="h-4 w-4"/>}

                  </button>

                </div>

                {error && (

                  <div className="flex items-center gap-2 text-red-500 text-xs">
                    <AlertCircle className="h-4 w-4"/>
                    {error}
                  </div>

                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2"
                >

                  {loading
                    ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"/>
                    : <>Sign in as {selectedRoleData?.label}<ChevronRight className="h-4 w-4"/></>}

                </button>

              </form>

            </div>

          )}

        </div>

        <p className="absolute bottom-6 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          © 2026 DABBA AI · Brainware University
        </p>

      </div>

    </div>

  );
};

export default LoginPage;