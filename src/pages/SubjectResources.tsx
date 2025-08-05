import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, FileText, Trophy, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { resources } from '@/data/resources';
import { useAuth } from '@/context/AuthContext';
import { useCompletion } from '@/context/CompletionContext';
import DocumentViewer from '@/components/DocumentViewer';
import StudentQuizzes from '@/components/student/StudentQuizzes';
import { toast } from 'sonner';
import { getQuizzesBySubject } from '@/services/apiService';

const SubjectResources = () => {
  const { gradeId, subjectId } = useParams<{ gradeId: string; subjectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completions, markResourceCompleted } = useCompletion();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'videos');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subject = resources.find(grade => 
    grade.gradeId === parseInt(gradeId!) && 
    grade.subjects.find(sub => sub.subjectId === parseInt(subjectId!))
  )?.subjects.find(sub => sub.subjectId === parseInt(subjectId!));

  useEffect(() => {
    const tab = searchParams.get('tab');
    const quiz = searchParams.get('quiz');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (tab === 'quizzes' && quiz) {
      fetchQuizzesAndSelectSpecific(quiz);
    }
  }, [searchParams]);

  const fetchQuizzesAndSelectSpecific = async (quizId: string) => {
    if (!subject) return;
    
    setLoading(true);
    try {
      const fetchedQuizzes = await getQuizzesBySubject(subject.name);
      setQuizzes(fetchedQuizzes);
      
      if (quizId === 'available' && fetchedQuizzes.length > 0) {
        setSelectedQuiz(fetchedQuizzes[0].id);
      } else {
        const targetQuiz = fetchedQuizzes.find(q => q.id === quizId);
        if (targetQuiz) {
          setSelectedQuiz(quizId);
        } else {
          toast.error('Quiz not available');
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', value);
    if (value !== 'quizzes') {
      newSearchParams.delete('quiz');
    }
    setSearchParams(newSearchParams);
  };

  const isResourceCompleted = (resourceId: string, type: 'video' | 'document') => {
    if (!user || !completions) return false;
    return completions.some(completion => 
      completion.resource_id === resourceId && 
      completion.resource_type === type
    );
  };

  const handleVideoEnded = async (videoId: string) => {
    if (user && user.role === 'student') {
      try {
        await markResourceCompleted(videoId, 'video');
        toast.success('Video completed!');
      } catch (error) {
        console.error('Error marking video as completed:', error);
        toast.error('Failed to mark video as completed');
      }
    }
  };

  const handleDocumentComplete = async (documentId: string) => {
    if (user && user.role === 'student') {
      try {
        await markResourceCompleted(documentId, 'document');
        toast.success('Document completed!');
      } catch (error) {
        console.error('Error marking document as completed:', error);
        toast.error('Failed to mark document as completed');
      }
    }
  };

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Subject not found</h1>
          <p className="text-gray-600 mt-2">The requested subject could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.name}</h1>
        <p className="text-gray-600">Grade {gradeId} • {subject.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-6">
          {selectedVideo && !previewMode ? (
            <div className="space-y-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedVideo(null)}
                className="mb-4"
              >
                ← Back to Videos
              </Button>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    {selectedVideo.title}
                  </CardTitle>
                  {selectedVideo.description && (
                    <CardDescription>{selectedVideo.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full"
                      onEnded={() => handleVideoEnded(selectedVideo.id)}
                    >
                      <source src={selectedVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subject.videos?.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        {video.title}
                      </span>
                      {isResourceCompleted(video.id, 'video') && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </CardTitle>
                    {video.description && (
                      <CardDescription>{video.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setSelectedVideo(video)}
                        className="flex-1"
                      >
                        Watch Video
                      </Button>
                      {(user?.role === 'admin' || user?.role === 'teacher') && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedVideo(video);
                            setPreviewMode(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          {selectedDocument ? (
            <div className="space-y-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedDocument(null)}
                className="mb-4"
              >
                ← Back to Documents
              </Button>
              <DocumentViewer 
                document={selectedDocument} 
                onComplete={() => handleDocumentComplete(selectedDocument.id)}
              />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subject.documents?.map((doc) => (
                <Card key={doc.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {doc.title}
                      </span>
                      {isResourceCompleted(doc.id, 'document') && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </CardTitle>
                    {doc.description && (
                      <CardDescription>{doc.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setSelectedDocument(doc)}
                      className="w-full"
                    >
                      View Document
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <StudentQuizzes 
            subjectName={subject.name} 
            selectedQuiz={selectedQuiz}
            onQuizSelect={setSelectedQuiz}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectResources;
