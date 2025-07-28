import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { 
  UserCircle, 
  Settings, 
  HelpCircle, 
  LogOut, 
  User,
  FileText,
  BarChart3
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalDistance, getCompletedWeeks } = useData();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          title="Profile"
          onClick={handleProfileClick}
        >
          <UserCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        {/* Profile Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{currentUser?.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{currentUser?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-2">
          <Link to="/analytics" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link to="/reports" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <FileText className="h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link to="/settings" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          
          <Separator className="my-2" />
          
          <Button variant="ghost" className="w-full justify-start gap-3">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            BaatoMetrics v1.0 • © 2024
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
