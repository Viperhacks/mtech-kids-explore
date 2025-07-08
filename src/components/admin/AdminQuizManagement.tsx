
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, Trash2, Users, FileText } from 'lucide-react';
import { getAllQuizzesAdmin, deleteQuizAdmin } from '@/services/apiService';
import { AdminQuiz } from '../types/adminTypes';
import QuizAttemptModal from '../QuizAttemptModal';
import toReadableDate from '@/utils/toReadableDate';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdminQuizManagement: React.FC = () => {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<AdminQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedQuizForAttempts, setSelectedQuizForAttempts] = useState<AdminQuiz | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, gradeFilter, subjectFilter]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllQuizzesAdmin();
      const quizzesData = Array.isArray(response) ? response : response.content || [];
      setQuizzes(quizzesData);
    } catch (error) {
      toast({
        title: "Failed to load quizzes",
        description: "Could not load quiz data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(quiz => quiz.grade === gradeFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(quiz => quiz.subject === subjectFilter);
    }

    setFilteredQuizzes(filtered);
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    try {
      await deleteQuizAdmin(quizId);
      toast({
        title: "Quiz deleted",
        description: `"${quizTitle}" has been deleted successfully`,
      });
      fetchQuizzes();
    } catch (error) {
      toast({
        title: "Failed to delete quiz",
        description: "Could not delete the quiz",
        variant: "destructive"
      });
    }
  };

  const grades = [...new Set(quizzes.map(q => q.grade))];
  const subjects = [...new Set(quizzes.map(q => q.subject))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quiz Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.quizId}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>Grade {quiz.grade}</TableCell>
                    <TableCell>{quiz.subject}</TableCell>
                    <TableCell>{quiz.teacherName}</TableCell>
                    <TableCell>{toReadableDate(quiz.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={quiz.standaAlone ? "default" : "secondary"}>
                        {quiz.standaAlone ? "Standalone" : "With Resource"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedQuizForAttempts(quiz)}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuiz(quiz.quizId, quiz.title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredQuizzes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
              <p>No quizzes match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedQuizForAttempts && (
        <QuizAttemptModal
          open={!!selectedQuizForAttempts}
          onOpenChange={() => setSelectedQuizForAttempts(null)}
          quizId={selectedQuizForAttempts.quizId}
          quizTitle={selectedQuizForAttempts.title}
        />
      )}
    </div>
  );
};

export default AdminQuizManagement;
