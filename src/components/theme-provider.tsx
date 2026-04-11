"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "celsia";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "energyhub-theme",
  ...props
}: ThemeProviderProps) {
  // Use defaultTheme if no stored theme exists, prioritizing defaultTheme for landing page
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      // If no stored theme, use defaultTheme (which should be "celsia" for landing page)
      return storedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  // Initialize theme from localStorage on client side only
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    // Only use stored theme if it exists, otherwise respect defaultTheme
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (defaultTheme) {
      // If no stored theme and defaultTheme is provided, use it (important for landing page)
      setTheme(defaultTheme);
    }
  }, [storageKey, defaultTheme]);

  // Apply theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "celsia");
    
    if (theme === "celsia") {
      root.classList.add("celsia");
      root.setAttribute("data-theme", "celsia");
    } else {
      root.classList.add("light");
      root.removeAttribute("data-theme");
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "celsia" : "light"));
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
