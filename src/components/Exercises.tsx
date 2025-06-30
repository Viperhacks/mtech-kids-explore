import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentResourcesViewer from '@/components/DocumentResourcesViewer';

const Exercises = () => {
  const {user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("documents");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value);
  };

  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || '1';

  const gradesToRender = isAuthenticated ?
    [getRecommendedGrade()]
    : selectedGrade
    ? [selectedGrade]
    : ['1','2','3','4','5','6','7']
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-8">Practice Exercises</h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Strengthen your understanding and test your knowledge with our comprehensive collection of exercises 
        designed to reinforce learning across various subjects and grade levels.
      </p>

      {/* Grade Filter */}
      {
        !isAuthenticated && (
          <div className="mb-6">
        <label htmlFor="grade-select" className="text-sm font-medium text-gray-700">Select Grade</label>
        <select
          id="grade-select"
          value={selectedGrade}
          onChange={handleGradeChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Grades</option>
          {[1, 2, 3, 4, 5, 6, 7].map((grade) => (
            <option key={grade} value={grade}>{`Grade ${grade}`}</option>
          ))}
        </select>
      </div>
        )
      }

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="documents">Worksheet Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="min-h-[200px]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-mtech-secondary mb-4">Practice Worksheets</h2>
            <p className="text-gray-600 mb-6">
              Download and complete these worksheets to practice your skills offline. 
              Open them online to view the problems and solutions.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {
                gradesToRender.map((grade)=>(
                  <div key={grade} className="bg-mtech-primary/5 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-mtech-primary mb-3">{`Grade ${grade} Worksheets`}</h3>
                      <DocumentResourcesViewer 
                        grade={selectedGrade || String(grade)} // Filter based on selected grade
                        limit={isAuthenticated ? 6 : undefined} 
                      />
                    </div>
                ))
              }
              {/* Loop through grades 1 to 7 
              {[1, 2, 3, 4, 5, 6, 7].map((grade) => {
                if (selectedGrade === "" || selectedGrade === String(grade)) {
                  return (
                    <div key={grade} className="bg-mtech-primary/5 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-mtech-primary mb-3">{`Grade ${grade} Worksheets`}</h3>
                      <DocumentResourcesViewer 
                        grade={selectedGrade || String(grade)} // Filter based on selected grade
                        limit={isAuthenticated ? 6 : undefined} 
                      />
                    </div>
                  );
                }
                return null; // Do not render anything if the grade is not selected
              })}*/}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Exercises;
