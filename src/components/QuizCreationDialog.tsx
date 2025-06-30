
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createQuiz, uploadQuestions } from '@/services/apiService';
import { Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface QuizCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizCreated: () => void;
}

const QuizCreationDialog: React.FC<QuizCreationDialogProps> = ({
  open,
  onOpenChange,
  onQuizCreated
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    subject: '',
    standaAlone: true,
    resourceId: '',
    teacherName: user?.fullName || user?.name || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createQuiz(formData);
      setCreatedQuizId(response.id);
      setShowUpload(true);
      toast({
        title: "Quiz Created",
        description: "Now upload questions for your quiz"
      });
    } catch (error) {
      toast({
        title: "Failed to create quiz",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !createdQuizId) return;

    setIsLoading(true);
    try {
      await uploadQuestions(createdQuizId, file);
      toast({
        title: "Questions Uploaded",
        description: "Quiz is ready for students"
      });
      onQuizCreated();
      onOpenChange(false);
      resetForm();
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      grade: '',
      subject: '',
      standaAlone: true,
      resourceId: '',
      teacherName: user?.fullName || user?.name || ''
    });
    setShowUpload(false);
    setCreatedQuizId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showUpload ? 'Upload Questions' : 'Create New Quiz'}
          </DialogTitle>
        </DialogHeader>

        {!showUpload ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="standalone"
                checked={formData.standaAlone}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, standaAlone: checked }))}
              />
              <Label htmlFor="standalone">Standalone Quiz</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Quiz'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV or Excel file with your quiz questions
            </p>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="questions-upload"
                disabled={isLoading}
              />
              <Label htmlFor="questions-upload" className="cursor-pointer">
                <Button variant="outline" asChild disabled={isLoading}>
                  <span>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload Questions
                  </span>
                </Button>
              </Label>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizCreationDialog;
