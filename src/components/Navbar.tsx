import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Layout, School, Home, BookOpenCheck, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthForm from './AuthForm';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '@/components/assets/mtech-kidz-app-icon.svg';


const getSeason = () => {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'fall';
  return 'winter';
};

const seasonBgClasses: Record<string, string> = {
  spring: 'bg-season-spring',
  summer: 'bg-season-summer',
  fall: 'bg-season-fall',
  winter: 'bg-season-winter',
};

const Navbar: React.FC = () => {
  const [season, setSeason] = useState<string>(getSeason());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();

  // Check if we need to show login dialog based on navigation state
  useEffect(() => {
    setSeason(getSeason());
    console.log(season);
  }, []); // Empty dependency array ensures this only runs on mount.

  // Handle login dialog visibility based on location state
  useEffect(() => {
    const state = location.state as { showLogin?: boolean };
    if (state?.showLogin) {
      setIsAuthOpen(true);
      // Clear the state to prevent showing the login dialog again on future navigations
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

  const userName = user?.username || user?.fullName || '';
  const firstNameOrEmail = userName ? userName.split(' ')[0] : (user?.username || '').split('@')[0];

  const bgClass = seasonBgClasses[season] ?? seasonBgClasses.winter;

  return (
    <nav className={`bg-yellow-100 shadow-lg sticky top-0 z-50 backdrop-blur-lg`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and MTECH */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}  
              alt="MTECH Logo"
              className="w-12 h-12"
            />
            <span className="text-3xl font-bold text-pink-500">MTECH</span>
            <span className="hidden md:inline-block text-green-500 text-xl font-semibold">Kids Explore</span>
          </Link>

          {/* Desktop Navbar Links */}
          <div className="hidden md:flex items-center space-x-6 text-lg">
            <Link to="/" className="text-blue-500 hover:text-purple-600 flex items-center gap-1">
              <Home size={18} /> Home
            </Link>
            <Link to="/revision" className="text-blue-500 hover:text-purple-600 flex items-center gap-1">
              <BookOpenCheck size={18} /> Revision
            </Link>
            <Link to="/teachers" className="text-blue-500 hover:text-purple-600 flex items-center gap-1">
              <School size={18} /> Teachers
            </Link>
            <Link to="/contacts" className="text-blue-500 hover:text-purple-600 flex items-center gap-1">
              <PhoneCall size={18} /> Contact
            </Link>
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 font-kids text-blue-700">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={userName} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User size={18} />
                    )}
                    <span className="max-w-[100px] truncate">{firstNameOrEmail}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 font-kids">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="font-semibold text-sm">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.fullName}</p>
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
                className="bg-pink-400 text-white hover:bg-pink-500 font-kids px-6 py-2 rounded-full shadow-lg"
              >
                🚀 Let's Go!
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-blue-600 hover:text-purple-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in font-kids text-lg text-blue-600 space-y-3">
            <Link to="/" className="hover:text-pink-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <Home size={16} /> Home
            </Link>
            <Link to="/revision" className="hover:text-pink-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <BookOpenCheck size={16} /> Revision
            </Link>
            <Link to="/teachers" className="hover:text-pink-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <School size={16} /> Teachers
            </Link>
            <Link to="/contacts" className="hover:text-pink-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <PhoneCall size={16} /> Contacts
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <Layout size={16} /> Dashboard
                </Link>
                <div onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer">
                  <User size={16} /> My Profile
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
                className="bg-pink-400 text-white hover:bg-pink-500 w-full mt-2"
              >
                🚀 Let's Go!
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Authentication Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 font-kids">
          <div className="p-6">
            <DialogTitle className="text-center text-2xl text-pink-600">🎉 Welcome Little Explorer!</DialogTitle>
            <DialogDescription className="text-center text-blue-500 mb-4">
              Sign in to start your learning adventure.
            </DialogDescription>
            <AuthForm onClose={handleAuthClose} />
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
