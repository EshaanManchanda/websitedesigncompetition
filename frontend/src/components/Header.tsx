import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [{
    label: 'Home',
    href: '/',
    type: 'page'
  }, {
    label: 'Register',
    href: '/register',
    type: 'page'
  }, {
    label: 'FAQ',
    href: '/faq',
    type: 'page'
  }, {
    label: 'Resources',
    href: '/resources',
    type: 'page'
  }, {
    label: 'Contact',
    href: '/contact',
    type: 'page'
  }];
  const handleNavigation = (item: any) => {
    if (item.type === 'page') {
      navigate(item.href);
    } else {
      // For section scrolling (if needed)
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setIsOpen(false);
  };
  const DesktopNavigation = () => <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map(item => <button 
        key={item.label} 
        onClick={() => handleNavigation(item)} 
        className={cn(
          "font-medium transition-colors duration-200 hover:scale-105 transform",
          location.pathname === item.href 
            ? "text-blue-600 font-semibold" 
            : "text-gray-700 hover:text-blue-600"
        )}>
          {item.label}
        </button>)}
    </nav>;
  const MobileNavigation = () => <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          {navigationItems.map(item => <button 
            key={item.label} 
            onClick={() => handleNavigation(item)} 
            className={cn(
              "text-left text-lg font-medium py-2 px-4 rounded-lg transition-colors duration-200",
              location.pathname === item.href 
                ? "text-blue-600 bg-blue-50 font-semibold" 
                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            )}>
              {item.label}
            </button>)}
        </div>
      </SheetContent>
    </Sheet>;
  return <>
    {/* Skip to main content link for accessibility */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Skip to main content
    </a>
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2 hover:scale-105 transform transition-transform duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">WebKids</h1>
                <p className="text-xs text-gray-600">Design Competition</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button onClick={() => handleNavigation({ href: '#submission', type: 'section' })} size="lg" className="hidden sm:inline-flex">
              Submit Entry
            </Button>
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  </>;
};
export default Header;