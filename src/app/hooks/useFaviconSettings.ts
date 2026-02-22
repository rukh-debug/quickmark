import { useState, useEffect, useCallback } from 'react';
import {
  FaviconSettings,
  FaviconSourceType,
  DEFAULT_FAVICON_SETTINGS,
  FAVICON_SETTINGS_KEY,
} from '../types/faviconSettings';

export function useFaviconSettings() {
  const [settings, setSettings] = useState<FaviconSettings>(DEFAULT_FAVICON_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVICON_SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FaviconSettings;
        // Merge with defaults to ensure all fields exist
        setSettings({
          ...DEFAULT_FAVICON_SETTINGS,
          ...parsed,
          sources: parsed.sources || DEFAULT_FAVICON_SETTINGS.sources,
        });
      } catch {
        setSettings(DEFAULT_FAVICON_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVICON_SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const toggleEnabled = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, []);

  const toggleSource = useCallback((type: FaviconSourceType) => {
    setSettings((prev) => ({
      ...prev,
      sources: prev.sources.map((source) =>
        source.type === type ? { ...source, enabled: !source.enabled } : source
      ),
    }));
  }, []);

  const reorderSources = useCallback((newOrder: FaviconSourceType[]) => {
    setSettings((prev) => {
      const sourceMap = new Map(prev.sources.map((s) => [s.type, s]));
      return {
        ...prev,
        sources: newOrder
          .map((type) => sourceMap.get(type))
          .filter((s): s is NonNullable<typeof s> => s !== undefined),
      };
    });
  }, []);

  const moveSourceUp = useCallback((index: number) => {
    if (index <= 0) return;
    setSettings((prev) => {
      const newSources = [...prev.sources];
      [newSources[index - 1], newSources[index]] = [newSources[index], newSources[index - 1]];
      return { ...prev, sources: newSources };
    });
  }, []);

  const moveSourceDown = useCallback((index: number) => {
    setSettings((prev) => {
      if (index >= prev.sources.length - 1) return prev;
      const newSources = [...prev.sources];
      [newSources[index], newSources[index + 1]] = [newSources[index + 1], newSources[index]];
      return { ...prev, sources: newSources };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_FAVICON_SETTINGS);
  }, []);

  // Get only enabled sources in priority order
  const getEnabledSources = useCallback((): FaviconSourceType[] => {
    if (!settings.enabled) return [];
    return settings.sources
      .filter((source) => source.enabled)
      .map((source) => source.type);
  }, [settings]);

  return {
    settings,
    isLoaded,
    toggleEnabled,
    toggleSource,
    reorderSources,
    moveSourceUp,
    moveSourceDown,
    resetToDefaults,
    getEnabledSources,
  };
}
