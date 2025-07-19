import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserDetails } from "@/services/apiService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  fullName: string;
  username: string;
  email?: string;
  role: string;
  grade?: string;
  gradeLevel?: string;
  assignedLevels?: string[];
}

interface UserEditModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  canEditRole?: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  open,
  onClose,
  onSuccess,
  canEditRole = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "",
    grade: "",
    assignedLevels: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const assignedLevels = currentUser?.assignedLevels || [];

  const allGradeLevels = ["0", "1", "2", "3", "4", "5", "6", "7"];

  const isAdmin = currentUser?.role === "ADMIN";

  const gradeOptions = isAdmin ? allGradeLevels : assignedLevels;

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        username: user.username || "",
        password: "",
        role: user.role || "",
        grade: user.grade || user.gradeLevel || "",
        assignedLevels: user.assignedLevels || [],
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.password && formData.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    const dataToSend: any = {
      fullName: formData.fullName,
      username: formData.username,
      role: formData.role,
    };

    if (formData.password) {
      dataToSend.password = formData.password;
    }

    if (formData.role === "STUDENT") {
      dataToSend.gradeLevel = formData.grade;
    } else {
      dataToSend.gradeLevel = null;
    }

    if (formData.role === "TEACHER") {
      dataToSend.assignedLevels = formData.assignedLevels;
    } else {
      dataToSend.assignedLevels = [];
    }

    setIsLoading(true);
    try {
     
      await updateUserDetails(user.id, dataToSend);
      toast.success("User updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Leave empty to keep current"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>

          {canEditRole && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.role === "STUDENT" && (
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleInputChange("grade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level === "0" ? "ECD" : `Grade ${level}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.role === "TEACHER" && (
            <div className="space-y-2">
              <Label>Assigned Levels</Label>
              <Select
                value=""
                onValueChange={(value) =>
                  handleInputChange(
                    "assignedLevels",
                    Array.from(new Set([...formData.assignedLevels, value]))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.assignedLevels.map((level) => (
                  <span
                    key={level}
                    className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                  >
                    {level === "0" ? "ECD" : `Grade ${level}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
