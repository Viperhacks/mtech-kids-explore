
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onResetRequest: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onResetRequest }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await forgotPassword(email);
      toast({
        title: "OTP Sent",
        description: "Check your email for a verification code",
      });
      onResetRequest(email);
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Could not process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-2 text-mtech-primary hover:text-mtech-secondary"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Forgot Password</h2>
      </div>
      
      <p className="text-gray-500 text-sm mb-6">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-mtech-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Verification Code"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
