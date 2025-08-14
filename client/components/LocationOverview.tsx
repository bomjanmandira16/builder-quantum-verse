import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function LocationOverview() {
  const { mappingRecords } = useData();

  // Calculate location statistics
  const locationStats = mappingRecords.reduce(
    (acc, record) => {
      if (record.status === "completed") {
        acc[record.location] = (acc[record.location] || 0) + record.length;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Dynamically adjust location count based on available locations
  const allLocations = Object.entries(locationStats).sort(
    ([, a], [, b]) => b - a,
  );
  const maxLocationsToShow = allLocations.length <= 3 ? allLocations.length : 6;
  const locations = allLocations.slice(0, maxLocationsToShow);

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            Mapped Locations
          </CardTitle>
          <CardDescription>
            Complete weeks to see your mapped locations
          </CardDescription>
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
        <CardDescription>Your mapped locations overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-fr">
          {locations.map(([location, distance], index) => (
            <div
              key={location}
              className="h-auto p-3 flex flex-col items-center gap-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all"
            >
              <div
                className={`p-2 rounded-lg ${
                  index === 0
                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                    : "bg-blue-100 dark:bg-blue-900/30"
                }`}
              >
                <MapPin
                  className={`h-5 w-5 ${
                    index === 0 ? "text-yellow-600" : "text-blue-600"
                  }`}
                />
              </div>

              <div className="text-center min-w-0">
                <p
                  className="font-medium text-xs truncate w-full"
                  title={location}
                >
                  {location}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-bold">
                  {distance.toFixed(1)} km
                </p>
                {index === 0 && (
                  <Badge className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 text-xs mt-1">
                    Top
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(locationStats).length > maxLocationsToShow && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +{Object.keys(locationStats).length - maxLocationsToShow} more
              locations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
