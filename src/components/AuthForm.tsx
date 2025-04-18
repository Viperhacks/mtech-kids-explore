import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import OtpConfirmForm from './OtpConfirmForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AuthFormProps {
  onClose: () => void;
}

interface CredentialResponse {
  credential: string;
}

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'>('STUDENT');
  const [gradeLevel, setGradeLevel] = useState('');
  const [view, setView] = useState<'main' | 'forgot' | 'reset' | 'otp'>('main');
  const [resetToken, setResetToken] = useState('');
  const [googleRole, setGoogleRole] = useState<'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'>('STUDENT');
  const [googleGradeLevel, setGoogleGradeLevel] = useState('');
  const [showGoogleRoleSelect, setShowGoogleRoleSelect] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const { login, register: registerUser, googleLogin, confirmOtp } = useAuth();
  const navigate = useNavigate();
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formType === 'register') {
        if (password !== confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "The passwords you entered do not match",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }

        const response = await registerUser(name, email, password, role, gradeLevel);
        if (response && response.success) {
          setRegisteredEmail(email);
          setShowOtpForm(true);
          toast({
            title: "Registration Successful",
            description: "Please check your email for the verification code",
          });
        }
      } else {
        await login(email, password);
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast({
        title: formType === 'login' ? 'Login Failed' : 'Registration Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmOtp(registeredEmail, otp);
      toast({
        title: "Account Verified",
        description: "You can now log in with your credentials",
      });
      setFormType('login');
      setShowOtpForm(false);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification code",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => setView('forgot');
  const handleBackToMain = () => setView('main');
  const handleResetPassword = (token: string) => {
    setResetToken(token);
    setView('reset');
  };
  const handleOtpConfirm = (email: string) => {
    setEmail(email);
    setView('otp');
  };

  const handleGoogleSuccess = async (res: CredentialResponse) => {
    try {
      const userInfo = jwtDecode<GoogleUserInfo>(res.credential);
      
      if (formType === 'register') {
        setShowGoogleRoleSelect(true);
        setEmail(userInfo.email);
        setName(userInfo.name);
        return;
      }
      
      await googleLogin(res.credential, userInfo.name, userInfo.email, userInfo.picture);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Authentication Failed',
        description: 'Could not sign in with Google',
        variant: 'destructive',
      });
    }
  };

  const completeGoogleSignup = async () => {
    if (!email || !name) return;
    
    try {
      setIsSubmitting(true);
      await registerUser(name, email, '', googleRole, googleGradeLevel);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Registration Failed',
        description: 'Could not create your account with Google',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowGoogleRoleSelect(false);
    }
  };

  if (view === 'forgot') {
    return <ForgotPasswordForm onBack={handleBackToMain} onResetRequest={handleOtpConfirm} />;
  }
  if (view === 'reset') {
    return <ResetPasswordForm token={resetToken} onBack={handleBackToMain} onComplete={onClose} />;
  }
  if (view === 'otp') {
    return <OtpConfirmForm email={email} onBack={handleBackToMain} onVerified={handleResetPassword} />;
  }

  if (showGoogleRoleSelect) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-medium">Complete Your Registration</h2>
        <p className="text-sm text-gray-500">Please select your role to complete signup with Google.</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-role">I am a:</Label>
            <Select value={googleRole} onValueChange={(value) => setGoogleRole(value as 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN')}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="PARENT">Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {googleRole === 'STUDENT' && (
            <div className="space-y-2">
              <Label htmlFor="google-grade-level">Grade Level</Label>
              <Select value={googleGradeLevel} onValueChange={setGoogleGradeLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 7 }, (_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      Grade {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowGoogleRoleSelect(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={completeGoogleSignup}
              className="flex-1 bg-mtech-primary"
              disabled={isSubmitting || (googleRole === 'STUDENT' && !googleGradeLevel)}
            >
              {isSubmitting ? 'Creating Account...' : 'Complete Signup'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showOtpForm) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
        <p className="text-sm text-gray-500 mb-6">
          We've sent a verification code to {registeredEmail}. Please enter it below:
        </p>
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <InputOTP 
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="flex justify-center gap-2"
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
          
          <Button 
            type="submit" 
            className="w-full bg-mtech-primary"
            disabled={otp.length !== 6}
          >
            Verify Email
          </Button>
        </form>
      </div>
    );
  }

  const renderRegistrationContent = () => (
    <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-mtech-primary">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="Enter your full name"
              className="pl-10"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="register-password"
              type="password"
              placeholder="Create a password"
              className="pl-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a:</Label>
          <Select 
            value={role} 
            onValueChange={(value) => setRole(value as 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN')} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="PARENT">Parent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === 'STUDENT' && (
          <div className="space-y-2">
            <Label htmlFor="grade-level">Grade Level</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 7 }, (_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>
                    Grade {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button type="submit" className="w-full bg-mtech-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs value={formType} onValueChange={v => setFormType(v as 'login' | 'register')} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-mtech-primary hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-mtech-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast({
                    title: 'Authentication Error',
                    description: 'Google login failed. Try again.',
                    variant: 'destructive',
                  });
                }}
                useOneTap
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="register" className="max-h-[600px]">
          {renderRegistrationContent()}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast({
                  title: 'Authentication Error',
                  description: 'Google login failed. Try again.',
                  variant: 'destructive',
                });
              }}
              useOneTap
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
