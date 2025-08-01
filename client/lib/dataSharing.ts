// Data sharing utilities for BaatoMetrics
import { MappingRecord } from '@/contexts/DataContext';
import { StoredImage } from './imageStorage';

export interface SharedData {
  mappingRecords: MappingRecord[];
  images: StoredImage[];
  sharedAt: string;
  sharedBy: string;
  version: string;
}

// Create a shareable data export
export function createShareableData(mappingRecords: MappingRecord[], images: StoredImage[], userName: string): SharedData {
  return {
    mappingRecords: mappingRecords.map(record => ({
      ...record,
      // Convert dates to strings for JSON serialization
      createdAt: record.createdAt.toISOString(),
      joinedAt: record.joinedAt?.toISOString() || new Date().toISOString(),
      lastActive: record.lastActive?.toISOString() || new Date().toISOString(),
    })) as any,
    images,
    sharedAt: new Date().toISOString(),
    sharedBy: userName,
    version: '1.0'
  };
}

// Convert shared data back to usable format
export function parseSharedData(sharedData: SharedData): { mappingRecords: MappingRecord[], images: StoredImage[] } {
  const mappingRecords = sharedData.mappingRecords.map(record => ({
    ...record,
    createdAt: new Date(record.createdAt as any),
    joinedAt: new Date((record as any).joinedAt),
    lastActive: new Date((record as any).lastActive),
  }));

  return {
    mappingRecords,
    images: sharedData.images
  };
}

// Generate shareable URL with data
export function generateShareableURL(mappingRecords: MappingRecord[], images: StoredImage[], userName: string): string {
  const sharedData = createShareableData(mappingRecords, images, userName);
  const encodedData = btoa(JSON.stringify(sharedData));
  
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set('shared', encodedData);
  
  return currentURL.toString();
}

// Extract shared data from URL
export function getSharedDataFromURL(): SharedData | null {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedParam = urlParams.get('shared');
  
  if (!sharedParam) return null;
  
  try {
    const decodedData = atob(sharedParam);
    return JSON.parse(decodedData) as SharedData;
  } catch (error) {
    console.error('Failed to parse shared data:', error);
    return null;
  }
}

// Save data to simple cloud storage (using a free service)
export async function saveToCloud(data: SharedData): Promise<string | null> {
  try {
    // Using JSONBin.io as a simple cloud storage (free tier)
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$...demo...', // You'd need a real API key
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.metadata.id;
    }
  } catch (error) {
    console.error('Failed to save to cloud:', error);
  }
  
  return null;
}

// Load data from cloud storage
export async function loadFromCloud(id: string): Promise<SharedData | null> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
      headers: {
        'X-Master-Key': '$2a$10$...demo...', // You'd need a real API key
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.record as SharedData;
    }
  } catch (error) {
    console.error('Failed to load from cloud:', error);
  }
  
  return null;
}

// Create a simple share ID for easier sharing
export function generateShareId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Store data with a simple share ID in localStorage for demo
export function storeWithShareId(shareId: string, data: SharedData): void {
  localStorage.setItem(`baato-shared-${shareId}`, JSON.stringify(data));
}

// Load data by share ID from localStorage
export function loadByShareId(shareId: string): SharedData | null {
  try {
    const stored = localStorage.getItem(`baato-shared-${shareId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load shared data:', error);
    return null;
  }
}
