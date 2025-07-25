import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { useData, MappingRecord } from "@/contexts/DataContext";
import { format } from "date-fns";

export default function RecentMappingLogs() {
  const { mappingRecords, updateMappingRecord, deleteMappingRecord } = useData();
  const { toast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<MappingRecord | null>(null);
  const [editForm, setEditForm] = useState({
    location: '',
    length: '',
    startDate: '',
    endDate: ''
  });

  const recordsPerPage = 8;
  const totalPages = Math.ceil(mappingRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = mappingRecords
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(startIndex, startIndex + recordsPerPage);

  const handleEdit = (record: MappingRecord) => {
    setEditingRecord(record);
    setEditForm({
      location: record.location,
      length: record.length.toString(),
      startDate: record.startDate,
      endDate: record.endDate
    });
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;

    if (!editForm.location || !editForm.length || !editForm.startDate || !editForm.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    updateMappingRecord(editingRecord.id, {
      location: editForm.location,
      length: parseFloat(editForm.length),
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      date: editForm.endDate
    });

    setEditingRecord(null);
    toast({
      title: "Record Updated",
      description: "The mapping record has been successfully updated.",
    });
  };

  const handleDelete = (record: MappingRecord) => {
    deleteMappingRecord(record.id);
    
    // Adjust current page if needed
    const newTotalPages = Math.ceil((mappingRecords.length - 1) / recordsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    toast({
      title: "Record Deleted",
      description: "The mapping record has been successfully deleted.",
    });
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (mappingRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Mapping Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mapping records yet</h3>
            <p className="text-gray-500 mb-6">
              Complete weekly uploads to see your mapping logs here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Mapping Logs</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {mappingRecords.length} total records • Page {currentPage} of {totalPages}
          </p>
        </div>
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
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-sm">{record.week}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {record.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{record.length}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Dialog open={editingRecord?.id === record.id} onOpenChange={(open) => !open && setEditingRecord(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Mapping Record</DialogTitle>
                            <DialogDescription>
                              Update the details for Week {record.week} mapping record.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-location">Location</Label>
                              <Input
                                id="edit-location"
                                value={editForm.location}
                                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Enter location"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-length">Road Length (KM)</Label>
                              <Input
                                id="edit-length"
                                type="number"
                                step="0.1"
                                value={editForm.length}
                                onChange={(e) => setEditForm(prev => ({ ...prev, length: e.target.value }))}
                                placeholder="Enter road length"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-start-date">Start Date</Label>
                                <Input
                                  id="edit-start-date"
                                  type="date"
                                  value={editForm.startDate}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-end-date">End Date</Label>
                                <Input
                                  id="edit-end-date"
                                  type="date"
                                  value={editForm.endDate}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingRecord(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the mapping record for Week {record.week} ({record.location}). 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(record)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Record
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={currentPage === pageNum ? "bg-blue-600 text-white" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
