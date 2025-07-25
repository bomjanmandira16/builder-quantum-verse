import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Check, 
  Calendar,
  MapPin,
  Plus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData, MappingRecord } from "@/contexts/DataContext";

interface WeekData {
  id: number;
  weekNumber: number;
  status: 'locked' | 'current' | 'completed';
  location: string;
  startDate: string;
  endDate: string;
  images: File[];
  roadLength: string;
}

export default function CompactWeeklyUpload() {
  const { mappingRecords, addMappingRecord, getCompletedWeeks } = useData();
  const { toast } = useToast();
  
  const [currentWeek, setCurrentWeek] = useState<WeekData>({
    id: 1,
    weekNumber: 1,
    status: 'current',
    location: '',
    startDate: '',
    endDate: '',
    images: [],
    roadLength: ''
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const completedWeeks = getCompletedWeeks();

  // Update current week based on completed weeks
  useEffect(() => {
    const nextWeekNumber = completedWeeks + 1;
    setCurrentWeek(prev => ({
      ...prev,
      weekNumber: nextWeekNumber,
      id: nextWeekNumber
    }));
  }, [completedWeeks]);

  const updateCurrentWeek = (updates: Partial<WeekData>) => {
    setCurrentWeek(prev => ({ ...prev, ...updates }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    updateCurrentWeek({ 
      images: [...currentWeek.images, ...newFiles] 
    });
  };

  const removeImage = (imageIndex: number) => {
    const newImages = currentWeek.images.filter((_, index) => index !== imageIndex);
    updateCurrentWeek({ images: newImages });
  };

  const completeWeek = () => {
    if (!currentWeek.location || !currentWeek.startDate || !currentWeek.endDate || !currentWeek.roadLength) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before completing the week.",
        variant: "destructive"
      });
      return;
    }

    // Add to mapping records
    addMappingRecord({
      date: currentWeek.endDate,
      week: currentWeek.weekNumber,
      location: currentWeek.location,
      length: parseFloat(currentWeek.roadLength),
      startDate: currentWeek.startDate,
      endDate: currentWeek.endDate,
      images: currentWeek.images,
      status: 'completed'
    });

    // Reset for next week
    const nextWeekNumber = currentWeek.weekNumber + 1;
    setCurrentWeek({
      id: nextWeekNumber,
      weekNumber: nextWeekNumber,
      status: 'current',
      location: '',
      startDate: '',
      endDate: '',
      images: [],
      roadLength: ''
    });

    toast({
      title: "Week Completed!",
      description: `Week ${currentWeek.weekNumber} has been completed and added to your mapping logs.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
              <CardDescription>
                {completedWeeks > 0 
                  ? `${completedWeeks} weeks completed • Working on Week ${currentWeek.weekNumber}`
                  : "Start your first week of mapping"
                }
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Week Progress Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {Array.from({ length: Math.max(5, completedWeeks + 2) }, (_, i) => (
                <div key={i + 1} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                      i < completedWeeks 
                        ? "bg-green-100 text-green-700 border-2 border-green-200"
                        : i === completedWeeks
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                    )}
                  >
                    {i < completedWeeks ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  {i < Math.max(4, completedWeeks + 1) && (
                    <div className={cn(
                      "w-6 h-0.5",
                      i < completedWeeks ? "bg-green-200" : "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Current Week Form */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold">Week {currentWeek.weekNumber}</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Current</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Kathmandu District"
                      value={currentWeek.location}
                      onChange={(e) => updateCurrentWeek({ location: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roadLength">Road Length (KM) *</Label>
                    <Input
                      id="roadLength"
                      placeholder="e.g., 25.5"
                      type="number"
                      step="0.1"
                      value={currentWeek.roadLength}
                      onChange={(e) => updateCurrentWeek({ roadLength: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={currentWeek.startDate}
                      onChange={(e) => updateCurrentWeek({ startDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={currentWeek.endDate}
                      onChange={(e) => updateCurrentWeek({ endDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Compact Image Upload */}
              <div className="mt-4">
                <Label>Project Images</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
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
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Choose
                    </Button>
                  </div>

                  {/* Image Thumbnails */}
                  {currentWeek.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {currentWeek.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                              onLoad={(e) => {
                                const img = e.target as HTMLImageElement;
                                setTimeout(() => URL.revokeObjectURL(img.src), 100);
                              }}
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      {currentWeek.images.length > 4 && (
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{currentWeek.images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Week Button */}
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={completeWeek}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete Week {currentWeek.weekNumber}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
