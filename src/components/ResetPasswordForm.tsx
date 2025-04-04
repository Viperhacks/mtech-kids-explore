
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ResetPasswordFormProps {
  token: string;
  onBack: () => void;
  onComplete: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  token, 
  onBack, 
  onComplete 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Could not reset your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-xl font-semibold text-center">Password Reset Successful</h2>
          <p className="text-gray-500 text-center">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-2 text-mtech-primary hover:text-mtech-secondary"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Reset Password</h2>
      </div>
      
      <p className="text-gray-500 text-sm mb-6">
        Create a new password for your account.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="new-password"
                type="password"
                placeholder="Create a new password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-mtech-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
