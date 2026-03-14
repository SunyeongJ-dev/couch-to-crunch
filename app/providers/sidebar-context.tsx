// app/providers/sidebar-context.tsx
// This is a React context provider for managing the state of the sidebar (whether it is collapsed or not) across the application.
// This prevents the reset of the sidebar state when navigating between pages.
"use client";

import { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMounted: boolean;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const sidebarState = localStorage.getItem("isSidebarCollapsed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sidebarState !== null) setIsCollapsed(sidebarState === "true");
    setIsMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("isSidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMounted }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
