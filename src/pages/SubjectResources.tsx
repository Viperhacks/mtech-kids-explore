import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Circle,
  Clock,
  FileText,
  Link2,
  Loader2,
  Video,
  Youtube,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getResourcesForAnyOne } from "@/services/apiService";
import { toast } from "@/hooks/use-toast";
import VideoModal from "@/components/VideoModal";
import DocumentModal from "@/components/DocumentModal";
import QuizModal from "@/components/QuizModal";
import { getQuizQuestions } from "@/services/apiService";
import { useCompletion } from "@/context/CompletionContext";

const SubjectResources: React.FC = () => {
  const { gradeId, subjectId } = useParams<{
    gradeId: string;
    subjectId: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const { user } = useAuth();
  const { markResourceCompleted } = useCompletion();
  
  // Get active tab and quiz from URL
  const activeTab = searchParams.get('tab') || 'videos';
  const targetQuiz = searchParams.get('quiz');

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    // Remove quiz param when changing tabs unless going to quizzes
    if (value !== 'quizzes') {
      newParams.delete('quiz');
    }
    setSearchParams(newParams);
  };

  const handleVideoEnded = async (video: any) => {
    console.log("Video ended:", video);
    
    try {
      // Mark video as completed with auto-refresh
      await markResourceCompleted(video.response.id, 'video');
      
      if (video.response.hasQuiz) {
        // Find and auto-open the associated quiz
        await openAssociatedQuiz(video.response.id);
      }
    } catch (error) {
      console.error("Error handling video completion:", error);
    }
  };

  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || "1";

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await getResourcesForAnyOne(getRecommendedGrade(), subjectId);
      const allResources = response.resources || [];
      console.log("Fetched resources:", allResources);
      setResources(allResources);

      // Filter quizzes and set them to state
      const quizResources = allResources.filter(
        (resource) => resource.response.type.toLowerCase() === "quiz"
      );
      setQuizzes(quizResources);
    } catch (error) {
      toast({
        title: "Failed to load resources",
        description: "Try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [gradeId, subjectId]);

  const openResourceModal = (resource: any) => {
    setSelectedResource(resource);
    setIsResourceModalOpen(true);
  };

  const closeResourceModal = () => {
    setSelectedResource(null);
    setIsResourceModalOpen(false);
  };

  const openQuizModal = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  const closeQuizModal = () => {
    setSelectedQuiz(null);
    setIsQuizModalOpen(false);
  };

  const openAssociatedQuiz = async (resourceId: string) => {
    try {
      const quiz = quizzes.find(
        (quiz) => quiz.response.resourceId === resourceId
      );
      if (quiz) {
        openQuizModal(quiz);
      } else {
        console.log("No associated quiz found for resource ID:", resourceId);
      }
    } catch (error) {
      console.error("Error opening associated quiz:", error);
    }
  };

  // Auto-select quiz based on URL parameter
  useEffect(() => {
    if (activeTab === 'quizzes' && targetQuiz && quizzes.length > 0) {
      // Find quiz by subject or first available quiz
      const targetQuizItem = quizzes.find(q => 
        q.subject.toLowerCase() === targetQuiz.toLowerCase()
      ) || quizzes[0];
      
      if (targetQuizItem) {
        setSelectedQuiz(targetQuizItem);
        setIsQuizModalOpen(true);
      } else {
        toast({
          title: "Quiz not available",
          description: `No quizzes available for ${targetQuiz}`,
          variant: "destructive",
        });
      }
    }
  }, [activeTab, targetQuiz, quizzes]);

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {subjectId ? `${subjectId} Resources` : "Resources"}
        </h1>
        <p className="text-muted-foreground">
          Explore resources for Grade {getRecommendedGrade()}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 mb-5">
          <TabsTrigger value="videos" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Videos</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Documents</TabsTrigger>
          <TabsTrigger value="quizzes" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
            </div>
          ) : resources.filter((resource) => resource.response.type.toLowerCase() === "video").length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-xl font-semibold mb-2">
                No videos available yet!
              </h2>
              <p>Check back later or explore other resources.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources
                .filter((resource) => resource.response.type.toLowerCase() === "video")
                .map((resource) => (
                  <Card key={resource.response.id} className="bg-white shadow-md rounded-md overflow-hidden">
                    <div className="relative">
                      <img
                        src={resource.response.thumbnailUrl}
                        alt={resource.response.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {resource.response.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-semibold mb-2">
                        {resource.response.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {resource.response.description}
                      </CardDescription>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => openResourceModal(resource)}
                      >
                        Watch Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
            </div>
          ) : resources.filter((resource) => resource.response.type.toLowerCase() === "document" || resource.response.type.toLowerCase() === "doc" || resource.response.type.toLowerCase() === "pdf" || resource.response.type.toLowerCase() === "docx").length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-xl font-semibold mb-2">
                No documents available yet!
              </h2>
              <p>Check back later or explore other resources.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources
                .filter((resource) => resource.response.type.toLowerCase() === "document" || resource.response.type.toLowerCase() === "doc" || resource.response.type.toLowerCase() === "pdf" || resource.response.type.toLowerCase() === "docx")
                .map((resource) => (
                  <Card key={resource.response.id} className="bg-white shadow-md rounded-md overflow-hidden">
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {resource.response.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {resource.response.description}
                      </CardDescription>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => openResourceModal(resource)}
                      >
                        Open Document
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-xl font-semibold mb-2">
                No quizzes available yet!
              </h2>
              <p>Check back later or explore other resources.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.response.id} className="bg-white shadow-md rounded-md overflow-hidden">
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      {quiz.response.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {quiz.response.description}
                    </CardDescription>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => openQuizModal(quiz)}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <VideoModal
        isOpen={isResourceModalOpen && selectedResource?.response.type.toLowerCase() === "video"}
        onClose={closeResourceModal}
        video={selectedResource}
        onVideoEnded={handleVideoEnded}
      />

      <DocumentModal
        isOpen={isResourceModalOpen && (selectedResource?.response.type.toLowerCase() === "document" || selectedResource?.response.type.toLowerCase() === "doc" || selectedResource?.response.type.toLowerCase() === "pdf" || selectedResource?.response.type.toLowerCase() === "docx")}
        onClose={closeResourceModal}
        document={selectedResource}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={closeQuizModal}
        quiz={selectedQuiz}
      />
    </div>
  );
};

export default SubjectResources;
