import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Chrome, MapPin, BarChart3, Users } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in."
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: "Welcome!",
          description: "Successfully logged in with Google."
        });
      } else {
        toast({
          title: "Google Login Failed",
          description: "Unable to authenticate with Google. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "An error occurred during Google authentication.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2F67d3cd4f4d464a76af4015fa874bdeea%2F60ac84203645468c97574dd2e6beec68?format=webp&width=800" 
              alt="BaatoMetrics Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold">BaatoMetrics</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Professional Road Mapping & Analytics Platform
            </h2>
            <p className="text-xl text-blue-100">
              Collaborate with your team to map roads, track progress, and generate comprehensive reports.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-200" />
            <span className="text-blue-100">Interactive mapping with Baato Maps integration</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-blue-200" />
            <span className="text-blue-100">Real-time analytics and progress tracking</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-200" />
            <span className="text-blue-100">Team collaboration and role management</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <img 
                  src="https://cdn.builder.io/api/v1/image/assets%2F67d3cd4f4d464a76af4015fa874bdeea%2F60ac84203645468c97574dd2e6beec68?format=webp&width=800" 
                  alt="BaatoMetrics Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold">BaatoMetrics</span>
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue mapping
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Login */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="w-full"
                variant="outline"
              >
                <Chrome className="h-4 w-4 mr-2" />
                {isGoogleLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Email Login */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Demo credentials: Any email + any password
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need help? Contact your team administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
