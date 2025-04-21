
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Users, FileText, Book, PlusCircle, Video, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DefaultLoginInfo from '../DefaultLoginInfo';
import CourseEditor from '../CourseEditor';
import { getResources, deleteResource, getAllUsers } from '@/services/apiService';
import { useIsMobile } from '@/hooks/use-mobile';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);
  const [resourceType, setResourceType] = useState('document');
  
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
     // console.log(response.resources)
      // Filter to only show resources created by this teacher (in a real app)
      setResources(response.resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Failed to load resources",
        description: "Could not load your learning materials. Please try again.",
        variant: "destructive"
      });
      // Fallback data if API fails
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
  
  const fetchStudents = async () => {
    setIsStudentsLoading(true);
    try {
      // Use a filter to only get students
      const response = await getAllUsers(1, 50, { role: 'student' });
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Failed to load students",
        description: "Could not load student data. Please try again.",
        variant: "destructive"
      });
      // Fallback data for students
      setStudents([
        { id: 's1', name: 'Austine  Bro', email: 'austine@example.com', grade: '6', lastActive: '2 hours ago' },
        { id: 's2', name: 'Lavet  Mbewe', email: 'lavet@example.com', grade: '6', lastActive: '1 day ago' },
        { id: 's3', name: 'Loui Bro', email: 'loui@example.com', grade: '6', lastActive: '3 days ago' }
      ]);
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
  
  // Mock data for recent uploads - in a real app, this would come from the API
  const recentUploads = resources.slice(0, 3).map(resource => ({
    id: resource.response.id,
    title: resource.response.title,
    type: resource.response.type?.charAt(0).toUpperCase() + resource.response.type?.slice(1) || 'Document',
    date: new Date(resource.response.createdAt || Date.now()).toLocaleDateString(),
    status: "Published"
  }));
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Teacher Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`mb-6 ${isMobile ? 'grid grid-cols-2 gap-2' : ''}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">My Materials</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          {!isMobile && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>
      
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
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
                  onClick={() => handleCreateNew('quiz')}
                >
                  <FileText className="mr-2 h-4 w-4" /> Create Quiz
                </Button>
                <Button 
                  className="w-full flex items-center justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('students')}
                >
                  <Users className="mr-2 h-4 w-4" /> View Students
                </Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Your recently uploaded materials</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-2" : ""}>
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
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Manage Grade Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/grade/grade3" className="block">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Grade 3</CardTitle>
                  <CardDescription>Manage Grade 3 resources</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm">View Resources</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/grade/grade4" className="block">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Grade 4</CardTitle>
                  <CardDescription>Manage Grade 4 resources</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm">View Resources</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/grade/grade5" className="block">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Grade 5</CardTitle>
                  <CardDescription>Manage Grade 5 resources</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm">View Resources</Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>My Learning Materials</CardTitle>
                  <CardDescription>Manage all your teaching resources</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleCreateNew('document')}>
                    <FileText className="mr-2 h-4 w-4" /> Upload Document
                  </Button>
                  <Button onClick={() => handleCreateNew('quiz')} variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" /> Create Quiz
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={isMobile ? "px-2" : ""}>
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading resources...</p>
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
                      {resources.map(resource => (
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
                    <Button onClick={() => handleCreateNew('quiz')} variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" /> Create Quiz
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>View and manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              {isStudentsLoading ? (
                <div className="text-center py-10">
                  <p>Loading students...</p>
                </div>
              ) : students.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        {!isMobile && <TableHead>Grade</TableHead>}
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name || `${student.firstName || ''} ${student.lastName || ''}`}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          {!isMobile && <TableCell>Grade {student.grade || 'N/A'}</TableCell>}
                          <TableCell>{student.lastActive || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View Progress</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="font-medium text-lg">No students found</h3>
                  <p className="text-muted-foreground">You don't have any students assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Learning Analytics</CardTitle>
              <CardDescription>Track performance and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Book className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="font-medium text-lg">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Track student progress and engagement with your materials</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Course Editor Dialog - Fixed accessibility warning by adding DialogTitle */}
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
      
      
    </div>
  );
};

export default TeacherDashboard;
