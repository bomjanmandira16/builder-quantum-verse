import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, UserPlus, CheckCircle, AlertCircle, Crown, Edit2, Shield } from 'lucide-react';

interface InviteData {
  email: string;
  role: string;
  timestamp: number;
  inviter: string;
}

export default function Join() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, login } = useAuth();
  
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const ref = searchParams.get('ref'); // For short links

    if (token) {
      try {
        const decoded = JSON.parse(atob(token)) as InviteData;

        // Check if token is expired (7 days)
        const isExpired = Date.now() - decoded.timestamp > 7 * 24 * 60 * 60 * 1000;

        if (isExpired) {
          setIsValidToken(false);
          toast({
            title: "Invitation Expired",
            description: "This invitation link has expired. Please ask for a new invitation.",
            variant: "destructive"
          });
        } else {
          setInviteData(decoded);
          setUserForm(prev => ({ ...prev, name: decoded.email.split('@')[0].replace(/[._]/g, ' ') }));
        }
      } catch (error) {
        setIsValidToken(false);
        toast({
          title: "Invalid Invitation",
          description: "This invitation link is invalid or corrupted.",
          variant: "destructive"
        });
      }
    } else if (ref) {
      // Handle short link reference
      toast({
        title: "Processing Short Link",
        description: "This appears to be a short invitation link. Please contact your inviter for the full invitation link.",
        variant: "destructive"
      });
      setIsValidToken(false);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams, toast]);

  const handleJoinTeam = async () => {
    if (!inviteData || !userForm.name || !userForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      // Attempt to login/register with the invited email
      const success = await login(inviteData.email, userForm.password);
      
      if (success) {
        toast({
          title: "Welcome to BaatoMetrics! 🎉",
          description: `You've successfully joined the team as ${inviteData.role}.`
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        toast({
          title: "Account Setup Failed",
          description: "Unable to create your account. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'editor': return <Edit2 className="h-4 w-4" />;
      case 'viewer': return <Shield className="h-4 w-4" />;
      default: return <UserPlus className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Full access to manage the team and all features';
      case 'editor': return 'Create and edit mapping projects and data';
      case 'viewer': return 'View and analyze mapping data and reports';
      default: return 'Team member access';
    }
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Already Signed In</CardTitle>
            <CardDescription>
              You're already signed in to BaatoMetrics as {currentUser.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired. Please contact the person who sent you the invitation for a new link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle>Join BaatoMetrics</CardTitle>
          <CardDescription>
            You've been invited to join the team
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>Invited by <strong>{inviteData.inviter}</strong></span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Your role:</span>
              <Badge variant="outline" className={getRoleColor(inviteData.role)}>
                {getRoleIcon(inviteData.role)}
                {inviteData.role.charAt(0).toUpperCase() + inviteData.role.slice(1)}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-500">
              {getRoleDescription(inviteData.role)}
            </p>
          </div>

          {/* Account Setup Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={userForm.confirmPassword}
                onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <Button 
            onClick={handleJoinTeam} 
            disabled={isJoining || !userForm.name || !userForm.password || !userForm.confirmPassword}
            className="w-full"
          >
            {isJoining ? "Joining Team..." : "Join Team"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By joining, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
