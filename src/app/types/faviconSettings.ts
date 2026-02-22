export type FaviconSourceType = 'direct' | 'google' | 'duckduckgo';

export interface FaviconSource {
  type: FaviconSourceType;
  enabled: boolean;
  label: string;
  description: string;
}

export interface FaviconSettings {
  enabled: boolean;
  sources: FaviconSource[];
}

export const DEFAULT_FAVICON_SETTINGS: FaviconSettings = {
  enabled: true,
  sources: [
    {
      type: 'google',
      enabled: true,
      label: 'Google Favicon Service',
      description: "Use Google's favicon fetching service",
    },
    {
      type: 'direct',
      enabled: true,
      label: 'Direct favicon.ico',
      description: 'Fetch favicon directly from the website',
    },
    {
      type: 'duckduckgo',
      enabled: false,
      label: 'DuckDuckGo Favicon Service',
      description: "Use DuckDuckGo's favicon fetching service",
    },
  ],
};

export const FAVICON_SETTINGS_KEY = 'quickmark-favicon-settings';
