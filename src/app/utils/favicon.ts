/**
 * Get the favicon URL for a given website URL
 * Tries the site's actual favicon.ico which will 404 if not present
 * (unlike Google service which returns a default globe icon)
 */
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Use the site's actual favicon - this will fail (404) if not present
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return '';
  }
}

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
