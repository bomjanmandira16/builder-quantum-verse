import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Calendar, Plus, Trash2, Eye, BarChart3 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'location' | 'summary';
  createdAt: Date;
  data: any;
}

export default function Reports() {
  const { mappingRecords, getTotalDistance, getCompletedWeeks } = useData();
  const { toast } = useToast();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWeeklyReport = () => {
    if (mappingRecords.length === 0) {
      toast({
        title: "No Data Available",
        description: "Complete some weeks first to generate a weekly report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        title: `Weekly Summary - ${format(new Date(), 'MMM yyyy')}`,
        description: `Summary of ${getCompletedWeeks()} completed weeks with ${getTotalDistance().toFixed(1)} km mapped`,
        type: 'weekly',
        createdAt: new Date(),
        data: mappingRecords
      };
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "Weekly summary report has been created successfully."
      });
    }, 1500);
  };

  const generateMonthlyReport = () => {
    if (mappingRecords.length === 0) {
      toast({
        title: "No Data Available", 
        description: "Complete some weeks first to generate a monthly report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const locationStats = mappingRecords.reduce((acc, record) => {
        acc[record.location] = (acc[record.location] || 0) + record.length;
        return acc;
      }, {} as Record<string, number>);

      const newReport: Report = {
        id: Date.now().toString(),
        title: `Monthly Analysis - ${format(new Date(), 'MMM yyyy')}`,
        description: `Comprehensive analysis covering ${Object.keys(locationStats).length} locations`,
        type: 'monthly',
        createdAt: new Date(),
        data: { records: mappingRecords, locationStats }
      };
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "Monthly analysis report has been created successfully."
      });
    }, 2000);
  };

  const generateLocationReport = () => {
    if (mappingRecords.length === 0) {
      toast({
        title: "No Data Available",
        description: "Complete some weeks first to generate a location report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const uniqueLocations = [...new Set(mappingRecords.map(r => r.location))];
      const newReport: Report = {
        id: Date.now().toString(),
        title: `Location Analysis - ${uniqueLocations.length} Locations`,
        description: `Detailed breakdown of mapping activities across ${uniqueLocations.join(', ')}`,
        type: 'location',
        createdAt: new Date(),
        data: { locations: uniqueLocations, records: mappingRecords }
      };
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "Location analysis report has been created successfully."
      });
    }, 1800);
  };

  const downloadReport = (report: Report) => {
    // Create a simple CSV download
    const csvContent = report.type === 'weekly' ? 
      "Week,Location,Distance(km),Start Date,End Date\n" +
      report.data.map((r: any) => `${r.week},${r.location},${r.length},${r.startDate},${r.endDate}`).join('\n')
      : "Location,Total Distance(km),Weeks\n" +
      Object.entries(report.data.locationStats || {}).map(([loc, dist]) => `${loc},${dist},1`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `${report.title} has been downloaded as CSV.`
    });
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast({
      title: "Report Deleted",
      description: "The report has been removed successfully."
    });
  };

  const viewReport = (report: Report) => {
    toast({
      title: "Opening Report",
      description: `Viewing ${report.title} details...`
    });
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'weekly': return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'monthly': return <BarChart3 className="h-5 w-5 text-green-600" />;
      case 'location': return <FileText className="h-5 w-5 text-purple-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and manage your road mapping reports</p>
        </div>
        <Button 
          onClick={generateWeeklyReport}
          disabled={isGenerating || mappingRecords.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reports.length}</p>
                <p className="text-sm text-muted-foreground">Generated Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getTotalDistance().toFixed(1)} km</p>
                <p className="text-sm text-muted-foreground">Total Data Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getCompletedWeeks()}</p>
                <p className="text-sm text-muted-foreground">Weeks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={generateWeeklyReport}
        >
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Weekly Summary</h3>
            <p className="text-sm text-muted-foreground">Generate weekly mapping summary</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={generateMonthlyReport}
        >
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Monthly Analysis</h3>
            <p className="text-sm text-muted-foreground">Comprehensive monthly analysis</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={generateLocationReport}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">Location Report</h3>
            <p className="text-sm text-muted-foreground">Location-based analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            {reports.length > 0 
              ? `${reports.length} reports generated from your mapping data`
              : "No reports generated yet. Create your first report above."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-500 mb-6">
                Generate reports from your completed mapping weeks to analyze your progress.
              </p>
              <Button 
                onClick={generateWeeklyReport}
                disabled={mappingRecords.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate First Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getReportIcon(report.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{report.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {format(report.createdAt, 'MMM dd, yyyy HH:mm')}
                        </span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          ready
                        </Badge>
                        <span className="text-xs text-muted-foreground">CSV</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadReport(report)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => viewReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{report.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteReport(report.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Report
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
