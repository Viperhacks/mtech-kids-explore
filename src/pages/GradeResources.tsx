
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Video, FileText, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ResourcesData from '@/data/resources';

const GradeResources = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Get the grade resources
  const gradeData = ResourcesData.grades.find(g => g.id === gradeId);
  
  if (!gradeData) {
    return (
      <div className="mtech-container py-20 text-center">
        <h1 className="text-3xl font-bold text-mtech-dark mb-4">Grade Not Found</h1>
        <p className="text-gray-600 mb-8">The grade you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mtech-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-mtech-dark">Grade {gradeData.name} Resources</h1>
          <p className="text-gray-600 mt-2">Explore learning materials for Grade {gradeData.name}</p>
        </div>
        
        {user?.role === 'teacher' && (
          <Button className="mt-4 md:mt-0">
            <FileText className="mr-2 h-4 w-4" />
            Upload New Material
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex overflow-x-auto space-x-2 pb-2 mb-6">
          <TabsTrigger value="all">All Subjects</TabsTrigger>
          {gradeData.subjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradeData.subjects.map(subject => {
              const progress = user?.progress?.[subject.id];
              const completion = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
              
              return (
                <Card key={subject.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>{subject.name}</CardTitle>
                      {completion === 100 && (
                        <Award className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <CardDescription>
                      {subject.videosCount} Videos • {subject.quizzesCount} Quizzes
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-mtech-primary rounded-full"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {completion}% Complete
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-4">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/grade/${gradeId}/subject/${subject.id}`}>
                          <Video className="mr-2 h-4 w-4" />
                          Videos
                        </Link>
                      </Button>
                      <Button size="sm" className="bg-mtech-secondary" asChild>
                        <Link to={`/grade/${gradeId}/subject/${subject.id}?tab=quizzes`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Quizzes
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {gradeData.subjects.map(subject => (
          <TabsContent key={subject.id} value={subject.id}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{subject.name} Videos</h2>
                {user?.role === 'teacher' && (
                  <Button size="sm" variant="outline">
                    <Video className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subject.videos.map((video) => {
                  const isCompleted = user?.completedLessons?.includes(video.id);
                  return (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-gray-100">
                        <img 
                          src={video.thumbnail || 'https://placehold.co/600x400?text=Video+Thumbnail'} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-mtech-primary text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                            <Video className="h-6 w-6" />
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription className="text-xs">{video.duration} • {video.teacher}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <Button size="sm" className="w-full">Watch Now</Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{subject.name} Quizzes</h2>
                {user?.role === 'teacher' && (
                  <Button size="sm" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Quiz
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subject.quizzes.map((quiz) => {
                  const isCompleted = user?.completedLessons?.includes(quiz.id);
                  return (
                    <Card key={quiz.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{quiz.title}</CardTitle>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <CardDescription className="text-xs">{quiz.questions} Questions • {quiz.time} Minutes</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button size="sm" className="w-full bg-mtech-secondary">
                          Start Quiz
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GradeResources;
