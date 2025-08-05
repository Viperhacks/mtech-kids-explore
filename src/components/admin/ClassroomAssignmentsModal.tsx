import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  getClassroomAssignments,
  deleteAssignment,
} from "@/services/apiService";
import { Users, Trash2, AlertTriangle } from "lucide-react";

interface Assignment {
  id: string;
  teacherId: number;
  teacherName: string;
  subjectName: string;
  classroomId: number;
}

interface Classroom {
  id: string;
  name: string;
  gradeLevel: string;
}

interface ClassroomAssignmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom;
  onAssignmentDeleted: () => void;
}

const ClassroomAssignmentsModal: React.FC<ClassroomAssignmentsModalProps> = ({
  open,
  onOpenChange,
  classroom,
  onAssignmentDeleted,
}) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) fetchAssignments();
  }, [open]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const resp = await getClassroomAssignments(classroom.id);
      const list = Array.isArray(resp) ? resp : resp.content || [];
      setAssignments(list);
    } catch (err) {
      toast({ title: "Failed to load", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}?`)) return;
    setDeletingId(id);
    try {
      await deleteAssignment(id);
      toast({ title: "Removed" });
      onAssignmentDeleted();
      fetchAssignments();
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {`Assignments for ${classroom.name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Classroom:</strong> {classroom.name} (
              {classroom.gradeLevel === "0"
                ? "ECD"
                : `Grade ${classroom.gradeLevel}`}
              )
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : assignments.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.teacherName}</TableCell>
                    <TableCell>{a.subjectName}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === a.id}
                        onClick={() => handleDelete(a.id, a.subjectName)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No assignments yet. Use “Assign Teacher” to add one.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomAssignmentsModal;
