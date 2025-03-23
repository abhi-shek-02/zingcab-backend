
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              ZingCab
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
              Home
            </Link>
            <Link to="/services" className={`text-sm font-medium ${isActive('/services') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
              Services
            </Link>
            <Link to="/contact" className={`text-sm font-medium ${isActive('/contact') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
              Contact
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className={`block py-2 px-3 rounded-md ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`block py-2 px-3 rounded-md ${isActive('/services') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className={`block py-2 px-3 rounded-md ${isActive('/contact') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button className="justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
