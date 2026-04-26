import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth, ADMIN_EMAIL, isFirebaseConfigured } from "@/lib/firebase";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase is not configured.");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const isAdmin = Boolean(user);
// login successful = admin ✅   
  return (
    <Ctx.Provider value={{ user, loading, isAdmin, configured: isFirebaseConfigured, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
