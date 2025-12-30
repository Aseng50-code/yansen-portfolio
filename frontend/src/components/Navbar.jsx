import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronDown, Anchor, Briefcase, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-700 to-sky-900 rounded-lg flex items-center justify-center shadow-md">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-sky-900 leading-tight">CV BUILD</span>
              <span className="text-xs font-semibold text-sky-700 -mt-1">FOR SEAMAN</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/jobs"
              className="flex items-center space-x-1 text-gray-700 hover:text-sky-900 transition-colors font-medium"
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Board</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-sky-900 transition-colors font-medium">
                <span>Tools</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/templates">Maritime CV Templates</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/builder">CV Builder</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/pricing"
              className="text-gray-700 hover:text-sky-900 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 hover:text-sky-900 transition-colors font-medium"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-sky-700 text-sky-900 hover:bg-sky-50">
                    <User className="w-4 h-4 mr-2" />
                    {user?.fullName || user?.email}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-sky-100 text-sky-800 text-xs font-semibold rounded">
                        Administrator
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/builder" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      My CV
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" className="hidden md:inline-flex border-sky-700 text-sky-900 hover:bg-sky-50" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            )}
            
            <Button asChild className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 shadow-md">
              <Link to="/builder">Create Seaman CV</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;