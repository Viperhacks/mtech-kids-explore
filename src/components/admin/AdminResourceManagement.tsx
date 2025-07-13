
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, Trash2, Video, FileText, Image } from 'lucide-react';
import { getAdminResources, deleteResourceAdmin } from '@/services/apiService';
import { AdminResource } from '../types/adminTypes';
import toReadableDate from '@/utils/toReadableDate';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { capitalize } from '@/utils/stringUtils';
import AdminPreviewModal from './AdminPreviewModal';

const AdminResourceManagement: React.FC = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<AdminResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResource, setSelectedResource] = useState<AdminResource | null>(null);
  const [previewResource, setPreviewResource] = useState<AdminResource | null>(null);

  useEffect(() => {
    fetchResources();
  }, [currentPage]);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, typeFilter, gradeFilter, subjectFilter]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminResources(currentPage, 10);
      
      const resourcesData = Array.isArray(response) ? response : response.resources || [];
      const totalPagesData = response.totalPages || 1;
      console.log( resourcesData,"admin data");
      setResources(resourcesData);
      setTotalPages(totalPagesData);
    } catch (error) {
      toast({
        title: "Failed to load resources",
        description: "Could not load resource data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.response.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.response.type === typeFilter);
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.response.grade === gradeFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(resource => resource.response.subject === subjectFilter);
    }

    setFilteredResources(filtered);
  };

  const handleDeleteResource = async (resourceId: string, resourceTitle: string) => {
    try {
      await deleteResourceAdmin(resourceId);
      toast({
        title: "Resource deleted",
        description: `"${resourceTitle}" has been deleted successfully`,
      });
      fetchResources();
    } catch (error) {
      toast({
        title: "Failed to delete resource",
        description: "Could not delete the resource",
        variant: "destructive"
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  const grades = [...new Set(resources.map(r => r.response.grade))];
  const subjects = [...new Set(resources.map(r => r.response.subject))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Resource Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{capitalize(subject)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.response.id}>
                    <TableCell className="font-medium">{capitalize(resource.response.title)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.response.type)}
                        <Badge variant="outline">
                          {resource.response.type === 'video' ? 'Video' : 'Document'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>Grade {resource.response.grade}</TableCell>
                    <TableCell>{capitalize(resource.response.subject)}</TableCell>
                    <TableCell>{toReadableDate(resource.response.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewResource(resource)}
                          title="View Resource"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resource.response.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteResource(resource.response.id, resource.response.title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredResources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p>No resources match your current filters</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
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
        </CardContent>
      </Card>

      <AdminPreviewModal
        open={!!previewResource}
        onOpenChange={(open) => !open && setPreviewResource(null)}
        content={previewResource}
        type="resource"
      />
    </div>
  );
};

export default AdminResourceManagement;
