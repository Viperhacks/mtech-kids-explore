import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { AdminQuiz } from '../types/adminTypes';
import { getQuizQuestions } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { capitalize } from '@/utils/stringUtils';
import toReadableDate from '@/utils/toReadableDate';

interface AdminQuizViewerProps {
  quiz: AdminQuiz;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerPosition: string;
  type: 'multiple_choice' | 'true_false';
}

const AdminQuizViewer: React.FC<AdminQuizViewerProps> = ({ quiz }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuizQuestions();
  }, [quiz.quizId]);

  const fetchQuizQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await getQuizQuestions(quiz.quizId);
      console.log('Quiz questions response:', response);
      // Handle axios response - response.data should contain the questions
      const questionsData = response.data || response || [];
      
      // Format questions to match our interface
      const formattedQuestions = Array.isArray(questionsData) 
        ? questionsData.map((q: any) => ({
            id: q.id || q.questionId || Math.random().toString(),
            question: q.question || q.questionText || 'No question text',
            options: q.options || q.answerOptions || [],
            correctAnswerPosition: q.correctAnswerPosition || q.correct || '',
            type: q.type || 'multiple_choice'
          }))
        : [];
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      // Use mock data on error for demonstration
      setQuestions([
        {
          id: '1',
          question: 'Sample question from quiz',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswerPosition: 'Option A',
          type: 'multiple_choice'
        }
      ]);
      toast({
        title: "Using sample data",
        description: "Could not load quiz questions, showing sample",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionIcon = (optionIndex: number, correctAnswerPosition: number) => {
  return optionIndex + 1 === correctAnswerPosition ? (  
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
};


  return (
    <div className="space-y-6">
      {/* Quiz Metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {capitalize(quiz.title)}
            </CardTitle>
            <Badge variant={quiz.standaAlone ? "default" : "secondary"}>
              {quiz.standaAlone ? "Standalone Quiz" : "Resource Quiz"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Grade:</span> {quiz.grade}
            </div>
            <div>
              <span className="font-medium">Subject:</span> {capitalize(quiz.subject)}
            </div>
            <div>
              <span className="font-medium">Created By:</span> {capitalize(quiz.teacherName)}
            </div>
            <div>
              <span className="font-medium">Created:</span> {
                Array.isArray(quiz.createdAt) 
                  ? toReadableDate(quiz.createdAt) 
                  : "Invalid date"
              }
            </div>
          </div>
          {quiz.description && (
            <div className="mt-4">
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-muted-foreground">{quiz.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p>This quiz doesn't have any questions yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-mtech-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Question {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium text-mtech-dark">
                      {question.question}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Answer Options:
                      </p>
                      <div className="grid gap-2">
                       {question.options.map((option, optionIndex) => (
  <div
    key={optionIndex}
    className={`flex items-center gap-3 p-3 rounded-lg border ${
      optionIndex + 1 === Number(question.correctAnswerPosition)
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}
  >
    {getOptionIcon(optionIndex, Number(question.correctAnswerPosition))}
    <span className="flex-1">{option}</span>
    {optionIndex + 1 === Number(question.correctAnswerPosition) && (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
        Correct Answer
      </Badge>
    )}
  </div>
))}

                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          <span className="font-medium">Type:</span> {
                            question.type === 'multiple_choice' ? 'Multiple Choice' : 'True/False'
                          }
                        </span>
                        <span>
                          <span className="font-medium">Correct Answer:</span> 
                          <span className="ml-1 font-medium text-green-600">
                            {question.correctAnswerPosition}
                          </span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuizViewer;