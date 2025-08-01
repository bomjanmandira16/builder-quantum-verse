// Utility to clean up dummy data and keep only real user data

export function cleanupDummyData(): void {
  if (typeof window === 'undefined') return;

  try {
    // Get current data
    const existingData = localStorage.getItem('baatometrics-data');
    const existingImages = localStorage.getItem('baatometrics-images');

    if (existingData) {
      const parsed = JSON.parse(existingData);
      // Filter out any demo/dummy data (records with IDs starting with 'demo-')
      const realData = parsed.filter((record: any) => !record.id.startsWith('demo-'));
      
      if (realData.length > 0) {
        localStorage.setItem('baatometrics-data', JSON.stringify(realData));
        console.log(`🧹 Cleaned up data: kept ${realData.length} real records`);
      } else {
        localStorage.removeItem('baatometrics-data');
        console.log('🧹 No real data found, cleared storage');
      }
    }

    if (existingImages) {
      const parsed = JSON.parse(existingImages);
      // Filter out any demo images (images with IDs starting with 'demo-')
      const realImages = parsed.filter((image: any) => !image.id.startsWith('demo-'));
      
      if (realImages.length > 0) {
        localStorage.setItem('baatometrics-images', JSON.stringify(realImages));
        console.log(`🧹 Cleaned up images: kept ${realImages.length} real images`);
      } else {
        localStorage.removeItem('baatometrics-images');
        console.log('🧹 No real images found, cleared storage');
      }
    }

  } catch (error) {
    console.error('Error cleaning up data:', error);
  }
}

// Initialize cleanup on load
if (typeof window !== 'undefined') {
  cleanupDummyData();
}
