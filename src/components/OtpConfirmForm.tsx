
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpConfirmFormProps {
  email: string;
  onBack: () => void;
  onVerified: (token: string) => void;
}

const OtpConfirmForm: React.FC<OtpConfirmFormProps> = ({ 
  email, 
  onBack, 
  onVerified 
}) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { confirmOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await confirmOtp(email, otp);
      toast({
        title: "Verification Successful",
        description: "Now you can reset your password",
      });
      // Pass the OTP as a token for the reset password step
      onVerified(otp);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification code",
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
        <h2 className="text-xl font-semibold">Verify Your Email</h2>
      </div>
      
      <p className="text-gray-500 text-sm mb-6">
        We've sent a 6-digit verification code to <strong>{email}</strong>. Enter the code below:
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <KeyRound className="h-8 w-8 text-mtech-primary" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block">Verification Code</Label>
            <InputOTP 
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="flex justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-mtech-primary"
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>
    </div>
  );
};

export default OtpConfirmForm;
