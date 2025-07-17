import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  createQuiz,
  getResources,
  getResourcesForQuiz,
  getTeacherSubjects,
} from "@/services/apiService";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subjects } from "@/utils/subjectUtils";
import { capitalize } from "@/utils/stringUtils";

interface QuizCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizCreated: () => void;
}

const QuizCreationDialog: React.FC<QuizCreationDialogProps> = ({
  open,
  onOpenChange,
  onQuizCreated,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    grade: "",
    subject: "",
    standaAlone: true,
    resourceId: "",
    teacherName: user?.fullName || user?.name || "",
  });
  const assignedLevels = user?.assignedLevels || [];
  const [resources, setResources] = useState([]);

  const [teacherSubjects, setTeacherSubjects] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    const fetchTeacherSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const fetchedSubjects = await getTeacherSubjects();

        if (fetchedSubjects.includes("All Subjects")) {
          // use your full subject list if "All Subjects" assigned
          setTeacherSubjects(subjects);
        } else {
          setTeacherSubjects(
            fetchedSubjects.map((name: string, idx: number) => ({
              id: idx,
              name,
            }))
          );
        }
      } catch (error) {
        toast({
          title: "Failed to load subjects",
          description: "Could not fetch your subjects.",
          variant: "destructive",
        });
        setTeacherSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchTeacherSubjects();
  }, [open, user]);

  useEffect(() => {
    if (open) {
      fetchAvailableResources();
    }
  }, [open]);

  const fetchAvailableResources = async () => {
    setIsLoading(true);
    try {
      const response = await getResourcesForQuiz();

      const resourcesData = Array.isArray(response)
        ? response
        : response.resources || [];
      console.log(resourcesData, "resource data");
      setResources(resourcesData);
    } catch (error) {
      toast({
        title: "Failed to load resources",
        description: "Could not load resource data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.standaAlone && !formData.resourceId) {
    toast({
      title: "Resource Required",
      description: "Please select a resource or mark the quiz as standalone.",
      variant: "destructive",
    });
    return;
  }

    try {
      await createQuiz(formData);
      toast({
        title: "Quiz Created Successfully",
        description: "You can now upload questions to your quiz",
      });
      onQuizCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to create quiz",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      grade: "",
      subject: "",
      standaAlone: true,
      resourceId: "",
      teacherName: user?.fullName || user?.name || "",
    });
  };

  if (!user || assignedLevels.length === 0) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Access Restricted</DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center text-red-600">
          You are not assigned to any grade level. Please contact your admin for access.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={capitalize(formData.title)}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={capitalize(formData.description)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, grade: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {assignedLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level === "0" ? "ECD" : `Grade ${level}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subject: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSubjects ? (
                    <SelectItem value="loading" disabled>
                      Loading subjects...
                    </SelectItem>
                  ) : teacherSubjects.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No subjects assigned
                    </SelectItem>
                  ) : (
                    teacherSubjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.name.toLowerCase()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="standalone"
              checked={formData.standaAlone}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, standaAlone: checked }))
              }
            />
            <Label htmlFor="standalone">Standalone Quiz</Label>
          </div>
          {!formData.standaAlone && (
            <div>
              <Label htmlFor="resource">Attach Resource</Label>
              <Select
                value={formData.resourceId?.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, resourceId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem
                      key={resource.id}
                      value={resource.id.toString()}
                    >
                      {resource.title || `Resource ${resource.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Quiz"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizCreationDialog;
