"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, onUnauthorized, tokenStore, unwrap } from "./api";
import { endpoints } from "./endpoints";
import type { AuthUser, Role } from "./types";
import { sampleUser } from "./demo-data";
import { DATA_MODE } from "./data-mode";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (DATA_MODE === "mock") {
      setUser(sampleUser);
      setLoading(false);
      return;
    }
    if (!tokenStore.get()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<AuthUser | { data: AuthUser }>(endpoints.auth.me);
      setUser(unwrap(me));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const off = onUnauthorized(() => setUser(null));
    return () => { off(); };
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: AuthUser }>(endpoints.auth.login, {
      email,
      password,
    });
    tokenStore.set(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
    } catch {
      /* session may already be gone */
    }
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/**
 * UI-only visibility rules. Laravel enforces the real permissions;
 * this just hides menu items a role can't use.
 */
export const ROLE_ACCESS: Record<string, Role[]> = {
  properties: ["super_admin", "admin", "property_manager", "agent"],
  listings: ["super_admin", "admin", "property_manager", "agent"],
  owners: ["super_admin", "admin", "property_manager"],
  clients: ["super_admin", "admin", "property_manager", "agent"],
  agents: ["super_admin", "admin", "property_manager"],
  enquiries: ["super_admin", "admin", "property_manager", "agent"],
  inspections: ["super_admin", "admin", "property_manager", "agent"],
  transactions: ["super_admin", "admin", "finance_officer"],
  tenancies: ["super_admin", "admin", "property_manager", "finance_officer"],
  payments: ["super_admin", "admin", "finance_officer"],
  expenses: ["super_admin", "admin", "finance_officer"],
  maintenance: ["super_admin", "admin", "property_manager"],
  reports: ["super_admin", "admin", "finance_officer"],
  content: ["super_admin", "admin"],
  settings: ["super_admin", "admin"],
  users: ["super_admin", "admin"],
};

export function canAccess(user: AuthUser | null, area: string): boolean {
  if (!user) return false;
  if (user.permissions?.includes(`view_${area}`)) return true;
  const allowed = ROLE_ACCESS[area];
  return !allowed || allowed.includes(user.role);
}
