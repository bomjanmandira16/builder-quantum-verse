import { createContext, useContext, useState, ReactNode } from 'react';
import { StoredImage } from '@/lib/imageStorage';

export interface MappingRecord {
  id: string;
  date: string;
  week: number;
  location: string;
  length: number;
  startDate: string;
  endDate: string;
  images: File[];
  imageIds: string[]; // References to stored images
  status: 'completed' | 'current' | 'locked';
  createdAt: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'location' | 'summary';
  createdAt: Date;
  data: any;
}

interface DataContextType {
  mappingRecords: MappingRecord[];
  reports: Report[];
  addMappingRecord: (record: Omit<MappingRecord, 'id' | 'createdAt'>) => Promise<void>;
  updateMappingRecord: (id: string, updates: Partial<MappingRecord>) => void;
  deleteMappingRecord: (id: string) => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  deleteReport: (id: string) => void;
  getTotalDistance: () => number;
  getCompletedWeeks: () => number;
  getWeeklyData: () => Array<{ week: string; km: number }>;
  getImagesForRecord: (recordId: string) => File[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [mappingRecords, setMappingRecords] = useState<MappingRecord[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baatometrics-data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((record: any) => ({
            ...record,
            createdAt: new Date(record.createdAt),
            // Ensure imageIds exists for backward compatibility
            imageIds: record.imageIds || [],
            // Keep images array for backward compatibility but empty it
            images: []
          }));
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    }
    return [];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    // Load reports from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baatometrics-reports');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((report: any) => ({
            ...report,
            createdAt: new Date(report.createdAt)
          }));
        } catch (error) {
          console.error('Error loading saved reports:', error);
        }
      }
    }
    return [];
  });

  // Save to localStorage whenever data changes
  const saveToStorage = (records: MappingRecord[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('baatometrics-data', JSON.stringify(records));
    }
  };

  const saveReportsToStorage = (reportsList: Report[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('baatometrics-reports', JSON.stringify(reportsList));
    }
  };

  const addMappingRecord = async (record: Omit<MappingRecord, 'id' | 'createdAt'>) => {
    // Import image storage functions
    const { filesToStoredImages, addImagesToStorage } = await import('@/lib/imageStorage');

    // Convert and store images
    let imageIds: string[] = [];
    if (record.images && record.images.length > 0) {
      try {
        const storedImages = await filesToStoredImages(record.images);
        addImagesToStorage(storedImages);
        imageIds = storedImages.map(img => img.id);
      } catch (error) {
        console.error('Failed to store images:', error);
      }
    }

    const newRecord: MappingRecord = {
      ...record,
      id: Date.now().toString(),
      imageIds,
      createdAt: new Date(),
    };
    const updatedRecords = [...mappingRecords, newRecord];
    setMappingRecords(updatedRecords);
    saveToStorage(updatedRecords);
  };

  const updateMappingRecord = (id: string, updates: Partial<MappingRecord>) => {
    const updatedRecords = mappingRecords.map(record =>
      record.id === id ? { ...record, ...updates } : record
    );
    setMappingRecords(updatedRecords);
    saveToStorage(updatedRecords);
  };

  const deleteMappingRecord = (id: string) => {
    const updatedRecords = mappingRecords.filter(record => record.id !== id);
    setMappingRecords(updatedRecords);
    saveToStorage(updatedRecords);
  };

  const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    saveReportsToStorage(updatedReports);
  };

  const deleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    saveReportsToStorage(updatedReports);
  };

  const getTotalDistance = () => {
    return mappingRecords
      .filter(record => record.status === 'completed')
      .reduce((total, record) => total + record.length, 0);
  };

  const getCompletedWeeks = () => {
    return mappingRecords.filter(record => record.status === 'completed').length;
  };

  const getWeeklyData = () => {
    return mappingRecords
      .filter(record => record.status === 'completed')
      .sort((a, b) => a.week - b.week)
      .map(record => ({
        week: `W${record.week}`,
        km: record.length,
      }));
  };

  return (
    <DataContext.Provider
      value={{
        mappingRecords,
        reports,
        addMappingRecord,
        updateMappingRecord,
        deleteMappingRecord,
        addReport,
        deleteReport,
        getTotalDistance,
        getCompletedWeeks,
        getWeeklyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
