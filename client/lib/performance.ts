// Performance monitoring utilities for Chrome optimization

export const measurePageLoad = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
          tcp: Math.round(perfData.connectEnd - perfData.connectStart),
          request: Math.round(perfData.responseStart - perfData.requestStart),
          response: Math.round(perfData.responseEnd - perfData.responseStart),
          dom: Math.round(perfData.domInteractive - perfData.responseEnd),
          domContentLoaded: Math.round(perfData.domContentLoadedEventStart - perfData.navigationStart),
          complete: Math.round(perfData.loadEventStart - perfData.navigationStart)
        };

        console.log('🚀 Page Performance Metrics:', metrics);
        
        // Log Core Web Vitals if available
        if ('web-vital' in window) {
          console.log('📊 Core Web Vitals tracking enabled');
        }
      }, 0);
    });
  }
};

export const preloadCriticalResources = () => {
  if (typeof document !== 'undefined') {
    // Preload critical images
    const criticalImages = [
      'https://cdn.builder.io/api/v1/image/assets%2F67d3cd4f4d464a76af4015fa874bdeea%2F60ac84203645468c97574dd2e6beec68?format=webp&width=800'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
};

export const optimizeImages = () => {
  if (typeof document !== 'undefined') {
    // Add intersection observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};
