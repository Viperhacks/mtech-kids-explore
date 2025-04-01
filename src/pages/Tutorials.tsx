
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

const Tutorials = () => {
  const { isAuthenticated } = useAuth();

  const handleAccessRequest = () => {
    if (!isAuthenticated) {
      toast("Please log in to access this content", {
        description: "Create an account or log in to continue",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/?showLogin=true"
        }
      });
    } else {
      // Proceed to video playback or content access
      toast.success("Loading tutorial content...");
    }
  };

  const tutorialsBySubject = {
    mathematics: [
      { id: 1, title: "Basic Addition and Subtraction", duration: "8:24", level: "Grade 3" },
      { id: 2, title: "Introduction to Multiplication", duration: "10:15", level: "Grade 4" },
      { id: 3, title: "Understanding Fractions", duration: "12:30", level: "Grade 5" },
      { id: 4, title: "Algebra Fundamentals", duration: "15:45", level: "Grade 6" },
      { id: 5, title: "Geometry Concepts", duration: "14:20", level: "Grade 7" },
    ],
    english: [
      { id: 1, title: "Reading Comprehension Basics", duration: "7:50", level: "Grade 3" },
      { id: 2, title: "Grammar Rules Made Simple", duration: "9:30", level: "Grade 4" },
      { id: 3, title: "Essay Writing Skills", duration: "11:15", level: "Grade 5" },
      { id: 4, title: "Analyzing Literature", duration: "13:40", level: "Grade 6" },
      { id: 5, title: "Advanced Vocabulary Building", duration: "10:55", level: "Grade 7" },
    ],
    science: [
      { id: 1, title: "Introduction to Living Things", duration: "8:10", level: "Grade 3" },
      { id: 2, title: "The Water Cycle", duration: "7:45", level: "Grade 4" },
      { id: 3, title: "Basic Forces and Motion", duration: "12:20", level: "Grade 5" },
      { id: 4, title: "Understanding Ecosystems", duration: "14:05", level: "Grade 6" },
      { id: 5, title: "Introduction to Chemistry", duration: "16:30", level: "Grade 7" },
    ],
    ict: [
      { id: 1, title: "Computer Basics", duration: "6:15", level: "Grade 3" },
      { id: 2, title: "Introduction to Typing", duration: "5:30", level: "Grade 4" },
      { id: 3, title: "Using Word Processors", duration: "11:50", level: "Grade 5" },
      { id: 4, title: "Internet Safety", duration: "9:25", level: "Grade 6" },
      { id: 5, title: "Basic Programming Concepts", duration: "17:40", level: "Grade 7" },
    ],
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-8">Educational Tutorials</h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Explore our comprehensive collection of educational tutorials designed to help students master various subjects
        through engaging visual content and clear explanations.
      </p>
      
      <Tabs defaultValue="mathematics" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="ict">ICT</TabsTrigger>
        </TabsList>
        
        {Object.entries(tutorialsBySubject).map(([subject, tutorials]) => (
          <TabsContent key={subject} value={subject} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map(tutorial => (
                <Card key={tutorial.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <span className="bg-mtech-primary/10 text-mtech-primary text-xs px-2 py-1 rounded-full">
                        {tutorial.level}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {tutorial.duration}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleAccessRequest}>
                      Watch Tutorial
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="mt-16 bg-mtech-primary/5 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-mtech-primary mb-4">Tutorial Recommendations</h2>
        <p className="text-gray-600 mb-4">
          Not sure where to start? Here are some suggested tutorials based on popular topics:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Basic Addition and Subtraction", 
            "Reading Comprehension Basics", 
            "Introduction to Living Things"
          ].map(title => (
            <div key={title} className="bg-white p-4 rounded-md shadow-sm flex items-center">
              <div className="bg-mtech-accent/20 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-accent">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <span className="text-gray-800 font-medium">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
