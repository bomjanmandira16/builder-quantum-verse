import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  User,
  FileText,
  BarChart3,
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
          className="hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          onClick={handleProfileClick}
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {currentUser?.name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase() || 'U'}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end">
        {/* Profile Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
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
                  {currentUser?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {currentUser?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-2">
          <Link to="/analytics" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link to="/reports" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link to="/settings" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>

          <Separator className="my-2" />

          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            BaatoMetrics v1.0 • © 2024
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
