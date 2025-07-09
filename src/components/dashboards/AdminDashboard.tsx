import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Users, Settings, Shield, FileText, Building2 ,BookOpenCheck, GraduationCap, Files} from 'lucide-react';
import DefaultLoginInfo from '../DefaultLoginInfo';
import CourseCreation from '../CourseCreation';
import ClassroomManagement from '../admin/ClassroomManagement';
import UserManagementSection from '../admin/UserManagementSection';
import { getAllUsers, getTeachers, getTotalStats } from '@/services/apiService';
import { toast } from '../ui/use-toast';
import { getDaysAgo } from '@/utils/calculateDays';
import { capitalize } from '@/utils/stringUtils';
import TeacherAccountCreation from '../admin/TeacherAccountCreation';
import { Teacher } from '../types/apiTypes';
import AdminContentPanel from '../admin/AdminContentPanel';



const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [currentPage, setCurrentPage] = useState(0);
  const [teacher, setTeachers] = useState<Teacher[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  type Stats = {
    totalUsers: number;
    totalTeachers: number;
    totalStudents: number;
    totalResources: number;
  };

  const [totalStats, setTotalStats] = useState<Stats>({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalResources: 0,
  });

  type RecentUser = {
    id: string;
    name: string;
    username: string;
    role: string;
    date: string;
  };
  
  const [joinedUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(()=>{
    fetchStats();
    fetchUsers();
    if(activeTab=="teachers"){
      fetchTeachers();
    }
  },[activeTab])

  const fetchStats = async ()=>{
    setIsLoading(true);
    try {
      const response = await getTotalStats();
      setTotalStats(response);
    } catch (error) {
       console.error('Error fetching stats:', error);
      toast({
        title: "Failed to load stats",
        description: "Could not system statistics. Please try again.",
        variant: "destructive"
      });
    } finally{
      setIsLoading(false);
    }
  }

  const fetchUsers = async ()=>{
    setIsLoading(true);
    try {
      const response = await getAllUsers(0,5);
      
      let content = Array.isArray(response) ? response : response.content || [];
      content = content.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      const topFive = content.slice(0,5);

      const formatted = topFive.map((u: any) => ({
        id: u.id,
        name: u.fullName,
        username: u.username,
        role: u.role,
        date: getDaysAgo(u.createdAt),
      }));

      
      setRecentUsers(formatted)
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const response = await getTeachers(currentPage, 10);
        console.log(response);
        const teacherData = Array.isArray(response) ? response : response.content || [];
        const totalPagesData = response.totalPages || 1;

        
        
        setTeachers(teacherData);
        setTotalPages(totalPagesData);
      } catch (error) {
        toast({
          title: "Failed to load users",
          description: "Could not load user data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

  const stats = [
    { label: "Total Users", value: totalStats.totalUsers, icon: Users },
    { label: "Teachers", value: totalStats.totalTeachers, icon: BookOpenCheck },
    { label: "Students", value: totalStats.totalStudents, icon: GraduationCap },
    { label: "Resources", value: totalStats.totalResources, icon: Files },
  ];

  const recentUsers = joinedUsers;

  const handleQuickAction = (action: string) => {
    handleTabChange(action);
    /*switch (action) {
      case 'users':
        setActiveTab('users');
        break;
      case 'content':
        setActiveTab('content');
        break;
      case 'classes':
        setActiveTab('classes');
        break;
      default:
        break;
    }*/
  };

  const tabsContentRef = useRef<HTMLDivElement>(null);

  const isElementInViewPort = (el: HTMLElement)=>{
    if(!el) return false;

    const rect = el.getBoundingClientRect();
    return(
      rect.top >= 0 &&
      rect.left >= 0 && 
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  const scrollToTab = useCallback((tabId:string)=>{
     setTimeout(() => {
      const el = document.getElementById(`tab-${tabId}`);
      if(el){
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 10);
  },[]);

  const handleTabChange= (tabValue:string)=>{
    setActiveTab(tabValue);
    //scrollToTab(tabValue)
    setTimeout(() => {
     if(!tabsContentRef.current) return;
     
     const tabContent = document.getElementById(`tab-${tabValue}`);
     if(!tabContent) return;
     if(!isElementInViewPort(tabsContentRef.current)){
      tabContent.scrollIntoView({
        behavior:"smooth",
        block: "start",
      });
     }
    }, 10);
  }
  
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
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{capitalize(user.name)}</TableCell>
                      <TableCell>{user.username}</TableCell>
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
            <Button variant="outline" onClick={() => handleQuickAction('users')}>
              View All Users
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full flex items-center justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('users')}
            >
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </Button>
            
            <Button 
              className="w-full flex items-center justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('content')}
            >
              <FileText className="mr-2 h-4 w-4" /> Content Management
            </Button>
            <Button 
              className="w-full flex items-center justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('classes')}
            >
              <Building2 className="mr-2 h-4 w-4" /> Class Management
            </Button>
          </CardContent>
        </Card>
      </div>
      <div ref={tabsContentRef}>
      <Tabs 
      value={activeTab}
      onValueChange={handleTabChange}
      
      className="w-full mb-8">
        <TabsList className='grid w-full grid-cols-3 overflow-x-auto'>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="teachers">Teacher Management</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users"
        id='tab-users'
         className="pt-4">
          <UserManagementSection />
        </TabsContent>
        
        <TabsContent value="teachers"
        id='tab-teachers'
        className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeacherAccountCreation />
            
            <Card>
              <CardHeader>
                <CardTitle>Active Teachers</CardTitle>
                <CardDescription>Currently active teachers in the system</CardDescription>
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
                    { 
                    teacher.map((t,index)=>(
                        <div className="flex justify-between p-3 border rounded-md" key={index}>
                      <div>
                        <p className="font-medium">{t.fullName || "Unknown Teacher"}</p>
                        <p className="text-sm text-muted-foreground">{t.gradeLevel || "Unassigned"}</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                      ))}
                    
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Teachers</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="classes"
        id='tab-classes'
        className="pt-4">
          <ClassroomManagement />
        </TabsContent>

        <TabsContent value="content" 
        id='tab-content'
        className="pt-4">
          <AdminContentPanel />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
