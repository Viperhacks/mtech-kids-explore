import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  Users,
  FileText,
  Book,
  PlusCircle,
  Video,
  CheckCircle,
  Trophy,
  Search,
  Pencil,
  Trash2,
  Edit2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DefaultLoginInfo from "../DefaultLoginInfo";
import CourseEditor from "../CourseEditor";
import {
  getResources,
  deleteResource,
  getAllUsers,
  getAllStudents,
  deleteUser,
} from "@/services/apiService";
import { useIsMobile } from "@/hooks/use-mobile";
import StudentAccountCreation from "../student/StudentAccountCreation";
import api, { teacherService } from "@/lib/api";
import { PaginatedResponse, Student } from "../types/apiTypes";
import { capitalize } from "@/utils/stringUtils";
import QuizManagement from "../QuizManagement";
import QuizCreationDialog from "../QuizCreationDialog";
import { Input } from "../ui/input";
import UserEditModal from "../UserEditModal";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);
  const [resourceType, setResourceType] = useState("document");
  const [groupedResources, setGroupedResources] = useState({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const studentsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchResources();
    if (activeTab === "students") {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await getResources();
      setResources(response.resources || []);
      const fetchedResources = response?.resources || [];

      const grouped = fetchedResources.reduce((acc, resource) => {
        const grade = resource.response.grade;
        if (!acc[grade]) {
          acc[grade] = [];
        }
        acc[grade].push(resource);
        return acc;
      }, {});
      console.log("Grouped Resources:", grouped);
      setGroupedResources(grouped);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Failed to load resources",
        description:
          "Could not load your learning materials. Please try again.",
        variant: "destructive",
      });
      setResources([
        {
          id: "fallback-1",
          title: "Introduction to Mathematics",
          type: "document",
          grade: "6",
          subject: "Mathematics",
          createdAt: new Date().toISOString(),
        },
        {
          id: "fallback-2",
          title: "Basic Science Concepts",
          type: "video",
          grade: "6",
          subject: "Science",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const paginatedResources = resources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchStudents = async () => {
    setIsStudentsLoading(true);
    try {
      const response: PaginatedResponse<Student> = await api.get(
        "/teacher/students"
      );
      console.log("fetched students paginated response", response);

      // Fix: The response is already unwrapped by the axios interceptor in api.ts
      if (!Array.isArray(response?.content)) {
        throw new Error("Missing or invalid content in response");
      }

      if (response.content.length === 0) {
        console.warn("No students found in response");
        setStudents([]);
        return;
      }

      const formattedStudents = response.content.map((student, i) => ({
        id: student.id ?? `student-${i}`,
        fullName: student.fullName || "Unnamed Student",
        username: student.username || "",
        email: student.email || "",
        gradeLevel: student.gradeLevel || "N/A",
        role: student.role || "STUDENT",
      }));

      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);

      toast({
        title: "Failed to load students",
        description:
          error instanceof Error
            ? error.message
            : "Could not load student data. Please try again.",
        variant: "destructive",
      });

      setStudents([]);
    } finally {
      setIsStudentsLoading(false);
    }
  };
  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(term) ||
      student.username?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.gradeLevel?.toString().includes(term)
    );
  });

  const totalStudentPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );
  const indexOfLastStudent = currentStudentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handleCreateNew = (type: string = "document") => {
    setSelectedResource(null);
    setResourceType(type);
    setIsEditing(true);
  };

  const handleEditResource = (resource: any) => {
    setSelectedResource(resource.response);
    setResourceType(resource.response.type || "document");
    setIsEditing(true);
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      toast({
        title: "Resource Deleted",
        description: "The learning material has been successfully deleted.",
      });
      fetchResources();
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveComplete = () => {
    setIsEditing(false);
    fetchResources();
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 mr-2" />;
      case "document":
        return <FileText className="h-4 w-4 mr-2" />;
      case "quiz":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      default:
        return <Book className="h-4 w-4 mr-2" />;
    }
  };

  const recentUploads = resources
    .slice()
    .reverse()
    .slice(0, 3)
    .map((resource) => ({
      id: resource.response.id,
      title: resource.response.title,
      type:
        resource.response.type?.charAt(0).toUpperCase() +
          resource.response.type?.slice(1) || "Document",
      date: new Date(
        resource.response.createdAt || Date.now()
      ).toLocaleDateString(),
      status: "Published",
    }));

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast({
        title: "Student Deleted",
        description: "The student has been successfully deleted.",
      });
      fetchStudents();
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleUserEditSuccess = () => {
    fetchStudents();
  };

  const allTabs = [
    { value: "overview", label: "Overview" },
    { value: "materials", label: "My Materials" },
    { value: "quiz_management", label: "Quiz Management" },
    { value: "students", label: "View Students", mobileHidden: true },
    { value: "accounts", label: "Create Student Accounts", mobileHidden: true },
    // { value: "analytics", label: "Analytics", mobileHidden: true }, // future tab maybe?
  ];

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Teacher Dashboard
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={`mb-6 h-12 ${
            isMobile ? "grid grid-cols-2 gap-2 !flex-none mb-12" : ""
          }`}
        >
          {allTabs
            .filter((tab) => !(isMobile && tab.mobileHidden))
            .map((tab) => (
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

        <TabsContent value="quiz_management">
          <QuizManagement />
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full flex items-center justify-start"
                  variant="outline"
                  onClick={() => handleCreateNew("document")}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>

                <Button
                  className="w-full flex items-center justify-start"
                  variant="outline"
                  onClick={() => handleCreateNew("video")}
                >
                  <Video className="mr-2 h-4 w-4" /> Upload Video
                </Button>
                <Button
                  className="w-full flex items-center justify-start"
                  variant="outline"
                  onClick={() => setActiveTab("students")}
                >
                  <Users className="mr-2 h-4 w-4" /> View Students
                </Button>
                <Button
                  className="w-full flex items-center justify-start"
                  variant="outline"
                  onClick={() => setActiveTab("accounts")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Student Account
                </Button>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>
                  Your recently uploaded materials
                </CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-2 " : ""}>
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
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        {!isMobile && <TableHead>Date</TableHead>}
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUploads.length > 0 ? (
                        recentUploads.map((upload) => (
                          <TableRow key={upload.id}>
                            <TableCell className="font-medium">
                              {upload.title}
                            </TableCell>
                            <TableCell>{upload.type}</TableCell>
                            {!isMobile && <TableCell>{upload.date}</TableCell>}
                            <TableCell>
                              <Badge
                                variant={
                                  upload.status === "Published"
                                    ? "default"
                                    : "secondary"
                                }
                                className={`px-2 py-1 text-xs`}
                              >
                                {upload.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={isMobile ? 3 : 4}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No uploads yet. Create your first resource!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Manage Grade Resources
            </h2>

            <div className="space-y-6">
              {Object.entries(
                resources.reduce<Record<string, typeof resources>>(
                  (acc, res) => {
                    const grade = res.response.grade;
                    if (!acc[grade]) acc[grade] = [];
                    acc[grade].push(res);
                    return acc;
                  },
                  {}
                )
              ).map(([grade, resArray]) => (
                <Card key={grade} className="border p-4">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {grade === "0" ? "ECD" : `Grade ${grade}`}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {resArray.length} total resources
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="overflow-x-auto">
                    <div className="flex flex-nowrap gap-4 py-2">
                      {Array.from(
                        new Map(
                          resArray.map((r) => [r.response.subject, r])
                        ).values()
                      ).map((subjectResource) => {
                        const subject = subjectResource.response.subject;
                        const subjectResources = resArray.filter(
                          (r) => r.response.subject === subject
                        );
                        const hasVideo = subjectResources.some(
                          (r) => r.response.type === "video"
                        );
                        const linkTo = hasVideo
                          ? `/grade/grade${grade}/subject/${subject}`
                          : `/revision`;

                        const counts = subjectResources.reduce((acc, r) => {
                          acc[r.response.type] =
                            (acc[r.response.type] || 0) + 1;
                          return acc;
                        }, {});

                        return (
                          <div
                            key={subject}
                            className="flex-shrink-0 border rounded-lg p-3 flex flex-col justify-between w-48"
                          >
                            <div>
                              <h4 className="font-medium">
                                {capitalize(subject)}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {subjectResources.length} resources
                              </p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                {counts.video && (
                                  <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                    <Video className="mr-2 h-4 w-4" />{" "}
                                    {counts.video}
                                  </span>
                                )}
                                {counts.document && (
                                  <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                    <FileText className="mr-2 h-4 w-4" />{" "}
                                    {counts.document}
                                  </span>
                                )}
                                {counts.quiz && (
                                  <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                                    <Trophy className="mr-2 h-4 w-4" />{" "}
                                    {counts.quiz}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              asChild
                            >
                              <Link to={linkTo}>
                                {hasVideo ? "View" : "Revise"}
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>My Learning Materials</CardTitle>
                  <CardDescription>
                    Manage all your teaching resources
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                  <Button
                    className="flex-1 flex items-center justify-center"
                    onClick={() => handleCreateNew("document")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>

                  <Button
                    className="flex-1 flex items-center justify-center"
                    onClick={() => handleCreateNew("video")}
                    variant="outline"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={isMobile ? "px-2" : ""}>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : resources.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        {!isMobile && <TableHead>Grade</TableHead>}
                        {!isMobile && <TableHead>Subject</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResources.map((resource) => (
                        <TableRow key={resource.response.id}>
                          <TableCell className="font-medium">
                            {capitalize(resource.response.title)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getResourceTypeIcon(resource.response.type)}
                              {resource.response.type?.charAt(0).toUpperCase() +
                                resource.response.type?.slice(1) || "Document"}
                            </div>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              {resource.response.grade === "0"
                                ? "ECD"
                                : `Grade ${resource.response.grade}`}
                            </TableCell>
                          )}
                          {!isMobile && (
                            <TableCell>
                              {capitalize(resource.response.subject)}
                            </TableCell>
                          )}
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditResource(resource)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteResource(resource.response.id)
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {totalPages > 1 && (
                    <div className="flex justify-end items-center mt-4 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Book className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="font-medium text-lg">No materials yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first learning resource
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => handleCreateNew("document")}>
                      <FileText className="mr-2 h-4 w-4" /> Upload Document
                    </Button>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      variant="outline"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Create Quiz
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>My Students</CardTitle>
                  <CardDescription>
                    View and manage your students ({filteredStudents.length}{" "}
                    found)
                  </CardDescription>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentStudentPage(1); // Reset to first page on search
                    }}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isStudentsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        {!isMobile && <TableHead>Grade</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {currentStudents.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {capitalize(student.fullName) || "Unnamed"}
                          </TableCell>

                          <TableCell className="max-w-xs truncate">
                            {student.username || "No username"}
                          </TableCell>

                          {!isMobile && (
                            <TableCell>
                              {student.gradeLevel === "0"
                                ? "ECD"
                                : student.gradeLevel
                                ? `Grade ${student.gradeLevel}`
                                : "N/A"}
                            </TableCell>
                          )}

                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
                                onClick={() => handleEditUser(student)}
                              >
                                <Edit2 size={16} className="mr-1" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700 transition"
                                onClick={() => handleDeleteUser(student.id)}
                              >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {totalStudentPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstStudent + 1} to{" "}
                        {Math.min(indexOfLastStudent, filteredStudents.length)}{" "}
                        of {filteredStudents.length} students
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentStudentPage((prev) =>
                              Math.max(prev - 1, 1)
                            )
                          }
                          disabled={currentStudentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {currentStudentPage} of {totalStudentPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentStudentPage((prev) =>
                              Math.min(prev + 1, totalStudentPages)
                            )
                          }
                          disabled={currentStudentPage === totalStudentPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  {searchTerm ? (
                    <>
                      <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="font-medium text-lg">
                        No matching students
                      </h3>
                      <p className="text-muted-foreground">
                        No students found for "{searchTerm}"
                      </p>
                      <Button
                        variant="ghost"
                        className="mt-4"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    </>
                  ) : (
                    <>
                      <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="font-medium text-lg">No students found</h3>
                      <p className="text-muted-foreground">
                        You don't have any students assigned yet
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <StudentAccountCreation />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Learning Analytics</CardTitle>
              <CardDescription>
                Track performance and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Book className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="font-medium text-lg">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Track student progress and engagement with your materials
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isEditing}
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedResource
                ? "Edit Resource"
                : resourceType === "quiz"
                ? "Create New Quiz"
                : "Upload New Resource"}
            </DialogTitle>
            <DialogDescription>
              {selectedResource
                ? "Modify your existing learning material"
                : resourceType === "quiz"
                ? "Create a new quiz for your students"
                : "Add a new learning resource for your students"}
            </DialogDescription>
          </DialogHeader>
          <CourseEditor
            resource={selectedResource}
            onSave={handleSaveComplete}
            onCancel={() => setIsEditing(false)}
            isNew={!selectedResource}
            initialType={resourceType}
          />
        </DialogContent>
      </Dialog>
      <QuizCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onQuizCreated={null}
      />

      <UserEditModal
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={handleUserEditSuccess}
        canEditRole={false}
      />
    </div>
  );
};

export default TeacherDashboard;
