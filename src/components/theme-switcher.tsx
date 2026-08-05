"use client";

import { Button } from "@/components/ui/button";
import { Sun, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

type Theme = "light" | "celsia";

interface ThemeSwitcherProps {
  open?: boolean;
}

const ThemeSwitcher = ({ open = false }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 18; // Larger icons for collapsed state
  const isLight = theme === 'light';

  const toggleTheme = () => {
    setTheme(isLight ? 'celsia' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size={open ? "default" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "relative hover:bg-accent/50 transition-colors group",
        open ? "h-9 w-auto px-3" : "h-10 w-10"
      )}
      aria-label={`Cambiar a tema ${isLight ? 'Celsia' : 'Ligero'}`}
    >
      <div className="relative flex items-center gap-2">
        {/* Sun Icon (Light Theme) */}
        <div className={cn(
          "absolute transition-all duration-300 ease-in-out",
          isLight ? "opacity-100 scale-100" : "opacity-0 scale-50 -rotate-45"
        )}>
          <Sun size={ICON_SIZE} className="text-yellow-500" />
        </div>
        
        {/* Zap Icon (Celsia Theme) */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isLight ? "opacity-0 scale-50 rotate-45" : "opacity-100 scale-100"
        )}>
          <Zap size={ICON_SIZE} className="text-blue-400" />
        </div>
        
        {open && (
          <span className="text-sm min-w-[60px] text-left transition-all duration-300">
            {isLight ? 'Ligero' : 'Celsia'}
          </span>
        )}
      </div>
    </Button>
  );
};

export { ThemeSwitcher };
