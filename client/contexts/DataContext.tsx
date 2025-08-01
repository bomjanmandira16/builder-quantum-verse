import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StoredImage, saveImagesToStorage } from '@/lib/imageStorage';
import { getSharedDataFromURL, loadByShareId, parseSharedData } from '@/lib/dataSharing';
import { initializeDefaultData, getDefaultData } from '@/lib/defaultData';

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
  isSharedData: boolean;
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
  const [mappingRecords, setMappingRecords] = useState<MappingRecord[]>([]);
  const [isSharedData, setIsSharedData] = useState(false);

  const [reports, setReports] = useState<Report[]>([]);

  // Load data on initialization
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    if (typeof window === 'undefined') return;

    // Check for shared data first
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');

    if (shareParam) {
      // Load shared data
      const sharedData = loadByShareId(shareParam);
      if (sharedData) {
        try {
          const { mappingRecords: sharedRecords, images } = parseSharedData(sharedData);
          setMappingRecords(sharedRecords);
          setIsSharedData(true);

          // Save shared images to current storage
          if (images.length > 0) {
            saveImagesToStorage(images);
          }

          console.log(`Loaded shared data: ${sharedRecords.length} records, ${images.length} images`);
          return;
        } catch (error) {
          console.error('Failed to load shared data:', error);
        }
      }
    }

    // Load only real user data from localStorage
    try {
      const saved = localStorage.getItem('baatometrics-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const localRecords = parsed.map((record: any) => ({
          ...record,
          createdAt: new Date(record.createdAt),
          imageIds: record.imageIds || [],
          images: []
        }));
        setMappingRecords(localRecords);
        console.log(`📊 Loaded ${localRecords.length} real mapping records`);
      }

      // Load local reports
      const savedReports = localStorage.getItem('baatometrics-reports');
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        const localReports = parsedReports.map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt)
        }));
        setReports(localReports);
      }
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  };

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
    if (isSharedData) {
      // Don't allow adding records when viewing shared data
      throw new Error('Cannot add records while viewing shared data');
    }

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

  const getImagesForRecord = (recordId: string): File[] => {
    const record = mappingRecords.find(r => r.id === recordId);
    if (!record || !record.imageIds.length) return [];

    try {
      // Dynamically import to avoid SSR issues
      import('@/lib/imageStorage').then(({ loadImagesFromStorage, storedImagesToFiles }) => {
        const allStoredImages = loadImagesFromStorage();
        const recordImages = allStoredImages.filter(img => record.imageIds.includes(img.id));
        return storedImagesToFiles(recordImages);
      });
    } catch (error) {
      console.error('Failed to load images for record:', error);
    }

    return [];
  };

  return (
    <DataContext.Provider
      value={{
        mappingRecords,
        reports,
        isSharedData,
        addMappingRecord,
        updateMappingRecord,
        deleteMappingRecord,
        addReport,
        deleteReport,
        getTotalDistance,
        getCompletedWeeks,
        getWeeklyData,
        getImagesForRecord,
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
