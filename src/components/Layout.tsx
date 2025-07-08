import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';

const Layout: React.FC = () => {
  const {user} = useAuth();
  const hideFooter = user?.role === "STUDENT";
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
       {!hideFooter &&  <Footer />}
      </div>
    </div>
  );
};

export default Layout;
