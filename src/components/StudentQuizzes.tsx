
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllQuizzes, getQuizQuestions, submitQuizAttempt } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import LoadingQuizzes from './LoadingQuizzes';

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
  correctAnswerPosition: number;
}

const StudentQuizzes: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuizIds,setCompletedQuizIds] = useState<string[]>([]);

  const userGrade = user?.grade || user?.gradeLevel || '1';

  useEffect(() => {
    fetchAvailableQuizzes();
  }, []);

  useEffect(
    ()=>{
      const stored = localStorage.getItem("completedQuizzes");
      if (stored){
        setCompletedQuizIds(JSON.parse(stored))
      }
    },[]
  );

  useEffect(()=>{
    localStorage.setItem("completedQuizzes",JSON.stringify(completedQuizIds));
  },[completedQuizIds]);
  
  const fetchAvailableQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllQuizzes();
      // Filter quizzes for student's grade
      const studentQuizzes = response.data.filter((quiz: Quiz) => 
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

  const startQuiz = async (quiz: Quiz) => {
    try {
      const response = await getQuizQuestions(quiz.quizId);
       console.log("heres the questions",response);
      setQuizQuestions(response.data);
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
    
    
      const currentQuestionId = quizQuestions[currentQuestionIndex]?.id;
   if(answers[currentQuestionId] === undefined){
    toast({
      title: "Please select an answer",
      variant: "destructive"
    });
    return;
   }
      setCurrentQuestionIndex(prev => prev + 1);
    
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Calculate correct answers
      let correctCount = 0;
      quizQuestions.forEach(question => {
        if (answers[question.id] === question.correctAnswerPosition-1) {
          correctCount++;
        }
      });

      await submitQuizAttempt(selectedQuiz!.quizId, correctCount,
        user?.id,
        quizQuestions.length
      );
      setScore(correctCount);
      setQuizCompleted(true);
      
      //mark

      if(selectedQuiz?.quizId){
        setCompletedQuizIds((prev)=>
        prev.includes(selectedQuiz.quizId)?
        prev 
        : [...prev, selectedQuiz.quizId]
        );
      }

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
  };

  if (isLoading) {
    return <LoadingQuizzes/>
  }

  return (
    <div className="space-y-6 container mb-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Quizzes</h2>
        <p className="text-muted-foreground">Test your knowledge with these quizzes for Grade {userGrade}</p>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
            <p className="text-muted-foreground">Check back later for new quizzes from your teachers</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          

          {quizzes.map((quiz) => (
            <Card key={quiz.quizId} className=" relative hover:shadow-lg transition-shadow">
               
              <CardHeader>
                
                <div className="flex justify-between items-start">
                  {completedQuizIds.includes(quiz.quizId) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full z-10">
                  <CheckCircle className="h-4 w-4" /> 
                  </div>
                )}
                  <CardTitle className="text-lg">{quiz.title} </CardTitle>
                  <Badge variant="secondary">{quiz.subject}</Badge>
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
                <Button className="w-full" onClick={() => startQuiz(quiz)}> {completedQuizIds.includes(quiz.quizId) ? 'Retry Quiz' : 'Start Quiz'}
                </Button>
              </CardContent>
            </Card>
          ))}
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
                    <div key={quizQuestions[currentQuestionIndex]?.id}>
                      <RadioGroup
                      key={quizQuestions[currentQuestionIndex].id}
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
