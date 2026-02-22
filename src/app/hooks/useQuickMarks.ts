'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuickMark, QuickMarkFormData } from '../types/quickmark';
import { quickMarkColors } from '../theme/gruvbox';

const STORAGE_KEY = 'quickmark-data';
const INLINE_DATA_ID = 'quickmark-inline-data';

// Migration helper: convert old quickmark format to new format
function migrateQuickMark(oldQuickMark: any): QuickMark {
  // If already in new format
  if ('shadowColor' in oldQuickMark && !('iconType' in oldQuickMark)) {
    return oldQuickMark as QuickMark;
  }

  // Convert from old format
  return {
    id: oldQuickMark.id,
    title: oldQuickMark.title,
    url: oldQuickMark.url,
    shadowColor: oldQuickMark.iconColor || quickMarkColors[3].value,
    pinned: oldQuickMark.pinned,
    createdAt: oldQuickMark.createdAt,
    updatedAt: oldQuickMark.updatedAt,
  };
}

export function useQuickMarks() {
  const [quickMarks, setQuickMarks] = useState<QuickMark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load quickmarks from localStorage on mount, fallback to inline data
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Try localStorage first
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Migrate old quickmarks to new format
          const migrated = parsed.map(migrateQuickMark);
          setQuickMarks(migrated);
          
          // Save migrated data back to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          setIsLoaded(true);
          return;
        }
      }
      
      // Fallback: try inline data from the HTML (for saved HTML files)
      const inlineDataElement = document.getElementById(INLINE_DATA_ID);
      if (inlineDataElement) {
        const inlineData = inlineDataElement.textContent;
        if (inlineData && inlineData !== '[]') {
          const parsed = JSON.parse(inlineData);
          if (Array.isArray(parsed)) {
            const migrated = parsed.map(migrateQuickMark);
            setQuickMarks(migrated);
            // Also save to localStorage so it persists
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load quickmarks:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save quickmarks to localStorage and inline element whenever they change
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;
    
    try {
      const data = JSON.stringify(quickMarks);
      localStorage.setItem(STORAGE_KEY, data);
      
      // Also update inline data element so "Save As" captures current data
      const inlineDataElement = document.getElementById(INLINE_DATA_ID);
      if (inlineDataElement) {
        inlineDataElement.textContent = data;
      }
    } catch (error) {
      console.error('Failed to save quickmarks:', error);
    }
  }, [quickMarks, isLoaded]);

  const addQuickMark = useCallback((data: QuickMarkFormData) => {
    const now = Date.now();
    const newQuickMark: QuickMark = {
      ...data,
      id: `qm-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setQuickMarks((prev) => [newQuickMark, ...prev]);
    return newQuickMark;
  }, []);

  const updateQuickMark = useCallback((id: string, data: Partial<QuickMarkFormData>) => {
    setQuickMarks((prev) =>
      prev.map((qm) =>
        qm.id === id
          ? { ...qm, ...data, updatedAt: Date.now() }
          : qm
      )
    );
  }, []);

  const deleteQuickMark = useCallback((id: string) => {
    setQuickMarks((prev) => prev.filter((qm) => qm.id !== id));
  }, []);

  const deleteAllQuickMarks = useCallback(() => {
    setQuickMarks([]);
  }, []);

  const togglePin = useCallback((id: string) => {
    setQuickMarks((prev) =>
      prev.map((qm) =>
        qm.id === id
          ? { ...qm, pinned: !qm.pinned, updatedAt: Date.now() }
          : qm
      )
    );
  }, []);

  const reorderQuickMarks = useCallback((newOrder: QuickMark[]) => {
    setQuickMarks(newOrder);
  }, []);

  const exportQuickMarks = useCallback(() => {
    const exportData = quickMarks.map(({ title, url, shadowColor, pinned }) => ({
      title,
      url,
      shadowColor,
      pinned,
    }));
    const jsonData = JSON.stringify(exportData, null, 2);
    const instructions = `\n\n/*\n * How to import:\n * 1. Go to https://quickmark.rubenk.dev\n * 2. Click on "Import Quickmark" button\n * 3. Paste all this text\n * 4. Press "Import"\n */`;
    return jsonData + instructions;
  }, [quickMarks]);

  const importQuickMarks = useCallback((json: string): { success: boolean; added: number; skipped: number } => {
    try {
      // Extract array content from the text (ignore anything outside [...])
      const arrayMatch = json.match(/\[[\s\S]*\]/);
      if (!arrayMatch) {
        return { success: false, added: 0, skipped: 0 };
      }
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) {
        // Migrate imported quickmarks to new format
        const migrated = parsed.map(migrateQuickMark);
        
        // Get existing URLs for duplicate checking
        const existingUrls = new Set(quickMarks.map(qm => qm.url.toLowerCase()));
        
        // Filter out duplicates and create new quickmarks with fresh IDs
        const now = Date.now();
        const newQuickMarks: QuickMark[] = [];
        let skipped = 0;
        
        migrated.forEach((importedQm, index) => {
          if (existingUrls.has(importedQm.url.toLowerCase())) {
            skipped++;
          } else {
            // Use index in ID to ensure uniqueness even within same millisecond
            newQuickMarks.push({
              ...importedQm,
              id: `qm-${now}-${index}-${Math.random().toString(36).slice(2, 11)}`,
              createdAt: now,
              updatedAt: now,
            });
            existingUrls.add(importedQm.url.toLowerCase());
          }
        });
        
        // Merge: keep existing quickmarks and add new ones at the beginning
        setQuickMarks((prev) => [...newQuickMarks, ...prev]);
        
        return { success: true, added: newQuickMarks.length, skipped };
      }
      return { success: false, added: 0, skipped: 0 };
    } catch {
      return { success: false, added: 0, skipped: 0 };
    }
  }, [quickMarks]);

  return {
    quickMarks,
    isLoaded,
    addQuickMark,
    updateQuickMark,
    deleteQuickMark,
    deleteAllQuickMarks,
    togglePin,
    reorderQuickMarks,
    exportQuickMarks,
    importQuickMarks,
  };
}
