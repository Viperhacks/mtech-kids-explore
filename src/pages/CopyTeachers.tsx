
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { 
  Video,
  FileText,
  UploadCloud, 
  Book,
  Plus,
  Edit,
  Trash,
  Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Copy = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('videos');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'quiz'>('video');
  
  // Get current date
  const currentDate = new Date();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /*// Sample data for teacher's materials
  const [materials, setMaterials] = useState({
    videos: [
      { 
        id: '1',
        title: 'Introduction to Addition',
        subject: 'Mathematics',
        grade: 'Grade 3',
        thumbnail: 'https://placehold.co/600x400?text=Addition',
        duration: '10:25',
        status: 'published',
        uploadDate: '2024-10-15'
      },
      { 
        id: '2',
        title: 'Reading Comprehension',
        subject: 'English',
        grade: 'Grade 4',
        thumbnail: 'https://placehold.co/600x400?text=Reading',
        duration: '15:30',
        status: 'published',
        uploadDate: '2024-10-10'
      },
      { 
        id: '3',
        title: 'Plants and Their Parts',
        subject: 'Science',
        grade: 'Grade 3',
        thumbnail: 'https://placehold.co/600x400?text=Plants',
        duration: '12:10',
        status: 'draft',
        uploadDate: '2024-10-20'
      }
    ],
    quizzes: [
      { 
        id: '1',
        title: 'Addition and Subtraction',
        subject: 'Mathematics',
        grade: 'Grade 3',
        questions: 10,
        status: 'published',
        uploadDate: '2024-10-14'
      },
      { 
        id: '2',
        title: 'English Grammar',
        subject: 'English',
        grade: 'Grade 5',
        questions: 8,
        status: 'published',
        uploadDate: '2024-10-08'
      }
    ]
  });
  
  // Handle dialog open
  const handleUploadClick = (type: 'video' | 'quiz') => {
    setUploadType(type);
    setIsUploadDialogOpen(true);
  };
  
  // Handle upload submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new item with today's date
    const today = currentDate.toISOString().split('T')[0];
    
    if (uploadType === 'video') {
      const newVideo = {
        id: (materials.videos.length + 1).toString(),
        title: "New Video",
        subject: "Mathematics",
        grade: "Grade 3",
        thumbnail: "https://placehold.co/600x400?text=New+Video",
        duration: "05:00",
        status: "draft",
        uploadDate: today
      };
      
      setMaterials({
        ...materials,
        videos: [...materials.videos, newVideo]
      });
    } else {
      const newQuiz = {
        id: (materials.quizzes.length + 1).toString(),
        title: "New Quiz",
        subject: "Mathematics",
        grade: "Grade 3",
        questions: 5,
        status: "draft",
        uploadDate: today
      };
      
      setMaterials({
        ...materials,
        quizzes: [...materials.quizzes, newQuiz]
      });
    }
    
    // This would submit to an API in a real app
    toast({
      title: `${uploadType === 'video' ? 'Video' : 'Quiz'} Uploaded`,
      description: "Your content has been saved successfully.",
    });
    
    setIsUploadDialogOpen(false);
  };
  
  // Handle material deletion
  const handleDelete = (type: 'videos' | 'quizzes', id: string) => {
    // This would call an API in a real app
    setMaterials({
      ...materials,
      [type]: materials[type].filter(item => item.id !== id)
    });
    
    toast({
      title: "Content Deleted",
      description: "The content has been removed successfully.",
    });
  };*/
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className='container mx-auto py-8 px-4'>
              <h1 className="text-3xl font-bold text-mtech-dark">will show info about teachers</h1>
             
              <p className="text-sm text-gray-500">Today: {currentDate.toLocaleDateString()}</p>
            </div>
      
     {/*} <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-mtech-dark">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your educational materials</p>
              <p className="text-sm text-gray-500">Today: {currentDate.toLocaleDateString()}</p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button onClick={() => handleUploadClick('video')}>
                <Video className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
              <Button variant="outline" onClick={() => handleUploadClick('quiz')}>
                <FileText className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="videos" className="flex-1">
                <Video className="mr-2 h-4 w-4" />
                My Videos
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                My Quizzes
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1">
                <Book className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Video Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  {materials.videos.length > 0 ? (
                    <div className="space-y-4">
                      {materials.videos.map(video => (
                        <div key={video.id} className="flex flex-col md:flex-row border rounded-lg overflow-hidden">
                          <div className="md:w-1/4 aspect-video">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 md:w-3/4 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="font-medium">{video.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  video.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {video.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {video.subject} • {video.grade} • {video.duration}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Uploaded on {formatDate(video.uploadDate)}
                              </p>
                            </div>
                            <div className="flex space-x-2 mt-4 md:mt-0">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500" 
                                onClick={() => handleDelete('videos', video.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              {video.status === 'draft' && (
                                <Button size="sm">
                                  <Save className="h-4 w-4 mr-1" />
                                  Publish
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Video className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="font-medium text-lg">No videos yet</h3>
                      <p className="text-muted-foreground">Upload your first video to get started</p>
                      <Button className="mt-4" onClick={() => handleUploadClick('video')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Video
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quizzes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  {materials.quizzes.length > 0 ? (
                    <div className="space-y-4">
                      {materials.quizzes.map(quiz => (
                        <div key={quiz.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{quiz.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              quiz.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {quiz.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {quiz.subject} • {quiz.grade} • {quiz.questions} questions
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created on {formatDate(quiz.uploadDate)}
                          </p>
                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDelete('quizzes', quiz.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="font-medium text-lg">No quizzes yet</h3>
                      <p className="text-muted-foreground">Create your first quiz to get started</p>
                      <Button className="mt-4" onClick={() => handleUploadClick('quiz')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Quiz
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Book className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="font-medium text-lg">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">Track student progress and engagement with your materials</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {uploadType === 'video' ? 'Upload New Video' : 'Create New Quiz'}
                </DialogTitle>
                <DialogDescription>
                  {uploadType === 'video' 
                    ? 'Upload educational video content for your students.'
                    : 'Create interactive quizzes to test student knowledge.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleUploadSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter title" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="shona">Shona</SelectItem>
                          <SelectItem value="ict">ICT</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="heritage">Heritage</SelectItem>
                          <SelectItem value="physical-education">Physical Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grade3">Grade 3</SelectItem>
                          <SelectItem value="grade4">Grade 4</SelectItem>
                          <SelectItem value="grade5">Grade 5</SelectItem>
                          <SelectItem value="grade6">Grade 6</SelectItem>
                          <SelectItem value="grade7">Grade 7</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter a description of your content" />
                  </div>
                  
                  {uploadType === 'video' ? (
                    <div className="space-y-2">
                      <Label htmlFor="video">Video File</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          MP4, WebM or OGG (max 500MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Quiz Settings</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="questions" className="text-xs">Number of Questions</Label>
                          <Input id="questions" type="number" min="1" max="50" defaultValue="10" />
                        </div>
                        <div>
                          <Label htmlFor="time" className="text-xs">Time Limit (minutes)</Label>
                          <Input id="time" type="number" min="1" max="120" defaultValue="30" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Creation date: {currentDate.toLocaleDateString()}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {uploadType === 'video' ? 'Upload Video' : 'Create Quiz'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>*/}
      
      
    </div>
  );
};

export default Copy;
