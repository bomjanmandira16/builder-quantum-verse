import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function LocationOverview() {
  const { mappingRecords } = useData();

  // Calculate location statistics
  const locationStats = mappingRecords.reduce((acc, record) => {
    if (record.status === 'completed') {
      acc[record.location] = (acc[record.location] || 0) + record.length;
    }
    return acc;
  }, {} as Record<string, number>);

  const locations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6); // Show top 6 locations

  const openInBaatoMaps = (location: string, distance: number) => {
    try {
      const url = `https://maps.baato.io/?q=${encodeURIComponent(location)}`;
      console.log('Opening Baato Maps:', url);
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        alert('Please allow popups for this site to open maps');
      }
    } catch (error) {
      console.error('Error opening Baato Maps:', error);
      alert('Unable to open maps. Please try again.');
    }
  };

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            Mapped Locations
          </CardTitle>
          <CardDescription>Complete weeks to see your mapped locations</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No locations mapped yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-purple-600" />
          Mapped Locations ({locations.length})
        </CardTitle>
        <CardDescription>
          Click location icons to view on Baato Maps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {locations.map(([location, distance], index) => (
            <Button
              key={location}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
              onClick={() => openInBaatoMaps(location, distance)}
            >
              <div className={`p-2 rounded-lg ${
                index === 0 ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <MapPin className={`h-5 w-5 ${
                  index === 0 ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              
              <div className="text-center min-w-0">
                <p className="font-medium text-xs truncate w-full" title={location}>
                  {location}
                </p>
                <p className="text-xs text-gray-600 font-bold">
                  {distance.toFixed(1)} km
                </p>
                {index === 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">
                    Top
                  </Badge>
                )}
              </div>
              
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </Button>
          ))}
        </div>

        {Object.keys(locationStats).length > 6 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              +{Object.keys(locationStats).length - 6} more locations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
