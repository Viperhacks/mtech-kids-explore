import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Eye,
  Trash2,
  FileQuestion,
  Upload,
  Edit,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllQuizzes,
  deleteQuiz,
  getQuizQuestions,
  deleteQuestion,
} from "@/services/apiService";
import { useAuth } from "@/context/AuthContext";
import QuizCreationDialog from "./QuizCreationDialog";
import QuestionUploadDialog from "./QuestionUploadDialog";
import QuizEditDialog from "./QuizEditDialog";
import QuizAttemptModal from "./QuizAttemptModal";

import LoadingQuizzes from "./LoadingQuizzes";

interface Quiz {
  quizId: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  standaAlone: boolean;
  teacherName: string;
}

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  correctAnswerText: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
}

const QuizManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAttemptModal, setShowAttemptModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllQuizzes();

      const teacherQuizzes = response.data.filter(
        (quiz: Quiz) =>
          quiz.teacherName === user?.fullName || quiz.teacherName === user?.name
      );
      console.log("Teacher quizzes:", teacherQuizzes);
      setQuizzes(teacherQuizzes);
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

  const handleDeleteQuiz = async (quizId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this quiz? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteQuiz(quizId);
      toast({
        title: "Quiz Deleted",
        description: "Quiz has been successfully deleted",
      });
      fetchQuizzes();
    } catch (error) {
      toast({
        title: "Failed to delete quiz",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleViewQuestions = async (quiz: Quiz) => {
    try {
      const response = await getQuizQuestions(quiz.quizId);
      setQuizQuestions(response.data);
      setSelectedQuiz(quiz);
      setShowQuestionsDialog(true);
    } catch (error) {
      toast({
        title: "Failed to load questions",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleViewAttempts = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowAttemptModal(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      toast({
        title: "Question Deleted",
        description: "Question has been removed from the quiz",
      });
      if (selectedQuiz) {
        handleViewQuestions(selectedQuiz);
      }
    } catch (error) {
      toast({
        title: "Failed to delete question",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleUploadQuestions = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowUploadDialog(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowEditDialog(true);
  };

  if (isLoading) {
    return <LoadingQuizzes />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Quizzes</CardTitle>

            <div className="flex gap-2 overflow-auto">
              <Button
                variant="outline"
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Questions
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <div className="text-center py-8">
              <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                You haven't created any quizzes yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start creating engaging quizzes for your students
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Quiz
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.quizId}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.subject}</TableCell>
                    <TableCell>Grade {quiz.grade}</TableCell>
                    <TableCell>
                      <Badge
                        variant={quiz.standaAlone ? "default" : "secondary"}
                      >
                        {quiz.standaAlone ? "Standalone" : "Linked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQuestions(quiz)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAttempts(quiz)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUploadQuestions(quiz)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuiz(quiz)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.quizId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <QuizCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onQuizCreated={fetchQuizzes}
      />

      <QuestionUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onQuestionsUploaded={fetchQuizzes}
        preSelectedQuizId={selectedQuiz?.quizId}
      />

      <QuizEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        quiz={selectedQuiz}
        onQuizUpdated={fetchQuizzes}
      />

      {selectedQuiz && (
        <QuizAttemptModal
          open={showAttemptModal}
          onOpenChange={setShowAttemptModal}
          quizId={selectedQuiz.quizId}
          quizTitle={selectedQuiz.title}
        />
      )}

      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title} - Questions</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {quizQuestions.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No questions available for this quiz.
              </p>
            ) : (
              quizQuestions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Question {index + 1}
                        </h4>
                        <p className="mb-3">{question.questionText}</p>
                {question.type === "SHORT_ANSWER" && (
                      <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-300">
                        <p className="font-medium text-yellow-800">
                          Expected Answer:
                        </p>
                        <p>
                          {question.correctAnswerText || "No answer provided"}
                        </p>
                      </div>
                    )
                  }

                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded text-sm ${
                                optIndex === question.correctIndex
                                  ? "bg-green-100 text-green-800 font-medium"
                                  : "bg-muted"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correctIndex && " ✓"}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManagement;
