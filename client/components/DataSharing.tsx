import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { loadImagesFromStorage } from "@/lib/imageStorage";
import { 
  generateShareableURL, 
  createShareableData, 
  generateShareId, 
  storeWithShareId 
} from "@/lib/dataSharing";
import { 
  Share2, 
  Copy, 
  Check, 
  Upload, 
  Download, 
  Users, 
  Eye 
} from "lucide-react";

export default function DataSharing() {
  const { mappingRecords } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareId, setShareId] = useState('');

  const completedRecords = mappingRecords.filter(record => record.status === 'completed');

  const generateShareLink = async () => {
    if (completedRecords.length === 0) {
      toast({
        title: "No Data to Share",
        description: "Complete at least one week before sharing your progress.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    try {
      // Get all stored images
      const allImages = loadImagesFromStorage();
      const relevantImageIds = completedRecords.flatMap(record => record.imageIds || []);
      const relevantImages = allImages.filter(img => relevantImageIds.includes(img.id));

      // Create shareable data
      const sharedData = createShareableData(
        completedRecords,
        relevantImages,
        currentUser?.name || 'Unknown User'
      );

      // Generate simple share ID
      const newShareId = generateShareId();
      storeWithShareId(newShareId, sharedData);

      // Create shareable URL
      const baseUrl = window.location.origin;
      const shareableUrl = `${baseUrl}/?share=${newShareId}`;
      
      setShareUrl(shareableUrl);
      setShareId(newShareId);

      toast({
        title: "Share Link Generated! 🔗",
        description: `Your mapping data is now shareable. Anyone with this link can view your progress.`
      });

    } catch (error) {
      console.error('Failed to generate share link:', error);
      toast({
        title: "Sharing Failed",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link Copied! 📋",
        description: "Share link has been copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    if (completedRecords.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Complete at least one week before exporting.",
        variant: "destructive"
      });
      return;
    }

    // Create export data without images (for smaller file size)
    const exportData = {
      mappingRecords: completedRecords,
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser?.name || 'Unknown User',
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `baatometrics-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported! 📁",
      description: "Your mapping data has been downloaded as a JSON file."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Your Progress
        </CardTitle>
        <CardDescription>
          Generate a shareable link so others can view your mapping progress and completed weeks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Data Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-3">Ready to Share:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedRecords.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Completed Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedRecords.reduce((sum, record) => sum + record.length, 0).toFixed(1)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total KM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {completedRecords.reduce((sum, record) => sum + (record.imageIds?.length || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(completedRecords.map(record => record.location)).size}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Locations</div>
            </div>
          </div>
        </div>

        {/* Generate Share Link */}
        <div className="space-y-4">
          <Label>Generate Shareable Link</Label>
          <div className="flex gap-2">
            <Button 
              onClick={generateShareLink}
              disabled={isSharing || completedRecords.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSharing ? "Generating..." : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Generate Share Link
                </>
              )}
            </Button>
            <Button onClick={exportData} variant="outline" disabled={completedRecords.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Share URL Display */}
        {shareUrl && (
          <div className="space-y-3 p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <Eye className="h-3 w-3 mr-1" />
                Ready to Share
              </Badge>
              <span className="text-sm text-green-700 dark:text-green-300">
                Share ID: {shareId}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-white dark:bg-gray-800 font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <p className="text-xs text-green-600 dark:text-green-400">
              ✅ Anyone with this link can view your completed weeks, images, and progress data
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p><strong>How sharing works:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Generate a link that includes all your completed week data</li>
            <li>Share the link with team members, clients, or stakeholders</li>
            <li>Recipients can view your progress without needing an account</li>
            <li>Data includes: completed weeks, images, locations, and distances</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
