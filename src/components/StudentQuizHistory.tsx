import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trophy, Calendar, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStudentAttempts } from '@/services/apiService';

interface QuizAttempt {
  id: string;
  quizTitle: string;
  score: number;
  total: number;
  date: string;
  subject: string;
  grade: string;
}

const StudentQuizHistory: React.FC = () => {
  const { toast } = useToast();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAttempts();
  }, [currentPage]);

  useEffect(() => {
    filterAttempts();
  }, [attempts, searchTerm, subjectFilter]);

  const fetchAttempts = async () => {
    setIsLoading(true);
    try {
      const response = await getStudentAttempts(currentPage, 10);
      // Handle different response structures
      const attemptsData = response.content || response || [];
      const totalPagesData = response.totalPages || 1;
      setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
      setTotalPages(totalPagesData);
    } catch (error) {
      toast({
        title: "Failed to load quiz history",
        description: "Could not load your quiz attempts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAttempts = () => {
    let filtered = attempts.filter(attempt => {
      const matchesSearch = attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = subjectFilter === 'all' || attempt.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
    setFilteredAttempts(filtered);
  };

  const getUniqueSubjects = () => {
    return Array.from(new Set(attempts.map(attempt => attempt.subject)));
  };

  const getBadgeVariant = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  const getOverallStats = () => {
    if (attempts.length === 0) return { total: 0, average: 0, best: 0 };
    
    const percentages = attempts.map(a => (a.score / a.total) * 100);
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const best = Math.max(...percentages);
    
    return {
      total: attempts.length,
      average: Math.round(average),
      best: Math.round(best)
    };
  };

  const stats = getOverallStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.average}%</p>
              </div>
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Score</p>
                <p className="text-2xl font-bold">{stats.best}%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quiz titles..."
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
          </div>
        </CardContent>
      </Card>

      {/* Quiz History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>Your quiz attempts and scores</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">
                        {attempt.quizTitle}
                      </TableCell>
                      <TableCell>{attempt.subject}</TableCell>
                      <TableCell>
                        {attempt.score}/{attempt.total}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(attempt.score, attempt.total)}>
                          {Math.round((attempt.score / attempt.total) * 100)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(attempt.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
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
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No quiz history</h3>
              <p>You haven't taken any quizzes yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentQuizHistory;