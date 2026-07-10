import { StateCreator } from 'zustand';

export interface RequestItem {
  id: string;
  title: string;
  status: string;
  category: string;
  created_at: string;
  priority?: string;
  description?: string;
}

export interface RequestsSlice {
  activeRequests: RequestItem[];
  selectedRequestId: string | null;
  setActiveRequests: (requests: RequestItem[]) => void;
  addRequest: (request: RequestItem) => void;
  updateRequest: (id: string, updates: Partial<RequestItem>) => void;
  getRequestById: (id: string) => RequestItem | undefined;
  getPendingRequests: () => RequestItem[];
  setSelectedRequestId: (id: string | null) => void;
}

export const createRequestsSlice: StateCreator<RequestsSlice> = (set, get) => ({
  activeRequests: [],
  selectedRequestId: null,
  setActiveRequests: (requests) =>
    set({
      activeRequests: [...requests].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    }),
  addRequest: (request) =>
    set((state) => ({ activeRequests: [request, ...state.activeRequests] })),
  updateRequest: (id, updates) =>
    set((state) => ({
      activeRequests: state.activeRequests.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
  getRequestById: (id) => get().activeRequests.find((r) => r.id === id),
  getPendingRequests: () =>
    get().activeRequests.filter((r) =>
      ['pending', 'submitted', 'assigned'].includes(r.status)
    ),
  setSelectedRequestId: (id) => set({ selectedRequestId: id }),
});
