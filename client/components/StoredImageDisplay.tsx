import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { loadImagesFromStorage, StoredImage, createImagePreviewUrl } from '@/lib/imageStorage';
import { Image as ImageIcon, Calendar, Trash2 } from 'lucide-react';

interface StoredImageDisplayProps {
  imageIds: string[];
  showMetadata?: boolean;
  className?: string;
  maxDisplay?: number;
}

export default function StoredImageDisplay({ 
  imageIds, 
  showMetadata = false, 
  className = "",
  maxDisplay = 4 
}: StoredImageDisplayProps) {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStoredImages();
  }, [imageIds]);

  const loadStoredImages = () => {
    try {
      const allStoredImages = loadImagesFromStorage();
      const matchingImages = allStoredImages.filter(img => imageIds.includes(img.id));
      setImages(matchingImages);
    } catch (error) {
      console.error('Failed to load images:', error);
      toast({
        title: "Image Load Error",
        description: "Some images could not be loaded.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-4 gap-2 ${className}`}>
        {Array.from({ length: Math.min(maxDisplay, imageIds.length) }).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  const displayImages = images.slice(0, maxDisplay);
  const remainingCount = images.length - maxDisplay;

  return (
    <div className={className}>
      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-2">
        {displayImages.map((image, index) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              <img
                src={image.dataUrl}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {showMetadata && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-end">
                <div className="p-2 text-white text-xs">
                  <p className="font-medium truncate">{image.name}</p>
                  <p className="text-gray-300">
                    {(image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Show remaining count */}
        {remainingCount > 0 && (
          <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-6 w-6 mx-auto text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">+{remainingCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      {showMetadata && images.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <ImageIcon className="h-3 w-3 mr-1" />
              {images.length} image{images.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(images[0]?.uploadedAt || '').toLocaleDateString()}
            </Badge>
          </div>
          
          <div className="text-xs text-gray-500">
            Total size: {(images.reduce((sum, img) => sum + img.size, 0) / 1024 / 1024).toFixed(1)} MB
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for using stored images in components
export function useStoredImages(imageIds: string[]) {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = () => {
      try {
        const allStoredImages = loadImagesFromStorage();
        const matchingImages = allStoredImages.filter(img => imageIds.includes(img.id));
        setImages(matchingImages);
      } catch (error) {
        console.error('Failed to load images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [imageIds]);

  return { images, loading };
}
