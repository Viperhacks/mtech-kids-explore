
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
import { getResources, deleteResource } from '@/services/apiService';
import { useIsMobile } from '@/hooks/use-mobile';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchResources();
  }, []);
  
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await getResources();
      // Filter to only show resources created by this teacher (in a real app)
      setResources(response.data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Failed to load resources",
        description: "Could not load your learning materials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    setSelectedResource(null);
    setIsEditing(true);
  };
  
  const handleEditResource = (resource: any) => {
    setSelectedResource(resource);
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
    id: resource.id,
    title: resource.title,
    type: resource.type.charAt(0).toUpperCase() + resource.type.slice(1),
    date: new Date(resource.createdAt || Date.now()).toLocaleDateString(),
    status: "Published"
  }));
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Teacher Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`mb-6 ${isMobile ? 'grid grid-cols-2 gap-2' : ''}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">My Materials</TabsTrigger>
          {!isMobile && <TabsTrigger value="students">Students</TabsTrigger>}
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
                  onClick={handleCreateNew}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Resource
                </Button>
                <Button className="w-full flex items-center justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Create Quiz
                </Button>
                <Button className="w-full flex items-center justify-start" variant="outline">
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
            <Link to="/grade/1" className="block">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Grade 1</CardTitle>
                  <CardDescription>Manage Grade 1 resources</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm">View Resources</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/grade/2" className="block">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Grade 2</CardTitle>
                  <CardDescription>Manage Grade 2 resources</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm">View Resources</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/grade/3" className="block">
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
                <Button onClick={handleCreateNew}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New
                </Button>
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
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium">{resource.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getResourceTypeIcon(resource.type)}
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </div>
                          </TableCell>
                          {!isMobile && <TableCell>Grade {resource.grade}</TableCell>}
                          {!isMobile && <TableCell>{resource.subject}</TableCell>}
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditResource(resource)}>
                              Edit
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
                  <Button onClick={handleCreateNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Resource
                  </Button>
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
              <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="font-medium text-lg">Student Management Coming Soon</h3>
                <p className="text-muted-foreground">Track student progress and engagement</p>
              </div>
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
      
      {/* Course Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto">
          <CourseEditor 
            resource={selectedResource} 
            onSave={handleSaveComplete} 
            onCancel={() => setIsEditing(false)}
            isNew={!selectedResource}
          />
        </DialogContent>
      </Dialog>
      
      <DefaultLoginInfo />
    </div>
  );
};

export default TeacherDashboard;
