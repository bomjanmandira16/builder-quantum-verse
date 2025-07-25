import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Filter } from "lucide-react";

export default function Reports() {
  const reports = [
    {
      id: 1,
      title: "Monthly Road Mapping Summary",
      description: "Comprehensive overview of all mapping activities for January 2024",
      date: "2024-01-31",
      status: "completed",
      format: "PDF"
    },
    {
      id: 2,
      title: "Urban Grid Analysis Report",
      description: "Detailed analysis of urban road network mapping efficiency",
      date: "2024-01-28",
      status: "completed",
      format: "XLSX"
    },
    {
      id: 3,
      title: "Mountain Pass Terrain Study",
      description: "Geographic and technical challenges in mountain road mapping",
      date: "2024-01-25",
      status: "in-progress",
      format: "PDF"
    },
    {
      id: 4,
      title: "Coastal Road Maintenance Report",
      description: "Assessment of coastal road conditions and mapping accuracy",
      date: "2024-01-22",
      status: "completed",
      format: "PDF"
    },
    {
      id: 5,
      title: "Rural Trails Accessibility",
      description: "Analysis of rural trail accessibility and mapping coverage",
      date: "2024-01-20",
      status: "draft",
      format: "DOCX"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and manage your road mapping reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Weekly Summary</h3>
            <p className="text-sm text-muted-foreground">Generate weekly mapping summary</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Monthly Report</h3>
            <p className="text-sm text-muted-foreground">Comprehensive monthly analysis</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Download className="h-8 w-8 mx-auto text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">Custom Export</h3>
            <p className="text-sm text-muted-foreground">Create custom data export</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your latest generated reports and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{report.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{report.date}</span>
                      <Badge variant="secondary" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{report.format}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {report.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
