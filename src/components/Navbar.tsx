
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    // This would integrate with actual authentication logic later
    console.log('Login clicked');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mtech-container py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-mtech-primary">MTECH</span>
            <span className="hidden md:inline-block text-mtech-secondary font-medium">Kids Explore</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-mtech-dark hover:text-mtech-primary font-medium">Home</Link>
            <Link to="/revision" className="text-mtech-dark hover:text-mtech-primary font-medium">Revision</Link>
            <Link to="/teachers" className="text-mtech-dark hover:text-mtech-primary font-medium">Teachers</Link>
            <Link to="/contacts" className="text-mtech-dark hover:text-mtech-primary font-medium">Contacts</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Button variant="ghost" className="flex items-center space-x-2">
                <User size={18} />
                <span>Profile</span>
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
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
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/revision" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Revision
              </Link>
              <Link 
                to="/teachers" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Teachers
              </Link>
              <Link 
                to="/contacts" 
                className="text-mtech-dark hover:text-mtech-primary py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacts
              </Link>
              {!isLoggedIn && (
                <Button 
                  onClick={handleLogin}
                  className="bg-mtech-primary text-white hover:bg-blue-700 w-full"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
