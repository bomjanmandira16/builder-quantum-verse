import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function CompletedWeeksGallery() {
  const { mappingRecords } = useData();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const completedWeeks = mappingRecords
    .filter(record => record.status === 'completed')
    .sort((a, b) => a.week - b.week);

  const openInBaatoMaps = (location: string) => {
    window.open(`https://maps.baato.io/?q=${encodeURIComponent(location)}`, '_blank');
  };

  const selectedWeekData = selectedWeek 
    ? completedWeeks.find(week => week.week === selectedWeek)
    : null;

  const nextImage = () => {
    if (selectedWeekData && selectedImageIndex < selectedWeekData.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (completedWeeks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Completed Week Maps
          </CardTitle>
          <CardDescription>View uploaded maps from completed weeks</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No completed weeks yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Completed Week Maps ({completedWeeks.length})
        </CardTitle>
        <CardDescription>
          View uploaded maps and images from completed weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedWeeks.map((week) => (
            <div
              key={week.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Week {week.week}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openInBaatoMaps(week.location)}
                    className="h-6 px-2"
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500">
                  {week.length} km
                </span>
              </div>

              <div className="mb-3">
                <p className="font-medium text-sm truncate" title={week.location}>
                  {week.location}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                </p>
              </div>

              {week.images.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {week.images.slice(0, 4).map((image, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="aspect-square bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden p-0 h-auto"
                            onClick={() => {
                              setSelectedWeek(week.week);
                              setSelectedImageIndex(index);
                            }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Week ${week.week} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onLoad={(e) => {
                                const img = e.target as HTMLImageElement;
                                setTimeout(() => URL.revokeObjectURL(img.src), 100);
                              }}
                            />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Week {week.week} - {week.location}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openInBaatoMaps(week.location)}
                                className="ml-auto"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View in Baato Maps
                              </Button>
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedWeekData && (
                            <div className="relative">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={URL.createObjectURL(selectedWeekData.images[selectedImageIndex])}
                                  alt={`Week ${selectedWeekData.week} - Image ${selectedImageIndex + 1}`}
                                  className="w-full h-full object-contain"
                                  onLoad={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    setTimeout(() => URL.revokeObjectURL(img.src), 100);
                                  }}
                                />
                              </div>
                              
                              {selectedWeekData.images.length > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={prevImage}
                                    disabled={selectedImageIndex === 0}
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                  </Button>
                                  
                                  <span className="text-sm text-gray-600">
                                    {selectedImageIndex + 1} of {selectedWeekData.images.length}
                                  </span>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={nextImage}
                                    disabled={selectedImageIndex === selectedWeekData.images.length - 1}
                                  >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                              
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Period:</span>
                                    <p className="text-gray-600">
                                      {new Date(selectedWeekData.startDate).toLocaleDateString()} - {new Date(selectedWeekData.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Distance:</span>
                                    <p className="text-gray-600">{selectedWeekData.length} km</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                  
                  {week.images.length > 4 && (
                    <div className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWeek(week.week);
                              setSelectedImageIndex(0);
                            }}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            View All ({week.images.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Week {week.week} - {week.location} (All Images)
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openInBaatoMaps(week.location)}
                                className="ml-auto"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View in Baato Maps
                              </Button>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            {week.images.map((image, imgIndex) => (
                              <div key={imgIndex} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Week ${week.week} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                  onLoad={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    setTimeout(() => URL.revokeObjectURL(img.src), 100);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No images uploaded
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
