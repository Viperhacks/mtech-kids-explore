import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Upload, Users, FileText, Book, PlusCircle, Video, CheckCircle, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DefaultLoginInfo from '../DefaultLoginInfo';
import CourseEditor from '../CourseEditor';
import { getResources, deleteResource, getAllUsers, getAllStudents } from '@/services/apiService';
import { useIsMobile } from '@/hooks/use-mobile';
import StudentAccountCreation from '../StudentAccountCreation';
import api, { teacherService } from '@/lib/api';
import { PaginatedResponse, Student } from '../types/apiTypes';
import { capitalize } from '@/utils/stringUtils';
import { LineChart } from '@/components/ui/charts/LineChart';
import QuizManagement from '../QuizManagement';
import QuizCreationDialog from '../QuizCreationDialog';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State variables
  const [resources, setResources] = useState<any[]>([]);
  const [groupedResources, setGroupedResources] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceType, setResourceType] = useState('document');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  

  useEffect(() => {
    fetchResources();
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);


  
  
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await getResources();
      setResources(response.resources || []);
      const fetchedResources = response?.resources || [];

      const grouped = fetchedResources.reduce((acc, resource) => {
        const grade = resource.response.grade;
        if (!acc[grade]) {
          acc[grade] = [];
        }
        acc[grade].push(resource);
        return acc;
      }, {});
      console.log('Grouped Resources:', grouped);
      setGroupedResources(grouped);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Failed to load resources",
        description: "Could not load your learning materials. Please try again.",
        variant: "destructive"
      });
      setResources([
        {
          id: 'fallback-1',
          title: 'Introduction to Mathematics',
          type: 'document',
          grade: '6',
          subject: 'Mathematics',
          createdAt: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          title: 'Basic Science Concepts',
          type: 'video',
          grade: '6',
          subject: 'Science',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const itemsPerPage = 10;
const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(resources.length / itemsPerPage);
const paginatedResources = resources.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  
  const fetchStudents = async () => {
    setIsStudentsLoading(true);
    try {
      const response: PaginatedResponse<Student> = await api.get("/teacher/students");
      console.log("fetched students paginated response", response);
  
      // Fix: The response is already unwrapped by the axios interceptor in api.ts
      if (!Array.isArray(response?.content)) {
        throw new Error('Missing or invalid content in response');
      }
  
      if (response.content.length === 0) {
        console.warn('No students found in response');
        setStudents([]);
        return;
      }
  
      const formattedStudents = response.content.map((student, i) => ({
        id: student.id ?? `student-${i}`,
        fullName: student.fullName || 'Unnamed Student',
        username: student.username || '',
        email: student.email || '',
        gradeLevel: student.gradeLevel || 'N/A',
        role: student.role || 'STUDENT'
      }));
  
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
  
      toast({
        title: "Failed to load students",
        description: error instanceof Error 
          ? error.message 
          : "Could not load student data. Please try again.",
        variant: "destructive"
      });
  
      setStudents([]);
    } finally {
      setIsStudentsLoading(false);
    }
  };
  
  
  
  
  
  
  
  
  
  
  const handleCreateNew = (type: string = 'document') => {
    setSelectedResource(null);
    setResourceType(type);
    setIsEditing(true);
  };
  
  const handleEditResource = (resource: any) => {
    setSelectedResource(resource.response);
    setResourceType(resource.response.type || 'document');
    setIsEditing(true);
  };
  
  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      toast({
        title: "Resource Deleted",
        description: "The learning material has been successfully deleted."
      });
      fetchResources();
    } catch (error) {
      console.error('Delete failed', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the resource. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveComplete = () => {
    setIsEditing(false);
    fetchResources();
  };
  
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      case 'document':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'quiz':
        return <CheckCircle className="h-4 w-4 mr-2" />;
      default:
        return <Book className="h-4 w-4 mr-2" />;
    }
  };
  
  const recentUploads = resources
  .slice() 
  .reverse()
  .slice(0, 3)
  .map(resource => ({
    id: resource.response.id,
    title: resource.response.title,
    type:
      resource.response.type?.charAt(0).toUpperCase() +
        resource.response.type?.slice(1) || "Document",
    date: new Date(resource.response.createdAt || Date.now()).toLocaleDateString(),
    status: "Published",
  }));

  
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
        <TabsList className={`mb-6 ${isMobile ? 'grid grid-cols-2 gap-2 ' : ''}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">My Materials</TabsTrigger>
 
          <TabsTrigger value="quiz_management">Quiz Management</TabsTrigger>

           {!isMobile &&<TabsTrigger value="students">Students</TabsTrigger>}
           {!isMobile &&<TabsTrigger value="accounts">Student Accounts</TabsTrigger>}
          {!isMobile && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>
 


       <TabsContent value="quiz_management">
      <QuizManagement/>
       </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>

              <CardHeader>
                <CardTitle>Resources Created</CardTitle>
                <CardDescription>Videos, documents & quizzes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full flex items-center justify-start" 
                  variant="outline"
                  onClick={() => handleCreateNew('document')}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
                <Button 
                  className="w-full flex items-center justify-start" 
                  variant="outline"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <FileText className="mr-2 h-4 w-4" /> Create Quiz
                </Button>
                <Button 
    className="w-full flex items-center justify-start" 
    variant="outline"
    onClick={() => handleCreateNew('video')}
  >
    <Video className="mr-2 h-4 w-4" /> Upload Video
  </Button>
                <Button 
                  className="w-full flex items-center justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('students')}
                >
                  <Users className="mr-2 h-4 w-4" /> View Students
                </Button>
                <Button 
                  className="w-full flex items-center justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('accounts')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Student Account
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>Average completion rate</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-2 " : ""}>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        {!isMobile && <TableHead>Date</TableHead>}
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUploads.length > 0 ? (
                        recentUploads.map(upload => (
                          <TableRow key={upload.id}>
                            <TableCell className="font-medium">{upload.title}</TableCell>
                            <TableCell>{upload.type}</TableCell>
                            {!isMobile && <TableCell>{upload.date}</TableCell>}
                            <TableCell>
                              <Badge 
                                variant={upload.status === "Published" ? "default" : "secondary"}
                                className={`px-2 py-1 text-xs`}
                              >
                                {upload.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-4 text-muted-foreground">
                            No uploads yet. Create your first resource!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
         
        <div className="mb-8">
  <h2 className="text-xl font-semibold mb-4">Manage Grade Resources</h2>

 <div className="space-y-6">
  {Object.entries(
    resources.reduce<Record<string, typeof resources>>((acc, res) => {
      const grade = res.response.grade;
      if (!acc[grade]) acc[grade] = [];
      acc[grade].push(res);
      return acc;
    }, {})
  ).map(([grade, resArray]) => (
    <Card key={grade} className="border p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Grade {grade}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {resArray.length} total resources
        </CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
              <div className="flex flex-nowrap gap-4 py-2">
                {Array.from(
                  new Map(resArray.map(r => [r.response.subject, r])).values()
                ).map(subjectResource => {
                  const subject = subjectResource.response.subject;
                  const subjectResources = resArray.filter(
                    r => r.response.subject === subject
                  );
                  const hasVideo = subjectResources.some(
                    r => r.response.type === "video"
                  );
                  const linkTo = hasVideo
                    ? `/grade/grade${grade}/subject/${subject}`
                    : `/revision`;

                  const counts = subjectResources.reduce((acc, r) => {
                    acc[r.response.type] = (acc[r.response.type] || 0) + 1;
                    return acc;
                  }, {});

                  return (
                    <div
                      key={subject}
                      className="flex-shrink-0 border rounded-lg p-3 flex flex-col justify-between w-48"
                    >
                      <div>
                        <h4 className="font-medium">{capitalize(subject)}</h4>
                        <p className="text-xs text-muted-foreground">
                          {subjectResources.length} resources
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {counts.video && (
                            <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                              <Video className="mr-2 h-4 w-4" /> {counts.video}
                            </span>
                          )}
                          {counts.document && (
                            <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                              <FileText className="mr-2 h-4 w-4" /> {counts.document}
                            </span>
                          )}
                          {counts.quiz && (
                            <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                              <Trophy className="mr-2 h-4 w-4" /> {counts.quiz}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="mt-4" asChild>
                        <Link to={linkTo}>{hasVideo ? "View" : "Revise"}</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>

      
     
    </Card>
  ))}
</div>




</div>







        </TabsContent>
        
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>My Learning Materials</CardTitle>
                  <CardDescription>Manage all your teaching resources</CardDescription>
                </div>
               

<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
  <Button
    className="flex-1 flex items-center justify-center"
    onClick={() => handleCreateNew('document')}
  >
    <FileText className="mr-2 h-4 w-4" />
    Upload Document
  </Button>

  <Button
    className="flex-1 flex items-center justify-center"
    onClick={() => setShowCreateDialog(true)}
    variant="outline"
  >
    <CheckCircle className="mr-2 h-4 w-4" />
    Create Quiz
  </Button>

  <Button
    className="flex-1 flex items-center justify-center"
    onClick={() => handleCreateNew('video')}
    variant="outline"
  >
    <Video className="mr-2 h-4 w-4" />
    Upload Video
  </Button>
</div>

              </div>
            </CardHeader>
            <CardContent className={isMobile ? "px-2" : ""}>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : resources.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        {!isMobile && <TableHead>Grade</TableHead>}
                        {!isMobile && <TableHead>Subject</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResources.map(resource => (
                        <TableRow key={resource.response.id}>
                          <TableCell className="font-medium">{resource.response.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getResourceTypeIcon(resource.response.type)}
                              {resource.response.type?.charAt(0).toUpperCase() + resource.response.type?.slice(1) || 'Document'}
                            </div>
                          </TableCell>
                          {!isMobile && <TableCell>Grade {resource.response.grade}</TableCell>}
                          {!isMobile && <TableCell>{resource.response.subject}</TableCell>}
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditResource(resource)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteResource(resource.response.id)}>
                              Delete 
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {totalPages > 1 && (
  <div className="flex justify-end items-center mt-4 gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    >
      Previous
    </Button>
    <span className="text-sm text-muted-foreground">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    >
      Next
    </Button>
  </div>
)}

                </div>
              ) : (
                <div className="text-center py-10">
                  <Book className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="font-medium text-lg">No materials yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your first learning resource</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => handleCreateNew('document')}>
                      <FileText className="mr-2 h-4 w-4" /> Upload Document
                    </Button>
 
                    <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" /> Create Quiz
                    </Button>

                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/course-creation">Create New Resource</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="quizzes" className="space-y-4">
          <QuizManagement />
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
              {isStudentsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : students.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        {!isMobile && <TableHead>Grade</TableHead>}
                        {/*<TableHead>Last Active</TableHead>*/}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
  {students.map((student, index) => (
    <TableRow key={index}>
      <TableCell className="font-medium">
        {capitalize(student.fullName) || 'Unnamed'}
      </TableCell>

      <TableCell>
        {student.username || 'No username'}
      </TableCell>

      {!isMobile && (
        <TableCell>
          Grade {student.gradeLevel || 'N/A'}
        </TableCell>
      )}

      

      <TableCell className="text-right">
        <Button variant="ghost" size="sm">View Progress</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

                  </Table>
                  //?Todo add pagination here
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

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Student Account</CardTitle>
              <CardDescription>Add new students to your class</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentAccountCreation />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
 
      
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResource ? 'Edit Resource' : resourceType === 'quiz' ? 'Create New Quiz' : 'Upload New Resource'}</DialogTitle>
            <DialogDescription>
              {selectedResource 
                ? 'Modify your existing learning material' 
                : resourceType === 'quiz' 
                  ? 'Create a new quiz for your students'
                  : 'Add a new learning resource for your students'
              }
            </DialogDescription>
          </DialogHeader>
          <CourseEditor 
            resource={selectedResource} 
            onSave={handleSaveComplete} 
            onCancel={() => setIsEditing(false)}
            isNew={!selectedResource}
            initialType={resourceType}
          />
        </DialogContent>
      </Dialog>
       <QuizCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onQuizCreated={null}
      />


    </div>
  );
};

export default TeacherDashboard;
