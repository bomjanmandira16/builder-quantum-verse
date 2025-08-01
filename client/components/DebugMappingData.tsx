import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, CheckCircle } from "lucide-react";

export default function DebugMappingData() {
  const { mappingRecords, getCompletedWeeks } = useData();

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug: Mapping Records</CardTitle>
          <Button onClick={refreshData} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs">
          <p><strong>Total Records:</strong> {mappingRecords.length}</p>
          <p><strong>Completed Weeks:</strong> {getCompletedWeeks()}</p>
          
          {mappingRecords.length > 0 ? (
            <div className="space-y-2">
              <p><strong>Records Detail:</strong></p>
              {mappingRecords.map((record, index) => (
                <div key={record.id} className="p-2 border rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={record.status === 'completed' ? 'default' : 'secondary'}
                      className={record.status === 'completed' ? 'bg-green-600' : ''}
                    >
                      Week {record.week}
                    </Badge>
                    <span className="font-mono">{record.status}</span>
                  </div>
                  <p>Location: {record.location}</p>
                  <p>Distance: {record.length} km</p>
                  <p>Images: {record.images?.length || 0} files, {record.imageIds?.length || 0} stored</p>
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
