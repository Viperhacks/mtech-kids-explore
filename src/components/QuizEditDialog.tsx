import React, { useState, useEffect } from "react";
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
import { getTeacherSubjects, updateQuiz, getResourcesForQuiz } from "@/services/apiService";
import { Loader2 } from "lucide-react";
import { subjects } from "@/utils/subjectUtils";
import { useAuth } from "@/context/AuthContext";
import { capitalize } from "@/utils/stringUtils";

interface Quiz {
  quizId: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  standaAlone: boolean;
  teacherName: string;
}

interface QuizEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
  onQuizUpdated: () => void;
}

const QuizEditDialog: React.FC<QuizEditDialogProps> = ({
  open,
  onOpenChange,
  quiz,
  onQuizUpdated,
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
  });
  const assignedLevels = user?.assignedLevels || [];

  const [teacherSubjects, setTeacherSubjects] = useState<{ id: number; name: string }[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // New: resources state & loading
  const [resources, setResources] = useState<{ id: number | string; title?: string }[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    const fetchTeacherSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const fetchedSubjects = await getTeacherSubjects();

        if (fetchedSubjects.includes("All Subjects")) {
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

    // Fetch resources too
    const fetchResources = async () => {
      setLoadingResources(true);
      try {
        const res = await getResourcesForQuiz();
        const resData = Array.isArray(res) ? res : res.resources || [];
        setResources(resData);
      } catch {
        toast({
          title: "Failed to load resources",
          description: "Could not load resources.",
          variant: "destructive",
        });
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchResources();
  }, [open, user, toast]);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title,
        description: quiz.description,
        grade: quiz.grade,
        subject: quiz.subject,
        standaAlone: quiz.standaAlone,
        resourceId: "", // if your quiz object has resourceId, set it here
      });
    }
  }, [quiz]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fix validation here: check if standalone false AND no resourceId
    if (!formData.standaAlone && !formData.resourceId) {
      toast({
        title: "Resource Required",
        description: "Please select a resource or mark the quiz as standalone.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateQuiz(quiz!.quizId, formData);
      toast({
        title: "Quiz Updated",
        description: "Quiz has been successfully updated",
      });
      onQuizUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to update quiz",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={capitalize(formData.title) || ""}
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
              value={capitalize(formData.description) || ""}
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
                value={formData.resourceId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, resourceId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  {loadingResources ? (
                    <SelectItem value="loading" disabled>
                      Loading resources...
                    </SelectItem>
                  ) : resources.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No resources available
                    </SelectItem>
                  ) : (
                    resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id.toString()}>
                        {resource.title || `Resource ${resource.id}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizEditDialog;
