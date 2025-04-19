
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, FileText, CheckCircle, ArrowLeft, Play, PlusCircle, Edit, Trash } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import ResourcesData from '@/data/resources';
import { getResources, deleteResource, getResourcesForAnyOne } from '@/services/apiService';
import CourseEditor from '@/components/CourseEditor';

const SubjectResources = () => {
  const { gradeId, subjectId } = useParams<{ gradeId: string, subjectId: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'quizzes' ? 'quizzes' : 'videos';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const { user, updateUserProgress, trackActivity } = useAuth();
  
  // Get the grade and subject data
  const grade = ResourcesData.grades.find(g => g.id === gradeId);
  const subject = grade?.subjects.find(s => s.id === subjectId);
  
  useEffect(() => {
    fetchResources();
  }, [gradeId, subjectId]);
  
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      let response;
       if(user?.role == "TEACHER"){
        response = await getResources(gradeId, subjectId);
       } else{
        response = await getResourcesForAnyOne(gradeId, subjectId);
       }
      console.log("-----",response.resources)
      setResources(response.resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Failed to load resources",
        description: "Could not load learning materials. Using sample data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!grade || !subject) {
    return (
      <div className="mtech-container py-20 text-center">
        <h1 className="text-3xl font-bold text-mtech-dark mb-4">Resource Not Found</h1>
        <p className="text-gray-600 mb-8">The subject or grade you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }
  
  // Handle watching a video
  const handleWatchVideo = (video: any) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);
    
    // Track the activity
    if (user) {
      trackActivity({
        userId: user.id,
        type: 'video_started',
        videoId: video.id,
        subjectId,
        gradeId,
        timestamp: new Date().toISOString()
      });
    }
    
    // In a real app, this would track that the user started the video
    // For demo purposes, we'll mark it as completed
    if (user && video.id) {
      updateUserProgress(subjectId as string, video.id);
    }
  };
  
  // Handle taking a quiz
  const handleStartQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setIsQuizOpen(true);
    
    // Track the activity
    if (user) {
      trackActivity({
        userId: user.id,
        type: 'quiz_started',
        quizId: quiz.id,
        subjectId,
        gradeId,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Handle selecting an answer
  const handleAnswerSelect = (answerId: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion]: answerId
    });
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    // Mock questions for demo
    const totalQuestions = 3;
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz is completed
      const correctAnswers = 2; // Mock value, in a real app would calculate based on answers
      const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
      setScore(scorePercent);
      setQuizCompleted(true);
      
      // Track quiz completion
      if (user && selectedQuiz) {
        trackActivity({
          userId: user.id,
          type: 'quiz_completed',
          quizId: selectedQuiz.id,
          subjectId,
          gradeId,
          score: scorePercent,
          timestamp: new Date().toISOString()
        });
        
        // Mark quiz as completed
        updateUserProgress(subjectId as string, selectedQuiz.id);
      }
    }
  };
  
  // Close quiz dialog and reset state
  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };
  
  const handleEditResource = (resource: any) => {
    setEditingResource(resource);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      toast({
        title: "Resource Deleted",
        description: "The resource has been successfully deleted."
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
  
  const handleCreateNewResource = (type: string) => {
    setEditingResource({
      type,
      grade: gradeId,
      subject: subjectId
    });
    setIsEditDialogOpen(true);
  };
  
  const handleSaveComplete = () => {
    setIsEditDialogOpen(false);
    fetchResources();
  };
  
  // Calculate progress for this subject
  const progress = user?.progress?.[subjectId as string] || { watched: 0, completed: 0, total: 10 };
  const completionPercent = Math.round((progress.completed / progress.total) * 100);
  
  // Mock quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "4" },
        { id: "c", text: "5" },
        { id: "d", text: "6" }
      ],
      correctAnswer: "b"
    },
    {
      id: 2,
      question: "Which planet is closest to the sun?",
      options: [
        { id: "a", text: "Earth" },
        { id: "b", text: "Venus" },
        { id: "c", text: "Mercury" },
        { id: "d", text: "Mars" }
      ],
      correctAnswer: "c"
    },
    {
      id: 3,
      question: "What is the capital of France?",
      options: [
        { id: "a", text: "Berlin" },
        { id: "b", text: "Madrid" },
        { id: "c", text: "Rome" },
        { id: "d", text: "Paris" }
      ],
      correctAnswer: "d"
    }
  ];
  
  return (
    <div className="mtech-container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to={`/grade/${gradeId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-mtech-dark">
            Grade {grade.name} - {subject.name}
          </h1>
          <p className="text-sm text-gray-600">
            Learn {subject.name} for Grade {grade.name}
          </p>
        </div>
      </div>
      
      <div className="bg-mtech-primary/10 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="font-medium">Your Progress</h2>
            <p className="text-sm text-mtech-dark">
              You've watched {progress.watched} videos and completed {progress.completed} out of {progress.total} items
            </p>
          </div>
          {user?.role === 'TEACHER' && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCreateNewResource('document')}>
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCreateNewResource('video')}>
                <Video className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCreateNewResource('quiz')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          )}
        </div>
        <Progress value={completionPercent} className="h-2 mt-3" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="videos">
            <Video className="mr-2 h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <FileText className="mr-2 h-4 w-4" />
            Quizzes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            { resources.filter(resource => resource.response.type === "video").map((video) => {
              const isCompleted = user?.completedLessons?.includes(video.id);
              return (
                <Card key={video.response.id} className="overflow-hidden">
                  <div 
                    className="relative aspect-video bg-gray-100 cursor-pointer"
                    onClick={() => handleWatchVideo(video)}
                  >
                    <img 
                      src={video.response.thumbnail || 'https://placehold.co/600x400?text=Video+Thumbnail'} 
                      alt={video.response.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-mtech-primary text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6" />
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{video.response.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {video.response.duration || "10:00"} • {video.response.teacher.split(' ')[0]}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleWatchVideo(video)}
                    >
                      {isCompleted ? 'Watch Again' : 'Watch Now'}
                    </Button>
                    
                    {user?.role === 'TEACHER' && (
                      <div className="flex gap-1 ml-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditResource(video);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(video.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            
            {user?.role === 'TEACHER' &&  resources.filter(resource => resource.type === "video").length === 0 && (
              <Card className="flex flex-col items-center justify-center h-full min-h-[250px] border-dashed">
                <Button 
                  variant="ghost" 
                  className="flex flex-col h-full w-full p-6"
                  onClick={() => handleCreateNewResource('video')}
                >
                  <PlusCircle className="h-8 w-8 mb-2" />
                  <p>Upload New Video</p>
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="quizzes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <CardDescription className="text-xs">
                      {quiz.questions} Questions • {quiz.time} Minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-mtech-secondary"
                      onClick={() => handleStartQuiz(quiz)}
                    >
                      {isCompleted ? 'Retry Quiz' : 'Start Quiz'}
                    </Button>
                    
                    {user?.role === 'TEACHER' && (
                      <div className="flex gap-1 ml-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditResource(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteResource(quiz.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            
            {user?.role === 'TEACHER' && (
              <Card className="flex flex-col items-center justify-center h-full min-h-[200px] border-dashed">
                <Button 
                  variant="ghost" 
                  className="flex flex-col h-full w-full p-6"
                  onClick={() => handleCreateNewResource('quiz')}
                >
                  <PlusCircle className="h-8 w-8 mb-2" />
                  <p>Create New Quiz</p>
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.response.title}</DialogTitle>
            <DialogDescription>
              By {selectedVideo?.response.teacher.split(' ')[0]} • {selectedVideo?.response.duration}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-md overflow-hidden">
            {/* In a real app, this would be a video player */}
            <div className="flex items-center justify-center h-full text-white">
            <iframe src={selectedVideo?.response.content}  allowFullScreen className='p-4 text-center'/>
              <p className="p-4 text-center"  >
                Video player would be embedded here. For demo purposes, 
                this video is automatically marked as watched.
                
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsVideoOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Quiz Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={handleCloseQuiz}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title}</DialogTitle>
            <DialogDescription>
              {!quizCompleted 
                ? `Question ${currentQuestion + 1} of ${quizQuestions.length}` 
                : 'Quiz Completed'}
            </DialogDescription>
          </DialogHeader>
          
          {!quizCompleted ? (
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {quizQuestions[currentQuestion].question}
                </h3>
                
                <RadioGroup
                  value={userAnswers[currentQuestion] || ''}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {quizQuestions[currentQuestion].options.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="cursor-pointer">{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleNextQuestion}
                disabled={!userAnswers[currentQuestion]}
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-mtech-primary mb-2">
                  Quiz Results
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You scored {score}% on this quiz
                </p>
                
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200 stroke-current" 
                      strokeWidth="10" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                    ></circle>
                    <circle 
                      className="text-mtech-primary stroke-current" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                      strokeDasharray={`${Math.PI * 80 * score / 100} ${Math.PI * 80}`}
                      strokeDashoffset={Math.PI * 20}
                    ></circle>
                    <text 
                      x="50" 
                      y="50" 
                      fontFamily="Verdana" 
                      fontSize="20" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className="fill-current text-mtech-dark font-bold"
                    >
                      {score}%
                    </text>
                  </svg>
                </div>
                
                {score >= 70 ? (
                  <p className="text-green-600 font-medium mt-4">Great job! You passed the quiz.</p>
                ) : (
                  <p className="text-amber-600 font-medium mt-4">Keep practicing! Try again to improve your score.</p>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCloseQuiz}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Resource Editor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResource?.id 
                ? 'Edit Resource' 
                : editingResource?.type === 'quiz' 
                  ? 'Create New Quiz' 
                  : 'Upload New Resource'}
            </DialogTitle>
            <DialogDescription>
              {editingResource?.id 
                ? 'Modify your existing learning material' 
                : editingResource?.type === 'quiz' 
                  ? 'Create a new quiz for your students'
                  : 'Add a new learning resource for your students'
              }
            </DialogDescription>
          </DialogHeader>
          <CourseEditor 
            resource={editingResource} 
            onSave={handleSaveComplete} 
            onCancel={() => setIsEditDialogOpen(false)}
            isNew={!editingResource?.id}
            initialType={editingResource?.type}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectResources;
