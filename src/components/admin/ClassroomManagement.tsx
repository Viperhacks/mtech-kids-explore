import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, Building2, Users, Loader2, UserPlus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getClassrooms, 
  createClassroom, 
  updateClassroom, 
  deleteClassroom 
} from '@/services/apiService';
import TeacherAssignmentModal from './TeacherAssignmentModal';
import ClassroomAssignmentsModal from './ClassroomAssignmentsModal';
import { capitalize } from '@/utils/stringUtils';

interface Classroom {
  id: string;
  name: string;
  gradeLevel: string;
}

const ClassroomManagement: React.FC = () => {
  const { toast } = useToast();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [formData, setFormData] = useState({ name: '', gradeLevel: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClassrooms();
  }, [currentPage]);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const response = await getClassrooms(currentPage, 10);
      const classroomsData = response.content || response.data?.content || response || [];
      const totalPagesData = response.totalPages || response.data?.totalPages || 1;
      setClassrooms(Array.isArray(classroomsData) ? classroomsData : []);
      setTotalPages(totalPagesData);
    } catch (error) {
      toast({
        title: "Failed to load classrooms",
        description: "Could not load classroom data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClassroom = async () => {
    if (!formData.name || !formData.gradeLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createClassroom(formData);
      toast({
        title: "Classroom Created",
        description: "New classroom has been created successfully"
      });
      setShowCreateDialog(false);
      setFormData({ name: '', gradeLevel: '' });
      fetchClassrooms();
    } catch (error) {
      toast({
        title: "Failed to create classroom",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleEditClassroom = async () => {
    if (!selectedClassroom || !formData.name || !formData.gradeLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateClassroom(selectedClassroom.id, formData);
      toast({
        title: "Classroom Updated",
        description: "Classroom has been updated successfully"
      });
      setShowEditDialog(false);
      setSelectedClassroom(null);
      setFormData({ name: '', gradeLevel: '' });
      fetchClassrooms();
    } catch (error) {
      toast({
        title: "Failed to update classroom",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClassroom = async () => {
    if (!selectedClassroom) return;

    try {
      await deleteClassroom(selectedClassroom.id);
      toast({
        title: "Classroom Deleted",
        description: "Classroom has been deleted successfully"
      });
      setShowDeleteDialog(false);
      setSelectedClassroom(null);
      fetchClassrooms();
    } catch (error) {
      toast({
        title: "Failed to delete classroom",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const openCreateDialog = () => {
    setFormData({ name: '', gradeLevel: '' });
    setShowCreateDialog(true);
  };

  const openEditDialog = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setFormData({ name: classroom.name, gradeLevel: classroom.gradeLevel });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setShowDeleteDialog(true);
  };

  const openAssignmentModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setShowAssignmentModal(true);
  };

  const openAssignmentsModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setShowAssignmentsModal(true);
  };

  const handleAssignmentCreated = () => {
    // Refresh data if needed
    fetchClassrooms();
  };

  const handleAssignmentDeleted = () => {
    // Refresh data if needed
    fetchClassrooms();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading classrooms...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Classroom Management
            </CardTitle>
            <Button onClick={openCreateDialog}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Classroom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {classrooms.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No classrooms found</h3>
              <p className="text-muted-foreground mb-4">Create your first classroom to get started</p>
              <Button onClick={openCreateDialog}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Classroom
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classroom Name</TableHead>
                    <TableHead>Grade Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classrooms.map((classroom) => (
                    <TableRow key={classroom.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {classroom.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Grade {classroom.gradeLevel}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openAssignmentModal(classroom)}
                          title="Assign Teacher"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openAssignmentsModal(classroom)}
                          title="View Assignments"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(classroom)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(classroom)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Classroom Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Classroom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Classroom Name</Label>
              <Input
                id="name"
                value={capitalize(formData.name)}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter classroom name"
              />
            </div>
            <div>
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Select value={formData.gradeLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>

                  {[1, 2, 3, 4, 5, 6, 7].map(grade => (

                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClassroom}>
              Create Classroom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Classroom Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Classroom Name</Label>
              <Input
                id="edit-name"
                value={capitalize(formData.name)}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter classroom name"
              />
            </div>
            <div>
              <Label htmlFor="edit-gradeLevel">Grade Level</Label>
              <Select value={formData.gradeLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map(grade => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClassroom}>
              Update Classroom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Classroom Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Classroom</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{selectedClassroom?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClassroom}>
              Delete Classroom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teacher Assignment Modal */}
      {selectedClassroom && (
        <TeacherAssignmentModal
          open={showAssignmentModal}
          onOpenChange={setShowAssignmentModal}
          classroom={selectedClassroom}
          onAssignmentCreated={handleAssignmentCreated}
        />
      )}

      {/* Classroom Assignments Modal */}
      {selectedClassroom && (
        <ClassroomAssignmentsModal
          open={showAssignmentsModal}
          onOpenChange={setShowAssignmentsModal}
          classroom={selectedClassroom}
          onAssignmentDeleted={handleAssignmentDeleted}
        />
      )}
    </div>
  );
};

export default ClassroomManagement;
