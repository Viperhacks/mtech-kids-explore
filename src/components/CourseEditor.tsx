
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash, Save, X } from 'lucide-react';
import { resourceService } from '@/lib/api';
import { title } from 'process';

interface CourseEditorProps {
  resource?: any;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
  initialType?: string;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ 
  resource, 
  onSave, 
  onCancel,
  isNew = false,
  initialType
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    grade: resource?.grade || '',
    subject: resource?.subject || '',
    type: resource?.type || initialType || 'video',
    content: resource?.content || '',
    thumbnail: resource?.thumbnail || '',
  });

  // Update form data if resource or initialType changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: resource?.title || prev.title,
      description: resource?.description || prev.description,
      grade: resource?.grade || prev.grade,
      subject: resource?.subject || prev.subject,
      type: resource?.type || initialType || prev.type,
      content: resource?.content || prev.content,
      thumbnail: resource?.thumbnail || prev.thumbnail,
    }));
  }, [resource, initialType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("grade", formData.grade);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("thumbnail" , formData.thumbnail);
      
      if (isNew) {
        await resourceService.uploadResource(formDataToSend);
        toast({
          title: "Resource Created",
          description: "Your resource has been successfully created.",
        });
      } else {
        await resourceService.updateResource(resource.id, formDataToSend);
        toast({
          title: "Resource Updated",
          description: "Your resource has been successfully updated.",
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: isNew ? "Creation Failed" : "Update Failed",
        description: "There was a problem saving your resource.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resource?.id) return;
    
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await resourceService.deleteResource(resource.id);
      toast({
        title: "Resource Deleted",
        description: "The resource has been successfully deleted.",
      });
      onSave();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting the resource.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isNew ? 'Create New Resource' : 'Edit Resource'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Resource title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Resource description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select 
                value={formData.grade} 
                onValueChange={(value) => handleSelectChange('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => handleSelectChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="social">Social Studies</SelectItem>
                  <SelectItem value="shona">Shona</SelectItem>
                  <SelectItem value="ict">ICT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content URL</Label>
            <Input
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="URL to your content"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="URL to thumbnail image"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || isDeleting} className="mr-2">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            {!isNew && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isLoading || isDeleting}
              >
                <Trash className="mr-2 h-4 w-4" /> 
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isLoading || isDeleting}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CourseEditor;
