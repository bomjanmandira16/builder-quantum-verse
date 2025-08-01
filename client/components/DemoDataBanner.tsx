import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { Eye, Play, Trash2, Users } from "lucide-react";

export default function DemoDataBanner() {
  const { mappingRecords, getCompletedWeeks, getTotalDistance } = useData();
  const { toast } = useToast();
  const [isHidden, setIsHidden] = useState(false);

  const completedWeeks = getCompletedWeeks();
  const totalDistance = getTotalDistance();

  const startOwnProgress = () => {
    if (confirm('This will clear the demo data and let you start your own mapping progress. Continue?')) {
      localStorage.removeItem('baatometrics-data');
      localStorage.removeItem('baatometrics-images');
      window.location.reload();
      
      toast({
        title: "Demo Data Cleared! 🚀",
        description: "You can now start tracking your own mapping progress."
      });
    }
  };

  const hideBanner = () => {
    setIsHidden(true);
    localStorage.setItem('baatometrics-hide-demo-banner', 'true');
  };

  // Check if banner should be hidden
  if (isHidden || localStorage.getItem('baatometrics-hide-demo-banner')) {
    return null;
  }

  // Only show if we have data that looks like demo data
  if (mappingRecords.length === 0 || !mappingRecords.some(r => r.id.includes('demo'))) {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Demo Progress - Bomjan Mandira's Mapping Data
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Complete mapping portfolio: <strong>{completedWeeks} weeks completed</strong> • <strong>{totalDistance.toFixed(1)} km mapped</strong> • <strong>6 districts covered</strong> • View all progress and images below
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={hideBanner}
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
            >
              <Users className="h-4 w-4 mr-1" />
              Keep Viewing
            </Button>
            <Button
              onClick={startOwnProgress}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Start My Own Progress
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
