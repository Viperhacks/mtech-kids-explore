
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Book, Video, FileText, Award, Users, User } from 'lucide-react';
import DefaultLoginInfo from '../DefaultLoginInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StudentDashboardProps {
  isParent?: boolean;
  studentId?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ isParent = false, studentId }) => {
  const { user, getStudentData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If this is a parent view and we have a studentId, fetch that student's data
    const fetchStudentData = async () => {
      if (isParent && user?.parentOf && user.parentOf.length > 0) {
        setIsLoading(true);
        try {
          // If studentId is provided, use that, otherwise use the first student in the list
          const targetStudentId = studentId || user.parentOf[0];
          const data = await getStudentData(targetStudentId);
          if (data) {
            setStudentData(data);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchStudentData();
  }, [isParent, user, studentId, getStudentData]);
  
  // Use either the fetched student data (for parent view) or the current user (for student view)
  const displayUser = isParent ? studentData : user;
  
  // Calculate overall progress
  const overallProgress = displayUser?.progress ? 
    Object.values(displayUser.progress).reduce((acc: any, curr: any) => {
      acc.completed += curr.completed;
      acc.total += curr.total;
      return acc;
    }, { completed: 0, total: 0 }) : 
    { completed: 0, total: 0 };
  
  const completionPercentage = overallProgress.total > 0 ? 
    Math.round((overallProgress.completed / overallProgress.total) * 100) : 0;

  // If parent but no student data yet, show loading state
  if (isParent && isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        <div className="flex justify-center items-center p-12">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Loading Student Data</CardTitle>
              <CardDescription>Please wait while we fetch the student's information</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div className="animate-spin w-8 h-8 border-4 border-mtech-primary border-t-transparent rounded-full"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Parent view with no students
  if (isParent && (!user?.parentOf || user.parentOf.length === 0)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Parent Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Students Connected</CardTitle>
            <CardDescription>You haven't connected to any student accounts yet.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-center mb-4">Connect to your child's account to view their progress and activities.</p>
            <Button asChild>
              <Link to="/profile">Connect Student Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {isParent ? 'Student Dashboard' : 'Student Dashboard'}
        {isParent && studentData && (
          <span className="text-base font-normal ml-2 text-muted-foreground">
            Viewing: {studentData.name}
          </span>
        )}
      </h1>
      
      {isParent && user?.parentOf && user.parentOf.length > 1 && (
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.parentOf.map((childId, index) => (
              <Button 
                key={childId} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Child {index + 1}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Overall learning completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Overall Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} />
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {displayUser?.completedLessons && displayUser.completedLessons.length > 0 ? (
                <p>Completed {displayUser.completedLessons.length} lessons</p>
              ) : (
                <p>No recent activity</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">View All Activities</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Badges Card */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Badges earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {displayUser?.earnedBadges && displayUser.earnedBadges.map((badge: string, index: number) => (
                <div key={index} className="flex items-center justify-center h-12 w-12 rounded-full bg-mtech-primary/10 text-mtech-primary">
                  <Award className="h-6 w-6" />
                </div>
              ))}
              {(!displayUser?.earnedBadges || displayUser.earnedBadges.length === 0) && (
                <p>No badges earned yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Continue Learning</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-mtech-primary text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                <Video className="h-6 w-6" />
              </div>
            </div>
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Mathematics: Basic Addition</CardTitle>
            <CardDescription className="text-xs">14 min • Ms. Johnson</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button size="sm" className="w-full" asChild>
              <Link to="/tutorials">Continue Learning</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-mtech-primary text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">English: Reading Comprehension</CardTitle>
            <CardDescription className="text-xs">Quiz • 10 questions</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button size="sm" className="w-full" asChild>
              <Link to="/exercises">Start Quiz</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-mtech-primary text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                <Book className="h-6 w-6" />
              </div>
            </div>
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Science: Plants & Growth</CardTitle>
            <CardDescription className="text-xs">Interactive Lesson • Mr. Thomas</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button size="sm" className="w-full" asChild>
              <Link to="/tutorials">Explore Lesson</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Recommended Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/grade/1" className="block">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Grade 1 Resources</CardTitle>
              <CardDescription>Core subjects for Grade 1 students</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">Explore Resources</Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/grade/2" className="block">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Grade 2 Resources</CardTitle>
              <CardDescription>Core subjects for Grade 2 students</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">Explore Resources</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
      
      <DefaultLoginInfo />
    </div>
  );
};

export default StudentDashboard;
