import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, BarChart3, PieChart, Plus, Edit2, Trash2, TrendingUp } from "lucide-react";
import WeeklyBarChart from "@/components/charts/WeeklyBarChart";
import WeeklyUpload from "@/components/WeeklyUpload";
import RecentMappingLogs from "@/components/RecentMappingLogs";
import { useData } from "@/contexts/DataContext";

export default function Dashboard() {
  const { getTotalDistance, getCompletedWeeks, getWeeklyData, mappingRecords } = useData();

  const totalDistance = getTotalDistance();
  const completedWeeks = getCompletedWeeks();
  const weeklyData = getWeeklyData();

  // Get top location
  const locationStats = mappingRecords.reduce((acc, record) => {
    if (record.status === 'completed') {
      acc[record.location] = (acc[record.location] || 0) + record.length;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLocation = Object.entries(locationStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data';

  // Calculate efficiency (assuming target of 25km per week)
  const targetKmPerWeek = 25;
  const averageKmPerWeek = completedWeeks > 0 ? totalDistance / completedWeeks : 0;
  const efficiency = Math.min(100, (averageKmPerWeek / targetKmPerWeek) * 100);

  return (
    <div className="space-y-6">
      {/* Weekly Upload System */}
      <WeeklyUpload />

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total KM Mapped</p>
                <p className="text-3xl font-bold">321.6 km</p>
                <p className="text-xs text-muted-foreground mt-1">Complete distance covered across all data</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weeks Logged</p>
                <p className="text-3xl font-bold">15 Weeks</p>
                <p className="text-xs text-muted-foreground mt-1">From January 1st to mid-April annually</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Location</p>
                <p className="text-3xl font-bold">Urban Grid</p>
                <p className="text-xs text-muted-foreground mt-1">Location with highest mapped distance</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Road Length per Week</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyBarChart data={weeklyData} />
        </CardContent>
      </Card>

      {/* Recent Mapping Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Mapping Logs</CardTitle>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Log
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Week</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Length (KM)</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mappingLogs.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{log.date}</td>
                    <td className="py-3 px-4 text-sm">{log.week}</td>
                    <td className="py-3 px-4 text-sm">{log.location}</td>
                    <td className="py-3 px-4 text-sm">{log.length}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
