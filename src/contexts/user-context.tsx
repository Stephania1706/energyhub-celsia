"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface UserData {
  nombre: string;
  contractId: string;
  ubicacion: UserLocation;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (updates: Partial<UserData>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "energyhub-user";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }
  }, []);

  // Guardar usuario en localStorage cuando cambia
  useEffect(() => {
    if (!isMounted) return;
    
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error removing user from localStorage:", error);
      }
    }
  }, [user, isMounted]);

  const setUser = (newUser: UserData | null) => {
    setUserState(newUser);
  };

  const updateUser = (updates: Partial<UserData>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const logout = () => {
    setUserState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

