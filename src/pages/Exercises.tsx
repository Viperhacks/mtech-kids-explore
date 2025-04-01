
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

const Exercises = () => {
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
      // Proceed to exercise content
      toast.success("Loading exercise content...");
    }
  };

  const exercisesByGrade = [
    {
      grade: "Grade 3",
      exercises: [
        {
          id: 1,
          title: "Addition and Subtraction Practice",
          subject: "Mathematics",
          questionsCount: 15,
          difficulty: "Easy",
          description: "Practice adding and subtracting numbers up to 100."
        },
        {
          id: 2,
          title: "Basic Reading Comprehension",
          subject: "English",
          questionsCount: 10,
          difficulty: "Easy",
          description: "Read short passages and answer questions about them."
        }
      ]
    },
    {
      grade: "Grade 4",
      exercises: [
        {
          id: 3,
          title: "Multiplication Tables",
          subject: "Mathematics",
          questionsCount: 20,
          difficulty: "Medium",
          description: "Practice multiplication tables from 1 to 10."
        },
        {
          id: 4,
          title: "Grammar Practice",
          subject: "English",
          questionsCount: 12,
          difficulty: "Medium",
          description: "Identify and correct common grammar mistakes."
        }
      ]
    },
    {
      grade: "Grade 5",
      exercises: [
        {
          id: 5,
          title: "Fractions and Decimals",
          subject: "Mathematics",
          questionsCount: 18,
          difficulty: "Medium",
          description: "Convert between fractions and decimals, and perform basic operations."
        },
        {
          id: 6,
          title: "Essay Structure",
          subject: "English",
          questionsCount: 5,
          difficulty: "Hard",
          description: "Learn to structure a basic five-paragraph essay."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-8">Practice Exercises</h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Strengthen your understanding and test your knowledge with our comprehensive collection of exercises 
        designed to reinforce learning across various subjects and grade levels.
      </p>
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-mtech-secondary">Featured Exercises</h2>
          <Button variant="outline" size="sm" onClick={handleAccessRequest}>
            View All Exercises
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge className="bg-mtech-accent mb-2">#1 Popular</Badge>
                <Badge variant="outline">Mathematics</Badge>
              </div>
              <CardTitle>Times Tables Challenge</CardTitle>
              <CardDescription>Test your multiplication speed and accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>10 minutes timed challenge</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>30 questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  <span>Grades 3-7</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAccessRequest}>
                Start Exercise
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge className="bg-green-600 mb-2">New</Badge>
                <Badge variant="outline">English</Badge>
              </div>
              <CardTitle>Vocabulary Builder</CardTitle>
              <CardDescription>Expand your vocabulary with interactive exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>15 minutes to complete</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>25 vocabulary words</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  <span>Grades 4-6</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAccessRequest}>
                Start Exercise
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge className="bg-blue-600 mb-2">Interactive</Badge>
                <Badge variant="outline">Science</Badge>
              </div>
              <CardTitle>Human Body Quiz</CardTitle>
              <CardDescription>Learn about the human body systems</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>20 minutes estimated time</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>Interactive diagrams</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  <span>Grades 5-7</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAccessRequest}>
                Start Exercise
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-mtech-secondary mb-6">Exercises by Grade</h2>
      
      {exercisesByGrade.map((gradeGroup, index) => (
        <div key={gradeGroup.grade} className="mb-6">
          <Collapsible>
            <div className="flex items-center justify-between bg-mtech-primary/5 p-4 rounded-lg mb-3">
              <h3 className="text-lg font-medium text-mtech-primary">{gradeGroup.grade}</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-primary">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                {gradeGroup.exercises.map(exercise => (
                  <Card key={exercise.id} className="border-l-4 border-l-mtech-accent">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{exercise.subject}</Badge>
                        <span className="text-xs text-gray-500">{exercise.questionsCount} questions</span>
                      </div>
                      <CardTitle className="text-lg mt-1">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          exercise.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                          exercise.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      <Button size="sm" onClick={handleAccessRequest}>Start</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {index < exercisesByGrade.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
      
      <div className="mt-12 bg-mtech-primary/5 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-mtech-primary mb-4">Track Your Progress</h3>
        <p className="text-gray-600 mb-6">
          Keep track of the exercises you've completed and see your improvement over time. 
          Log in to access your personalized progress dashboard.
        </p>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="completed1" checked disabled />
            <label htmlFor="completed1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Addition and Subtraction Practice
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completed2" checked disabled />
            <label htmlFor="completed2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Basic Reading Comprehension
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completed3" disabled />
            <label htmlFor="completed3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Multiplication Tables
            </label>
          </div>
          <Button className="mt-4" onClick={handleAccessRequest}>View All Progress</Button>
        </div>
      </div>
    </div>
  );
};

export default Exercises;
