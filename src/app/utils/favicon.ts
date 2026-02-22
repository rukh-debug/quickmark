export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function getInitials(url: string): string {
  try {
    const domain = getDomain(url);
    return domain.charAt(0).toUpperCase();
  } catch {
    return '?';
  }
}

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
  return '🔗';
}

export function preloadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function isGoogleDefaultFavicon(img: HTMLImageElement): boolean {
  return img.naturalWidth === 16 && img.naturalHeight === 16;
}

export async function findWorkingFavicon(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const origin = urlObj.origin;

    const directUrl = `${origin}/favicon.ico`;
    const googleUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

    const directImg = await preloadImage(directUrl);
    if (directImg) {
      return directUrl;
    }

    const googleImg = await preloadImage(googleUrl);
    if (googleImg && !isGoogleDefaultFavicon(googleImg)) {
      return googleUrl;
    }

    return null;
  } catch {
    return null;
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.origin}/favicon.ico`;
  } catch {
    return '';
  }
}
