import { useState, useCallback } from 'react';

const SNOW_STORAGE_KEY = 'quickmark-snow-enabled';

export function useSnow() {
  const [isSnowing, setIsSnowing] = useState(() => {
    const stored = localStorage.getItem(SNOW_STORAGE_KEY);
    return stored === 'true';
  });

  const toggleSnow = useCallback(() => {
    setIsSnowing((prev) => {
      const newValue = !prev;
      localStorage.setItem(SNOW_STORAGE_KEY, String(newValue));
      return newValue;
    });
  }, []);

  const enableSnow = useCallback(() => {
    setIsSnowing(true);
    localStorage.setItem(SNOW_STORAGE_KEY, 'true');
  }, []);

  const disableSnow = useCallback(() => {
    setIsSnowing(false);
    localStorage.setItem(SNOW_STORAGE_KEY, 'false');
  }, []);

  return {
    isSnowing,
    toggleSnow,
    enableSnow,
    disableSnow,
  };
}
