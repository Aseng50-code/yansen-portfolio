import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">CV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WIZARD</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
                <span>Tools</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/templates">Resume Templates</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/builder">Resume Builder</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/pricing"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex">
              Log in
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/builder">Create resume</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;