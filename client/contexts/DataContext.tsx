import { createContext, useContext, useState, ReactNode } from 'react';

export interface MappingRecord {
  id: string;
  date: string;
  week: number;
  location: string;
  length: number;
  startDate: string;
  endDate: string;
  images: File[];
  status: 'completed' | 'current' | 'locked';
  createdAt: Date;
}

interface DataContextType {
  mappingRecords: MappingRecord[];
  addMappingRecord: (record: Omit<MappingRecord, 'id' | 'createdAt'>) => void;
  updateMappingRecord: (id: string, updates: Partial<MappingRecord>) => void;
  deleteMappingRecord: (id: string) => void;
  getTotalDistance: () => number;
  getCompletedWeeks: () => number;
  getWeeklyData: () => Array<{ week: string; km: number }>;
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
            createdAt: new Date(record.createdAt)
          }));
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    }
    return [];
  });

  const addMappingRecord = (record: Omit<MappingRecord, 'id' | 'createdAt'>) => {
    const newRecord: MappingRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setMappingRecords(prev => [...prev, newRecord]);
  };

  const updateMappingRecord = (id: string, updates: Partial<MappingRecord>) => {
    setMappingRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, ...updates } : record
      )
    );
  };

  const deleteMappingRecord = (id: string) => {
    setMappingRecords(prev => prev.filter(record => record.id !== id));
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
        addMappingRecord,
        updateMappingRecord,
        deleteMappingRecord,
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
