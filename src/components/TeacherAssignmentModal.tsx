
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getTeachers, createAssignment } from '@/services/apiService';
import { subjects } from '@/utils/subjectUtils';
import { UserPlus, Loader2 } from 'lucide-react';

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
  onAssignmentCreated
}) => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTeachers();
    }
  }, [open]);

  const fetchTeachers = async () => {
    setIsFetchingTeachers(true);
    try {
      const response = await getTeachers();
      const teachersData = Array.isArray(response) ? response : response.content || [];
      setTeachers(teachersData);
    } catch (error) {
      toast({
        title: "Failed to load teachers",
        description: "Could not load teacher data",
        variant: "destructive"
      });
    } finally {
      setIsFetchingTeachers(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTeacher || !selectedSubject) {
      toast({
        title: "Validation Error",
        description: "Please select both teacher and subject",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await createAssignment(
        parseInt(selectedTeacher),
        parseInt(classroom.id),
        parseInt(selectedSubject)
      );
      
      toast({
        title: "Assignment Created",
        description: "Teacher has been assigned to classroom successfully"
      });

      onAssignmentCreated();
      onOpenChange(false);
      setSelectedTeacher('');
      setSelectedSubject('');
    } catch (error) {
      toast({
        title: "Failed to create assignment",
        description: "Could not assign teacher to classroom",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Teacher to {classroom.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="teacher">Select Teacher</Label>
            {isFetchingTeachers ? (
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading teachers...</span>
              </div>
            ) : (
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.fullName} ({teacher.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label htmlFor="subject">Select Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Classroom:</strong> {classroom.name} (Grade {classroom.gradeLevel})
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Teacher'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAssignmentModal;
