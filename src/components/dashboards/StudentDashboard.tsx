
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
import StudentQuizzes from '../StudentQuizzes';

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
    <div className="space-y-8">
      <div className="px-4 pt-6 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left md:mb-0 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {capitalize(displayName.split(' ')[0] || 'Student')}!
          </h1>
        </div>
       {/* <div className="text-left md:text-right">
          <Button 
            onClick={() => navigate(`/grade/grade${getRecommendedGrade()}`)}
            className="bg-mtech-primary hover:bg-mtech-dark text-white"
          >
            Continue Learning
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>*/}
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value='quizzes'>Quizzes</TabsTrigger>
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
      <p>Check back later or explore other subjects.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(resourceStats).map(([subject, stats]) => {
        const hasVideos = stats.videos > 0; // Check if there are videos
        return (
          <Card key={subject}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 p-2 rounded-full">
                  <BookOpen className="h-4 w-4" />
                </span>
                {capitalize(subject)}
              </CardTitle>
              <CardDescription>
                Grade {getRecommendedGrade()} {capitalize(subject)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="text-muted-foreground">
                    {calculateProgress(subject).completed}/{calculateProgress(subject).total} items
                  </span>
                </div>
                <Progress value={calculateProgress(subject).progress} className="h-2" />
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-blue-50 rounded-md">
                    <Video className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs font-medium">{stats.videosCompleted}/{stats.videos}</p>
                    <p className="text-xs text-muted-foreground">Videos</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-md">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-xs font-medium">{stats.documentsCompleted}/{stats.documents}</p>
                    <p className="text-xs text-muted-foreground">Docs</p>
                  </div>
                  <div className="text-center p-2 bg-amber-50 rounded-md">
                    <Award className="h-4 w-4 mx-auto mb-1 text-amber-600" />
                    <p className="text-xs font-medium">{stats.quizzesCompleted}/{stats.quizzes}</p>
                    <p className="text-xs text-muted-foreground">Quizzes</p>
                  </div>
                </div>
              </div>

              {hasVideos ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/grade/grade${getRecommendedGrade()}/subject/${subject}`)}
                >
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/revision")}
                >
                  No videos available, go to revisions <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  )}

  {/*!isLoading && resources.length > 0 && (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Resources</CardTitle>
        <CardDescription>Based on your recent activity and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedResources.map(resource => (
            <Button
              key={resource.id}
              variant="outline"
              onClick={() => navigate(resource.path)}
              className="justify-start p-6 h-auto transition-all border hover:bg-muted hover:border-mtech-primary hover:shadow-md group"
            >
              <div className="flex flex-col items-start gap-2 w-full text-left">
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-mtech-primary">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{resource.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-mtech-primary">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )*/}
</TabsContent>

      <TabsContent value='quizzes'>
        <StudentQuizzes/>
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
