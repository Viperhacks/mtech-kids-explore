
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, BookOpen, Award, BarChart3, CheckCircle, Users, PenTool } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileEdit from '@/components/ProfileEdit';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) {
    return (
      <div className="mtech-container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <Button>Sign In</Button>
      </div>
    );
  }
  
  // Calculate overall progress - only relevant for students
  const overallProgress = user.role === 'student' && user.progress ? 
    Object.values(user.progress).reduce((acc, curr) => {
      acc.completed += curr.completed;
      acc.total += curr.total;
      return acc;
    }, { completed: 0, total: 0 }) : 
    { completed: 0, total: 0 };
  
  const completionPercentage = overallProgress.total > 0 ? 
    Math.round((overallProgress.completed / overallProgress.total) * 100) : 0;
  
  // Define badges with role filtering
  const badges = [
    { 
      id: 'welcome', 
      name: 'Welcome!', 
      description: 'Joined MTECH Kids Explore', 
      icon: '👋', 
      earned: true,
      roles: ['student', 'teacher', 'admin']
    },
    { 
      id: 'eager_learner', 
      name: 'Eager Learner', 
      description: 'Completed 5+ lessons', 
      icon: '📚', 
      earned: user.earnedBadges?.includes('eager_learner') || false,
      roles: ['student']
    },
    { 
      id: 'math_wizard', 
      name: 'Math Wizard', 
      description: 'Completed all math lessons', 
      icon: '🧮', 
      earned: user.progress?.['mathematics']?.completed === user.progress?.['mathematics']?.total,
      roles: ['student']
    },
    { 
      id: 'science_explorer', 
      name: 'Science Explorer', 
      description: 'Completed 3+ science quizzes', 
      icon: '🔬', 
      earned: false,
      roles: ['student']
    },
    { 
      id: 'perfect_score', 
      name: 'Perfect Score', 
      description: 'Scored 100% on a quiz', 
      icon: '🏆', 
      earned: false,
      roles: ['student']
    },
    { 
      id: 'reading_champion', 
      name: 'Reading Champion', 
      description: 'Read 10+ lessons', 
      icon: '📖', 
      earned: false,
      roles: ['student']
    },
    { 
      id: 'quiz_master', 
      name: 'Quiz Master', 
      description: 'Completed 20+ quizzes', 
      icon: '✅', 
      earned: false,
      roles: ['student']
    },
    { 
      id: 'consistent_learner', 
      name: 'Consistent Learner', 
      description: 'Logged in for 5 consecutive days', 
      icon: '📆', 
      earned: false,
      roles: ['student']
    },
    { 
      id: 'helpful_teacher', 
      name: 'Helpful Teacher', 
      description: 'Created content that helped many students', 
      icon: '🏆', 
      earned: false,
      roles: ['teacher']
    },
    { 
      id: 'content_creator', 
      name: 'Content Creator', 
      description: 'Created multiple high-quality learning resources', 
      icon: '✏️', 
      earned: false,
      roles: ['teacher']
    },
  ];
  
  // Filter badges by user role
  const filteredBadges = badges.filter(badge => badge.roles.includes(user.role));
  
  if (isEditing) {
    return (
      <div className="mtech-container py-8">
        <ProfileEdit onCancel={() => setIsEditing(false)} />
      </div>
    );
  }
  
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
                  {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                {user.role === 'student' && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-primary">
                        {user.completedLessons?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Lessons</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-secondary">
                        {filteredBadges.filter(b => b.earned).length}
                      </p>
                      <p className="text-xs text-gray-500">Badges</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-primary">
                        {completionPercentage}%
                      </p>
                      <p className="text-xs text-gray-500">Progress</p>
                    </div>
                  </>
                )}
                
                {user.role === 'teacher' && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-primary">
                        0
                      </p>
                      <p className="text-xs text-gray-500">Resources</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-secondary">
                        {filteredBadges.filter(b => b.earned).length}
                      </p>
                      <p className="text-xs text-gray-500">Badges</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-primary">
                        0
                      </p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-primary">
                        0
                      </p>
                      <p className="text-xs text-gray-500">Teachers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-secondary">
                        0
                      </p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-mtech-primary">
                        0
                      </p>
                      <p className="text-xs text-gray-500">Resources</p>
                    </div>
                  </>
                )}
              </div>
              
              <Button variant="outline" className="mt-2 w-full" onClick={() => setIsEditing(true)}>
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
                {user.school && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">School</p>
                    <p>{user.school}</p>
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
        
        {/* Main Content - Different tabs based on role */}
        <div className="w-full md:w-2/3">
          {user.role === 'student' && (
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
              
              {/* Progress Tab - Student only */}
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
              
              {/* Badges Tab - Filtered by role */}
              <TabsContent value="badges" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Badges & Achievements</CardTitle>
                    <CardDescription>
                      You have earned {filteredBadges.filter(b => b.earned).length} out of {filteredBadges.length} badges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredBadges.map(badge => (
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
              
              {/* Completed Lessons Tab - Student only */}
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
                        <Button className="mt-4" variant="outline" asChild>
                          <Link to="/tutorials">Browse Lessons</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Teacher specific tabs */}
          {user.role === 'teacher' && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="resources" className="flex-1">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Resources
                </TabsTrigger>
                <TabsTrigger value="badges" className="flex-1">
                  <Award className="mr-2 h-4 w-4" />
                  Teacher Badges
                </TabsTrigger>
                <TabsTrigger value="students" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  My Students
                </TabsTrigger>
              </TabsList>
              
              {/* Teacher resources tab */}
              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">My Teaching Resources</CardTitle>
                    <CardDescription>
                      Resources you've created for students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <PenTool className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>You haven't created any resources yet.</p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link to="/dashboard">Create Resources</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Teacher badges tab */}
              <TabsContent value="badges" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Teacher Achievements</CardTitle>
                    <CardDescription>
                      Recognition for your teaching contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredBadges.map(badge => (
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
              
              {/* Teacher students tab */}
              <TabsContent value="students" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">My Students</CardTitle>
                    <CardDescription>
                      Students who have access to your materials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>No student data available yet.</p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link to="/dashboard">Manage Classes</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Admin specific tabs */}
          {user.role === 'admin' && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="users" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Platform Analytics
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Platform Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Admin users tab */}
              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manage Users</CardTitle>
                    <CardDescription>
                      View and manage all platform users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>User management tools are available on the admin dashboard.</p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link to="/dashboard">Go to Admin Dashboard</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Admin analytics tab */}
              <TabsContent value="analytics" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Analytics</CardTitle>
                    <CardDescription>
                      User engagement and platform statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <BarChart3 className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>Detailed analytics are available on the admin dashboard.</p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link to="/dashboard">View Analytics</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Admin settings tab */}
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Settings</CardTitle>
                    <CardDescription>
                      Configure system-wide settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <Settings className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p>Configure platform settings from the admin dashboard.</p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link to="/dashboard">System Settings</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
