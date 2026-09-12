import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type User = { name: string; email: string };

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "Aditya Pratama",
    email: "aditya@example.com",
  });

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: (email: string) => setUser({ name: "Aditya Pratama", email }),
    logout: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
