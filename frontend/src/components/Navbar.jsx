import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronDown, Anchor, Briefcase } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const location = useLocation();

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
            <Button variant="outline" className="hidden md:inline-flex border-sky-700 text-sky-900 hover:bg-sky-50">
              <Link to="/login">Log in</Link>
            </Button>
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