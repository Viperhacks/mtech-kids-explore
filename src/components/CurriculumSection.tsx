
import React, { useState } from 'react';
import { GraduationCap, Book, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Sample curriculum data - would come from an API in a real app
const curriculumData = {
  'Grade 3': {
    id: 'grade3',
    subjects: [
      { id: 'mathematics', name: 'Mathematics', videoCount: 8, quizCount: 5 },
      { id: 'english', name: 'English', videoCount: 6, quizCount: 4 },
      { id: 'science', name: 'Science', videoCount: 7, quizCount: 3 },
      { id: 'shona', name: 'Shona', videoCount: 5, quizCount: 2 },
    ]
  },
  'Grade 4': {
    id: 'grade4',
    subjects: [
      { id: 'mathematics', name: 'Mathematics', videoCount: 10, quizCount: 6 },
      { id: 'english', name: 'English', videoCount: 8, quizCount: 5 },
      { id: 'science', name: 'Science', videoCount: 9, quizCount: 4 },
      { id: 'shona', name: 'Shona', videoCount: 7, quizCount: 3 },
    ]
  },
  'Grade 5': {
    id: 'grade5',
    subjects: [
      { id: 'mathematics', name: 'Mathematics', videoCount: 12, quizCount: 7 },
      { id: 'english', name: 'English', videoCount: 10, quizCount: 6 },
      { id: 'science', name: 'Science', videoCount: 11, quizCount: 5 },
      { id: 'shona', name: 'Shona', videoCount: 9, quizCount: 4 },
      { id: 'agriculture', name: 'Agriculture', videoCount: 6, quizCount: 3 },
    ]
  },
  'Grade 6': {
    id: 'grade6',
    subjects: [
      { id: 'mathematics', name: 'Mathematics', videoCount: 14, quizCount: 8 },
      { id: 'english', name: 'English', videoCount: 12, quizCount: 7 },
      { id: 'science', name: 'Science', videoCount: 13, quizCount: 6 },
      { id: 'shona', name: 'Shona', videoCount: 11, quizCount: 5 },
      { id: 'agriculture', name: 'Agriculture', videoCount: 8, quizCount: 4 },
      { id: 'ict', name: 'ICT', videoCount: 7, quizCount: 3 },
    ]
  },
  'Grade 7': {
    id: 'grade7',
    subjects: [
      { id: 'mathematics', name: 'Mathematics', videoCount: 16, quizCount: 9 },
      { id: 'english', name: 'English', videoCount: 14, quizCount: 8 },
      { id: 'science', name: 'Science', videoCount: 15, quizCount: 7 },
      { id: 'shona', name: 'Shona', videoCount: 13, quizCount: 6 },
      { id: 'agriculture', name: 'Agriculture', videoCount: 10, quizCount: 5 },
      { id: 'ict', name: 'ICT', videoCount: 9, quizCount: 4 },
      { id: 'heritage', name: 'Heritage', videoCount: 8, quizCount: 3 },
    ]
  }
};

const CurriculumSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getRecommendedGrade = () => {
    return user?.grade || user?.gradeLevel || '1';
  };

  const handleResourceClick = (gradeId: string, subjectId?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to access this resource.",
        duration: 3000,
      });
      // Set a state to show login modal when redirected to home
      navigate('/', { state: { showLogin: true } });
      return;
    }
    
    // If authenticated, navigate to the appropriate resource
    if (subjectId) {
      navigate(`/dashboard`);
    } else {
      navigate(`/dashboard`);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">
      <div className="mtech-container">
        <div className="text-center mb-10">
         <h2 className="text-4xl font-extrabold text-mtech-secondary font-kids flex items-center justify-center gap-2">
  🎓 Our Curriculum
</h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive curriculum designed to engage and educate primary school students through interactive videos and exercises.
          </p>
        </div>

        <Tabs defaultValue="Grade 3" className="w-full">
          <TabsList
  className="w-full flex overflow-x-auto gap-2 pb-2 mb-6 h-14 
             no-scrollbar scroll-smooth whitespace-nowrap snap-x snap-mandatory"
>

            {Object.keys(curriculumData).map((grade) => (
             <TabsTrigger 
  key={grade} 
  value={grade}
  className="snap-start flex-shrink-0 px-4 py-2 rounded-full border border-mtech-secondary hover:border-mtech-primary bg-white text-mtech-dark hover:bg-mtech-primary hover:text-white transition 
             data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary"
>
  <GraduationCap className="mr-2 h-4 w-4" />
  {grade}
</TabsTrigger>


            ))}
          </TabsList>

          {Object.entries(curriculumData).map(([grade, data]) => (
            <TabsContent key={grade} value={grade}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.subjects.map((subject) => (
                  <div 
                    key={subject.id}
                    className="mtech-card bg-gradient-to-br from-mtech-primary/10 to-mtech-secondary/10  p-6 relative"
                  >
                    {!isAuthenticated && (
                      <div className="absolute top-3 right-3">
                        <Lock className="h-5 w-5 text-mtech-warning" />
                      </div>
                    )}
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">
                        <Book className="h-5 w-5 text-mtech-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{subject.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {subject.videoCount} Videos • {subject.quizCount} Quizzes
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 text-sm hover:bg-mtech-accent" 
                        onClick={() => handleResourceClick(data.id, subject.id)}
                      >
                        Watch Videos
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-mtech-secondary text-white hover:bg-sky-600 text-sm" 
                        onClick={() => handleResourceClick(data.id, subject.id)}
                      >
                        Try Quizzes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {isAuthenticated && (
                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => handleResourceClick(data.id)}
                  >
                    Explore All Grade {grade.split(' ')[1]} Resources
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default CurriculumSection;
