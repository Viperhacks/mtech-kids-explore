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
  
  const badges = user?.earnedBadges || [];
  
  const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Student');
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const suggestedResources = [
    {
      id: 1,
      title: 'Basic Fractions',
      description: 'Learn how to identify and work with basic fractions',
      duration: '15 minutes',
      path: '/lessons/fractions'
    },
    {
      id: 2,
      title: 'Reading Comprehension',
      description: 'Practice understanding story elements',
      duration: '10 minutes',
      path: '/lessons/reading-comprehension'
    },
    {
      id: 3,
      title: 'Animal Habitats',
      description: 'Learn about different animal homes and environments',
      duration: '20 minutes',
      path: '/lessons/animal-habitats'
    }
  ];
  

  
  return (
    <div className="space-y-8">
      <div className="px-4 pt-6 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left md:mb-0 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
          Hello, {capitalize(displayName.split(' ')[0] || 'Student')}!
          </h1>
        </div>
        <div className="text-left md:text-right">
          <Button 
            onClick={() => navigate(`/grade/grade${getRecommendedGrade()}`)}
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
                  onClick={() => navigate(`/grade/grade${getRecommendedGrade()}/subject/mathematics`)}
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
                  onClick={() => navigate(`/grade/grade${getRecommendedGrade()}/subject/english`)}
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
                  onClick={() => navigate(`/grade/grade${getRecommendedGrade()}/subject/science`)}
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
                  <div key={badge} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center border ${badge === 'welcome' ? 'bg-amber-50 border-amber-200' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge === 'welcome' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-400'}`}>
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-sm">{badge}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{badge === 'welcome' ? 'Joined the platform' : 'Completed lessons'}</p>
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
