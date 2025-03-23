
import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ZingCab. All rights reserved.
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
