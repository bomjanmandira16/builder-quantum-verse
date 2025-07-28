import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function Analytics() {
  const { mappingRecords } = useData();

  const locationAnalytics = mappingRecords.reduce((acc, record) => {
    if (record.status === 'completed') {
      // Ensure location name is properly formatted and case-consistent
      const cleanLocation = record.location.trim();

      if (!acc[cleanLocation]) {
        acc[cleanLocation] = { distance: 0, weeks: 0 };
      }
      acc[cleanLocation].distance += record.length;
      acc[cleanLocation].weeks += 1;
    }
    return acc;
  }, {} as Record<string, { distance: number; weeks: number }>);

  // Debug: Log to check if all locations are being processed correctly
  console.log('Mapping Records:', mappingRecords);
  console.log('Location Analytics:', locationAnalytics);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and trends from your road mapping data</p>
        </div>
        <Button>Export Report</Button>
      </div>

      {/* Key Metrics - Real Data Only */}
      {mappingRecords.length > 0 ? (
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                  <p className="text-2xl font-bold">{mappingRecords.reduce((sum, r) => sum + r.length, 0).toFixed(1)} km</p>
                  <p className="text-xs text-muted-foreground mt-1">Across all weeks</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Weekly</p>
                  <p className="text-2xl font-bold">
                    {(mappingRecords.reduce((sum, r) => sum + r.length, 0) / mappingRecords.length).toFixed(1)} km
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Per completed week</p>
                </div>
                <LineChart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Week</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...mappingRecords.map(r => r.length)).toFixed(1)} km
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Best single week</p>
                </div>
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Locations</p>
                  <p className="text-2xl font-bold">{Object.keys(locationAnalytics).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Unique areas mapped</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-500">
              Complete some weeks in the Dashboard to see your analytics and insights.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Analytics Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
            <CardDescription>Performance analysis by geographic location</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(locationAnalytics).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(locationAnalytics)
                  .sort(([,a], [,b]) => b.distance - a.distance) // Sort by distance descending
                  .map(([location, stats]) => (
                  <div
                    key={location}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    onClick={() => window.open(`https://maps.baato.io/?q=${encodeURIComponent(location)}`, '_blank')}
                  >
                    <div>
                      <p className="font-medium capitalize text-gray-900 dark:text-gray-100">{location}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stats.weeks} weeks completed • Click to view on map</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 dark:text-blue-400">{stats.distance.toFixed(1)} km</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{(stats.distance / stats.weeks).toFixed(1)} km/week avg</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete some weeks to see location analytics</p>
                <p className="text-sm mt-2">Add locations like "Ilam", "Kathmandu", etc. when completing weekly uploads</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>Your mapping performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            {mappingRecords.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
                  Showing {mappingRecords.filter(r => r.status === 'completed').length} completed weeks (sorted chronologically)
                </div>
                {mappingRecords
                  .filter(record => record.status === 'completed')
                  .sort((a, b) => a.week - b.week) // Sort weeks in ascending order (1, 2, 3, 4, 5...)
                  .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        record.week >= 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className={`font-medium ${
                          record.week >= 4
                            ? 'text-blue-700 dark:text-blue-300 font-bold'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          Week {record.week}
                          {record.week >= 4 && <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">✨</span>}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{record.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">{record.length.toFixed(1)} km</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(record.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete some weeks to see trends</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
