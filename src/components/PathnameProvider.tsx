"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const PathnameContext = createContext<string | null>(null);

export function PathnameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); //
  return (
    <PathnameContext.Provider value={pathname}>
      {children}
    </PathnameContext.Provider>
  );
}

export function usePathnameContext() {
  const context = useContext(PathnameContext);
  if (context === null) {
    throw new Error(
      "usePathnameContext must be used within a PathnameProvider"
    );
  }
  return context;
}
