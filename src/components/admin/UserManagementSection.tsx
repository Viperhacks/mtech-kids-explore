import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { deleteUser, getAllUsers } from "@/services/apiService";
import { getDaysAgo } from "@/utils/calculateDays";
import { capitalize } from "@/utils/stringUtils";
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react";
import UserEditModal from "../UserEditModal";

interface User {
  id: string;
  fullName: string;
  username: string;
  role: string;
  gradeLevel?: string | null;
  assignedLevels?: string[] | null;
  createdAt: string;
}

const UserManagementSection: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, gradeFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(currentPage, 10);
      const usersData = Array.isArray(response)
        ? response
        : response.content || [];
      const totalPagesData = response.totalPages || 1;
      console.log("Fetched users:", usersData, "Total pages:", totalPagesData);

      setUsers(usersData);
      setTotalPages(totalPagesData);
    } catch (error) {
      toast({
        title: "Failed to load users",
        description: "Could not load user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserGrade = (user: User) => {
    if (user.gradeLevel === "0") return "ECD";

    if (user.gradeLevel) return `Grade ${user.gradeLevel}`;

    if (user.assignedLevels && user.assignedLevels.length > 0) {
      return user.assignedLevels
        .map((level) => (level === "0" ? "ECD" : `Grade ${level}`))
        .join(", ");
    }

    return "N/A";
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter((user) => {
        const grades: string[] = [];

        if (user.gradeLevel) {
          grades.push(user.gradeLevel);
        }
        if (user.assignedLevels && user.assignedLevels.length > 0) {
          grades.push(...user.assignedLevels);
        }

        return grades.includes(gradeFilter);
      });
    }

    setFilteredUsers(filtered);
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Name", "Username", "Role", "Date Joined"],
      ...filteredUsers.map((user) => [
        user.fullName,
        user.username,
        user.role,
        getDaysAgo(user.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleUserEditSuccess = () => {
    fetchUsers();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <Button onClick={exportToCSV} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="0">ECD</SelectItem>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {capitalize(user.fullName)}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "default"
                            : user.role === "TEACHER"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{getUserGrade(user)}</TableCell>
                    <TableCell>{getDaysAgo(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-mtech-primary border-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-mtech-secondary border-red-600 hover:bg-red-100 hover:text-red-700 transition"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && ` matching "${searchTerm}"`}
          {roleFilter !== "all" && ` with role "${roleFilter}"`}
        </div>
      </CardContent>
      <UserEditModal
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={handleUserEditSuccess}
        canEditRole={true}
      />
    </Card>
  );
};

export default UserManagementSection;
