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
  Upload,
  Check,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";

export default function Dashboard() {
  const { getTotalDistance, getCompletedWeeks, getWeeklyData, mappingRecords, isSharedData } =
    useData();

  const [currentWeek, setCurrentWeek] = useState({
    weekNumber: 3,
    location: '',
    startDate: '',
    endDate: '',
    roadLength: '',
    images: [] as File[]
  });

  const totalDistance = getTotalDistance();
  const completedWeeks = getCompletedWeeks();
  const weeklyData = getWeeklyData();

  // Get completed weeks data
  const completedRecords = mappingRecords.filter(r => r.status === "completed");
  
  // Calculate weekly average
  const averageKmPerWeek = completedWeeks > 0 ? totalDistance / completedWeeks : 0;

  // Location data for cards
  const locationStats = mappingRecords.reduce(
    (acc, record) => {
      if (record.status === "completed") {
        acc[record.location] = (acc[record.location] || 0) + record.length;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const locations = Object.entries(locationStats).map(([name, distance]) => ({
    name,
    distance: distance.toFixed(1),
    color: name.toLowerCase().includes('kathmandu') ? 'blue' : 'purple'
  }));

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setCurrentWeek(prev => ({ 
      ...prev, 
      images: [...prev.images, ...newFiles] 
    }));
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Shared Data Banner */}
      {isSharedData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  Viewing Shared Data
                </h3>
                <p className="text-sm text-blue-700">
                  You're viewing someone else's mapping progress. This data is read-only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Progress */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-700">Weekly Progress</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            4 weeks completed • Working on Week 5
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Circles */}
          <div className="flex items-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((week) => (
              <div key={week} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    week <= 2
                      ? "bg-green-500 text-white border-green-500"
                      : week === 3
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  )}
                >
                  {week <= 2 ? <Check className="h-4 w-4" /> : week}
                </div>
                {week < 5 && (
                  <div className={cn(
                    "w-8 h-0.5 mx-2",
                    week < 3 ? "bg-green-200" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Week 3 Form */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-600">📅 Week 3</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Current
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Kathmandu District"
                    value={currentWeek.location}
                    onChange={(e) => setCurrentWeek(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1 border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="roadLength" className="text-sm font-medium text-gray-700">
                    Total Road Length *
                  </Label>
                  <Input
                    id="roadLength"
                    placeholder="e.g., 25.5"
                    value={currentWeek.roadLength}
                    onChange={(e) => setCurrentWeek(prev => ({ ...prev, roadLength: e.target.value }))}
                    className="mt-1 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={currentWeek.startDate}
                    onChange={(e) => setCurrentWeek(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1 border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={currentWeek.endDate}
                    onChange={(e) => setCurrentWeek(prev => ({ ...prev, endDate: e.target.value }))}
                    className="mt-1 border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Project Images Upload */}
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-700">Project Images</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {currentWeek.images.length > 0 
                          ? `${currentWeek.images.length} files selected`
                          : "Upload project images"
                        }
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="text-gray-600 border-gray-300"
                  >
                    + Browse
                  </Button>
                </div>
              </div>
            </div>

            {/* Complete Week Button */}
            <div className="flex justify-end mt-6">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Complete Week 3
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total KM Mapped */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total KM Mapped
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalDistance.toFixed(1)} km
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Complete distance covered across all data
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Completed */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Week Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">{completedWeeks}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Total successfully mapped
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Average */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Weekly Average
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {averageKmPerWeek.toFixed(0)} km
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Overall average efficiency
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapped Location */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-700">Mapped Location</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Click location icons to view on Baato Maps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {locations.map((location, index) => (
              <Card key={location.name} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      location.color === 'blue' ? "bg-blue-100" : "bg-purple-100"
                    )}>
                      <MapPin className={cn(
                        "h-5 w-5",
                        location.color === 'blue' ? "text-blue-500" : "text-purple-500"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-500">{location.distance} km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Road Length per Week Chart */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-700">Road Length per Week</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Progress tracking across completed weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* W1 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 w-8">W1</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="bg-blue-400 h-full rounded-full transition-all duration-500"
                  style={{ width: completedRecords[0] ? '85%' : '0%' }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {completedRecords[0] ? `${completedRecords[0].length.toFixed(0)}%` : '0%'}
              </span>
            </div>

            {/* W2 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 w-8">W2</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="bg-blue-400 h-full rounded-full transition-all duration-500"
                  style={{ width: completedRecords[1] ? '90%' : '0%' }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {completedRecords[1] ? `${completedRecords[1].length.toFixed(0)}%` : '0%'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed 2 Weeks Map */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-700">Completed 2 Weeks Map</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            View detailed maps that completed previous weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {completedRecords.slice(0, 2).map((record, index) => (
              <Card key={record.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{record.location}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Week {record.week}
                      </Badge>
                    </div>
                    
                    {/* Map Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border">
                      <div className="text-center text-blue-600">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Map View</p>
                        <p className="text-xs">Click to expand</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Distance:</span> {record.length} km</p>
                      <p><span className="font-medium">Date:</span> {record.endDate}</p>
                      <p><span className="font-medium">Images:</span> {record.images?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
