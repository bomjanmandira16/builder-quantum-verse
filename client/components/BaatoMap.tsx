import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Maximize2, Minimize2, Navigation } from 'lucide-react';

interface BaatoMapProps {
  location?: string;
  showControls?: boolean;
  height?: string;
  className?: string;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }>;
}

export default function BaatoMap({ 
  location = "Kathmandu, Nepal", 
  showControls = true, 
  height = "400px",
  className = "",
  markers = []
}: BaatoMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(location);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Default coordinates for Kathmandu
  const [mapCenter, setMapCenter] = useState({ lat: 27.7172, lng: 85.3240 });

  // Generate map URL
  const mapSrc = `https://maps.baato.io/?lat=${mapCenter.lat}&lng=${mapCenter.lng}&zoom=12&search=${encodeURIComponent(searchQuery)}`;

  useEffect(() => {
    setMapLoaded(false);
    // Force re-render of iframe by changing key
    setMapKey(prev => prev + 1);

    // Set loaded after iframe loads
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [mapCenter, searchQuery]);

  const handleSearch = () => {
    // Update map with new search query
    setSearchQuery(searchQuery);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {showControls && (
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button onClick={goToCurrentLocation} variant="outline" title="Go to current location">
              <Navigation className="h-4 w-4" />
            </Button>
            <Button onClick={toggleFullscreen} variant="outline">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
          
          {markers.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {markers.map((marker, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setMapCenter({ lat: marker.lat, lng: marker.lng })}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {marker.title}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div
        ref={mapRef}
        className={`bg-gray-100 rounded-lg border overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''
        }`}
        style={{ height: isFullscreen ? '100vh' : height }}
      >
        {!mapLoaded && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Baato Map...</p>
            </div>
          </div>
        )}
      </div>
      
      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50"
          variant="outline"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  );
}
