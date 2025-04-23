
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/charts/BarChart';
import { PieChart } from '@/components/ui/charts/PieChart';
import { LineChart } from '@/components/ui/charts/LineChart';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getAllStudents, getSystemStats, getResourceStats } from '@/services/apiService';
import { PaginatedResponse, Student } from '@/components/types/apiTypes';
import { Loader2 } from 'lucide-react';

// Extended Student interface to include the missing properties
interface ExtendedStudent extends Student {
  name?: string;
  progress?: number;
  lastActive?: string;
}

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [resourceStats, setResourceStats] = useState<any>(null);
  const [systemStats, setSystemStats] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get students for this teacher
        const studentData: PaginatedResponse<Student> = await getAllStudents();
        
        // Access the content array safely, using an empty array if not available
        const studentsContent = studentData && studentData.content 
          ? studentData.content 
          : [];
          
        setStudents(studentsContent);
        
        const systemStatsData = await getSystemStats();
        setSystemStats(systemStatsData);
        
        const resourceStatsData = await getResourceStats();
        setResourceStats(resourceStatsData);
        
      } catch (error) {
        console.error("Error loading teacher dashboard data:", error);
        toast({
          title: "Error Loading Dashboard",
          description: "There was an error loading your dashboard data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-mtech-primary" />
      </div>
    );
  }

  // Sample chart data (replace with real data from your API)
  const resourceTypeData = [
    { name: 'Videos', value: resourceStats?.videoCount || 12 },
    { name: 'Documents', value: resourceStats?.documentCount || 8 },
    { name: 'Quizzes', value: resourceStats?.quizCount || 5 },
  ];

  const subjectData = [
    { name: 'Math', value: resourceStats?.subjectCounts?.math || 10 },
    { name: 'Science', value: resourceStats?.subjectCounts?.science || 7 },
    { name: 'English', value: resourceStats?.subjectCounts?.english || 4 },
    { name: 'History', value: resourceStats?.subjectCounts?.history || 3 },
  ];

  const studentActivityData = [
    { name: 'Monday', value: systemStats?.dailyActivity?.[0] || 24 },
    { name: 'Tuesday', value: systemStats?.dailyActivity?.[1] || 18 },
    { name: 'Wednesday', value: systemStats?.dailyActivity?.[2] || 30 },
    { name: 'Thursday', value: systemStats?.dailyActivity?.[3] || 27 },
    { name: 'Friday', value: systemStats?.dailyActivity?.[4] || 15 },
    { name: 'Saturday', value: systemStats?.dailyActivity?.[5] || 8 },
    { name: 'Sunday', value: systemStats?.dailyActivity?.[6] || 7 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || 'Teacher'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/course-creation">Create Course</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/student-accounts">Manage Students</Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>Students assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resources Created</CardTitle>
                <CardDescription>Videos, documents & quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(resourceStats?.videoCount || 0) + 
                   (resourceStats?.documentCount || 0) + 
                   (resourceStats?.quizCount || 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>Average completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats?.avgCompletionRate || 78}%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
                <CardDescription>By type</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={resourceTypeData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Activity</CardTitle>
                <CardDescription>Lessons viewed this week</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={studentActivityData} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Subject Coverage</CardTitle>
              <CardDescription>Resources by subject area</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={subjectData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Resources</CardTitle>
              <CardDescription>All teaching materials you've created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{resourceStats?.videoCount || 12}</span>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/resources?type=video">View All</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{resourceStats?.documentCount || 8}</span>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/resources?type=document">View All</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">{resourceStats?.quizCount || 5}</span>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/resources?type=quiz">View All</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Resource Performance</h3>
                <div className="space-y-4">
                  <div className="bg-muted rounded p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Grade 3 Science: States of Matter</span>
                      <span className="text-muted-foreground">82% completion</span>
                    </div>
                    <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-mtech-primary rounded-full" style={{width: '82%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Grade 2 Math: Addition Quiz</span>
                      <span className="text-muted-foreground">95% completion</span>
                    </div>
                    <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-mtech-primary rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Grade 1 Reading: Letter Sounds</span>
                      <span className="text-muted-foreground">67% completion</span>
                    </div>
                    <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full bg-mtech-primary rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/course-creation">Create New Resource</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>View and manage your students</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/student-accounts">Add Students</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-4 font-medium p-4 border-b bg-muted">
                    <div>Name</div>
                    <div>Grade</div>
                    <div>Progress</div>
                    <div>Last Active</div>
                  </div>
                  
                  <div className="divide-y">
                    {students.map((student) => (
                      <div key={student.id} className="grid grid-cols-4 p-4 hover:bg-muted/50">
                        <div className="font-medium">{student.name || student.username || student.fullName}</div>
                        <div>Grade {student.gradeLevel || "N/A"}</div>
                        <div>
                          <div className="flex items-center">
                            <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-mtech-primary rounded-full" 
                                style={{width: `${student.progress || 0}%`}}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">{student.progress || 0}%</span>
                          </div>
                        </div>
                        <div className="text-muted-foreground">{student.lastActive || "Never"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No students assigned yet</p>
                  <Button asChild>
                    <Link to="/student-accounts">Add Students</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={[
                  { name: 'Math', value: 78 },
                  { name: 'Reading', value: 82 },
                  { name: 'Science', value: 76 },
                  { name: 'Social Studies', value: 85 },
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
