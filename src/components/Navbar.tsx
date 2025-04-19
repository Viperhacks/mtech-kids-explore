
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthForm from './AuthForm';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();

  // Check if we need to show login dialog based on navigation state
  React.useEffect(() => {
    const state = location.state as { showLogin?: boolean };
    if (state?.showLogin) {
      setIsAuthOpen(true);
      // Clear the state so it doesn't trigger again on navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthOpen = () => {
    setIsAuthOpen(true);
  };

  const handleAuthClose = () => {
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const userName = user?.name || user?.fullName || '';
  const firstNameOrEmail = userName ? userName.split(' ')[0] : (user?.username || '').split('@')[0];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-mtech-primary">MTECH</span>
            <span className="hidden md:inline-block text-mtech-secondary font-medium">Kids Explore</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-mtech-dark hover:text-mtech-primary font-medium">Home</Link>
            <Link to="/revision" className="text-mtech-dark hover:text-mtech-primary font-medium">Revision</Link>
            <Link to="/teachers" className="text-mtech-dark hover:text-mtech-primary font-medium">Teachers</Link>
            <Link to="/contacts" className="text-mtech-dark hover:text-mtech-primary font-medium">Contacts</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={userName} 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={18} />
                    )}
                    <span className="max-w-[100px] truncate">{firstNameOrEmail}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-sm">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <Layout className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleAuthOpen}
                className="bg-mtech-primary text-white hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-mtech-dark hover:text-mtech-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/revision" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Revision
              </Link>
              <Link 
                to="/teachers" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Teachers
              </Link>
              <Link 
                to="/contacts" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacts
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="flex items-center px-2 py-2 text-base cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Layout size={16} className="mr-2" />
                    <span>Dashboard</span>
                  </Link>
                  <div 
                    className="flex items-center px-2 py-2 text-base cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <User size={16} className="mr-2" />
                    <span>My Profile</span>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full mt-2"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleAuthOpen}
                  className="bg-mtech-primary text-white hover:bg-blue-700 w-full mt-2"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
  <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
    <div className="p-6">
      <DialogTitle>Welcome to MTECH Kids Explore</DialogTitle>
      <DialogDescription className="mb-4">
        Sign in to access personalized learning resources and track your progress.
      </DialogDescription>

      
        <AuthForm onClose={handleAuthClose} />
      
    </div>
  </DialogContent>
</Dialog>

    </nav>
  );
};

export default Navbar;
