import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getQuizzes, startQuiz, submitQuiz, submitQuizAttempt } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useCompletion } from '@/context/CompletionContext';

interface Question {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  quizId: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  questions: Question[];
}

const StudentQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshCompletions } = useCompletion();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const userGrade = user?.grade || user?.gradeLevel || '1';
      const response = await getQuizzes();
      const filteredQuizzes = response.data.filter((quiz: Quiz) => quiz.grade === userGrade);
      setQuizzes(filteredQuizzes);
    } catch (error: any) {
      console.error('Failed to load quizzes:', error);
      setError(error.message || 'Failed to load quizzes.');
      toast({
        title: "Error",
        description: "Failed to load quizzes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      await startQuiz(quiz.quizId);
      setSelectedQuiz(quiz);
      setQuestions(quiz.questions);
      setAnswers({});
      setCurrentQuestion(0);
      setShowResult(false);
      setQuizResult(null);
      setShowConfirmation(true);
    } catch (error: any) {
      console.error('Failed to start quiz:', error);
      toast({
        title: "Error",
        description: "Failed to start the quiz. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = async () => {
    if (!selectedQuiz || Object.keys(answers).length !== questions.length) return;

    setIsSubmitting(true);
    try {
      let score = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          score++;
        }
      });

      await submitQuizAttempt(selectedQuiz.quizId, score, questions.length);
      
      // Refresh completion context after quiz submission
      await refreshCompletions();

      setQuizResult({ score, total: questions.length });
      setShowResult(true);

      // Update local storage for completed quizzes
      let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
      if (!completedQuizzes.includes(selectedQuiz.quizId)) {
        completedQuizzes.push(selectedQuiz.quizId);
        localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
      }
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${score} out of ${questions.length}.`,
      });
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast({
        title: "Submission Failed",
        description: "Could not submit your quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading quizzes...
        </div>
      )}
      {error && (
        <div className="text-red-500">Error: {error}</div>
      )}
      {!selectedQuiz ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.quizId}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Subject: {quiz.subject}</p>
                <p>Grade: {quiz.grade}</p>
              </CardContent>
              <Button onClick={() => handleStartQuiz(quiz)}>Start Quiz</Button>
            </Card>
          ))}
        </div>
      ) : showResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Result</CardTitle>
          </CardHeader>
          <CardContent>
            {quizResult && (
              <div>
                <p>Your Score: {quizResult.score} / {quizResult.total}</p>
                {/* You can add more detailed feedback here based on the score */}
              </div>
            )}
          </CardContent>
          <Button onClick={() => setSelectedQuiz(null)}>Go Back to Quiz List</Button>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedQuiz.title}</CardTitle>
            <CardDescription>Question {currentQuestion + 1} of {questions.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {questions.length > 0 && (
              <div>
                <p>{questions[currentQuestion].questionText}</p>
                <RadioGroup defaultValue={answers[currentQuestion]} onValueChange={(value) => handleAnswerSelect(currentQuestion, value)}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${currentQuestion}-opt${index}`} className="border-2 border-gray-500" />
                      <Label htmlFor={`q${currentQuestion}-opt${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
          <div className="flex justify-between p-4">
            <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
              Previous
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleQuizSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Submitting...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </div>
        </Card>
      )}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Start Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to start the quiz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleConfirmationClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setShowConfirmation(false)}>
              Start Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentQuizzes;
