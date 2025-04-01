
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, BookOpen, Award, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');
  
  if (!user) {
    return (
      <div className="mtech-container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <Button>Sign In</Button>
      </div>
    );
  }
  
  // Calculate overall progress
  const overallProgress = user.progress ? 
    Object.values(user.progress).reduce((acc, curr) => {
      acc.completed += curr.completed;
      acc.total += curr.total;
      return acc;
    }, { completed: 0, total: 0 }) : 
    { completed: 0, total: 0 };
  
  const completionPercentage = overallProgress.total > 0 ? 
    Math.round((overallProgress.completed / overallProgress.total) * 100) : 0;
  
  // Define badges
  const badges = [
    { 
      id: 'welcome', 
      name: 'Welcome!', 
      description: 'Joined MTECH Kids Explore', 
      icon: '👋', 
      earned: true
    },
    { 
      id: 'eager_learner', 
      name: 'Eager Learner', 
      description: 'Completed 5+ lessons', 
      icon: '📚', 
      earned: user.earnedBadges?.includes('eager_learner') || false
    },
    { 
      id: 'math_wizard', 
      name: 'Math Wizard', 
      description: 'Completed all math lessons', 
      icon: '🧮', 
      earned: user.progress?.['mathematics']?.completed === user.progress?.['mathematics']?.total
    },
    { 
      id: 'science_explorer', 
      name: 'Science Explorer', 
      description: 'Completed 3+ science quizzes', 
      icon: '🔬', 
      earned: false
    },
    { 
      id: 'perfect_score', 
      name: 'Perfect Score', 
      description: 'Scored 100% on a quiz', 
      icon: '🏆', 
      earned: false
    },
    { 
      id: 'reading_champion', 
      name: 'Reading Champion', 
      description: 'Read 10+ lessons', 
      icon: '📖', 
      earned: false
    },
    { 
      id: 'quiz_master', 
      name: 'Quiz Master', 
      description: 'Completed 20+ quizzes', 
      icon: '✅', 
      earned: false
    },
    { 
      id: 'consistent_learner', 
      name: 'Consistent Learner', 
      description: 'Logged in for 5 consecutive days', 
      icon: '📆', 
      earned: false
    },
  ];
  
  return (
    <div className="mtech-container py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* User Card */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-mtech-primary text-white text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                  {user.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-mtech-primary">
                    {user.completedLessons?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-mtech-secondary">
                    {badges.filter(b => b.earned).length}
                  </p>
                  <p className="text-xs text-gray-500">Badges</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-mtech-primary">
                    {completionPercentage}%
                  </p>
                  <p className="text-xs text-gray-500">Progress</p>
                </div>
              </div>
              
              <Button variant="outline" className="mt-2 w-full">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          
          {/* Additional information for the user */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                {user.grade && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Grade</p>
                    <p>Grade {user.grade}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p>October 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="progress" className="flex-1">
                <BarChart3 className="mr-2 h-4 w-4" />
                Learning Progress
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex-1">
                <Award className="mr-2 h-4 w-4" />
                Badges & Achievements
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed Lessons
              </TabsTrigger>
            </TabsList>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                  <CardDescription>
                    You have completed {overallProgress.completed} out of {overallProgress.total} lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium">{completionPercentage}% Complete</span>
                    <span className="text-sm text-muted-foreground">
                      {overallProgress.completed}/{overallProgress.total}
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  
                  <div className="mt-8 space-y-6">
                    <h3 className="font-medium">Progress by Subject</h3>
                    
                    {user.progress && Object.entries(user.progress).length > 0 ? (
                      Object.entries(user.progress).map(([subjectId, data]) => {
                        const subjectPercentage = Math.round((data.completed / data.total) * 100);
                        return (
                          <div key={subjectId} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="capitalize">{subjectId}</span>
                              <span className="text-sm text-muted-foreground">
                                {data.completed}/{data.total}
                              </span>
                            </div>
                            <Progress value={subjectPercentage} className="h-2" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <BookOpen className="mx-auto h-10 w-10 opacity-20 mb-2" />
                        <p>No progress data yet. Start learning to track your progress!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Badges Tab */}
            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Badges & Achievements</CardTitle>
                  <CardDescription>
                    You have earned {badges.filter(b => b.earned).length} out of {badges.length} badges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {badges.map(badge => (
                      <div 
                        key={badge.id} 
                        className={`p-4 rounded-lg border text-center ${badge.earned ? 'border-mtech-primary bg-mtech-primary/5' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-medium text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        {badge.earned ? (
                          <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Earned
                          </span>
                        ) : (
                          <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                            Locked
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Completed Lessons Tab */}
            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Lessons</CardTitle>
                  <CardDescription>
                    Your learning history and completed items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.completedLessons && user.completedLessons.length > 0 ? (
                    <div className="space-y-4">
                      {/* This would be fetched from an API in a real app */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Mathematics: Basic Addition</h4>
                            <p className="text-sm text-muted-foreground">Video • 14 min</p>
                          </div>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">English: Reading Comprehension</h4>
                            <p className="text-sm text-muted-foreground">Quiz • 10 questions</p>
                          </div>
                          <span className="text-xs text-muted-foreground">3 days ago</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Mathematics: Counting Numbers</h4>
                            <p className="text-sm text-muted-foreground">Video • 8 min</p>
                          </div>
                          <span className="text-xs text-muted-foreground">4 days ago</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <BookOpen className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>You haven't completed any lessons yet.</p>
                      <Button className="mt-4" variant="outline">Browse Lessons</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
