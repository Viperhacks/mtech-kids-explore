
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Upload, Users, FileText, Book, PlusCircle, Video, CheckCircle, ArrowUpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DefaultLoginInfo from '../DefaultLoginInfo';

const TeacherDashboard: React.FC = () => {
  const { user, uploadResource } = useAuth();
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    grade: '',
    subject: '',
    type: 'video',
    file: null as File | null,
  });
  
  const recentUploads = [
    { id: 1, title: "Mathematics: Fractions Video", type: "Video", date: "2 days ago", status: "Published" },
    { id: 2, title: "Science: Plants Quiz", type: "Quiz", date: "1 week ago", status: "Published" },
    { id: 3, title: "English: Grammar Notes", type: "Document", date: "2 weeks ago", status: "Draft" },
  ];
  
  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.grade || !uploadForm.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, this would create a FormData and upload the file
      // const formData = new FormData();
      // formData.append('title', uploadForm.title);
      // formData.append('description', uploadForm.description);
      // formData.append('grade', uploadForm.grade);
      // formData.append('subject', uploadForm.subject);
      // formData.append('type', uploadForm.type);
      // if (uploadForm.file) {
      //   formData.append('file', uploadForm.file);
      // }
      
      await uploadResource(uploadForm);
      
      toast({
        title: "Upload Successful",
        description: "Your resource has been uploaded"
      });
      
      setIsUploadDialogOpen(false);
      setUploadForm({
        title: '',
        description: '',
        grade: '',
        subject: '',
        type: 'video',
        file: null,
      });
    } catch (error) {
      console.error('Upload failed', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload your resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0]
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full flex items-center justify-start" 
              variant="outline"
              onClick={() => setIsUploadDialogOpen(true)}
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
        
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Your recently uploaded materials</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUploads.map(upload => (
                  <TableRow key={upload.id}>
                    <TableCell className="font-medium">{upload.title}</TableCell>
                    <TableCell>{upload.type}</TableCell>
                    <TableCell>{upload.date}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          upload.status === "Published" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {upload.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Manage Grade Resources</h2>
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
      
      <h2 className="text-2xl font-semibold mb-4">Manage Subjects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center p-6 hover:shadow-md transition-all">
          <Book className="h-10 w-10 mx-auto text-mtech-primary mb-2" />
          <h3 className="font-medium mb-1">Mathematics</h3>
          <p className="text-sm text-gray-500 mb-4">12 Resources</p>
          <Button size="sm">Manage</Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-md transition-all">
          <Book className="h-10 w-10 mx-auto text-mtech-secondary mb-2" />
          <h3 className="font-medium mb-1">English</h3>
          <p className="text-sm text-gray-500 mb-4">8 Resources</p>
          <Button size="sm">Manage</Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-md transition-all">
          <Book className="h-10 w-10 mx-auto text-green-500 mb-2" />
          <h3 className="font-medium mb-1">Science</h3>
          <p className="text-sm text-gray-500 mb-4">10 Resources</p>
          <Button size="sm">Manage</Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-md transition-all border-dashed flex flex-col items-center justify-center">
          <PlusCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <h3 className="font-medium mb-1">Add New Subject</h3>
          <Button variant="ghost" size="sm">Create</Button>
        </Card>
      </div>
      
      {/* Upload Resource Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Learning Resource</DialogTitle>
            <DialogDescription>
              Upload videos, documents, or quizzes for your students.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadResource} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Enter resource title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Enter resource description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select 
                  value={uploadForm.grade} 
                  onValueChange={(value) => setUploadForm({ ...uploadForm, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                    <SelectItem value="4">Grade 4</SelectItem>
                    <SelectItem value="5">Grade 5</SelectItem>
                    <SelectItem value="6">Grade 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={uploadForm.subject} 
                  onValueChange={(value) => setUploadForm({ ...uploadForm, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="social">Social Studies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select 
                value={uploadForm.type} 
                onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50">
                <ArrowUpCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">Max file size: 50MB</p>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {uploadForm.file && (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{uploadForm.file.name}</span>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Resource'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <DefaultLoginInfo />
    </div>
  );
};

export default TeacherDashboard;
