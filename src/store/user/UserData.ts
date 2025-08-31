import { createStore } from 'zustand/vanilla'

export interface UserData {
  id: string;
  name: string;
  isAdmin: boolean;
  impersonation?: {
    isImpersonating: boolean;
    adminName: string;
    impersonatedUserName: string;
  } | null;
}

// Store factory for SSR hydration
export const createUserDataStore = (initData?: Partial<UserData>) =>
  createStore<UserData>(() => ({
    id: initData?.id || '',
    name: initData?.name || '',
    isAdmin: initData?.isAdmin || false,
    impersonation: initData?.impersonation || null,
  }));

