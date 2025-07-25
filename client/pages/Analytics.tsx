import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart, MapPin } from "lucide-react";
import BaatoMap from "@/components/BaatoMap";
import { useData } from "@/contexts/DataContext";

export default function Analytics() {
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

      {/* Placeholder for future analytics components */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Advanced analytics and trend visualization will be implemented here</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Trend analysis charts coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Detailed performance insights and comparisons</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Performance metrics coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
