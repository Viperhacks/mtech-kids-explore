
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Video, FileText, Award, CheckCircle, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ResourcesData from '@/data/resources';

const GradeResources = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const { user, uploadResource, trackActivity } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'video',
    file: null as File | null,
  });
  
  // Get the grade resources
  const gradeData = ResourcesData.grades.find(g => g.id === gradeId);
  
  useEffect(() => {
    // Track page view
    if (user && gradeData) {
      trackActivity({
        userId: user.id,
        type: 'page_view',
        page: 'grade_resources',
        gradeId,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, gradeId, gradeData, trackActivity]);
  
  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, this would upload the file
      const resourceData = {
        ...uploadForm,
        grade: gradeId
      };
      
      await uploadResource(resourceData);
      
      toast({
        title: "Upload Successful",
        description: "Your resource has been uploaded"
      });
      
      setIsUploadDialogOpen(false);
      setUploadForm({
        title: '',
        description: '',
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
  
  const handleStartExercise = (subjectId: string) => {
    // Track the activity
    if (user) {
      trackActivity({
        userId: user.id,
        type: 'exercise_started',
        subjectId,
        gradeId,
        timestamp: new Date().toISOString()
      });
    }
    
    // Navigate to the exercises
    navigate(`/grade/${gradeId}/subject/${subjectId}?tab=quizzes`);
  };
  
  if (!gradeData) {
    return (
      <div className="mtech-container py-20 text-center">
        <h1 className="text-3xl font-bold text-mtech-dark mb-4">Grade Not Found</h1>
        <p className="text-gray-600 mb-8">The grade you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }
  
  // Only show grade-appropriate content for students
  const filteredSubjects = user?.role === 'student' && user?.grade 
    ? gradeData.subjects.filter(s => parseInt(user.grade || '0') >= parseInt(gradeData.name))
    : gradeData.subjects;
  
  return (
    <div className="mtech-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mtech-dark">Grade {gradeData.name} Resources</h1>
          <p className="text-gray-600 mt-2">Explore learning materials for Grade {gradeData.name}</p>
        </div>
        
        {user?.role === 'teacher' && (
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New Material
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex overflow-x-auto space-x-2 pb-2 mb-6">
          <TabsTrigger value="all">All Subjects</TabsTrigger>
          {filteredSubjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map(subject => {
              const progress = user?.progress?.[subject.id];
              const completion = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
              
              return (
                <Card key={subject.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>{subject.name}</CardTitle>
                      {completion === 100 && (
                        <Award className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <CardDescription>
                      {subject.videosCount} Videos • {subject.quizzesCount} Quizzes
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-mtech-primary rounded-full"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {completion}% Complete
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-4">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/grade/${gradeId}/subject/${subject.id}`}>
                          <Video className="mr-2 h-4 w-4" />
                          Videos
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-mtech-secondary"
                        onClick={() => handleStartExercise(subject.id)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Exercises
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {filteredSubjects.map(subject => (
          <TabsContent key={subject.id} value={subject.id}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{subject.name} Videos</h2>
                {user?.role === 'teacher' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setUploadForm({
                        ...uploadForm,
                        subject: subject.id,
                        type: 'video'
                      });
                      setIsUploadDialogOpen(true);
                    }}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subject.videos.map((video) => {
                  const isCompleted = user?.completedLessons?.includes(video.id);
                  return (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-gray-100">
                        <img 
                          src={video.thumbnail || 'https://placehold.co/600x400?text=Video+Thumbnail'} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-mtech-primary text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                            <Video className="h-6 w-6" />
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription className="text-xs">{video.duration} • {video.teacher}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/grade/${gradeId}/subject/${subject.id}`)}
                        >
                          Watch Now
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{subject.name} Exercises</h2>
                {user?.role === 'teacher' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setUploadForm({
                        ...uploadForm,
                        subject: subject.id,
                        type: 'quiz'
                      });
                      setIsUploadDialogOpen(true);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Create Exercise
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subject.quizzes.map((quiz) => {
                  const isCompleted = user?.completedLessons?.includes(quiz.id);
                  return (
                    <Card key={quiz.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{quiz.title}</CardTitle>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <CardDescription className="text-xs">{quiz.questions} Questions • {quiz.time} Minutes</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          size="sm" 
                          className="w-full bg-mtech-secondary"
                          onClick={() => handleStartExercise(subject.id)}
                        >
                          Start Exercise
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Upload Resource Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Learning Resource</DialogTitle>
            <DialogDescription>
              Upload videos, documents, or quizzes for Grade {gradeData.name}.
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
                  {filteredSubjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
              />
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
    </div>
  );
};

export default GradeResources;
