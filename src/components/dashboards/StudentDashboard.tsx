
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Book, Video, FileText, Award } from 'lucide-react';
import DefaultLoginInfo from '../DefaultLoginInfo';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate overall progress
  const overallProgress = user?.progress ? 
    Object.values(user.progress).reduce((acc, curr) => {
      acc.completed += curr.completed;
      acc.total += curr.total;
      return acc;
    }, { completed: 0, total: 0 }) : 
    { completed: 0, total: 0 };
  
  const completionPercentage = overallProgress.total > 0 ? 
    Math.round((overallProgress.completed / overallProgress.total) * 100) : 0;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
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
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.completedLessons && user.completedLessons.length > 0 ? (
                <p>You've completed {user.completedLessons.length} lessons</p>
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
            <CardDescription>Badges you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {user?.earnedBadges && user.earnedBadges.map((badge, index) => (
                <div key={index} className="flex items-center justify-center h-12 w-12 rounded-full bg-mtech-primary/10 text-mtech-primary">
                  <Award className="h-6 w-6" />
                </div>
              ))}
              {(!user?.earnedBadges || user.earnedBadges.length === 0) && (
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
            <Button size="sm" className="w-full">Continue Learning</Button>
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
            <Button size="sm" className="w-full">Start Quiz</Button>
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
            <Button size="sm" className="w-full">Explore Lesson</Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
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
