
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getAllQuizzes, uploadQuestions } from '@/services/apiService';
import { Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Quiz {
  quizId: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  teacherName: string;
}

interface QuestionUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionsUploaded: () => void;
  preSelectedQuizId?: string;
}

const QuestionUploadDialog: React.FC<QuestionUploadDialogProps> = ({
  open,
  onOpenChange,
  onQuestionsUploaded,
  preSelectedQuizId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState(preSelectedQuizId || '');

  useEffect(() => {
    if (open) {
      fetchQuizzes();
    }
  }, [open]);

  useEffect(() => {
    if (preSelectedQuizId) {
      setSelectedQuizId(preSelectedQuizId);
    }
  }, [preSelectedQuizId]);

  const fetchQuizzes = async () => {
    try {
      const response = await getAllQuizzes();

      const teacherQuizzes = response.data.filter((quiz: Quiz) => 

        quiz.teacherName === user?.fullName || quiz.teacherName === user?.name
      );
      setQuizzes(teacherQuizzes);
    } catch (error) {
      toast({
        title: "Failed to load quizzes",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedQuizId) return;

    setIsLoading(true);
    try {
      await uploadQuestions(selectedQuizId, file);
      toast({
        title: "Questions Uploaded Successfully",
        description: "Questions have been added to the quiz"
      });
      onQuestionsUploaded();
      onOpenChange(false);
      setSelectedQuizId('');
    } catch (error) {
      toast({
        title: "Failed to upload questions",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Questions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="quiz-select">Select Quiz</Label>
            <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a quiz" />
              </SelectTrigger>
              <SelectContent>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.quizId} value={quiz.quizId}>
                    {quiz.title} - Grade {quiz.grade} ({quiz.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="questions-upload"
              disabled={isLoading || !selectedQuizId}
            />
            <Label htmlFor="questions-upload" className="cursor-pointer">
              <Button variant="outline" asChild disabled={isLoading || !selectedQuizId}>
                <span>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload Questions File
                </span>
              </Button>
            </Label>
            <p className="text-sm text-muted-foreground mt-2">
              Support CSV, XLSX, XLS files
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionUploadDialog;
