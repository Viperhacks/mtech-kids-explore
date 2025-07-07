
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getQuizAttempts } from '@/services/apiService';

interface QuizAttempt {
  id: string;
  studentName: string;
  score: number;
  total: number;
  date: string;
}

interface QuizAttemptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  quizTitle: string;
}

const QuizAttemptModal: React.FC<QuizAttemptModalProps> = ({
  open,
  onOpenChange,
  quizId,
  quizTitle
}) => {
  const { toast } = useToast();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (open && quizId) {
      fetchAttempts();
    }
  }, [open, quizId, currentPage]);

  const fetchAttempts = async () => {
    setIsLoading(true);
    try {
      const response = await getQuizAttempts(quizId, currentPage, 10);
      // Handle different response structures
      const attemptsData = response.content || response.data?.content || response || [];
      const totalPagesData = response.totalPages || response.data?.totalPages || 1;
      setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
      setTotalPages(totalPagesData);
    } catch (error) {
      toast({
        title: "Failed to load quiz attempts",
        description: "Could not load student attempts for this quiz",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Student Name', 'Score', 'Total', 'Percentage', 'Date'],
      ...attempts.map(attempt => [
        attempt.studentName,
        attempt.score.toString(),
        attempt.total.toString(),
        `${Math.round((attempt.score / attempt.total) * 100)}%`,
        attempt.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizTitle}_attempts.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quiz Attempts: {quizTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Total attempts: {attempts.length}
            </p>
            <Button onClick={exportCSV} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : attempts.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">
                        {attempt.studentName}
                      </TableCell>
                      <TableCell>
                        {attempt.score}/{attempt.total}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            (attempt.score / attempt.total) >= 0.8 ? "default" :
                            (attempt.score / attempt.total) >= 0.6 ? "secondary" : 
                            "destructive"
                          }
                        >
                          {Math.round((attempt.score / attempt.total) * 100)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{attempt.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No attempts yet</h3>
              <p>Students haven't taken this quiz yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizAttemptModal;
