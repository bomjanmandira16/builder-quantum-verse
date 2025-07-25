import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  TrendingUp,
  Settings,
  Search,
  Bell,
  HelpCircle,
  User,
  Menu,
  LogOut,
  UserCircle,
  Github,
  Twitter,
  Mail,
  Phone
} from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import NotificationPopover from "./NotificationPopover";
import ProfilePopover from "./ProfilePopover";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { getCompletedWeeks, getTotalDistance } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, message: "Week 3 data successfully uploaded", time: "2 hours ago", unread: true },
    { id: 2, message: "Monthly report generated", time: "1 day ago", unread: false },
    { id: 3, message: "New team member added", time: "3 days ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // In a real app, you'd implement search functionality here
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F67d3cd4f4d464a76af4015fa874bdeea%2F60ac84203645468c97574dd2e6beec68?format=webp&width=800"
                  alt="BaatoMetrics Logo"
                  className="w-8 h-8 object-contain transition-opacity duration-200"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <h1 className="text-xl font-bold text-gray-900">BaatoMetrics</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for roads, locations, or data..."
                  className="pl-10 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <NotificationPopover
                  notifications={notifications.map(n => ({ ...n, type: 'info' as const }))}
                  unreadCount={unreadCount}
                />
                <Button variant="ghost" size="sm" className="hidden sm:flex" title="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <ProfilePopover />

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white transition-all duration-200 ease-in-out">
            <div className="px-4 py-2 space-y-1 animate-in slide-in-from-top-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Search */}
              <div className="pt-4 pb-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for roads, locations, or data..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Mobile Notifications & Profile */}
              <div className="pt-2 pb-4 border-t border-gray-200 space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Bell className="h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={cn(
        "px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto transition-all duration-300",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F67d3cd4f4d464a76af4015fa874bdeea%2F60ac84203645468c97574dd2e6beec68?format=webp&width=800"
                  alt="BaatoMetrics Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-bold text-gray-900">BaatoMetrics</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional road mapping and analytics platform for efficient infrastructure management.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quick Stats</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Distance:</span>
                  <span className="font-medium">{getTotalDistance().toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Weeks:</span>
                  <span className="font-medium">{getCompletedWeeks()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quick Links</h4>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact & Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Support</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <a href="mailto:support@baatometrics.com" className="flex items-center gap-2 hover:text-gray-900">
                  <Mail className="h-3 w-3" />
                  support@baatometrics.com
                </a>
                <a href="tel:+977-1-4444444" className="flex items-center gap-2 hover:text-gray-900">
                  <Phone className="h-3 w-3" />
                  +977-1-4444444
                </a>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-3 w-3" />
                  24/7 Support Available
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>© 2024 BaatoMetrics. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">API Docs</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
