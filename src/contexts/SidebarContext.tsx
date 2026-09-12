import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SidebarContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const value = useMemo(() => ({
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((value) => !value),
  }), [isOpen]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside SidebarProvider");
  return context;
}
