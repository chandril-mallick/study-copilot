import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  MapPin, 
  Clock, 
  Zap, 
  BookOpen,
  MessageCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { studentService } from '../../../services/studentService';
import { handleApiError } from '../../../utils/errorHandler';
import Toast from '../../../components/Toast';

const StudyGroupModerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchSuggestions();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudyGroups();
      setGroups(Array.isArray(data) ? data : (data.groups || []));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await studentService.getGroupSuggestions();
      setSuggestions(Array.isArray(data) ? data : (data.suggestions || []));
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await studentService.joinStudyGroup(groupId);
      setToast({ message: 'Successfully joined study group!', type: 'success' });
      fetchGroups(); // Refresh list
    } catch (err) {
      setToast({ message: handleApiError(err), type: 'error' });
    }
  };

  const handleFindMatch = async () => {
    try {
      await fetchSuggestions();
      if (suggestions.length > 0) {
        setToast({ message: `Found ${suggestions.length} matching groups!`, type: 'success' });
      } else {
        setToast({ message: 'No matching groups found. Try adjusting your preferences.', type: 'info' });
      }
    } catch (err) {
      setToast({ message: handleApiError(err), type: 'error' });
    }
  };

  // Transform API data to match UI format
  const transformedGroups = groups.map((group, index) => ({
    id: group.id || index + 1,
    name: group.name || `Study Group ${index + 1}`,
    topic: group.subject || "General",
    members: group.members_count || 0,
    maxMembers: group.max_members || 10,
    level: group.skill_level || "Intermediate",
    pace: group.meeting_schedule || "Moderate",
    nextSession: "Check schedule",
    matchScore: group.match_score || 0
  }));

  const mockGroups = [
    {
      id: 1,
      name: "Machine Learning Masters",
      topic: "Artificial Intelligence",
      members: 5,
      maxMembers: 8,
      level: "Advanced",
      pace: "Fast",
      nextSession: "Tomorrow, 6:00 PM",
      matchScore: 95
    },
    {
      id: 2,
      name: "Calculus Cram Crew",
      topic: "Mathematics",
      members: 3,
      maxMembers: 6,
      level: "Intermediate",
      pace: "Moderate",
      nextSession: "Wed, 8:00 PM",
      matchScore: 88
    },
    {
      id: 3,
      name: "Python Philosophers",
      topic: "Computer Science",
      members: 12,
      maxMembers: 15,
      level: "Beginner",
      pace: "Relaxed",
      nextSession: "Sat, 2:00 PM",
      matchScore: 60
    }
  ];

  const displayGroups = transformedGroups.length > 0 ? transformedGroups : mockGroups;
  const filteredGroups = displayGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading study groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-orange-500" />
            Study Group Finder
          </h2>
          <p className="text-gray-500">
            AI-powered matchmaking to find your perfect study partners.
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search topics or skills..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Special "Match Me" Card */}
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-lg col-span-1 md:col-span-2 lg:col-span-3 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-6 h-6 text-yellow-300" />
              Not sure where to join?
            </h3>
            <p className="text-indigo-100 max-w-xl">
              Our AI analyzes your recent quiz scores, learning pace, and weak topics to suggest the most effective study groups for you.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">AI Matched</Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">Personalized</Badge>
            </div>
          </div>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold shadow-xl shrink-0" onClick={handleFindMatch}>
             ⚡ Find My Perfect Match
          </Button>
        </Card>
        
        {/* Group Cards */}
        {filteredGroups.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Study Groups Found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or create a new group.</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
          <Card key={group.id} className="flex flex-col group hover:shadow-lg transition-all duration-300 border-t-4 border-t-transparent hover:border-t-orange-500">
            <CardContent className="p-6 flex-1 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <Badge variant={group.level === 'Advanced' ? 'destructive' : 'secondary'} className="rounded-sm">
                  {group.level}
                </Badge>
                {group.matchScore > 80 && (
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                    {group.matchScore}% Match
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-orange-600 transition-colors">{group.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {group.topic}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 py-2">
                 <div className="flex items-center gap-2">
                   <Users className="w-4 h-4 text-gray-400" />
                   {group.members}/{group.maxMembers} Members
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-gray-400" />
                   {group.pace} Pace
                 </div>
                 <div className="col-span-2 flex items-center gap-2 text-indigo-600 font-medium">
                   <MapPin className="w-4 h-4" />
                   {group.nextSession}
                 </div>
              </div>

              <div className="flex-1"></div> {/* Spacer */}

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button 
                  className="flex-1 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white hover:bg-gray-800"
                  onClick={() => handleJoinGroup(group.id)}
                >
                   Join Group
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Toast */}
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

export default StudyGroupModerator;
