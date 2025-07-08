
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, TrendingUp } from 'lucide-react';
import AdminQuizManagement from './AdminQuizManagement';
import AdminResourceManagement from './AdminResourceManagement';
import AdminStudentProgress from './AdminStudentProgress';

const AdminContentPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
      </div>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Student Progress
          </TabsTrigger>
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
