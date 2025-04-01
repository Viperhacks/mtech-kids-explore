
import React, { useState } from 'react';
import { GraduationCap, Book, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample curriculum data - would come from an API in a real app
const curriculumData = {
  'Grade 3': {
    subjects: [
      { id: 1, name: 'Mathematics', videoCount: 8, quizCount: 5 },
      { id: 2, name: 'English', videoCount: 6, quizCount: 4 },
      { id: 3, name: 'Science', videoCount: 7, quizCount: 3 },
      { id: 4, name: 'Shona', videoCount: 5, quizCount: 2 },
    ]
  },
  'Grade 4': {
    subjects: [
      { id: 1, name: 'Mathematics', videoCount: 10, quizCount: 6 },
      { id: 2, name: 'English', videoCount: 8, quizCount: 5 },
      { id: 3, name: 'Science', videoCount: 9, quizCount: 4 },
      { id: 4, name: 'Shona', videoCount: 7, quizCount: 3 },
    ]
  },
  'Grade 5': {
    subjects: [
      { id: 1, name: 'Mathematics', videoCount: 12, quizCount: 7 },
      { id: 2, name: 'English', videoCount: 10, quizCount: 6 },
      { id: 3, name: 'Science', videoCount: 11, quizCount: 5 },
      { id: 4, name: 'Shona', videoCount: 9, quizCount: 4 },
      { id: 5, name: 'Agriculture', videoCount: 6, quizCount: 3 },
    ]
  },
  'Grade 6': {
    subjects: [
      { id: 1, name: 'Mathematics', videoCount: 14, quizCount: 8 },
      { id: 2, name: 'English', videoCount: 12, quizCount: 7 },
      { id: 3, name: 'Science', videoCount: 13, quizCount: 6 },
      { id: 4, name: 'Shona', videoCount: 11, quizCount: 5 },
      { id: 5, name: 'Agriculture', videoCount: 8, quizCount: 4 },
      { id: 6, name: 'ICT', videoCount: 7, quizCount: 3 },
    ]
  },
  'Grade 7': {
    subjects: [
      { id: 1, name: 'Mathematics', videoCount: 16, quizCount: 9 },
      { id: 2, name: 'English', videoCount: 14, quizCount: 8 },
      { id: 3, name: 'Science', videoCount: 15, quizCount: 7 },
      { id: 4, name: 'Shona', videoCount: 13, quizCount: 6 },
      { id: 5, name: 'Agriculture', videoCount: 10, quizCount: 5 },
      { id: 6, name: 'ICT', videoCount: 9, quizCount: 4 },
      { id: 7, name: 'Heritage', videoCount: 8, quizCount: 3 },
    ]
  }
};

const CurriculumSection: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will connect to auth state later
  const { toast } = useToast();

  const handleResourceClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to access this resource.",
        duration: 3000,
      });
    }
    // If logged in, navigate to resource (will implement later)
  };

  return (
    <section className="py-12">
      <div className="mtech-container">
        <div className="text-center mb-10">
          <h2 className="section-heading">Our Curriculum</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive curriculum designed to engage and educate primary school students through interactive videos and exercises.
          </p>
        </div>

        <Tabs defaultValue="Grade 3" className="w-full">
          <TabsList className="w-full flex overflow-x-auto space-x-2 pb-2 mb-6">
            {Object.keys(curriculumData).map((grade) => (
              <TabsTrigger 
                key={grade} 
                value={grade}
                className="flex-shrink-0"
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
                    className="mtech-card p-6 relative"
                  >
                    {!isLoggedIn && (
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
                        className="flex-1 text-sm" 
                        onClick={handleResourceClick}
                      >
                        Watch Videos
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-mtech-secondary text-white hover:bg-sky-600 text-sm" 
                        onClick={handleResourceClick}
                      >
                        Try Quizzes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default CurriculumSection;
