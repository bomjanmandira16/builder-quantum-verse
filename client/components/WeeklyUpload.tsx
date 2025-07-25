import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Check,
  Clock,
  Lock,
  X,
  Calendar,
  MapPin,
  FileImage,
  Plus
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

export default function WeeklyUpload() {
  const [weeks, setWeeks] = useState<WeekData[]>([
    { id: 1, weekNumber: 1, status: 'current', location: '', startDate: '', endDate: '', images: [], roadLength: '' },
    { id: 2, weekNumber: 2, status: 'locked', location: '', startDate: '', endDate: '', images: [], roadLength: '' },
    { id: 3, weekNumber: 3, status: 'locked', location: '', startDate: '', endDate: '', images: [], roadLength: '' },
    { id: 4, weekNumber: 4, status: 'locked', location: '', startDate: '', endDate: '', images: [], roadLength: '' },
    { id: 5, weekNumber: 5, status: 'locked', location: '', startDate: '', endDate: '', images: [], roadLength: '' },
  ]);

  const [draggedWeek, setDraggedWeek] = useState<number | null>(null);

  const updateWeek = (weekId: number, updates: Partial<WeekData>) => {
    setWeeks(prev => prev.map(week => 
      week.id === weekId ? { ...week, ...updates } : week
    ));
  };

  const handleFileUpload = (weekId: number, files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    updateWeek(weekId, { 
      images: [...weeks.find(w => w.id === weekId)!.images, ...newFiles] 
    });
  };

  const removeImage = (weekId: number, imageIndex: number) => {
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;

    const newImages = week.images.filter((_, index) => index !== imageIndex);
    updateWeek(weekId, { images: newImages });
  };

  const completeWeek = (weekId: number) => {
    const week = weeks.find(w => w.id === weekId);
    if (!week || !week.location || !week.startDate || !week.endDate || !week.roadLength) {
      alert('Please fill in all required fields before completing the week.');
      return;
    }

    // Mark current week as completed
    updateWeek(weekId, { status: 'completed' });

    // Unlock next week
    const nextWeek = weeks.find(w => w.weekNumber === week.weekNumber + 1);
    if (nextWeek) {
      updateWeek(nextWeek.id, { status: 'current' });
    }
  };

  const getStatusIcon = (status: WeekData['status']) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4 text-green-600" />;
      case 'current': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'locked': return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: WeekData['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked': return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const completedWeeks = weeks.filter(w => w.status === 'completed').length;
  const progress = (completedWeeks / weeks.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            Weekly Progress Tracker
          </CardTitle>
          <CardDescription>
            Complete each week's data collection and image uploads sequentially
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress: {completedWeeks} of {weeks.length} weeks completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex gap-2 flex-wrap">
              {weeks.map(week => (
                <Badge
                  key={week.id}
                  variant="outline"
                  className={cn("flex items-center gap-1", getStatusColor(week.status))}
                >
                  {getStatusIcon(week.status)}
                  Week {week.weekNumber}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Cards */}
      <div className="grid gap-6">
        {weeks.map((week) => (
          <Card 
            key={week.id} 
            className={cn(
              "transition-all duration-200",
              week.status === 'locked' && "opacity-60",
              week.status === 'current' && "ring-2 ring-blue-200 shadow-lg",
              week.status === 'completed' && "border-green-200 bg-green-50/20"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(week.status)}
                  <div>
                    <CardTitle className="text-lg">Week {week.weekNumber}</CardTitle>
                    <CardDescription>
                      {week.status === 'locked' && "Complete previous weeks to unlock"}
                      {week.status === 'current' && "Currently active - fill in your data"}
                      {week.status === 'completed' && "Completed ✓"}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(week.status)}>
                  {week.status.charAt(0).toUpperCase() + week.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {week.status !== 'locked' && (
                <>
                  {/* Data Input Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`location-${week.id}`}>Location *</Label>
                      <Input
                        id={`location-${week.id}`}
                        placeholder="e.g., Mountain Pass, Urban Grid"
                        value={week.location}
                        onChange={(e) => updateWeek(week.id, { location: e.target.value })}
                        disabled={week.status === 'completed'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`roadLength-${week.id}`}>Road Length (KM) *</Label>
                      <Input
                        id={`roadLength-${week.id}`}
                        placeholder="e.g., 25.5"
                        type="number"
                        step="0.1"
                        value={week.roadLength}
                        onChange={(e) => updateWeek(week.id, { roadLength: e.target.value })}
                        disabled={week.status === 'completed'}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${week.id}`}>Start Date *</Label>
                      <Input
                        id={`startDate-${week.id}`}
                        type="date"
                        value={week.startDate}
                        onChange={(e) => updateWeek(week.id, { startDate: e.target.value })}
                        disabled={week.status === 'completed'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${week.id}`}>End Date *</Label>
                      <Input
                        id={`endDate-${week.id}`}
                        type="date"
                        value={week.endDate}
                        onChange={(e) => updateWeek(week.id, { endDate: e.target.value })}
                        disabled={week.status === 'completed'}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label>Project Images</Label>
                    
                    {/* Upload Area */}
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                        draggedWeek === week.id ? "border-blue-400 bg-blue-50" : "border-gray-300",
                        week.status === 'completed' ? "opacity-50" : "hover:border-gray-400"
                      )}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggedWeek(week.id);
                      }}
                      onDragLeave={() => setDraggedWeek(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggedWeek(null);
                        if (week.status !== 'completed') {
                          handleFileUpload(week.id, e.dataTransfer.files);
                        }
                      }}
                    >
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Upload className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Drop images here or click to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id={`file-upload-${week.id}`}
                          onChange={(e) => handleFileUpload(week.id, e.target.files)}
                          disabled={week.status === 'completed'}
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (week.status !== 'completed') {
                              document.getElementById(`file-upload-${week.id}`)?.click();
                            }
                          }}
                          disabled={week.status === 'completed'}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    {/* Uploaded Images Grid */}
                    {week.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {week.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                            {week.status !== 'completed' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={() => removeImage(week.id, index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                              {image.name.split('.')[0].substring(0, 8)}...
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {week.status === 'current' && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button 
                        onClick={() => completeWeek(week.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Complete Week {week.weekNumber}
                      </Button>
                    </div>
                  )}
                </>
              )}

              {week.status === 'locked' && (
                <div className="text-center py-8 text-gray-500">
                  <Lock className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p>Complete Week {week.weekNumber - 1} to unlock this week</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
