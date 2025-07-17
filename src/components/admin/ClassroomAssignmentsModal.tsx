
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getClassroomAssignments, deleteAssignment } from '@/services/apiService';
import { getSubjectById, getSubjectByName } from '@/utils/subjectUtils';
import { Users, Trash2, AlertTriangle } from 'lucide-react';

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
  onAssignmentDeleted
}) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (open && classroom.id) {
      fetchAssignments();
    }
  }, [open, classroom.id]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await getClassroomAssignments(classroom.id);
      const assignmentsData = Array.isArray(response) ? response : response.content || [];
      console.log("asssignment data",assignmentsData)
      setAssignments(assignmentsData);
    } catch (error) {
      toast({
        title: "Failed to load assignments",
        description: "Could not load classroom assignments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to remove this teacher assignment?')) {
      return;
    }

    setDeletingId(assignmentId);
    try {
      await deleteAssignment(assignmentId);
      toast({
        title: "Assignment Removed",
        description: "Teacher assignment has been removed successfully"
      });
      
      onAssignmentDeleted();
      fetchAssignments();
    } catch (error) {
      toast({
        title: "Failed to remove assignment",
        description: "Could not remove teacher assignment",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teacher Assignments - {classroom.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Classroom:</strong> {classroom.name} ({classroom.gradeLevel === "0"
                            ? "ECD"
                            : `Grade ${classroom.gradeLevel}`})
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : assignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {assignment.teacherName}
                    </TableCell>
                    <TableCell>
                      {getSubjectByName(assignment.subjectName)?.name || 'Unknown Subject'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        disabled={deletingId === assignment.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingId === assignment.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
                No teachers are currently assigned to this classroom.
                Use the "Assign Teacher" button to add assignments.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomAssignmentsModal;
