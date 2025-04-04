
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { Upload, Users, FileText, Book, PlusCircle } from 'lucide-react';
import DefaultLoginInfo from '../DefaultLoginInfo';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const recentUploads = [
    { id: 1, title: "Mathematics: Fractions Video", type: "Video", date: "2 days ago", status: "Published" },
    { id: 2, title: "Science: Plants Quiz", type: "Quiz", date: "1 week ago", status: "Published" },
    { id: 3, title: "English: Grammar Notes", type: "Document", date: "2 weeks ago", status: "Draft" },
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full flex items-center justify-start" variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload Resource
            </Button>
            <Button className="w-full flex items-center justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Create Quiz
            </Button>
            <Button className="w-full flex items-center justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" /> View Students
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Your recently uploaded materials</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUploads.map(upload => (
                  <TableRow key={upload.id}>
                    <TableCell className="font-medium">{upload.title}</TableCell>
                    <TableCell>{upload.type}</TableCell>
                    <TableCell>{upload.date}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          upload.status === "Published" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {upload.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Manage Grade Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/grade/1" className="block">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Grade 1</CardTitle>
              <CardDescription>Manage Grade 1 resources</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">View Resources</Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/grade/2" className="block">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Grade 2</CardTitle>
              <CardDescription>Manage Grade 2 resources</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">View Resources</Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/grade/3" className="block">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Grade 3</CardTitle>
              <CardDescription>Manage Grade 3 resources</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">View Resources</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Manage Subjects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center p-6 hover:shadow-md transition-all">
          <Book className="h-10 w-10 mx-auto text-mtech-primary mb-2" />
          <h3 className="font-medium mb-1">Mathematics</h3>
          <p className="text-sm text-gray-500 mb-4">12 Resources</p>
          <Button size="sm">Manage</Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-md transition-all">
          <Book className="h-10 w-10 mx-auto text-mtech-secondary mb-2" />
          <h3 className="font-medium mb-1">English</h3>
          <p className="text-sm text-gray-500 mb-4">8 Resources</p>
          <Button size="sm">Manage</Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-md transition-all">
          <Book className="h-10 w-10 mx-auto text-green-500 mb-2" />
          <h3 className="font-medium mb-1">Science</h3>
          <p className="text-sm text-gray-500 mb-4">10 Resources</p>
          <Button size="sm">Manage</Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-md transition-all border-dashed flex flex-col items-center justify-center">
          <PlusCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <h3 className="font-medium mb-1">Add New Subject</h3>
          <Button variant="ghost" size="sm">Create</Button>
        </Card>
      </div>
      
      <DefaultLoginInfo />
    </div>
  );
};

export default TeacherDashboard;
