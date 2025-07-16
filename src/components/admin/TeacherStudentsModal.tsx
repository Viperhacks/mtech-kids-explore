import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminUserResponseDto } from "../types/adminTypes";
import { getStudentsCreatedByTeacher as getStudentsByTeacher } from "@/services/apiService";
import { Badge } from "../ui/badge";

interface TeacherStudentsModalProps {
  teacherId: number;
  open: boolean;
  onClose: () => void;
}

const TeacherStudentsDialog: React.FC<TeacherStudentsModalProps> = ({
  teacherId,
  open,
  onClose,
}) => {
  const [students, setStudents] = useState<AdminUserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    if (!open) return;

    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getStudentsByTeacher(
          teacherId.toString(),
          currentPage,
          10
        );
        const studentsData = Array.isArray(response)
          ? response
          : response.data.content || [];

        setStudents(studentsData);
        setTotalPages(response.data.totalPages || 1);
        setTotalStudents(response.data.totalElements || 0);
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [teacherId, open, currentPage]);

  return (
    <Dialog open={open} onOpenChange={onClose} >
     <DialogContent className="w-full max-w-2xl sm:max-w-3xl">

        <DialogHeader>
  <DialogTitle>Students under Teacher</DialogTitle>
  <DialogDescription>
    Total Students: {totalStudents} | Page {currentPage + 1} of {totalPages}
  </DialogDescription>
</DialogHeader>


        {isLoading ? (
          <>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : students.length === 0 ? (
          <p>No students found for this teacher.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-auto">
            {students.map((student,idx) => (
              <li
                key={student.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium"> {idx + 1 + currentPage * 10}. {student.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    Grade {student.gradeLevel}
                  </p>
                </div>
                <Badge variant="outline">{student.role}</Badge>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="secondary"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherStudentsDialog;
