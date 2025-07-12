import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Video,
  FileText,
  CheckCircle,
  ArrowLeft,
  Play,
  PlusCircle,
  Edit,
  Trash,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import ResourcesData from "@/data/resources";
import {
  getResources,
  deleteResource,
  getResourcesForAnyOne,
} from "@/services/apiService";
import CourseEditor from "@/components/CourseEditor";
import VideoThumbnail from "./VideoThumbnail";
import { resolve } from "path";
import FloatingBackButton from "@/components/FloatingBackButton";

import StudentQuizzes from "@/components/student/StudentQuizzes";
import QuizManagement from "@/components/QuizManagement";
import { Badge } from "@/components/ui/badge";
import { useCompletion } from "@/context/CompletionContext";
import { completionService } from "@/services/completionService";

const SubjectResources = () => {
  //const { gradeId, subjectId } = useParams<{ gradeId: string, subjectId: string }>();

  const { gradeId: fullGradeId, subjectId } = useParams<{
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

  useEffect(() => {
    console.log("URL Parameters:", {
      originalGradeId: fullGradeId,
      cleanedGradeId: gradeIdNumber,
      subjectId,
    });
  }, [fullGradeId, gradeIdNumber, subjectId]);
  const [searchParams] = useSearchParams();
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

  // Get the grade and subject data
  const grade = ResourcesData.grades.find((g) => g.id === gradeIdNumber);
  const subject = grade?.subjects.find((s) => s.id === subjectId);
  //console.log("subject",subject)

  const { refreshCompletions, isResourceCompleted } = useCompletion();
  useEffect(() => {
    fetchResources();
  }, [gradeIdNumber, subjectId]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      let response;
      if (user?.role == "TEACHER") {
        response = await getResources(`${gradeIdNumber}`, subjectId);
        console.log("response", response);
      } else {
        response = await getResourcesForAnyOne(`${gradeIdNumber}`, subjectId);
        console.log("response", response);
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
      // console.log("-----",response.resources)
      //setResources(response.resources || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Failed to load resources",
        description:
          "Could not load learning materials. Using sample data instead.",
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

  /*if (!grade || !subjectId) {
    return (
      <div className="mtech-container py-20 text-center">
        <h1 className="text-3xl font-bold text-mtech-dark mb-4">Resource Not Found</h1>
        <p className="text-gray-600 mb-8">The subject or grade you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }*/

  const handleVideoEnded = async () => {
    if (user && selectedVideo) {
      // Update progress by marking this specific video as completed
      /*updateUserProgress(
      subjectId as string, 
      selectedVideo.response.id,
      totalVideos
    );*/

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

        // Add to local completed set
        setCompletedVideos((prev) =>
          new Set(prev).add(selectedVideo.response.id)
        );
        if (selectedVideo.response.hasQuiz) {
          setActiveTab("quizzes");
        } else {
          setActiveTab("videos");
        }

        toast({
          title: "Video Completed!",
          description: selectedVideo.response.hasQuiz
            ? `Great job watching the entire video. Now go and crush the quiz`
            : "Great job watching the entire video.",
        });
      } catch (error) {
        console.error("Failed to mark video as completed:", error);
      }
    }
  };

  // Handle watching a video
  const handleWatchVideo = (video: any) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);

    // Track the activity
    if (user) {
      trackActivity({
        userId: user.id || "user",
        type: "video_started",
        videoId: video.response.id,
        subjectId: grade.id,
        gradeId: subject.id,
        timestamp: new Date().toISOString(),
      });
    }

    // In a real app, this would track that the user started the video
    // For demo purposes, we'll mark it as completed
    if (user && video.response.id) {
      updateUserProgress(
        subjectId as string,
        video.response.id,
        resources.filter((r) => r.response.type === "video").length
      );
    }
  };

  const handleEditResource = (resource: any) => {
    setEditingResource(resource.response);
    setIsEditDialogOpen(true);
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      toast({
        title: "Resource Deleted",
        description: "The resource has been successfully deleted.",
      });
      fetchResources();
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewResource = (type: string) => {
    setEditingResource({
      type,
      grade: gradeIdNumber,
      subject: subjectId,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveComplete = () => {
    setIsEditDialogOpen(false);
    fetchResources();
  };

  const totalVideos = resources.filter(
    (r) => r.response.type === "video"
  ).length;

  // Get completed count from user progress or completedVideos
  const getCompletedCount = () => {
    if (user?.completedVideos?.[subjectId as string]) {
      return user.completedVideos[subjectId as string].length;
    }
    if (user?.progress?.[subjectId as string]?.completed) {
      return user.progress[subjectId as string].completed;
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
  
  if (isLoading) {
    return (
      <div className="mtech-container py-20 flex flex-col items-center justify-center">
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
    <div className="mtech-container py-8">
      <div className="flex items-center mb-6">
        <FloatingBackButton />
        <div>
          <h1 className="text-2xl font-bold text-mtech-dark">
            Grade {gradeIdNumber} -{" "}
            {subject?.name ||
              subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}
          </h1>
          <p className="text-sm text-gray-600">
            Learn{" "}
            {subject?.name ||
              subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}{" "}
            for Grade {gradeIdNumber}
          </p>
        </div>
      </div>

      <div className="bg-mtech-primary/10 rounded-lg p-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Progress Summary */}
          <div>
            <h2 className="font-medium">Your Progress</h2>
            <p className="text-sm text-mtech-dark">
              You've watched{" "}
              {
                progress.watched ||
                  progress.completed /*mind we are currently recording watched vids */
              }{" "}
              videos and completed {progress.completed} out of {progress.total}{" "}
              items
            </p>
          </div>

          {/* Teacher Action Buttons */}
          {user?.role === "TEACHER" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCreateNewResource("document")}
                className="w-full sm:w-auto"
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCreateNewResource("video")}
                className="w-full sm:w-auto"
              >
                <Video className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </div>
          )}
        </div>

        <Progress value={completionPercent} className="h-2 mt-4" />
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="relative aspect-video bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  </div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button size="sm" className="flex-1" disabled>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : resources.filter((resource) => resource.response.type === "video")
              .length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources
                .filter((resource) => resource.response.type === "video")
                .map((video) => {
                  /*const isCompleted =
                    completedVideos.has(video.response.id) ||
                    user?.completedLessons?.includes(video.response.id);*/

                    const isCompleted = isVideoCompleted(video.response.id);
                  return (
                    <Card key={video.response.id} className="overflow-hidden">
                      <div
                        className="relative aspect-video bg-gray-100 cursor-pointer"
                        onClick={() => handleWatchVideo(video)}
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-video-thumbnail.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                        )}
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
                        {video.response.hasQuiz && (
                          <div className="absolute bottom-2 right-5 ">
                            <Badge variant="secondary" className="">
                              Quiz Available
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">
                          {video.response.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {video.duration || "10:00"} •{" "}
                          {video.response.teacher.split(" ")[0]}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleWatchVideo(video)}
                        >
                          {isCompleted ? "Watch Again" : "Watch Now"}
                        </Button>

                        {user?.role === "TEACHER" && (
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
              <Video className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No videos available yet</p>
              {user?.role === "TEACHER" && (
                <Button
                  variant="default"
                  onClick={() => handleCreateNewResource("video")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload New Video
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          {user?.role == "STUDENT" ? <StudentQuizzes /> : <QuizManagement />}
        </TabsContent>
      </Tabs>

      {/* Video Dialog */}

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.response.title}</DialogTitle>
            <DialogDescription>
              By {selectedVideo?.response.teacher.split(" ")[0]} •{" "}
              {selectedVideo?.duration}
            </DialogDescription>
          </DialogHeader>

          <div className="aspect-video bg-black rounded-md overflow-hidden relative">
            {selectedVideo ? (
              <>
                {/* Video Player with Loading State */}
                <video
                  key={selectedVideo.response.id}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onWaiting={() => setIsVideoLoading(true)}
                  onCanPlay={() => setIsVideoLoading(false)}
                  onEnded={handleVideoEnded}
                  onError={(e) => {
                    console.error("Video error:", e);
                    const video = e.target as HTMLVideoElement;
                    video.controls = false;
                    setHasError(true); // Trigger the error state
                  }}
                >
                  <source
                    src={`http://localhost:8080/uploads/${selectedVideo.response.content}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Loading Overlay */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <span className="sr-only">Loading video...</span>
                  </div>
                )}

                {/* Error State */}
                {hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-4">
                    <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                    <h3 className="font-medium text-lg">
                      Video Failed to Load
                    </h3>
                    <p className="text-sm text-center mt-1">
                      We couldn't load this video. Please try again later.
                    </p>
                    <Button
                      variant="ghost"
                      className="mt-4 text-white"
                      onClick={() => {
                        // Retry logic if needed
                        setHasError(false); // Reset error state
                        const video = document.querySelector("video");
                        if (video) {
                          video.load();
                        }
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedVideo?.response.description}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsVideoOpen(false)}>
                Close
              </Button>
              {user?.role === "TEACHER" && selectedVideo && (
                <Button
                  variant="default"
                  onClick={() => {
                    setIsVideoOpen(false);
                    handleEditResource(selectedVideo);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Editor Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => !open && setIsEditDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResource?.id
                ? "Edit Resource"
                : editingResource?.type === "quiz"
                ? "Create New Quiz"
                : "Upload New Resource"}
            </DialogTitle>
            <DialogDescription>
              {editingResource?.id
                ? "Modify your existing learning material"
                : editingResource?.type === "quiz"
                ? "Create a new quiz for your students"
                : "Add a new learning resource for your students"}
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
