
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types";
import { BrainCog, Camera, ChevronDown, Home, LineChart, LogOut, Settings, User as UserIcon } from "lucide-react";

interface NavbarProps {
  userName: string;
  userType: UserType;
  onLogout: () => void;
}

const Navbar = ({ userName, userType, onLogout }: NavbarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Stress Monitor",
      path: "/stress-monitor",
      icon: <BrainCog className="w-5 h-5" />,
      show: userType === 'it_professional',
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <LineChart className="w-5 h-5" />,
      show: userType === 'admin',
    },
    {
      name: "Camera Access",
      path: "/camera-access",
      icon: <Camera className="w-5 h-5" />,
      show: userType === 'it_professional',
    },
  ].filter(link => link.show !== false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <BrainCog className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-primary">StressSense</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    location.pathname === link.path
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full flex items-center">
                  <span className="mr-1">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-base font-medium ${
                  location.pathname === link.path
                    ? "text-primary bg-gray-50 dark:bg-gray-800"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </div>
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              <div className="px-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">{userName}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" />
                    Profile
                  </div>
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
