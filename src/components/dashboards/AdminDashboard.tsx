import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Users,
  Settings,
  Shield,
  FileText,
  Building2,
  BookOpenCheck,
  GraduationCap,
  Files,
  UserX,
} from "lucide-react";
import DefaultLoginInfo from "../DefaultLoginInfo";
import CourseCreation from "../CourseCreation";
import ClassroomManagement from "../admin/ClassroomManagement";
import UserManagementSection from "../admin/UserManagementSection";
import { getAllUsers, getTeachers, getTotalStats } from "@/services/apiService";
import { toast } from "../ui/use-toast";
import { getDaysAgo } from "@/utils/calculateDays";
import { capitalize } from "@/utils/stringUtils";
import TeacherAccountCreation from "../admin/TeacherAccountCreation";
import { Teacher } from "../types/apiTypes";
import AdminContentPanel from "../admin/AdminContentPanel";
import TeacherStudentsModal from "../admin/TeacherStudentsModal";
import UserEditModal from "../UserEditModal";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // URL-based tab state management
  const urlTab = searchParams.get("tab") || "users";
  const [activeTab, setActiveTab] = useState(urlTab);

  const [currentPage, setCurrentPage] = useState(0);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const [editingUser, setEditingUser] = useState<any>(null);

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

  // Refs for scroll management
  const tabsContentRef = useRef<HTMLDivElement>(null);

  // Update activeTab when URL changes
  useEffect(() => {
    const newTab = searchParams.get("tab") || "users";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    if (activeTab == "teachers") {
      fetchTeachers(currentPage);
    }
  }, [activeTab, currentPage]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await getTotalStats();
      setTotalStats(response);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Failed to load stats",
        description: "Could not system statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(0, 5);

      let content = Array.isArray(response) ? response : response.content || [];
      content = content.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const topFive = content.slice(0, 5);

      const formatted = topFive.map((u: any) => ({
        id: u.id,
        name: u.fullName,
        username: u.username,
        role: u.role,
        date: getDaysAgo(u.createdAt),
      }));

      setRecentUsers(formatted);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeachers = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getTeachers(page, 5);
      const teacherData = Array.isArray(response)
        ? response
        : response.content || [];
      console.log("API Response for Teachers:", response);
      const totalPagesData = response.totalPages || 1;

      setTeachers(teacherData);
      setTotalPages(totalPagesData);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: "Failed to load teachers",
        description: "Could not load teacher data",
        variant: "destructive",
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

  // Smart scroll detection
  const shouldScrollToTabs = useCallback(() => {
    if (!tabsContentRef.current) return false;

    const rect = tabsContentRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Only scroll if tabs are significantly out of view
    // Allow for some threshold to prevent unnecessary scrolling
    return rect.top < -100 || rect.top > viewportHeight - 200;
  }, []);

  // Scroll to tab content smoothly
  const scrollToTabContent = useCallback(() => {
    if (!tabsContentRef.current) return;

    tabsContentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Enhanced tab change handler with URL persistence and smart scrolling
  const handleTabChange = useCallback(
    (tabValue: string, scrollBehavior: "auto" | "force" | "none" = "auto") => {
      // Update URL parameters to persist tab state
      setSearchParams({ tab: tabValue });
      setActiveTab(tabValue);

      // Smart scrolling logic
      if (scrollBehavior === "force") {
        scrollToTabContent();
      } else if (scrollBehavior === "auto" && shouldScrollToTabs()) {
        scrollToTabContent();
      }
      // 'none' behavior doesn't scroll at all
    },
    [setSearchParams, shouldScrollToTabs, scrollToTabContent]
  );

  // Quick action handler - forces scroll since it's navigation from outside tabs
  const handleQuickAction = (action: string) => {
    handleTabChange(action, "force");
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleUserEditSuccess = () => {
    fetchUsers();
    fetchTeachers(currentPage);
  };

  const adminTabs = [
    { value: "users", label: "User Management" },
    { value: "teachers", label: "Teacher Management" },
    { value: "classes", label: "Classes" },
    { value: "content", label: "Content Management" },
  ];

  const handleViewStudents = (teacherId: string) => {
    // Navigate to the teacher's student management page
    setSearchParams({ tab: "teachers", teacherId });
    handleTabChange("teachers", "force");
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5 min-h-screen">
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {capitalize(user.name)}
                      </TableCell>
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
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => handleQuickAction("users")}
            >
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
              onClick={() => handleQuickAction("users")}
            >
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </Button>
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              onClick={() => handleQuickAction("teachers")}
            >
              <BookOpenCheck className="mr-2 h-4 w-4" /> Manage Teachers
            </Button>
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              onClick={() => handleQuickAction("content")}
            >
              <FileText className="mr-2 h-4 w-4" /> Content Management
            </Button>
            <Button
              className="w-full flex items-center justify-start"
              variant="outline"
              onClick={() => handleQuickAction("classes")}
            >
              <Building2 className="mr-2 h-4 w-4" /> Class Management
            </Button>
          </CardContent>
        </Card>
      </div>

      <div ref={tabsContentRef}>
        <Tabs
          value={activeTab}
          onValueChange={(value) => handleTabChange(value, "none")}
          className="w-full mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-5 h-12 ">
            {adminTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="snap-start flex-shrink-0 px-4 py-2 rounded-full border border-mtech-secondary hover:border-mtech-primary bg-white text-mtech-dark hover:bg-mtech-primary hover:text-white transition 
             data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary ml-2"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="users" id="tab-users" className="pt-4">
            <UserManagementSection />
          </TabsContent>

          <TabsContent value="teachers" id="tab-teachers" className="pt-7">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeacherAccountCreation onAdd={fetchTeachers} />

              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teachers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground space-y-3">
                        <UserX className="w-12 h-12" />
                        <p className="text-lg font-semibold">
                          No teachers found
                        </p>
                        <p className="text-sm">
                          Looks like nobody's on staff duty yet
                        </p>
                      </div>
                    ) : (
                      <>
                        {teachers.map((t, index) => (
                          <div
                            className="flex justify-between items-center p-3 border rounded-md"
                            key={index}
                          >
                            <div>
                              <p className="font-medium">
                                {t.fullName || "Unknown Teacher"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t.assignedLevels?.length ? (
                                  <>
                                    Assigned to:{" "}
                                    {t.assignedLevels
                                      .map((level) =>
                                        level === "0" ? "ECD" : `Grade ${level}`
                                      )
                                      .join(", ")}
                                  </>
                                ) : (
                                  "Not assigned to any level"
                                )}
                              </p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Badge variant="outline">Active</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setSelectedTeacherId(Number(t.id))
                                }
                              >
                                View Students
                              </Button>
                            </div>
                          </div>
                        ))}

                        {selectedTeacherId !== null && (
                          <TeacherStudentsModal
                            teacherId={selectedTeacherId}
                            open={true}
                            onClose={() => setSelectedTeacherId(null)}
                          />
                        )}

                        {totalPages > 1 && (
                          <div className="flex justify-center gap-3 mt-4">
                            <Button
                              disabled={currentPage === 0}
                              onClick={() => setCurrentPage((prev) => prev - 1)}
                              variant="secondary"
                            >
                              Prev
                            </Button>
                            <Button
                              disabled={currentPage + 1 >= totalPages}
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                              variant="secondary"
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="classes" id="tab-classes" className="pt-4">
            <ClassroomManagement />
          </TabsContent>

          <TabsContent value="content" id="tab-content" className="pt-4">
            <AdminContentPanel />
          </TabsContent>
        </Tabs>
      </div>

      <UserEditModal
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={handleUserEditSuccess}
        canEditRole={true}
      />
    </div>
  );
};

export default AdminDashboard;
