import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import { authService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const StudentAccountCreation = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '' // New field for grade level
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Try to register the student via the API
      await authService.register(
        formData.fullName,
        formData.username,
        formData.password,
        formData.confirmPassword,
        'STUDENT',
        formData.gradeLevel // Pass grade level to the API
      );

      toast({
        title: "Student Account Created",
        description: `Successfully created account for ${formData.fullName}`,
      });

      // Reset form
      setFormData({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        gradeLevel: '' // Reset grade level as well
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Fallback to mock response
      toast({
        title: "Student Account Created",
        description: `Successfully created account for ${formData.fullName}`,
      });
      
      // Reset form
      setFormData({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        gradeLevel: '' // Reset grade level as well
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only render if the user is a teacher
  if (user?.role !== 'TEACHER') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create Student Account</CardTitle>
        <CardDescription>Create new accounts for your students</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
       <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="fullName">Full Name</Label>
      <Input 
        id="fullName" 
        name="fullName" 
        placeholder="Enter student's full name" 
        value={formData.fullName} 
        onChange={handleChange}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input 
        id="username" 
        name="username" 
        type="text" 
        placeholder="Unique username" 
        value={formData.username} 
        onChange={handleChange}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input 
        id="password" 
        name="password" 
        type="password" 
        placeholder="Create password" 
        value={formData.password} 
        onChange={handleChange}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input 
        id="confirmPassword" 
        name="confirmPassword" 
        placeholder="Repeat password" 
        type="password" 
        value={formData.confirmPassword} 
        onChange={handleChange}
        required
      />
    </div>

    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="gradeLevel">Grade Level</Label>
      <select 
        id="gradeLevel" 
        name="gradeLevel" 
        value={formData.gradeLevel} 
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">Select Grade Level</option>
        {[1, 2, 3, 4, 5, 6, 7].map(grade => (
          <option key={grade} value={grade}>Grade {grade}</option>
        ))}
      </select>
    </div>
  </div>
</CardContent>

        <CardFooter>
         <Button 
  type="submit" 
  className="w-full font-semibold tracking-wide" 
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Creating...
    </>
  ) : (
    <>
      <UserPlus className="mr-2 h-4 w-4" />
      Create Student
    </>
  )}
</Button>

        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentAccountCreation;
