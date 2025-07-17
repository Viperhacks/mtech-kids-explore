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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem
                      key={subject.id}
                      value={subject.name.toLowerCase()}
                    >
                      {subject.name}
                    </SelectItem>
                  ))}
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
