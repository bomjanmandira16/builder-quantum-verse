import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart, MapPin } from "lucide-react";
import BaatoMap from "@/components/BaatoMap";
import { useData } from "@/contexts/DataContext";

export default function Analytics() {
  const { mappingRecords } = useData();

  const locationAnalytics = mappingRecords.reduce((acc, record) => {
    if (record.status === 'completed') {
      if (!acc[record.location]) {
        acc[record.location] = { distance: 0, weeks: 0 };
      }
      acc[record.location].distance += record.length;
      acc[record.location].weeks += 1;
    }
    return acc;
  }, {} as Record<string, { distance: number; weeks: number }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and trends from your road mapping data</p>
        </div>
        <Button>Export Report</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">1,284.7 km</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
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
                <p className="text-2xl font-bold">85.6 km</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">-3.2%</span>
                </div>
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
                <p className="text-2xl font-bold">156.3 km</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.1%</span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">94.2%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.8%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                {Object.entries(locationAnalytics).map(([location, stats]) => (
                  <div key={location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{location}</p>
                      <p className="text-sm text-gray-600">{stats.weeks} weeks completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{stats.distance.toFixed(1)} km</p>
                      <p className="text-sm text-gray-600">{(stats.distance / stats.weeks).toFixed(1)} km/week avg</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete some weeks to see location analytics</p>
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
                {mappingRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Week {record.week}</p>
                      <p className="text-sm text-gray-600">{record.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{record.length.toFixed(1)} km</p>
                      <p className="text-sm text-gray-600">{record.date}</p>
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
