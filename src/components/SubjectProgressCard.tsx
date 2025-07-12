
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, FileText, Award, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import useSubjectQuizStats from '@/hooks/useSubjectQuizStats';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ResourceStats {
  total: number;
  completed: number;
  videos: number;
  documents: number;
  quizzes: number;
  videosCompleted: number;
  documentsCompleted: number;
  quizzesCompleted: number;
}

interface Props {
  subject: string;
  stats: ResourceStats;
  grade: string;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const SubjectProgressCard: React.FC<Props> = ({ subject, stats, grade }) => {
  const { total: subjectQuizTotal, completed: subjectQuizCompleted } = useSubjectQuizStats(subject, grade);
  const hasVideos = stats.videos > 0;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Calculate total including subject-specific quizzes
  const totalItems = stats.videos + stats.documents + subjectQuizTotal;
  const completedItems = stats.videosCompleted + stats.documentsCompleted + subjectQuizCompleted;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || '1';

  const handleClickTab = (tab: 'videos' | 'documents' | 'quizzes') => {
  navigate(`/grade/grade${getRecommendedGrade()}/subject/${subject}?tab=${tab}`);
};

  return (
    <Card className='mb-5'>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 p-2 rounded-full">
            <BookOpen className="h-4 w-4" />
          </span>
          {capitalize(subject)}
        </CardTitle>
        <CardDescription>
          Grade {grade} {capitalize(subject)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="text-muted-foreground">
              {completedItems}/{totalItems} items
            </span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100 transition"
              onClick={() => handleClickTab('videos')}>
              <Video className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-medium">{stats.videosCompleted}/{stats.videos}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <div
  className="text-center p-2 bg-green-50 rounded-md cursor-pointer hover:bg-blue-100 transition"
  onClick={() => navigate("/revision")}
>
  <FileText className="h-4 w-4 mx-auto mb-1 text-green-600" />
  <p className="text-xs font-medium">{stats.documentsCompleted}/{stats.documents}</p>
  <p className="text-xs text-muted-foreground">Docs</p>
</div>

            <div className="text-center p-2 bg-amber-50 rounded-md cursor-pointer hover:bg-blue-100 transition" onClick={() => handleClickTab('quizzes')}>
              <Award className="h-4 w-4 mx-auto mb-1 text-amber-600" />
              <p className="text-xs font-medium">{subjectQuizCompleted}/{subjectQuizTotal}</p>
              <p className="text-xs text-muted-foreground">Quizzes</p>
            </div>
          </div>
        </div>

        {hasVideos ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/grade/grade${getRecommendedGrade()}/subject/${subject}`)}
          >
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/revision")}
          >
            No videos available, go to revisions <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectProgressCard;
