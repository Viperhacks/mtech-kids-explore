import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Tutorials = () => {
  const { isAuthenticated } = useAuth();
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');

  useEffect(() => {
    setIsComingSoon(true);
    const timer = setTimeout(() => setIsComingSoon(false), 3000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleAccessRequest = () => {
    if (!isAuthenticated) {
      toast('Please log in to access this content', {
        description: 'Create an account or log in to continue',
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/?showLogin=true'
        }
      });
    } else {
      toast.success('Alright, loading the fun stuff!');
    }
  };

  const handleSubjectClick = (subject: string) => {
    setActiveTab(subject);
  };

  const allSubjects = ['Mathematics', 'English', 'Science', 'ICT', 'Agriculture', 'Shona', 'Farem', 'PE'];

  const tutorialsBySubject: Record<string, any[]> = allSubjects.reduce((acc, subject) => {
    acc[subject] = [];
    return acc;
  }, {} as Record<string, any[]>);

  const subjectsToRender = activeTab === 'all' ? allSubjects : [activeTab];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-8">
        Educational Tutorials
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        We’re gearing up some awesome lessons! Pick a subject and watch for an update.
      </p>

      <Tabs value={activeTab} onValueChange={handleSubjectClick} className="w-full">
        <div className="flex justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mb-6">
          <TabsList className="inline-flex space-x-4 px-4">
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            {allSubjects.map(subject => (
              <TabsTrigger key={subject} value={subject}>
                {subject}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-center bg-blue-100 max-w-lg w-full rounded-md shadow-md px-6 py-8">
              <h3 className="text-2xl font-bold text-mtech-primary mb-3">
                All Subjects – Something fun is brewing in every class!
              </h3>
              <p className="text-gray-700 text-base">
                We’re working hard to serve up lessons across all your favorite subjects. Stay tuned and check back soon!
              </p>
            </div>
          </div>
        </TabsContent>

        {allSubjects.map(subject => (
          <TabsContent key={subject} value={subject} className="space-y-6">
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="text-center bg-yellow-100 max-w-lg w-full rounded-md shadow-md px-6 py-8">
                <h3 className="text-2xl font-bold text-mtech-primary mb-3">
                  Hold tight! {subject} is cooking!
                </h3>
                <p className="text-gray-700 text-base">
                  We’re whipping up some awesome tutorials just for you. Check back soon—it’s going to be tasty learning! 🍪
                </p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Tutorials;
