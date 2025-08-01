// Utility functions for persisting images across page refreshes

export interface StoredImage {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64 encoded image
  uploadedAt: string;
}

// Convert File to base64 string for storage
export function fileToStoredImage(file: File): Promise<StoredImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString()
      });
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Convert stored image back to File for use in components
export function storedImageToFile(storedImage: StoredImage): File {
  // Convert base64 to blob
  const byteCharacters = atob(storedImage.dataUrl.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: storedImage.type });
  
  // Create File from blob
  return new File([blob], storedImage.name, { 
    type: storedImage.type,
    lastModified: new Date(storedImage.uploadedAt).getTime()
  });
}

// Convert File array to StoredImage array
export async function filesToStoredImages(files: File[]): Promise<StoredImage[]> {
  const promises = files.map(file => fileToStoredImage(file));
  return Promise.all(promises);
}

// Convert StoredImage array to File array
export function storedImagesToFiles(storedImages: StoredImage[]): File[] {
  return storedImages.map(storedImage => storedImageToFile(storedImage));
}

// Create object URL that can be revoked later for display
export function createImagePreviewUrl(image: File | StoredImage): string {
  if ('dataUrl' in image) {
    // It's a StoredImage
    return image.dataUrl;
  } else {
    // It's a File
    return URL.createObjectURL(image);
  }
}

// Storage key for images
const IMAGES_STORAGE_KEY = 'baatometrics-images';

// Save images to localStorage
export function saveImagesToStorage(images: StoredImage[]): void {
  try {
    localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error('Failed to save images to storage:', error);
  }
}

// Load images from localStorage
export function loadImagesFromStorage(): StoredImage[] {
  try {
    const stored = localStorage.getItem(IMAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load images from storage:', error);
    return [];
  }
}

// Add images to storage
export function addImagesToStorage(newImages: StoredImage[]): void {
  const existingImages = loadImagesFromStorage();
  const updatedImages = [...existingImages, ...newImages];
  saveImagesToStorage(updatedImages);
}

// Remove image from storage by ID
export function removeImageFromStorage(imageId: string): void {
  const existingImages = loadImagesFromStorage();
  const filteredImages = existingImages.filter(img => img.id !== imageId);
  saveImagesToStorage(filteredImages);
}

// Get image by ID
export function getImageById(imageId: string): StoredImage | null {
  const images = loadImagesFromStorage();
  return images.find(img => img.id === imageId) || null;
}
