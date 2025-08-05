import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  getTeachersForAssignment,
  createAssignment,
} from "@/services/apiService";
import { subjects } from "@/utils/subjectUtils";
import { UserPlus, Loader2 } from "lucide-react";

interface Teacher {
  id: number;
  fullName: string;
  username: string;
}

interface Classroom {
  id: string;
  name: string;
  gradeLevel: string;
}

interface TeacherAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom;
  onAssignmentCreated: () => void;
}

const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  open,
  onOpenChange,
  classroom,
  onAssignmentCreated,
}) => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false);

  useEffect(() => {
    if (open) fetchTeachers();
  }, [open]);

  async function fetchTeachers() {
    setIsFetchingTeachers(true);
    try {
      const resp = await getTeachersForAssignment();
      const list = Array.isArray(resp) ? resp : resp.content || [];
      setTeachers(list);
    } catch {
      toast({ title: "Failed to load teachers", variant: "destructive" });
    } finally {
      setIsFetchingTeachers(false);
    }
  }

  const toggleTeacher = (id: number) => {
    setSelectedTeacherIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSubject = (id: number) => {
    setSelectedSubjectIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedTeacherIds.size || !selectedSubjectIds.size) {
      toast({
        title: "Validation Error",
        description: "Pick at least one teacher and one subject",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isAllSubjects = selectedSubjectIds.has(0);
      const subjectsToAssign = isAllSubjects
        ? [0]
        : Array.from(selectedSubjectIds);

      for (let teacherId of selectedTeacherIds) {
        for (let subjectId of subjectsToAssign) {
          await createAssignment(
            teacherId,
            parseInt(classroom.id),
            subjectId === 0 ? undefined : subjectId, // undefined or null means all subjects on backend
            subjectId === 0
              ? "all"
              : subjects.find((s) => s.id === subjectId)?.name || ""
          );
        }
      }

      toast({ title: "Assignments Created" });
      onAssignmentCreated();
      onOpenChange(false);
      setSelectedTeacherIds(new Set());
      setSelectedSubjectIds(new Set());
    } catch {
      toast({
        title: "Failed to create assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Teachers & Subjects to {classroom.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label>Select Teachers</Label>
            {isFetchingTeachers ? (
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading…</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto p-2 border rounded">
                {teachers.map((t) => (
                  <div key={t.id} className="flex items-center">
                    <Checkbox
                      checked={selectedTeacherIds.has(t.id)}
                      onCheckedChange={() => toggleTeacher(t.id)}
                    />
                    <span className="ml-2 text-sm">
                      {t.fullName} ({t.username})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Select Subjects</Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-auto p-2 border rounded">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedSubjectIds.has(0)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // Select "All" => clear others
                      setSelectedSubjectIds(new Set([0]));
                    } else {
                      // Uncheck "All"
                      setSelectedSubjectIds((prev) => {
                        const next = new Set(prev);
                        next.delete(0);
                        return next;
                      });
                    }
                  }}
                />
                <span className="ml-2 text-sm">All Subjects</span>
              </div>

              {subjects.map((s) => (
                <div key={s.id} className="flex items-center">
                  <Checkbox
                    checked={selectedSubjectIds.has(s.id)}
                    onCheckedChange={(checked) => {
                      setSelectedSubjectIds((prev) => {
                        const next = new Set(prev);
                        if (checked) {
                          next.add(s.id);
                          // Remove "All" if another subject selected
                          next.delete(0);
                        } else {
                          next.delete(s.id);
                        }
                        return next;
                      });
                    }}
                    disabled={selectedSubjectIds.has(0)} // disable if All selected
                  />
                  <span className="ml-2 text-sm">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted rounded">
            <p>
              <strong>Classroom:</strong> {classroom.name} —{" "}
              {classroom.gradeLevel === "0"
                ? "ECD"
                : `Grade ${classroom.gradeLevel}`}
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning…
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAssignmentModal;
