"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const LOCAL_STORAGE_KEY = "app_settings";
const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;

interface SettingsContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  minSize: number;
  maxSize: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSizeState] = useState(DEFAULT_FONT_SIZE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const { fontSize: savedFontSize } = JSON.parse(savedSettings);
        if (
          typeof savedFontSize === "number" &&
          savedFontSize >= MIN_FONT_SIZE &&
          savedFontSize <= MAX_FONT_SIZE
        ) {
          setFontSizeState(savedFontSize);
        }
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage and update body style whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const settingsToSave = JSON.stringify({ fontSize });
      localStorage.setItem(LOCAL_STORAGE_KEY, settingsToSave);

      // Update CSS custom property on the root element
      document.documentElement.style.setProperty(
        "--font-size-base",
        `${fontSize}px`
      );
    } catch (error) {
      console.error("Failed to save settings or update style", error);
    }
  }, [fontSize, isLoaded]);

  const setFontSize = useCallback((size: number) => {
    const newSize = Math.max(MIN_FONT_SIZE, Math.min(size, MAX_FONT_SIZE));
    setFontSizeState(newSize);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        minSize: MIN_FONT_SIZE,
        maxSize: MAX_FONT_SIZE,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
