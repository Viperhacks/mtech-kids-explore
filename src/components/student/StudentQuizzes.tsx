import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  Search,
  Filter,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllQuizzes,
  getCompletedResources,
  getQuizQuestions,
  markResourceCompleted,
  submitQuizAttempt,
} from "@/services/apiService";
import { useAuth } from "@/context/AuthContext";

import LoadingQuizzes from "../LoadingQuizzes";

import { Quiz, Question } from "../types/apiTypes";
import {
  shuffleAnswers,
  shuffleArray,
  shuffleQuestions,
} from "@/utils/quizUtils";
import QuizResultPreview from "../QuizResultPreview";
import { capitalize } from "@/utils/stringUtils";
import { useCompletion } from "@/context/CompletionContext";
import { completionService } from "@/services/completionService";

const StudentQuizzes: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const [showReview, setShowReview] = useState(false);
  const [answeredQues, setAnsweredQues] = useState<Record<string, boolean>>({});
  const [confirmingQuizId, setConfirmingQuizId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [completedQuiz, setCompletedQuizIds] = useState("");
  const { refreshCompletions } = useCompletion();

  const userGrade = user?.grade || user?.gradeLevel || "1";

  const completedQuizIds =
    user?.completedLessons
      ?.filter((item: any) => item.resourceType === "QUIZ")
      .map((item: any) => item.resourceId) || [];

  useEffect(() => {
    fetchAvailableQuizzes();
  }, []);

  // Add the missing useEffect for filtering
  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, subjectFilter, statusFilter]);

  const fetchAvailableQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllQuizzes();

      // Filter quizzes for student's grade
      const studentQuizzes = response.data.filter(
        (quiz: Quiz) => quiz.grade === userGrade
      );

      const shuffle = shuffleArray(studentQuizzes) as Quiz[];

      setQuizzes(studentQuizzes);
    } catch (error) {
      toast({
        title: "Failed to load quizzes",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        subjectFilter === "all" || quiz.subject === subjectFilter;

      let matchesStatus = true;
      if (statusFilter === "completed") {
        matchesStatus = completedQuizIds.includes(quiz.quizId);
      } else if (statusFilter === "not-started") {
        matchesStatus = !completedQuizIds.includes(quiz.quizId);
      }

      return matchesSearch && matchesSubject && matchesStatus;
    });

    setFilteredQuizzes(filtered);
  };

  const getUniqueSubjects = () => {
    return Array.from(new Set(quizzes.map((quiz) => quiz.subject)));
  };

  const startQuiz = async (quiz: Quiz) => {
    try {
      const response = await getQuizQuestions(quiz.quizId);
      const shuffledQuestions = shuffleQuestions(response.data);
      setQuizQuestions(shuffledQuestions);

      setSelectedQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuizCompleted(false);
      setShowQuizDialog(true);
    } catch (error) {
      toast({
        title: "Failed to start quiz",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    setAnsweredQues((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const nextQuestion = () => {
    const currentQuestionId = quizQuestions[currentQuestionIndex]?.id;

    if (!answeredQues[currentQuestionId]) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    const currentQuestionId = quizQuestions[currentQuestionIndex]?.id;

    if (!answeredQues[currentQuestionId]) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let correctCount = 0;

      quizQuestions.forEach((question) => {
        const answer = answers[question.id];

        switch (question.type) {
          case "MULTIPLE_CHOICE":
          case "TRUE_FALSE":
            if (Number(answer) === question.correctAnswerPosition - 1) {
              correctCount++;
            }
            break;
          case "SHORT_ANSWER":
            if (
              typeof answer === "string" &&
              answer.trim().toLowerCase() ===
                question.correctAnswerText?.trim().toLowerCase()
            ) {
              correctCount++;
            }
            break;
        }
      });

      await submitQuizAttempt(
        selectedQuiz!.quizId,
        correctCount,
        quizQuestions.length
      );
      //mark
      //await markResourceCompleted(Number(selectedQuiz!.quizId), "quiz");

      await completionService.markComplete(
        Number(selectedQuiz!.quizId),
        "quiz",
        refreshCompletions
      );

      //await refreshCompletions();

      setScore(correctCount);
      setQuizCompleted(true);

      // Update local storage for completed quizzes
      let completedQuizzes = JSON.parse(
        localStorage.getItem("completedQuizzes") || "[]"
      );
      if (!completedQuizzes.includes(selectedQuiz.quizId)) {
        completedQuizzes.push(selectedQuiz.quizId);
        localStorage.setItem(
          "completedQuizzes",
          JSON.stringify(completedQuizzes)
        );
      }
    } catch (error) {
      const rawMsg = error?.response?.data?.message || error?.message || "";
      let friendlyMsg = "Oops! Something went wrong. Please try again.";

      if (rawMsg.includes("only have 2 attempts")) {
        friendlyMsg = "You can only try this quiz twice. No more retries!";
      }

      toast({
        title: "Quiz submission failed",
        description: friendlyMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeQuiz = () => {
    setShowQuizDialog(false);
    setSelectedQuiz(null);
    setQuizQuestions([]);
    setQuizCompleted(false);
    setScore(0);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowReview(false);
    setAnsweredQues({});
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const type = currentQuestion?.type;

  const renderQuestionInput = () => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return currentQuestion.options.map((option, index) => {
          const isSelected =
            answers[currentQuestion.id]?.toString() === index.toString();
          return (
            <div
              key={index}
              onClick={() => handleAnswerChange(currentQuestion.id, index)}
              className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition ${
                isSelected
                  ? "bg-mtech-light border-mtech-primary"
                  : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                className="scale-125 pointer-events-none"
              />
              <Label
                htmlFor={`option-${index}`}
                className="text-base sm:text-lg cursor-pointer w-full"
              >
                {String.fromCharCode(65 + index)}. {option}
              </Label>
            </div>
          );
        });

      case "TRUE_FALSE":
        return ["True", "False"].map((option, index) => {
          const isSelected =
            answers[currentQuestion.id]?.toString() === index.toString();
          return (
            <div
              key={index}
              onClick={() => handleAnswerChange(currentQuestion.id, index)}
              className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition ${
                isSelected
                  ? "bg-mtech-light border-mtech-primary"
                  : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`tf-${index}`}
                className="scale-125 pointer-events-none"
              />
              <Label
                htmlFor={`tf-${index}`}
                className="text-base sm:text-lg cursor-pointer w-full"
              >
                {option}
              </Label>
            </div>
          );
        });

      case "SHORT_ANSWER":
        return (
          <Input
            type="text"
            placeholder="Type your answer..."
            value={answers[currentQuestion.id]?.toString() || ""}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value)
            }
          />
        );

      default:
        return <div className="text-red-500">Unsupported question type</div>;
    }
  };

  if (isLoading) {
    return <LoadingQuizzes />;
  }

  return (
    <div className="space-y-6 container mb-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Quizzes</h2>
        <p className="text-muted-foreground">
          Test your knowledge with these quizzes for Grade {userGrade}
        </p>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span>Completed: {completedQuizIds.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Available: {quizzes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {getUniqueSubjects().map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredQuizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <Card
              key={quiz.quizId}
              className=" relative hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  {completedQuizIds.includes(quiz.quizId) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full z-10">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  <CardTitle className="text-lg">
                    {capitalize(quiz.title)}{" "}
                  </CardTitle>
                  <Badge variant="secondary">{capitalize(quiz.subject)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {capitalize(quiz.description)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                    By {quiz.teacherName}
                  </span>
                  <Badge variant={quiz.standaAlone ? "default" : "outline"}>
                    {quiz.standaAlone ? "Standalone" : "Linked"}
                  </Badge>
                </div>

                {completedQuizIds.includes(quiz.quizId) ? (
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmingQuizId(quiz.quizId)}
                    className="w-full"
                  >
                    {" "}
                    Retry Quiz
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => startQuiz(quiz)}>
                    {" "}
                    Start Quiz
                  </Button>
                )}

                {confirmingQuizId === quiz.quizId && (
                  <>
                    <div className="text-sm text-center text-muted-foreground">
                      Are you sure? Your latest score will be used, if you get a
                      lesser score, that one will be used as the final mark.
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setConfirmingQuizId(null)}
                      >
                        No, go back
                      </Button>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => {
                          startQuiz(quiz);
                          setConfirmingQuizId(null);
                        }}
                      >
                        Yes, Retry
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={showQuizDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeQuiz();
          }
        }}
      >
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-md rounded-xl overflow-y-auto flex flex-col justify-start gap-6"
          style={{ zIndex: 50 }}
        >
          {!quizCompleted ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-xl sm:text-2xl font-bold">
                  <span>{selectedQuiz?.title}</span>
                  <Badge
                    variant="outline"
                    className="text-sm sm:text-base px-3 py-1 rounded-md"
                  >
                    Q{currentQuestionIndex + 1} / {quizQuestions.length}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              {quizQuestions.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold leading-snug">
                      {quizQuestions[currentQuestionIndex]?.questionText}
                    </h3>

                    <div className="space-y-4">
                      {type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE" ? (
                        <RadioGroup
                          key={currentQuestion.id}
                          value={answers[currentQuestion.id]?.toString() || ""}
                          onValueChange={(value) =>
                            handleAnswerChange(
                              currentQuestion.id,
                              parseInt(value)
                            )
                          }
                        >
                          {renderQuestionInput()}
                        </RadioGroup>
                      ) : (
                        renderQuestionInput()
                      )}
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="w-full sm:w-auto text-base sm:text-lg"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={
                        currentQuestionIndex === quizQuestions.length - 1
                          ? submitQuiz
                          : nextQuestion
                      }
                      disabled={isSubmitting}
                      className="w-full sm:w-auto text-base sm:text-lg"
                    >
                      {currentQuestionIndex === quizQuestions.length - 1
                        ? isSubmitting
                          ? "Submitting..."
                          : "Submit Quiz"
                        : "Next"}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">
                  Quiz Completed!
                </DialogTitle>
              </DialogHeader>

              {!showReview ? (
                <>
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="p-4 bg-green-100 rounded-full">
                        <Award className="h-12 w-12 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Your Score</h3>
                      <p className="text-3xl font-bold text-green-600">
                        {score}/{quizQuestions.length}
                      </p>
                      <p className="text-muted-foreground text-lg">
                        {Math.round((score / quizQuestions.length) * 100)}%
                        Correct
                      </p>
                      {Math.round((score / quizQuestions.length) * 100) >=
                        80 && (
                        <Badge className="mt-2 text-base">Great Score!</Badge>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col gap-4 mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setShowReview(true)}
                      className="w-full text-lg"
                    >
                      View All My Answers
                    </Button>
                    <Button onClick={closeQuiz} className="w-full text-lg">
                      Close
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <QuizResultPreview
                  quizQuestions={quizQuestions}
                  score={score}
                  answers={answers}
                  onClose={closeQuiz}
                  onRetry={() => {
                    setQuizCompleted(false);
                    setShowReview(false);
                    setAnswers({});
                    setCurrentQuestionIndex(0);
                    setAnsweredQues({});
                  }}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentQuizzes;
