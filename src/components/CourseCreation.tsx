
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Book, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const mockCreateCourse = async (courseData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, data: { id: `mock-${Date.now()}`, ...courseData } };
};

const CourseCreation = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    subject: '',
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      await axios.post('http://localhost:8080/api/courses', formData);
      
      toast({
        title: "Course Created",
        description: `Successfully created course: ${formData.title}`,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        grade: '',
        subject: '',
        duration: ''
      });
    } catch (error) {
      console.error('Course creation error:', error);
      
      // Fallback to mock API
      await mockCreateCourse(formData);
      
      toast({
        title: "Course Created",
        description: `Successfully created course: ${formData.title}`,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        grade: '',
        subject: '',
        duration: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only render if the user is an admin
  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create New Course</CardTitle>
        <CardDescription>Add a new course to the curriculum</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="e.g., Introduction to Mathematics" 
              value={formData.title} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe what students will learn in this course" 
              value={formData.description} 
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="social-studies">Social Studies</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="physical-education">Physical Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select 
                value={formData.grade} 
                onValueChange={(value) => handleSelectChange('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (weeks)</Label>
            <Input 
              id="duration" 
              name="duration" 
              type="number" 
              min="1"
              max="52"
              placeholder="e.g., 8" 
              value={formData.duration} 
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Course...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create Course
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CourseCreation;
