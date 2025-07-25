import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, BarChart3, PieChart, Plus, Edit2, Trash2 } from "lucide-react";
import WeeklyBarChart from "@/components/charts/WeeklyBarChart";
import LocationPieChart from "@/components/charts/LocationPieChart";

export default function Dashboard() {
  const mappingLogs = [
    { date: "2024-01-01", week: 1, location: "Mountain Pass", length: 15.2 },
    { date: "2024-01-08", week: 2, location: "Coastal Road", length: 22.8 },
    { date: "2024-01-15", week: 3, location: "Urban Grid", length: 30.5 },
    { date: "2024-01-22", week: 4, location: "Rural Trails", length: 18.1 },
    { date: "2024-01-29", week: 5, location: "Mountain Pass", length: 18 },
    { date: "2024-02-05", week: 6, location: "Coastal Road", length: 25.5 },
    { date: "2024-02-12", week: 7, location: "Urban Grid", length: 33 },
    { date: "2024-02-19", week: 8, location: "Rural Trails", length: 12.5 },
  ];

  const weeklyData = [
    { week: "W1", km: 15.2 },
    { week: "W2", km: 22.8 },
    { week: "W3", km: 30.5 },
    { week: "W4", km: 18.1 },
    { week: "W5", km: 18 },
    { week: "W6", km: 25.5 },
    { week: "W7", km: 33 },
    { week: "W8", km: 12.5 },
    { week: "W9", km: 28.3 },
    { week: "W10", km: 19.7 },
    { week: "W11", km: 24.8 },
    { week: "W12", km: 31.2 },
    { week: "W13", km: 17.9 },
    { week: "W14", km: 26.4 },
    { week: "W15", km: 29.1 },
  ];

  const locationData = [
    { name: "Mountain Pass", percentage: 23, color: "#3b82f6" },
    { name: "Coastal Road", percentage: 31, color: "#10b981" },
    { name: "Urban Grid", percentage: 35, color: "#8b5cf6" },
    { name: "Rural Trails", percentage: 11, color: "#9ca3af" },
  ];

  return (
    <div className="space-y-6">
      {/* Data Input Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ArcGIS Data Input</CardTitle>
            <CardDescription>Input total road length and date range from ArcGIS Pro.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="road-length">Total Road Length (KM)</Label>
              <Input id="road-length" placeholder="0" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Image Upload</CardTitle>
            <CardDescription>Upload images related to the road mapping project.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Button variant="outline">Upload Image</Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Road Length per Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyData.map((data, index) => (
                <div key={data.week} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{data.week}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(data.km / maxKm) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {data.km} km
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Roads Mapped by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">Mountain Pass 23%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">Coastal Road</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-sm">Urban Grid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span className="text-sm">Rural Trails 11%</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="23, 100"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
