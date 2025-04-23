import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';  // Import Sonner for toast notifications

const Revision = () => {
  const [activeTab, setActiveTab] = useState("mathematics");
  const { isAuthenticated } = useAuth();

  const subjectTopics = {
    mathematics: [
      { id: 'math-1', title: 'Numbers and Operations', description: 'Learn about addition, subtraction, multiplication, and division.', level: 'Beginner' },
      { id: 'math-2', title: 'Fractions and Decimals', description: 'Understanding fractions, decimals, and percentages.', level: 'Intermediate' },
      { id: 'math-3', title: 'Geometry and Measurements', description: 'Explore shapes, angles, and measurements.', level: 'Intermediate' },
      { id: 'math-4', title: 'Pre-Algebra Concepts', description: 'Introduction to variables, equations, and algebraic thinking.', level: 'Advanced' },
    ],
    english: [
      { id: 'eng-1', title: 'Grammar Essentials', description: 'Master parts of speech, sentence structure, and punctuation.', level: 'Beginner' },
      { id: 'eng-2', title: 'Reading Comprehension', description: 'Techniques for understanding and analyzing texts.', level: 'Intermediate' },
      { id: 'eng-3', title: 'Vocabulary Building', description: 'Expand your vocabulary and improve word usage.', level: 'Intermediate' },
      { id: 'eng-4', title: 'Creative Writing', description: 'Learn to write compelling stories and essays.', level: 'Advanced' },
    ],
    science: [
      { id: 'sci-1', title: 'Life Sciences', description: 'Explore plants, animals, and human biology.', level: 'Beginner' },
      { id: 'sci-2', title: 'Earth Sciences', description: 'Learn about geology, weather, and the environment.', level: 'Intermediate' },
      { id: 'sci-3', title: 'Physical Sciences', description: 'Discover the basics of physics and chemistry.', level: 'Intermediate' },
      { id: 'sci-4', title: 'Scientific Method', description: 'Understand how to conduct experiments and scientific inquiry.', level: 'Advanced' },
    ],
    history: [
      { id: 'hist-1', title: 'Ancient Civilizations', description: 'Explore the earliest human societies and their achievements.', level: 'Beginner' },
      { id: 'hist-2', title: 'Middle Ages', description: 'Learn about life, culture, and events from 500-1500 CE.', level: 'Intermediate' },
      { id: 'hist-3', title: 'Modern History', description: 'Study significant events from the 1500s to the present.', level: 'Intermediate' },
      { id: 'hist-4', title: 'Cultural History', description: 'Understand how art, music, and literature shaped societies.', level: 'Advanced' },
    ]
  };

  // Handle the revision start
  const handleStartRevision = () => {
    toast('Revision content is coming soon!');  // Show toast notification with Sonner
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Revision Resources</h1>
        <p className="text-gray-600 mb-6">
          Select a subject below to explore revision materials designed to help you practice and master key concepts.
        </p>

        <Tabs defaultValue="mathematics" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {Object.entries(subjectTopics).map(([subject, topics]) => (
            <TabsContent key={subject} value={subject} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topics.map((topic) => (
                  <Card key={topic.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{topic.title}</CardTitle>
                          <CardDescription>{topic.description}</CardDescription>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${topic.level === 'Beginner' ? 'bg-green-100 text-green-800' : topic.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {topic.level}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-sm text-gray-500">
                          {subject === 'mathematics' ? '10 practice exercises' :
                           subject === 'english' ? '8 practice exercises' :
                           subject === 'science' ? '12 practice exercises' :
                           '9 practice exercises'}
                        </div>
                        <Button 
                          onClick={handleStartRevision}  // Show toast instead of redirecting
                          variant="outline" 
                          className="text-mtech-primary border-mtech-primary"
                        >
                          Start Revision
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Revision;
