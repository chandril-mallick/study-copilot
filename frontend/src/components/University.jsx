import React from 'react';
import { 
  GraduationCap, 
  Building2, 
  Target, 
  BookOpen, 
  Trophy, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Rocket
} from 'lucide-react';

const University = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-100" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 p-6 sm:p-10 text-gray-800 dark:text-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-12 mt-4">
          <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-6">
             <GraduationCap className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
            Brainware University
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
            Premier educational institution committed to excellence in education and innovation.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/10 shadow-sm">
              <CheckCircle className="w-4 h-4" /> Established 2016
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/10 shadow-sm">
              <CheckCircle className="w-4 h-4" /> NAAC Accredited
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/10 shadow-sm">
              <CheckCircle className="w-4 h-4" /> UGC Approved
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 -mt-8 mx-auto max-w-5xl">
          {[
            { icon: BookOpen, label: "Programs", value: "50+", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { icon: Rocket, label: "Labs", value: "Innovation", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
            { icon: Users, label: "Faculty", value: "500+", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
            { icon: Trophy, label: "Placement", value: "99%", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* About & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* About Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">About Brainware</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              Brainware University, established in 2016 in Kolkata, West Bengal, has quickly emerged as a center of academic excellence. We offer world-class education across diverse disciplines.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              With <span className="font-semibold text-blue-600 dark:text-blue-400">state-of-the-art infrastructure</span>, experienced faculty, and an industry-aligned curriculum, we prepare students to excel globally.
            </p>
          </div>

          {/* Mission & Vision Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mission & Vision</h3>
            </div>
            <div className="space-y-5">
              <div className="pl-4 border-l-2 border-amber-200 dark:border-amber-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Vision</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  To be a globally recognized university nurturing innovation, creativity, and ethical leadership.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-amber-200 dark:border-amber-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Mission</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Empowering students with cutting-edge knowledge, professional skills, and values to be responsible global citizens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Academics & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
           {/* Programs */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Academic Programs
            </h3>
            <div className="space-y-4">
              {[
                { name: "Engineering", det: "B.Tech, M.Tech specializations", color: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" },
                { name: "Management", det: "MBA, BBA with industry focus", color: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800" },
                { name: "Computer Apps", det: "BCA, MCA with latest tech", color: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800" },
                { name: "Commerce", det: "B.Com, M.Com practical exposure", color: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800" },
              ].map((prog, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${prog.color} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                   <span className="font-semibold text-sm">{prog.name}</span>
                   <span className="text-xs opacity-80">{prog.det}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recognition */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements & Recognition
            </h3>
            <div className="space-y-4">
               {[
                 { title: "NAAC Accreditation", desc: "Grade A accreditation for quality education", icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
                 { title: "UGC Recognition", desc: "Recognized by University Grants Commission", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
                 { title: "AICTE Approved", desc: "All technical programs AICTE approved", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`p-2 rounded-lg ${item.bg} ${item.color} shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Contact Info Footer */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
           
           <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
             <MapPin className="w-5 h-5 text-blue-400" />
             Contact Information
           </h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
             <div className="space-y-2">
               <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                 <MapPin className="w-4 h-4" /> Campus
               </div>
               <p className="text-sm leading-relaxed text-gray-300">
                 398, Ramkrishnapur Road, Barasat<br/>Kolkata - 700124, WB
               </p>
             </div>
             
             <div className="space-y-2">
               <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                 <Phone className="w-4 h-4" /> Connect
               </div>
               <p className="text-sm leading-relaxed text-gray-300">
                 +91-33-69001010<br/>+91-9073683913
               </p>
             </div>

             <div className="space-y-2">
               <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                 <Globe className="w-4 h-4" /> Digital
               </div>
               <p className="text-sm leading-relaxed text-gray-300 hover:text-white transition-colors">
                 <a href="https://brainwareuniversity.ac.in" target="_blank" rel="noreferrer">brainwareuniversity.ac.in</a><br/>
                 info@brainwareuniversity.ac.in
               </p>
             </div>

             <div className="space-y-2">
               <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                 <Clock className="w-4 h-4" /> Hours
               </div>
               <p className="text-sm leading-relaxed text-gray-300">
                 Mon - Sat: 9:00 AM - 6:00 PM<br/>Sunday: Closed
               </p>
             </div>
           </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Ready to embark on your journey?</p>
           <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
             Explore Admissions
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

      </div>
    </div>
  );
};

export default University;
