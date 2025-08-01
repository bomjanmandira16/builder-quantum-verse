import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, CheckCircle, Eye } from "lucide-react";

export default function DebugMappingData() {
  const { mappingRecords, getCompletedWeeks, updateMappingRecord } = useData();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [previousRecordCount, setPreviousRecordCount] = useState(mappingRecords.length);

  // Monitor data changes in real-time
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setLastUpdate(Date.now());
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  // Watch for data changes and log activities
  useEffect(() => {
    const currentCount = mappingRecords.length;
    const now = new Date().toLocaleTimeString();

    if (currentCount !== previousRecordCount) {
      const change = currentCount > previousRecordCount ? 'ADDED' : 'REMOVED';
      const logEntry = `${now}: ${change} record(s) - Total: ${currentCount}`;

      setActivityLog(prev => [logEntry, ...prev.slice(0, 4)]); // Keep last 5 entries
      setPreviousRecordCount(currentCount);

      console.log('🔍 Debug Panel - Data changed:', {
        change,
        totalRecords: currentCount,
        completedWeeks: getCompletedWeeks(),
        latestRecord: mappingRecords[mappingRecords.length - 1]
      });
    }

    console.log('🔍 Current Data State:', {
      totalRecords: mappingRecords.length,
      completedWeeks: getCompletedWeeks(),
      records: mappingRecords.map(r => ({
        week: r.week,
        location: r.location,
        distance: r.length,
        status: r.status,
        images: r.imageIds?.length || 0
      }))
    });
  }, [mappingRecords, getCompletedWeeks, previousRecordCount]);

  const refreshData = () => {
    window.location.reload();
  };

  const forceCompleteWeek = (recordId: string, weekNumber: number) => {
    updateMappingRecord(recordId, { status: "completed" });
    toast({
      title: "Week Completed! 🚀",
      description: `Week ${weekNumber} has been manually marked as completed.`,
    });
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all mapping data? This cannot be undone.",
      )
    ) {
      localStorage.removeItem("baatometrics-data");
      localStorage.removeItem("baatometrics-images");
      window.location.reload();
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Debug: Live Mapping Records</CardTitle>
            <p className="text-xs text-gray-500">
              Real-time monitoring • Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              size="sm"
              variant={isMonitoring ? "default" : "outline"}
            >
              <Eye className="h-4 w-4 mr-1" />
              {isMonitoring ? "Monitoring" : "Paused"}
            </Button>
            <Button onClick={refreshData} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button onClick={clearAllData} size="sm" variant="destructive">
              Clear All Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Total Records:</strong> {mappingRecords.length}</p>
              <p><strong>Completed Weeks:</strong> {getCompletedWeeks()}</p>
              <p><strong>Total Distance:</strong> {mappingRecords.reduce((sum, r) => sum + r.length, 0).toFixed(1)} km</p>
            </div>
            <div>
              <p><strong>Current Week:</strong> Week {getCompletedWeeks() + 1}</p>
              <p><strong>Total Images:</strong> {mappingRecords.reduce((sum, r) => sum + (r.imageIds?.length || 0), 0)}</p>
              <p><strong>Locations:</strong> {new Set(mappingRecords.map(r => r.location)).size}</p>
            </div>
          </div>

          {mappingRecords.length > 0 ? (
            <div className="space-y-2">
              <p>
                <strong>Records Detail:</strong>
              </p>
              {mappingRecords.map((record, index) => (
                <div key={record.id} className="p-2 border rounded text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          record.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          record.status === "completed" ? "bg-green-600" : ""
                        }
                      >
                        Week {record.week}
                      </Badge>
                      <span className="font-mono">{record.status}</span>
                    </div>
                    {record.status !== "completed" && (
                      <Button
                        onClick={() =>
                          forceCompleteWeek(record.id, record.week)
                        }
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                  <p>Location: {record.location}</p>
                  <p>Distance: {record.length} km</p>
                  <p>
                    Images: {record.images?.length || 0} files,{" "}
                    {record.imageIds?.length || 0} stored
                  </p>
                  <p>Date: {record.endDate}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No mapping records found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
