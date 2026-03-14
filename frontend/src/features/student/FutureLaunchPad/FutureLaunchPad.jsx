import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Globe, 
  Terminal, 
  Cpu, 
  Building2, 
  Clock,
  Play,
  RotateCw,
  Filter,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { jobService } from '../../../services/jobService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Toast from '../../../components/Toast';
import DabbaBotLogo from '../../../components/DabbaBotLogo';

const FutureLaunchPad = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: 'All'
  });
  const [scrapeLogs, setScrapeLogs] = useState([]);
  const logsEndRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrapeLogs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs({
        role: searchQuery,
        location: filters.location,
        type: filters.type === 'All' ? '' : filters.type
      });
      setJobs(data);
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Failed to load jobs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!searchQuery.trim()) {
      setToast({ show: true, message: 'Please enter a job role to scrape', type: 'error' });
      return;
    }

    setScraping(true);
    setScrapeLogs([]);
    
    // Simulate terminal logs animation
    const addLog = (msg) => setScrapeLogs(prev => [...prev, `${new Date().toLocaleTimeString()} > ${msg}`]);
    
    setTimeout(() => addLog(`Initializing Dabba AI Future Launch Pad v4.0...`), 500);
    setTimeout(() => addLog(`Connecting to global job index...`), 1500);
    setTimeout(() => addLog(`Searching sources: LinkedIn, Indeed, Glassdoor...`), 2500);
    setTimeout(() => addLog(`Analyzing job patterns for "${searchQuery}"...`), 3500);
    setTimeout(() => addLog(`Filtering spam and irrelevant listings...`), 5000);

    try {
      // Actually fetch mock data while animation plays
      await new Promise(r => setTimeout(r, 6000)); // Ensure animation plays long enough
      const response = await jobService.scrapeJobs(searchQuery);
      
      addLog(`Scraping complete! Found ${response.jobs_found} fresh opportunities.`);
      setJobs(response.jobs); // Update with "fresh" jobs
      setToast({ show: true, message: 'Found successfully!', type: 'success' });
    } catch (error) {
      addLog(`Error: ${error}`);
      setToast({ show: true, message: 'Failed to find', type: 'error' });
    } finally {
      setScraping(false);
    }
  };

  const LocationOptions = ["Remote", "Bangalore", "Hyderabad", "Pune", "Gurgaon", "San Francisco", "London"];
  const TypeOptions = ["All", "Full-time", "Internship", "Contract"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 backdrop-blur-md">
              <DabbaBotLogo iconOnly className="scale-75" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Job/Internship Finder
              </h1>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Controls */}
          <Card className="lg:col-span-2 border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input 
                    placeholder="Search roles (e.g. React Developer, Data Scientist)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:ring-cyan-500 text-lg"
                  />
                </div>
                <Button 
                  onClick={handleScrape}
                  disabled={scraping}
                  className={`h-12 px-8 font-bold text-white transition-all duration-500 ${
                    scraping 
                      ? 'bg-amber-600 cursor-not-allowed animate-pulse' 
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:scale-105'
                  }`}
                >
                  {scraping ? (
                    <div className="flex items-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin" />
                      SEARCHING...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                       <Terminal className="w-5 h-5" />
                       Find Jobs
                    </div>
                  )}
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Filter className="w-4 h-4" />
                  FILTERS:
                </div>
                
                <select 
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                  className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Any Location</option>
                  {LocationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>

                <select 
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
                  className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {TypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <Button 
                  variant="outline" 
                  onClick={fetchJobs}
                  className="ml-auto text-xs border-white/10 hover:bg-white/5 text-gray-400"
                >
                  Refresh Results
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scrape Status / Terminal */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl h-full min-h-[200px] flex flex-col font-mono text-xs">
            <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-500">launcher_logs.sh</span>
            </div>
            <CardContent className="p-4 flex-1 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-700">
               {scrapeLogs.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                   <Cpu className="w-8 h-8 opacity-20" />
                   <p>System Ready. Waiting for input...</p>
                 </div>
               ) : (
                 <div className="space-y-1">
                   {scrapeLogs.map((log, i) => (
                     <div key={i} className="text-green-400 font-mono animate-fade-in">
                       {log}
                     </div>
                   ))}
                   <div ref={logsEndRef} />
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              Live Opportunities ({jobs.length})
            </h2>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Live Data Feed Active
            </div>
          </div>

          {loading && !scraping ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3].map(i => (
                 <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse border border-white/5"></div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="group bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={job.logo_url} 
                          alt={job.company} 
                          className="w-12 h-12 rounded-lg bg-white p-1 object-contain"
                        />
                        <div>
                          <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-lg">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-200 flex items-center gap-2 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10">
                        {job.match_score}% Match
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.source && (
                        <Badge className={`border ${
                          job.source === 'Unstop' ? 'bg-orange-500/20 border-orange-500/50 text-orange-200 hover:bg-orange-500/30' :
                          job.source === 'Naukri' ? 'bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30' :
                          'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 hover:bg-indigo-500/30'
                        }`}>
                          <Globe className="w-3 h-3 mr-1" />
                          {job.source}
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        <MapPin className="w-3 h-3 mr-1 text-cyan-400" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                         <Clock className="w-3 h-3 mr-1 text-cyan-400" />
                         {job.type}
                      </Badge>
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                         {job.posted_date}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
                      <Button 
                        onClick={() => window.open(job.apply_link, '_blank')}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold gap-2 shadow-lg shadow-cyan-500/20 py-6 transition-all duration-300 hover:scale-[1.02]"
                      >
                        Apply Now <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
};

export default FutureLaunchPad;
