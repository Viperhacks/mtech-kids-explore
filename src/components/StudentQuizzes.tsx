
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, Award, BookOpen, Search, Filter, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllQuizzes, getQuizQuestions, submitQuizAttempt } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { useQuizProgress } from './QuizProgressTracker';

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
}

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
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const userGrade = user?.grade || user?.gradeLevel || '1';
  const userId = user?.id || user?.userId || 'anonymous';
  const quizProgress = useQuizProgress(userId);

  useEffect(() => {
    fetchAvailableQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, subjectFilter, statusFilter]);

  const fetchAvailableQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllQuizzes();
      const studentQuizzes = response.filter((quiz: Quiz) => 
        quiz.grade === userGrade
      );
      setQuizzes(studentQuizzes);
    } catch (error) {
      toast({
        title: "Failed to load quizzes",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = subjectFilter === 'all' || quiz.subject === subjectFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'completed') {
        matchesStatus = quizProgress.isQuizCompleted(quiz.quizId);
      } else if (statusFilter === 'not-started') {
        matchesStatus = !quizProgress.isQuizCompleted(quiz.quizId);
      }

      return matchesSearch && matchesSubject && matchesStatus;
    });

    setFilteredQuizzes(filtered);
  };

  const getUniqueSubjects = () => {
    return Array.from(new Set(quizzes.map(quiz => quiz.subject)));
  };

  const startQuiz = async (quiz: Quiz) => {
    try {
      const questions = await getQuizQuestions(quiz.quizId);
      setQuizQuestions(questions);
      setSelectedQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuizCompleted(false);
      setShowQuizDialog(true);
    } catch (error) {
      toast({
        title: "Failed to start quiz",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      let correctCount = 0;
      quizQuestions.forEach(question => {
        if (answers[question.id] === question.correctIndex) {
          correctCount++;
        }
      });

      await submitQuizAttempt(selectedQuiz!.quizId, correctCount);
      
      // Record progress
      quizProgress.recordQuizAttempt(selectedQuiz!.quizId, correctCount, quizQuestions.length);

      setScore(correctCount);
      setQuizCompleted(true);
      
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${correctCount} out of ${quizQuestions.length}`,
      });
    } catch (error) {
      toast({
        title: "Failed to submit quiz",
        description: "Please try again",
        variant: "destructive"
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
    // Refresh to show updated progress
    filterQuizzes();
  };

  if (isLoading) {
    return <div className="p-4">Loading available quizzes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Quizzes</h2>
        <p className="text-muted-foreground">Test your knowledge with these quizzes for Grade {userGrade}</p>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span>Completed: {quizProgress.getTotalCompletedQuizzes()}</span>
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
                {getUniqueSubjects().map(subject => (
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
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => {
            const isCompleted = quizProgress.isQuizCompleted(quiz.quizId);
            const bestScore = quizProgress.getBestScore(quiz.quizId);
            
            return (
              <Card key={quiz.quizId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary">{quiz.subject}</Badge>
                      {isCompleted && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">By {quiz.teacherName}</span>
                    <Badge variant={quiz.standaAlone ? "default" : "outline"}>
                      {quiz.standaAlone ? "Standalone" : "Linked"}
                    </Badge>
                  </div>
                  
                  {isCompleted && (
                    <div className="mb-4 p-2 bg-green-50 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span>Best Score:</span>
                        <span className="font-medium text-green-700">{bestScore}%</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={() => startQuiz(quiz)}
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Retake Quiz" : "Start Quiz"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="max-w-2xl">
          {!quizCompleted ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedQuiz?.title}</span>
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              {quizQuestions.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {quizQuestions[currentQuestionIndex]?.questionText}
                    </h3>
                    <RadioGroup
                      value={answers[quizQuestions[currentQuestionIndex]?.id]?.toString() || ""}
                      onValueChange={(value) => 
                        handleAnswerChange(quizQuestions[currentQuestionIndex].id, parseInt(value))
                      }
                    >
                      {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="cursor-pointer">
                            {String.fromCharCode(65 + index)}. {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <DialogFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      {currentQuestionIndex === quizQuestions.length - 1 ? (
                        <Button onClick={submitQuiz} disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                      ) : (
                        <Button onClick={nextQuestion}>
                          Next
                        </Button>
                      )}
                    </div>
                  </DialogFooter>
                </div>
              )}
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Quiz Completed!</DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Award className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Your Score</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {score}/{quizQuestions.length}
                  </p>
                  <p className="text-muted-foreground">
                    {Math.round((score / quizQuestions.length) * 100)}% Correct
                  </p>
                  {quizProgress.getBestScore(selectedQuiz!.quizId) < Math.round((score / quizQuestions.length) * 100) && (
                    <Badge className="mt-2">New Best Score!</Badge>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={closeQuiz} className="w-full">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentQuizzes;
