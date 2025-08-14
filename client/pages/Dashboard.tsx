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
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import { loadImagesFromStorage, getImageById } from "@/lib/imageStorage";
import WeeklyBarChart from "@/components/charts/WeeklyBarChart";
import CompactWeeklyUpload from "@/components/CompactWeeklyUpload";
import LocationOverview from "@/components/LocationOverview";
import CompletedWeeksGallery from "@/components/CompletedWeeksGallery";

export default function Dashboard() {
  const {
    getTotalDistance,
    getCompletedWeeks,
    getWeeklyData,
    mappingRecords,
    isSharedData,
    updateMappingRecord,
    deleteMappingRecord,
  } = useData();
  const { toast } = useToast();

  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    location: "",
    length: "",
    startDate: "",
    endDate: "",
  });

  const totalDistance = getTotalDistance();
  const completedWeeks = getCompletedWeeks();
  const weeklyData = getWeeklyData();

  // Get completed weeks data
  const completedRecords = mappingRecords.filter(
    (r) => r.status === "completed",
  );

  // Calculate weekly average
  const averageKmPerWeek =
    completedWeeks > 0 ? totalDistance / completedWeeks : 0;

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
    color: name.toLowerCase().includes("kathmandu") ? "blue" : "purple",
  }));

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setEditForm({
      location: record.location,
      length: record.length.toString(),
      startDate: record.startDate,
      endDate: record.endDate,
    });
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;

    if (
      !editForm.location ||
      !editForm.length ||
      !editForm.startDate ||
      !editForm.endDate
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateMappingRecord(editingRecord.id, {
      location: editForm.location,
      length: parseFloat(editForm.length),
      startDate: editForm.startDate,
      endDate: editForm.endDate,
    });

    toast({
      title: "Record Updated! ✅",
      description: `Week ${editingRecord.week} has been successfully updated.`,
    });

    setEditingRecord(null);
  };

  const handleDelete = (record: any) => {
    deleteMappingRecord(record.id);
    toast({
      title: "Record Deleted",
      description: `Week ${record.week} has been removed.`,
    });
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
                  You're viewing someone else's mapping progress. This data is
                  read-only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Weekly Upload System - Modified to match Figma */}
      {!isSharedData && (
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-700">
              Weekly Progress
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {completedWeeks > 0
                ? `${completedWeeks} weeks completed • Working on Week ${completedWeeks + 1}`
                : "Start your first week of mapping"}
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
                      week <= completedWeeks
                        ? "bg-green-500 text-white border-green-500"
                        : week === completedWeeks + 1
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-400 border-gray-200",
                    )}
                  >
                    {week <= completedWeeks ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      week
                    )}
                  </div>
                  {week < 5 && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-2",
                        week <= completedWeeks ? "bg-green-200" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Integrate existing CompactWeeklyUpload */}
            <div className="border-t pt-4">
              <CompactWeeklyUpload />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards - Styled to match Figma */}
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
                <p className="text-3xl font-bold text-gray-900">
                  {completedWeeks}
                </p>
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

      {/* Mapped Location - Modified existing LocationOverview */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-700">
            Mapped Location
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Click location icons to view on Baato Maps
          </CardDescription>
        </CardHeader>
        <CardContent>
          {locations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {locations.map((location, index) => (
                <Card
                  key={location.name}
                  className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          location.color === "blue"
                            ? "bg-blue-100"
                            : "bg-purple-100",
                        )}
                      >
                        <MapPin
                          className={cn(
                            "h-5 w-5",
                            location.color === "blue"
                              ? "text-blue-500"
                              : "text-purple-500",
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {location.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {location.distance} km
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <LocationOverview />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Road Length per Week Chart - Modified existing WeeklyBarChart */}
      {weeklyData.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-700">
              Road Length per Week
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Progress tracking across completed weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyBarChart data={weeklyData} />
          </CardContent>
        </Card>
      )}

      {/* Completed 2 Weeks Map - Modified existing CompletedWeeksGallery */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-700">
            Completed 2 Weeks Map
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            View detailed maps that completed previous weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedRecords.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {completedRecords.slice(0, 2).map((record, index) => {
                // Get stored images for this record
                const storedImages = loadImagesFromStorage();
                const recordImages =
                  record.imageIds
                    ?.map((id) => getImageById(id))
                    .filter(Boolean) || [];

                return (
                  <Card key={record.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {record.location}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Week {record.week}
                            </Badge>
                            {!isSharedData && (
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleEdit(record)}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Edit Week {record.week}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Update the details for this mapping
                                        record.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="edit-location"
                                          className="text-right"
                                        >
                                          Location
                                        </Label>
                                        <Input
                                          id="edit-location"
                                          value={editForm.location}
                                          onChange={(e) =>
                                            setEditForm((prev) => ({
                                              ...prev,
                                              location: e.target.value,
                                            }))
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="edit-length"
                                          className="text-right"
                                        >
                                          Length (km)
                                        </Label>
                                        <Input
                                          id="edit-length"
                                          type="number"
                                          step="0.1"
                                          value={editForm.length}
                                          onChange={(e) =>
                                            setEditForm((prev) => ({
                                              ...prev,
                                              length: e.target.value,
                                            }))
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="edit-start"
                                          className="text-right"
                                        >
                                          Start Date
                                        </Label>
                                        <Input
                                          id="edit-start"
                                          type="date"
                                          value={editForm.startDate}
                                          onChange={(e) =>
                                            setEditForm((prev) => ({
                                              ...prev,
                                              startDate: e.target.value,
                                            }))
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="edit-end"
                                          className="text-right"
                                        >
                                          End Date
                                        </Label>
                                        <Input
                                          id="edit-end"
                                          type="date"
                                          value={editForm.endDate}
                                          onChange={(e) =>
                                            setEditForm((prev) => ({
                                              ...prev,
                                              endDate: e.target.value,
                                            }))
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditingRecord(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button onClick={handleSaveEdit}>
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(record)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Distance:</span>{" "}
                            {record.length} km
                          </p>
                          <p>
                            <span className="font-medium">Date:</span>{" "}
                            {record.endDate}
                          </p>
                          <p>
                            <span className="font-medium">Images:</span>{" "}
                            {recordImages.length}
                          </p>
                        </div>

                        {/* Uploaded Photos */}
                        {recordImages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Uploaded Photos
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {recordImages
                                .slice(0, 4)
                                .map((image, imgIndex) => (
                                  <div
                                    key={image?.id || imgIndex}
                                    className="relative group cursor-pointer"
                                  >
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                      {image && (
                                        <img
                                          src={image.dataUrl}
                                          alt={`${record.location} - Photo ${imgIndex + 1}`}
                                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                      )}
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                      <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ))}
                              {recordImages.length > 4 && (
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                                  <span className="text-sm text-gray-500 font-medium">
                                    +{recordImages.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CompletedWeeksGallery />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
