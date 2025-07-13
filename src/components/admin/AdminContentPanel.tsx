import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, TrendingUp } from "lucide-react";
import AdminQuizManagement from "./AdminQuizManagement";
import AdminResourceManagement from "./AdminResourceManagement";
import AdminStudentProgress from "./AdminStudentProgress";

const studentTabs = [
  {
    value: "quizzes",
    label: "Quizzes",
    icon: FileText,
  },
  {
    value: "resources",
    label: "Resources",
    icon: Video,
  },
  {
    value: "progress",
    label: "Student Progress",
    icon: TrendingUp,
  },
];

const AdminContentPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
      </div>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          {studentTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="snap-start flex-shrink-0 px-4 py-2 rounded-full border border-mtech-secondary hover:border-mtech-primary bg-white text-mtech-dark hover:bg-mtech-primary hover:text-white transition 
             data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="quizzes" className="mt-6">
          <AdminQuizManagement />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <AdminResourceManagement />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <AdminStudentProgress />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentPanel;
