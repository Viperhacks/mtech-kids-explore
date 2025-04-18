
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, Award, Clock, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserActivity from './UserActivity';

interface StudentDashboardProps {
  isParent?: boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ isParent = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Helper function to safely calculate progress
  const calculateProgress = (subject: string): { progress: number, completed: number, total: number } => {
    if (!user?.progress || !user.progress[subject]) {
      return { progress: 0, completed: 0, total: 10 };
    }
    
    const subjectProgress = user.progress[subject];
    const completed = subjectProgress.completed || 0;
    const total = subjectProgress.total || 10;
    const progress = Math.round((completed / total) * 100);
    
    return { progress, completed, total };
  };
  
  const getRecommendedGrade = () => {
    return user?.grade || user?.gradeLevel || '1';
  };
  
  // Badges earned by student
  const badges = user?.earnedBadges || [];
  
  // Get user's display name
  const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Student');
  
  return (
    <div className="space-y-8">
      <div className="px-4 pt-6 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left md:mb-0 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {displayName.split(' ')[0] || 'Student'}!
          </h1>
        </div>
        <div className="text-left md:text-right">
          <Button 
            onClick={() => navigate(`/grade/${getRecommendedGrade()}`)}
            className="bg-mtech-primary hover:bg-mtech-dark text-white"
          >
            Continue Learning
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="progress">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 p-2 rounded-full">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  Mathematics
                </CardTitle>
                <CardDescription>Grade {getRecommendedGrade()} Mathematics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {calculateProgress('math').completed}/{calculateProgress('math').total} lessons
                    </span>
                  </div>
                  <Progress value={calculateProgress('math').progress} className="h-2" />
                </div>
                <Button
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/grade/${getRecommendedGrade()}/subject/math`)}
                >
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 p-2 rounded-full">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  English
                </CardTitle>
                <CardDescription>Grade {getRecommendedGrade()} English</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {calculateProgress('english').completed}/{calculateProgress('english').total} lessons
                    </span>
                  </div>
                  <Progress value={calculateProgress('english').progress} className="h-2" />
                </div>
                <Button
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/grade/${getRecommendedGrade()}/subject/english`)}
                >
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 p-2 rounded-full">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  Science
                </CardTitle>
                <CardDescription>Grade {getRecommendedGrade()} Science</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {calculateProgress('science').completed}/{calculateProgress('science').total} lessons
                    </span>
                  </div>
                  <Progress value={calculateProgress('science').progress} className="h-2" />
                </div>
                <Button
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/grade/${getRecommendedGrade()}/subject/science`)}
                >
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Suggested Resources</CardTitle>
              <CardDescription>
                Based on your recent activity and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start p-6 h-auto">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">15 minutes</span>
                    </div>
                    <h3 className="text-lg font-medium">Basic Fractions</h3>
                    <p className="text-sm text-muted-foreground text-left">
                      Learn how to identify and work with basic fractions
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start p-6 h-auto">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">10 minutes</span>
                    </div>
                    <h3 className="text-lg font-medium">Reading Comprehension</h3>
                    <p className="text-sm text-muted-foreground text-left">
                      Practice understanding story elements
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start p-6 h-auto">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">20 minutes</span>
                    </div>
                    <h3 className="text-lg font-medium">Animal Habitats</h3>
                    <p className="text-sm text-muted-foreground text-left">
                      Learn about different animal homes and environments
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Badges</CardTitle>
              <CardDescription>Achievements you've earned through learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${badges.includes('welcome') ? 'bg-amber-50 border-amber-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badges.includes('welcome') ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-400'}`}>
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-sm">Welcome</h3>
                  <p className="text-xs text-muted-foreground mt-1">Joined the platform</p>
                </div>
                
                <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${badges.includes('eager_learner') ? 'bg-blue-50 border-blue-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badges.includes('eager_learner') ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-400'}`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-sm">Eager Learner</h3>
                  <p className="text-xs text-muted-foreground mt-1">Completed 5 lessons</p>
                </div>
                
                <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${badges.includes('math_whiz') ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badges.includes('math_whiz') ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-sm">Math Whiz</h3>
                  <p className="text-xs text-muted-foreground mt-1">Mastered math basics</p>
                </div>
                
                <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${badges.includes('reading_star') ? 'bg-purple-50 border-purple-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badges.includes('reading_star') ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-400'}`}>
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-sm">Reading Star</h3>
                  <p className="text-xs text-muted-foreground mt-1">Completed all reading lessons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          {user?.id && <UserActivity/>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
