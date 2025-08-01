import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import WeeklyBarChart from "@/components/charts/WeeklyBarChart";
import CompactWeeklyUpload from "@/components/CompactWeeklyUpload";
import RecentMappingLogs from "@/components/RecentMappingLogs";
import LocationOverview from "@/components/LocationOverview";
import CompletedWeeksGallery from "@/components/CompletedWeeksGallery";
import DebugMappingData from "@/components/DebugMappingData";
import { useData } from "@/contexts/DataContext";

export default function Dashboard() {
  const { getTotalDistance, getCompletedWeeks, getWeeklyData, mappingRecords } =
    useData();

  const totalDistance = getTotalDistance();
  const completedWeeks = getCompletedWeeks();
  const weeklyData = getWeeklyData();

  // Get top location
  const locationStats = mappingRecords.reduce(
    (acc, record) => {
      if (record.status === "completed") {
        acc[record.location] = (acc[record.location] || 0) + record.length;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const topLocation =
    Object.entries(locationStats).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "No data";

  // Calculate efficiency (assuming target of 25km per week)
  const targetKmPerWeek = 25;
  const averageKmPerWeek =
    completedWeeks > 0 ? totalDistance / completedWeeks : 0;
  const efficiency = Math.min(100, (averageKmPerWeek / targetKmPerWeek) * 100);

  return (
    <div className="space-y-6">
      {/* Compact Weekly Upload System */}
      <CompactWeeklyUpload />

      {/* Debug Information */}
      <DebugMappingData />

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total KM Mapped
                </p>
                <p className="text-3xl font-bold">
                  {totalDistance.toFixed(1)} km
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete distance covered across all data
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Weeks Completed
                </p>
                <p className="text-3xl font-bold">{completedWeeks}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedWeeks === 0
                    ? "Start your first week"
                    : "Weeks successfully logged"}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Weekly Average
                </p>
                <p className="text-3xl font-bold">
                  {averageKmPerWeek.toFixed(1)} km
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {efficiency.toFixed(0)}% of target efficiency
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Location Overview */}
      <LocationOverview />

      {/* Charts Section */}
      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Road Length per Week
            </CardTitle>
            <CardDescription>
              Progress tracking across completed weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyBarChart data={weeklyData} />
          </CardContent>
        </Card>
      )}

      {/* Completed Weeks Gallery */}
      <CompletedWeeksGallery />

      {/* Recent Mapping Logs */}
      <RecentMappingLogs />
    </div>
  );
}
