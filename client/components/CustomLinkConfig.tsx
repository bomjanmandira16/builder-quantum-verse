import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link, Check, ExternalLink, Settings } from 'lucide-react';

interface CustomLinkConfigProps {
  onDomainUpdate?: (domain: string) => void;
}

export default function CustomLinkConfig({ onDomainUpdate }: CustomLinkConfigProps) {
  const { toast } = useToast();
  const [customDomain, setCustomDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState(
    () => localStorage.getItem('custom-invite-domain') || window.location.origin
  );
  const [copied, setCopied] = useState(false);

  const handleSaveDomain = () => {
    if (!customDomain) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain URL.",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format
    try {
      new URL(customDomain);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://app.baato.io)",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('custom-invite-domain', customDomain);
    setCurrentDomain(customDomain);
    onDomainUpdate?.(customDomain);
    
    toast({
      title: "Domain Updated! 🔗",
      description: "Your custom domain has been saved. New invitations will use this URL."
    });
    
    setCustomDomain('');
  };

  const copyExample = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Example URL copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the URL manually.",
        variant: "destructive"
      });
    }
  };

  const generateExampleLink = () => {
    const exampleToken = "abc12345";
    return `${currentDomain}/j/${exampleToken}`;
  };

  const domainSuggestions = [
    'https://app.baato.io',
    'https://team.baato.app', 
    'https://join.mycompany.com',
    'https://invite.myorg.app'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Easy Invitation Links
        </CardTitle>
        <CardDescription>
          Configure a custom domain for shorter, more professional invitation links
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Domain Display */}
        <div className="space-y-2">
          <Label>Current Invitation Domain</Label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Active
            </Badge>
            <span className="font-mono text-sm flex-1">{currentDomain}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyExample(currentDomain)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Example Link Preview */}
        <div className="space-y-2">
          <Label>Example Invitation Link</Label>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
              {generateExampleLink()}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              ↳ This is how your invitation links will look
            </p>
          </div>
        </div>

        {/* Custom Domain Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-domain">Set Custom Domain</Label>
            <div className="flex gap-2">
              <Input
                id="custom-domain"
                placeholder="https://app.baato.io"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleSaveDomain} disabled={!customDomain}>
                <Settings className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Domain Suggestions */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Popular Domain Examples</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {domainSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start font-mono text-xs"
                  onClick={() => setCustomDomain(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Benefits of Custom Domains:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Shorter, more memorable links (e.g., app.baato.io/j/abc123)</li>
            <li>• Professional branded appearance</li>
            <li>• Better email deliverability</li>
            <li>• Consistent user experience</li>
          </ul>
        </div>

        {/* Production Setup Note */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Production Setup:</strong> To use a custom domain in production, you'll need to:
          </p>
          <ol className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 ml-4 list-decimal">
            <li>Set up DNS records for your domain</li>
            <li>Configure SSL certificates</li>
            <li>Set the INVITE_DOMAIN environment variable</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
