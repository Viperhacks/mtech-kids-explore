
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, TrendingUp } from 'lucide-react';
import { getAllAttemptsAdmin, getAllQuizzesAdmin } from '@/services/apiService';
import { AdminAttempt, AdminQuiz } from '../types/adminTypes';
import toReadableDate from '@/utils/toReadableDate';
import { capitalize } from '@/utils/stringUtils';

const AdminStudentProgress: React.FC = () => {
  const { toast } = useToast();
  const [attempts, setAttempts] = useState<AdminAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<AdminAttempt[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
  }, [currentPage]);

  useEffect(() => {
    filterAttempts();
  }, [attempts, searchTerm, selectedQuizId, gradeFilter, subjectFilter]);

  const fetchQuizzes = async () => {
    try {
      const response = await getAllQuizzesAdmin();
      const quizzesData = Array.isArray(response) ? response : response.content || [];
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  const fetchAttempts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAttemptsAdmin(currentPage, 10);
      const attemptsData = Array.isArray(response) ? response : response.content || [];
      const totalPagesData = response.totalPages || 1;
      
      setAttempts(attemptsData);
      setTotalPages(totalPagesData);
    } catch (error) {
      toast({
        title: "Failed to load student progress",
        description: "Could not load attempt data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAttempts = () => {
    let filtered = attempts;

    if (searchTerm) {
      filtered = filtered.filter(attempt =>
        attempt.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedQuizId !== 'all') {
      filtered = filtered.filter(attempt => attempt.quizId === selectedQuizId);
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(attempt => attempt.grade === gradeFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(attempt => attempt.subject === subjectFilter);
    }

    setFilteredAttempts(filtered);
  };

  const exportCSV = () => {
    const csvContent = [
      ['Student Name', 'Quiz Title', 'Score', 'Total', 'Percentage', 'Date', 'Grade', 'Subject'],
      ...filteredAttempts.map(attempt => [
        attempt.userFullName,
        attempt.quizTitle,
        attempt.score.toString(),
        attempt.total.toString(),
        `${Math.round((attempt.score / attempt.total) * 100)}%`,
        toReadableDate(attempt.attemptedAt),
        attempt.grade || 'N/A',
        attempt.subject || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_progress_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScoreBadgeVariant = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  const grades = [...new Set(attempts.map(a => a.grade).filter(Boolean))];
  const subjects = [...new Set(attempts.map(a => a.subject).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Student Progress Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students or quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Quiz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quizzes</SelectItem>
                {quizzes.map(quiz => (
                  <SelectItem key={quiz.quizId} value={quiz.quizId}>
                    {capitalize(quiz.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade!}> {grade === "0"
                            ? "ECD"
                            : `Grade ${grade}`}</SelectItem>
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
                  <SelectItem key={subject} value={subject!}>{capitalize(subject)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportCSV} variant="outline" size="sm">
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
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Quiz Title</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt, index) => (
                  <TableRow key={`${attempt.id}-${index}`}>
                    <TableCell className="font-medium">{capitalize(attempt.userFullName)}</TableCell>
                    <TableCell>{capitalize(attempt.quizTitle)}</TableCell>
                    <TableCell>{attempt.score}/{attempt.total}</TableCell>
                    <TableCell>
                      <Badge variant={getScoreBadgeVariant(attempt.score, attempt.total)}>
                        {Math.round((attempt.score / attempt.total) * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell>{attempt.grade === "0"
                            ? "ECD"
                            : `Grade ${attempt.grade}` || 'N/A'}</TableCell>
                    <TableCell>{capitalize(attempt.subject) || 'N/A'}</TableCell>
                    <TableCell>{toReadableDate(attempt.attemptedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredAttempts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No progress data found</h3>
              <p>No student attempts match your current filters</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudentProgress;
