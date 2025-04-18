
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <div className="mtech-container text-center">
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-bold text-mtech-primary mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-mtech-dark mb-4">Page Not Found</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Oops! It seems like the page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="bg-mtech-primary hover:bg-blue-700 text-white">
              <Link to="/" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
          
          <div className="max-w-lg mx-auto mt-12">
            <h3 className="text-lg font-medium mb-4">Looking for something specific?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/" className="p-3 mtech-card hover:shadow-md text-mtech-primary">
                Home
              </Link>
              <Link to="/revision" className="p-3 mtech-card hover:shadow-md text-mtech-primary">
                Revision
              </Link>
              <Link to="/teachers" className="p-3 mtech-card hover:shadow-md text-mtech-primary">
                Teachers
              </Link>
              <Link to="/contacts" className="p-3 mtech-card hover:shadow-md text-mtech-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default NotFound;
