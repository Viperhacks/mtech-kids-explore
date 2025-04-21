
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Users, Settings, Shield, Book, FileText } from 'lucide-react';
import DefaultLoginInfo from '../DefaultLoginInfo';
import CourseCreation from './CourseCreation';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for admin dashboard
  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student", date: "2 days ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Teacher", date: "3 days ago" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Student", date: "1 week ago" },
  ];
  
  const stats = [
    { label: "Total Users", value: "243", icon: Users },
    { label: "Teachers", value: "18", icon: Shield },
    { label: "Students", value: "225", icon: Book },
    { label: "Resources", value: "142", icon: FileText },
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">{stat.value}</span>
                <stat.icon className="h-6 w-6 text-mtech-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Recently added users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === "Teacher" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{user.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline">View All Users</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full flex items-center justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </Button>
            <Button className="w-full flex items-center justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Content Management
            </Button>
            <Button className="w-full flex items-center justify-start" variant="outline">
              <Shield className="mr-2 h-4 w-4" /> Role Permissions
            </Button>
            <Button className="w-full flex items-center justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" /> System Settings
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="courses" className="w-full mb-8">
        <TabsList>
          <TabsTrigger value="courses">Course Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CourseCreation />
            
            <Card>
              <CardHeader>
                <CardTitle>Active Courses</CardTitle>
                <CardDescription>Currently active courses in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Mathematics Fundamentals</p>
                        <p className="text-sm text-muted-foreground">Grade 4 • 12 weeks</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Science Exploration</p>
                        <p className="text-sm text-muted-foreground">Grade 5 • 10 weeks</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">English Literature</p>
                        <p className="text-sm text-muted-foreground">Grade 6 • 16 weeks</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Courses</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
                <p>Analytics visualization would appear here</p>
                <p className="text-sm text-gray-500">User growth metrics and charts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Usage and performance reports</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p>Reports would appear here</p>
                <p className="text-sm text-gray-500">Download or view system reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system activity logs</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <Settings className="h-16 w-16 text-gray-300 mb-4" />
                <p>System logs would appear here</p>
                <p className="text-sm text-gray-500">Monitor system activity and events</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
