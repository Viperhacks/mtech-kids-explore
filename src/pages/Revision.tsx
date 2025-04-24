import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import DocumentResourcesViewer from '@/components/DocumentResourcesViewer';

const Revision = () => {
  const [activeTab, setActiveTab] = useState("mathematics");
  const { isAuthenticated, user } = useAuth();
  

  // Subject Topics with their display names
  const subjectTopics = {
    mathematics: "Mathematics",
    english: "English",
    science: "Science",
    history: "History",
    // Add more subjects as needed
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Revision Resources</h1>
        <p className="text-gray-600 mb-6">
          Access study materials and documents for your revision. Select a subject to begin.
        </p>

        {/* All Subjects Document Viewer (shows documents from all subjects) */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">All Document Resources</h2>
          <DocumentResourcesViewer 
            grade={user?.grade || user?.gradeLevel} 
            limit={6}
          />
        </div>

        {/* Subject-specific Document Viewers */}
        <Tabs 
          defaultValue="mathematics" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            {Object.entries(subjectTopics).map(([key, subject]) => (
              <TabsTrigger key={key} value={key}>
                {subject}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(subjectTopics).map(([key, subject]) => (
            <TabsContent key={key} value={key} className="mt-0 min-h-[200px]">
              <div className="mt-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">{subject} Documents</h2>
                <DocumentResourcesViewer 
                  subject={key} 
                  grade={user?.grade || user?.gradeLevel}
                  limit={3} 
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Revision;