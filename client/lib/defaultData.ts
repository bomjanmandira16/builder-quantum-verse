import { MappingRecord } from '@/contexts/DataContext';
import { StoredImage } from './imageStorage';

// Comprehensive mapping data showing Bomjan Mandira's complete progress
export const DEFAULT_MAPPING_RECORDS: MappingRecord[] = [
  {
    id: 'demo-week-1',
    date: '2025-01-20',
    week: 1,
    location: 'Kathmandu District',
    length: 793,
    startDate: '2025-01-14',
    endDate: '2025-01-20',
    images: [],
    imageIds: ['demo-img-1', 'demo-img-2', 'demo-img-3'],
    status: 'completed',
    createdAt: new Date('2025-01-20T10:00:00Z')
  },
  {
    id: 'demo-week-2',
    date: '2025-01-27',
    week: 2,
    location: 'Bagmati Province',
    length: 620,
    startDate: '2025-01-21',
    endDate: '2025-01-27',
    images: [],
    imageIds: ['demo-img-4', 'demo-img-5'],
    status: 'completed',
    createdAt: new Date('2025-01-27T15:30:00Z')
  },
  {
    id: 'demo-week-3',
    date: '2025-02-03',
    week: 3,
    location: 'Lalitpur District',
    length: 485,
    startDate: '2025-01-28',
    endDate: '2025-02-03',
    images: [],
    imageIds: ['demo-img-6', 'demo-img-7'],
    status: 'completed',
    createdAt: new Date('2025-02-03T14:20:00Z')
  },
  {
    id: 'demo-week-4',
    date: '2025-02-10',
    week: 4,
    location: 'Bhaktapur District',
    length: 567,
    startDate: '2025-02-04',
    endDate: '2025-02-10',
    images: [],
    imageIds: ['demo-img-8', 'demo-img-9'],
    status: 'completed',
    createdAt: new Date('2025-02-10T16:45:00Z')
  },
  {
    id: 'demo-week-5',
    date: '2025-02-17',
    week: 5,
    location: 'Chitwan District',
    length: 892,
    startDate: '2025-02-11',
    endDate: '2025-02-17',
    images: [],
    imageIds: ['demo-img-10', 'demo-img-11', 'demo-img-12'],
    status: 'completed',
    createdAt: new Date('2025-02-17T12:30:00Z')
  },
  {
    id: 'demo-week-6',
    date: '2025-02-24',
    week: 6,
    location: 'Pokhara Metropolitan',
    length: 634,
    startDate: '2025-02-18',
    endDate: '2025-02-24',
    images: [],
    imageIds: ['demo-img-13', 'demo-img-14'],
    status: 'completed',
    createdAt: new Date('2025-02-24T09:15:00Z')
  }
];

// Helper function to safely encode SVG to data URL
function createSvgDataUrl(svgContent: string): string {
  // Use encodeURIComponent instead of btoa to handle Unicode characters
  return 'data:image/svg+xml,' + encodeURIComponent(svgContent);
}

// Default demo images
export const DEFAULT_IMAGES: StoredImage[] = [
  {
    id: 'demo-img-1',
    name: 'kathmandu_road_1.jpg',
    type: 'image/jpeg',
    size: 2048576, // 2MB
    dataUrl: createSvgDataUrl(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#2563eb"/>
        <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" rx="10"/>
        <text x="200" y="130" text-anchor="middle" fill="#374151" font-family="Arial" font-size="16">Kathmandu Road Mapping</text>
        <text x="200" y="160" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Week 1 - Main Highway</text>
        <circle cx="120" cy="200" r="20" fill="#10b981"/>
        <text x="120" y="206" text-anchor="middle" fill="white" font-family="Arial" font-size="10">OK</text>
        <text x="280" y="206" text-anchor="middle" fill="#374151" font-family="Arial" font-size="10">793 km mapped</text>
      </svg>
    `),
    uploadedAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 'demo-img-2',
    name: 'kathmandu_road_2.jpg',
    type: 'image/jpeg',
    size: 1843200, // 1.8MB
    dataUrl: createSvgDataUrl(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#059669"/>
        <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" rx="10"/>
        <text x="200" y="130" text-anchor="middle" fill="#374151" font-family="Arial" font-size="16">Secondary Roads</text>
        <text x="200" y="160" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Week 1 - Local Streets</text>
        <rect x="100" y="180" width="200" height="4" fill="#3b82f6"/>
        <text x="200" y="210" text-anchor="middle" fill="#374151" font-family="Arial" font-size="10">Urban mapping complete</text>
      </svg>
    `),
    uploadedAt: '2025-01-20T14:30:00Z'
  },
  {
    id: 'demo-img-3',
    name: 'kathmandu_overview.jpg',
    type: 'image/jpeg',
    size: 3145728, // 3MB
    dataUrl: createSvgDataUrl(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#7c3aed"/>
        <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" rx="10"/>
        <text x="200" y="120" text-anchor="middle" fill="#374151" font-family="Arial" font-size="16">Area Overview</text>
        <text x="200" y="140" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Kathmandu District</text>
        <text x="200" y="170" text-anchor="middle" fill="#374151" font-family="Arial" font-size="14">DONE - 793 KM COMPLETED</text>
        <text x="200" y="190" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="10">Total progress Week 1</text>
        <text x="200" y="220" text-anchor="middle" fill="#059669" font-family="Arial" font-size="12">Status: Completed</text>
      </svg>
    `),
    uploadedAt: '2025-01-20T16:45:00Z'
  },
  {
    id: 'demo-img-4',
    name: 'lalitpur_road_1.jpg',
    type: 'image/jpeg',
    size: 2621440, // 2.5MB
    dataUrl: createSvgDataUrl(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#dc2626"/>
        <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" rx="10"/>
        <text x="200" y="130" text-anchor="middle" fill="#374151" font-family="Arial" font-size="16">Lalitpur Road Network</text>
        <text x="200" y="160" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Week 2 - District Roads</text>
        <circle cx="150" cy="200" r="15" fill="#10b981"/>
        <circle cx="250" cy="200" r="15" fill="#10b981"/>
        <text x="200" y="230" text-anchor="middle" fill="#374151" font-family="Arial" font-size="10">620 km mapped</text>
      </svg>
    `),
    uploadedAt: '2025-01-27T11:20:00Z'
  },
  {
    id: 'demo-img-5',
    name: 'lalitpur_progress.jpg',
    type: 'image/jpeg',
    size: 1966080, // 1.9MB
    dataUrl: createSvgDataUrl(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#ea580c"/>
        <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" rx="10"/>
        <text x="200" y="120" text-anchor="middle" fill="#374151" font-family="Arial" font-size="16">Week 2 Complete</text>
        <text x="200" y="140" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Bagmati Province</text>
        <text x="200" y="170" text-anchor="middle" fill="#374151" font-family="Arial" font-size="14">DONE - 620 KM COMPLETED</text>
        <text x="200" y="190" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="10">Total: 1,413 km across 2 weeks</text>
        <text x="200" y="220" text-anchor="middle" fill="#059669" font-family="Arial" font-size="12">Progress: Excellent!</text>
      </svg>
    `),
    uploadedAt: '2025-01-27T17:15:00Z'
  }
];

// Helper function to check if we should load default data
export function shouldLoadDefaultData(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if there's any existing user data
  const existingData = localStorage.getItem('baatometrics-data');
  const existingImages = localStorage.getItem('baatometrics-images');
  
  // If no existing data, load defaults
  return !existingData && !existingImages;
}

// Function to initialize default data
export function initializeDefaultData(): void {
  if (typeof window === 'undefined') return;
  
  // Only set defaults if no data exists
  if (shouldLoadDefaultData()) {
    localStorage.setItem('baatometrics-data', JSON.stringify(DEFAULT_MAPPING_RECORDS));
    localStorage.setItem('baatometrics-images', JSON.stringify(DEFAULT_IMAGES));
    
    console.log('🎯 Initialized default demo data for new visitor');
  }
}

// Get the default data for display
export function getDefaultData() {
  return {
    mappingRecords: DEFAULT_MAPPING_RECORDS,
    images: DEFAULT_IMAGES
  };
}
