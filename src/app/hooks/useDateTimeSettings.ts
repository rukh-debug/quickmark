import { useState, useEffect, useCallback } from 'react';

export interface DateTimeSettings {
  showDate: boolean;
  showTime: boolean;
}

export const DEFAULT_DATETIME_SETTINGS: DateTimeSettings = {
  showDate: true,
  showTime: true,
};

export const DATETIME_SETTINGS_KEY = 'quickmark-datetime-settings';

export function useDateTimeSettings() {
  const [settings, setSettings] = useState<DateTimeSettings>(DEFAULT_DATETIME_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(DATETIME_SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DateTimeSettings;
        // Merge with defaults to ensure all fields exist
        setSettings({
          ...DEFAULT_DATETIME_SETTINGS,
          ...parsed,
        });
      } catch {
        setSettings(DEFAULT_DATETIME_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(DATETIME_SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const toggleShowDate = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      showDate: !prev.showDate,
    }));
  }, []);

  const toggleShowTime = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      showTime: !prev.showTime,
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_DATETIME_SETTINGS);
  }, []);

  return {
    settings,
    isLoaded,
    toggleShowDate,
    toggleShowTime,
    resetToDefaults,
  };
}
