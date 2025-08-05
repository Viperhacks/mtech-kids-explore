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


  // 2. Safety check for undefined params
  if (typeof fullGradeId === "undefined" || typeof subjectId === "undefined") {
    return (
      <div className="p-4 text-red-500">
        Error: Missing URL parameters. Expected format:
        /grade/:gradeId/subject/:subjectId
      </div>
    );
  }

  // 3. Clean the gradeId (extract just the number)
  const gradeIdNumber = fullGradeId.replace(/\D/g, "");

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab =
    searchParams.get("tab") === "quizzes" ? "quizzes" : "videos";

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
  const [hasError, setHasError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(
    new Set()
  );

  const { toast } = useToast();
  const { user, updateUserProgress, trackActivity } = useAuth();
  const { findAndOpenAssociatedQuiz } = useAutoQuizOpen();

  // Get the grade and subject data
  const grade = ResourcesData.grades.find((g) => g.id === gradeIdNumber);
  const subject = grade?.subjects.find((s) => s.id === subjectId);

  const { refreshCompletions, isResourceCompleted } = useCompletion();
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || "1";

 useEffect(() => {
  // Handle tab parameter
  const tabParam = searchParams.get("tab");
  if (tabParam === "quizzes") {
    setActiveTab("quizzes");
  }

  // Handle subject filter parameter
  const subjectParam = searchParams.get("subjectFilter");
  if (subjectParam) {
    setSubjectFilter(decodeURIComponent(subjectParam));
  }
}, [searchParams]);
  
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      let response;
      if (user?.role == "TEACHER") {
        response = await getResources(`${gradeIdNumber}`, subjectId);
      } else {
        response = await getResourcesForAnyOne(`${gradeIdNumber}`, subjectId);
      }

      const resourcesWithThumbnails = await Promise.all(
        response.resources.map(async (resource) => {
          if (resource.response.type === "video") {
            //const thumbnail = await generateThumbnail(`http://localhost:8080/uploads/${resource.response.content}`);
            const videoUrl = `http://localhost:8080/uploads/${resource.response.content}`;
            const video = document.createElement("video");
            video.src = videoUrl;
            await new Promise((resolve) => {
              video.addEventListener("loadedmetadata", resolve);
            });
            const thumbnail = await generateThumbnail(videoUrl);
            const duration = formatDuration(video.duration);
            return { ...resource, thumbnail, duration };
          }
          return resource;
        })
      );
      setResources(resourcesWithThumbnails);
      
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
  const generateThumbnail = async (videoUrl: string) => {
    if (videoUrl.startsWith(window.location.origin)) {
      return null;
    }
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    await new Promise((resolve) => {
      video.addEventListener("loadedmetadata", resolve);
    });
    video.currentTime = 15;
    await new Promise((resolve) => {
      video.addEventListener("seeked", resolve);
    });
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  };

  const formatDuration = (duration: number) => {
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Add selectedSubject state
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
  const quizSlug = searchParams.get("quiz");
  if (!quizSlug || !resources.length || activeTab !== "quizzes") return;

  const slugify = (str: string) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Show all quiz subjects and their slugs
  console.table(
    resources
      .filter((r) => r.response.type === "quiz")
      .map((r) => ({
        subject: r.response.subject,
        slugified: slugify(r.response.subject || ""),
      }))
  );

  const matchedSubject = resources.find(
    (r) =>
      r.response.type === "quiz" &&
      r.response.subject &&
      slugify(r.response.subject) === quizSlug
  )?.response.subject;

  if (matchedSubject) {
    console.log("🎯 [Deep Link] Matching subject found:", matchedSubject);
    setSelectedSubject(matchedSubject);
  } else {
    console.warn("🚫 [Deep Link] No matching subject for slug:", quizSlug);
    toast({
      title: "Subject not found",
      description: `No quiz subject matches: ${quizSlug}`,
      variant: "destructive",
    });
  }
}, [searchParams, resources, activeTab]);

  const [autoStartQuiz, setAutoStartQuiz] = useState<Quiz | null>(null);

  const handleVideoEnded = async () => {
    if (user && selectedVideo) {
      try {
        await completionService.markComplete(
          selectedVideo.response.id,
          "video",
          refreshCompletions
        );

        // Track activity
        trackActivity({
          userId: user.id || "user",
          type: "video_completed",
          videoId: selectedVideo.response.id,
          subjectId: subjectId,
          gradeId: gradeIdNumber,
          timestamp: new Date().toISOString(),
        });

        toast({
          title: "Video Completed!",
          description: selectedVideo.response.hasQuiz
            ? "Great job! Looking for your quiz..."
            : "Great job watching the entire video.",
        });

        // Auto-open associated quiz if it exists
        if (selectedVideo.response.hasQuiz) {
          await findAndOpenAssociatedQuiz(
            selectedVideo.response.id,
            gradeIdNumber,
            subjectId,
            (quiz) => {
              // Close video dialog first
              setIsVideoOpen(false);


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
    return completedVideos.size;
  };

  const completedCount = getCompletedCount();
  const progress = {
    completed: completedCount,
    total: totalVideos,
    watched: user?.progress?.[subjectId as string]?.watched || 0,
  };

  const completionPercent =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  const isVideoCompleted = (videoId: string) => {
    return isResourceCompleted(videoId) || completedVideos.has(videoId);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);
    if (value !== "quizzes") newParams.delete("quiz");
    setSearchParams(newParams);
  };

  const tabOptions = [
    {
      value: "videos",
      label: "Videos",
      icon: Video,
    },
    {
      value: "quizzes",
      label: "Quizzes",
      icon: FileText,
    },
  ];

  if (isLoading) {
    return (
      <div className="mtech-container py-20 flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">
        {/* Fun spinning loader */}
        <div className="loader-spin">
          <Loader2 className="h-16 w-16 text-mtech-primary" />
        </div>

        {/* Kid-friendly message */}
        <p className="mt-6 text-mtech-dark text-xl font-semibold text-center">
          Hang tight! We're gathering some fun learning resources just for you!
        </p>

        {/* Fun encouragement */}
        <p className="mt-4 text-mtech-dark text-lg text-center">
          Almost there... Let's get ready to explore! 🚀
        </p>
      </div>
    );
  }

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
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList>
          {tabOptions.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="snap-start flex-shrink-0 px-4 py-2 rounded-full border border-mtech-secondary hover:border-mtech-primary bg-white text-mtech-dark hover:bg-mtech-primary hover:text-white transition 
             data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary ml-2"
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
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
