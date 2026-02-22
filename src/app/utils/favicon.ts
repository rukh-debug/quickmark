/**
 * Get the domain name from a URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Get the first letter of the domain for fallback icon
 */
export function getInitials(url: string): string {
  try {
    const domain = getDomain(url);
    return domain.charAt(0).toUpperCase();
  } catch {
    return '?';
  }
}

/**
 * Get fallback emoji based on URL and title keywords
 */
export function getFallbackEmoji(url: string, title: string): string {
  const text = (url + title).toLowerCase();
  if (text.includes('print') || text.includes('barcode')) return '🖨️';
  if (text.includes('graph') || text.includes('monitor') || text.includes('score')) return '📊';
  if (text.includes('schedule') || text.includes('time') || text.includes('roster')) return '📅';
  if (text.includes('alert') || text.includes('lightning')) return '⚡';
  if (text.includes('local') || text.includes('file')) return '📁';
  if (text.includes('dock') || text.includes('yard')) return '🚚';
  if (text.includes('wiki') || text.includes('quip')) return '📝';
  if (text.includes('amazon') || text.includes('aws')) return '📦';
  return '🔗'; // Default
}

/**
 * Favicon source with priority and metadata
 */
export interface FaviconSource {
  url: string;
  priority: number; // Lower is higher priority
  size: number;     // Estimated size in pixels
  type: 'service' | 'direct';
}

/**
 * Get multiple favicon URLs in priority order.
 * Uses external services that handle the complex parsing of <link> tags.
 * 
 * Priority order:
 * 1. DuckDuckGo (clean, no default fallback, good quality)
 * 2. Google (reliable, widely used)
 * 3. Direct /favicon.ico fallback
 */
export function getFaviconUrls(url: string): FaviconSource[] {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const origin = urlObj.origin;

    const sources: FaviconSource[] = [
      // DuckDuckGo - returns actual icon or nothing (no default globe)
      {
        url: `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
        priority: 1,
        size: 32,
        type: 'service',
      },
      // Google - reliable but returns a default globe if not found
      // We use it as fallback since it always returns something
      {
        url: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
        priority: 2,
        size: 128,
        type: 'service',
      },
      // Direct fallback - many sites still have this
      {
        url: `${origin}/favicon.ico`,
        priority: 3,
        size: 16,
        type: 'direct',
      },
    ];

    return sources.sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
}

/**
 * Check if a favicon URL is likely a "default" placeholder icon
 * from services like Google that return a globe for missing icons
 */
export function isDefaultFavicon(img: HTMLImageElement): boolean {
  // Google's default icon is a globe that's typically 16x16 or very small
  // and has specific dimensions. We can detect it by:
  // 1. Natural size (Google's default is 16x16)
  // 2. Loading it on a canvas and checking pixel patterns (complex)
  
  // Simple heuristic: if it's exactly 16x16 from Google service, 
  // it's likely the default globe icon
  return img.naturalWidth === 16 && img.naturalHeight === 16 &&
         img.src.includes('google.com/s2/favicons');
}

/**
 * Preload an image and return success status
 */
export function preloadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Try to find a working favicon from multiple sources.
 * Returns the first working favicon URL or null if none work.
 */
export async function findWorkingFavicon(url: string): Promise<string | null> {
  const sources = getFaviconUrls(url);
  
  for (const source of sources) {
    const img = await preloadImage(source.url);
    if (img) {
      // Skip Google's default globe icon
      if (isDefaultFavicon(img)) {
        continue;
      }
      return source.url;
    }
  }
  
  return null;
}
