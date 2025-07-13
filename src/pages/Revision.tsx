import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import DocumentResourcesViewer from "@/components/DocumentResourcesViewer";
import { subjects } from "@/utils/subjectUtils";

const Revision = () => {
  const [activeTab, setActiveTab] = useState("");
  const { isAuthenticated, user } = useAuth();

  // Subject Topics with their display names
  const subjectTopics = {
    mathematics: "Mathematics",
    english: "English",
    science: "Science",
    history: "History",
    social: "Social Studies",
    shona: "Shona",
    ict: "ICT",
    // Add more subjects as needed
  };

  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || "1";

  return (
    <div className="bg-gradient-to-br from-[#E0F2FE] via-[#FEF9C3] to-[#FEE2E2] min-h-screen container mx-auto px-4 py-8  shadow-lg rounded-xl">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-kids font-extrabold text-mtech-secondary flex items-center gap-2">
          📚 Revision Zone
        </h1>

        <p className="text-gray-600 mb-6">
          Access study materials and documents for your revision. Select a
          subject to begin.
        </p>

        {/* All Subjects Document Viewer (shows documents from all subjects) */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">All Document Resources</h2>
          <DocumentResourcesViewer grade={getRecommendedGrade()} limit={6} />
        </div>

        {/* Subject-specific Document Viewers */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex overflow-x-auto whitespace-nowrap no-scrollbar gap-2 mb-6 pb-1 border-b border-muted h-18">
            {subjects.map((subject) => (
              <TabsTrigger
                key={subject.id}
                value={subject.name.toLowerCase()}
                className="flex-shrink-0 px-4 py-2 ps-2 rounded-full border border-mtech-secondary bg-white text-mtech-dark hover:bg-mtech-secondary hover:text-white transition 
             data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary"
              >
                {subject.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => (
            <TabsContent
              key={subject.id}
              value={subject.name.toLowerCase()}
              className="mt-0 min-h-[200px]"
            >
              <div className="mt-8 mb-4 shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  {subject.name} Documents
                </h2>
                <DocumentResourcesViewer
                  subject={subject.name.toLowerCase()}
                  grade={getRecommendedGrade()}
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
