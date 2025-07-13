import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import { authService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { capitalize } from '@/utils/stringUtils';

const TeacherAccountCreation = ({ onAdd }: { onAdd?: () => void }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '' 
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
        'TEACHER',
        
      );

      toast({
        title: "Teacher Account Created",
        description: `Successfully created account for ${formData.fullName}`,
      });

      onAdd?.();

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
      
      
      
    } finally {
      setIsLoading(false);
    }
  };

  // Only render if the user is a teacher
  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create Teacher Account</CardTitle>
        <CardDescription>Create new accounts for your teachers</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              name="fullName" 
              placeholder="Enter teacher's full name" 
              value={capitalize(formData.fullName)} 
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
              placeholder="Choose a unique username for the teacher" 
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
              placeholder="Enter a secure password" 
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
              placeholder="Re-enter password to confirm" 
              type="password" 
              value={formData.confirmPassword} 
              onChange={handleChange}
              required
            />
          </div>
          
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Create Teacher Account
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TeacherAccountCreation;
