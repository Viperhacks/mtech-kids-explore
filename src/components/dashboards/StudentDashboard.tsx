
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, Award, Clock, Loader2, FileText, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getResourcesForAnyOne } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import { userTrackingService } from '@/lib/userTracking';
import StudentQuizzes from '../student/StudentQuizzes';
import StudentQuizHistory from '../StudentQuizHistory';
import SubjectProgressCard from '../SubjectProgressCard';

interface StudentDashboardProps {
  isParent?: boolean;
}

interface ResourceStats {
  total: number;
  completed: number;
  videos: number;
  documents: number;
  quizzes: number;
  videosCompleted: number;
  documentsCompleted: number;
  quizzesCompleted: number;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ isParent = false }) => {
  const { gradeId, subjectId } = useParams<{ gradeId: string, subjectId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [resourceStats, setResourceStats] = useState<{[key: string]: ResourceStats}>({});

  const calculateProgress = (subject: string) => {
    if (!resourceStats[subject]) return { progress: 0, completed: 0, total: 10 };
    const { completed = 0, total = 10 } = resourceStats[subject];
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { progress, completed, total };
  };

  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || '1';
  const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Student');
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const badges = user?.earnedBadges || [];

  useEffect(() => {
    fetchResources();
  }, [gradeId, subjectId]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await getResourcesForAnyOne(getRecommendedGrade());
      const allResources = response.resources || [];
      setResources(allResources);
      
      // Calculate resource statistics per subject
      const stats: {[key: string]: ResourceStats} = {};
      
      // Get user-specific viewed documents
      const viewedDocuments = user ? 
        userTrackingService.getUserData(`viewedDocuments`, {}) : 
        JSON.parse(localStorage.getItem("viewedDocuments") || "{}");
      
      // Group resources by subject and calculate stats
      allResources.forEach(resource => {
        const subject = resource.response.subject;
        const type = resource.response.type;
        const isCompleted = viewedDocuments[resource.response.id]?.completed || false;
        
        if (!stats[subject]) {
          stats[subject] = {
            total: 0,
            completed: 0,
            videos: 0,
            documents: 0,
            quizzes: 0,
            videosCompleted: 0,
            documentsCompleted: 0,
            quizzesCompleted: 0
          };
        }
        
        stats[subject].total++;
        
        if (type === 'video') {
          stats[subject].videos++;
          if (isCompleted) stats[subject].videosCompleted++;
        } 
        else if (type === 'document') {
          stats[subject].documents++;
          if (isCompleted) stats[subject].documentsCompleted++;
        }
        else if (type === 'quiz') {
          stats[subject].quizzes++;
          if (isCompleted) stats[subject].quizzesCompleted++;
        }
        
        if (isCompleted) {
          stats[subject].completed++;
        }
      });
      
      setResourceStats(stats);
      
    } catch (error) {
      toast({
        title: "Failed to load resources",
        description: "Could not load learning materials. Using sample data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 container ">
      <div className="px-4 pt-6 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left md:mb-0 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {capitalize(displayName.split(' ')[0] || 'Student')}!
          </h1>
        </div>
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value='quizzes'>Quizzes</TabsTrigger>
          <TabsTrigger value='quiz-history'>Quiz History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 flex-col text-center text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 mb-4" />
              Hang tight, loading your learning world...
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-xl font-semibold mb-2">Oops, no lessons available yet!</h2>
              <p>Check back later or explore quizzes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(resourceStats).map(([subject, stats]) => (
                <SubjectProgressCard
                  key={subject}
                  subject={subject}
                  stats={stats}
                  grade={getRecommendedGrade()}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='quizzes'>
          <StudentQuizzes/>
        </TabsContent>

        <TabsContent value='quiz-history'>
          <StudentQuizHistory/>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Badges</CardTitle>
              <CardDescription>Achievements you've earned through learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div
                    key={badge}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${
                      badge === 'welcome'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-gray-100 border-gray-200 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        badge === 'welcome' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-sm">{badge}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge === 'welcome' ? 'Joined the platform' : 'Completed lessons'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
