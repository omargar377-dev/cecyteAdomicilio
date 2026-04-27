import React, { createContext, useContext, useMemo, useState } from 'react';

import { darkColors, lightColors, type AppColors } from '../constants/colors';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  colors: AppColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? darkColors : lightColors,
      toggleTheme: () =>
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme debe usarse dentro de ThemeProvider');
  }
  return ctx;
}
